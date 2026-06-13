// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./FogVault.sol";

contract FogSession {
    // ─── Enums ───────────────────────────────────────────────
    enum SessionState { WAITING, ACTIVE, ENDED }

    // ─── Structs ─────────────────────────────────────────────
    struct Session {
        uint256 id;
        address creator;
        uint256 entryFee;
        uint256 maxPlayers;
        uint256 duration;       // in seconds
        uint256 startTime;
        SessionState state;
        address[] players;
        address winner;
        FogVault vault;
    }

    // ─── State ────────────────────────────────────────────────
    uint256 public sessionCount;
    uint256 public creationFee;
    uint256 public defaultEntryFee;
    address public owner;
    address public gameServer;  // authorized caller for endSession / refundSession

    mapping(uint256 => Session) public sessions;
    mapping(uint256 => mapping(address => bool)) public hasJoined;

    // ─── Events ───────────────────────────────────────────────
    event SessionCreated(uint256 indexed sessionId, address indexed creator, uint256 maxPlayers, uint256 entryFee);
    event PlayerJoined(uint256 indexed sessionId, address indexed player);
    event SessionStarted(uint256 indexed sessionId, uint256 startTime);
    event SessionEnded(uint256 indexed sessionId, address indexed winner, uint256 prize);
    event SessionRefunded(uint256 indexed sessionId);
    event GameServerUpdated(address indexed previous, address indexed next);

    // ─── Modifiers ────────────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner || msg.sender == gameServer, "Not authorized");
        _;
    }

    modifier sessionExists(uint256 sessionId) {
        require(sessionId < sessionCount, "Session does not exist");
        _;
    }

    modifier inState(uint256 sessionId, SessionState expected) {
        require(sessions[sessionId].state == expected, "Wrong session state");
        _;
    }

    // ─── Constructor ──────────────────────────────────────────
    constructor(uint256 _creationFee, uint256 _defaultEntryFee) {
        owner      = msg.sender;
        gameServer = msg.sender;
        creationFee     = _creationFee;
        defaultEntryFee = _defaultEntryFee;
    }

    // ─── Admin ────────────────────────────────────────────────
    function setGameServer(address _gameServer) external onlyOwner {
        emit GameServerUpdated(gameServer, _gameServer);
        gameServer = _gameServer;
    }

    function setFees(uint256 _creationFee, uint256 _defaultEntryFee) external onlyOwner {
        creationFee     = _creationFee;
        defaultEntryFee = _defaultEntryFee;
    }

    // ─── Create Session ───────────────────────────────────────
    function createSession(uint256 maxPlayers, uint256 durationSeconds) external payable {
        require(msg.value == creationFee, "Wrong creation fee");
        require(maxPlayers >= 2 && maxPlayers <= 200, "Players must be 2-200");
        require(durationSeconds >= 60, "Duration must be >= 60s");

        FogVault vault = new FogVault(address(this), defaultEntryFee);

        uint256 sessionId = sessionCount++;

        Session storage s = sessions[sessionId];
        s.id         = sessionId;
        s.creator    = msg.sender;
        s.entryFee   = defaultEntryFee;
        s.maxPlayers = maxPlayers;
        s.duration   = durationSeconds;
        s.state      = SessionState.WAITING;
        s.vault      = vault;

        payable(owner).transfer(msg.value);

        emit SessionCreated(sessionId, msg.sender, maxPlayers, defaultEntryFee);
    }

    // ─── Join Session ─────────────────────────────────────────
    function joinSession(uint256 sessionId)
        external
        payable
        sessionExists(sessionId)
        inState(sessionId, SessionState.WAITING)
    {
        Session storage s = sessions[sessionId];

        require(!hasJoined[sessionId][msg.sender], "Already joined");
        require(s.players.length < s.maxPlayers, "Session is full");
        require(msg.value == s.entryFee, "Wrong entry fee");

        hasJoined[sessionId][msg.sender] = true;
        s.players.push(msg.sender);

        s.vault.deposit{value: msg.value}(msg.sender);

        emit PlayerJoined(sessionId, msg.sender);
    }

    // ─── Start Session ────────────────────────────────────────
    function startSession(uint256 sessionId)
        external
        sessionExists(sessionId)
        inState(sessionId, SessionState.WAITING)
    {
        Session storage s = sessions[sessionId];
        require(msg.sender == s.creator, "Only creator can start");
        require(s.players.length >= 2, "Need at least 2 players");

        s.state     = SessionState.ACTIVE;
        s.startTime = block.timestamp;

        emit SessionStarted(sessionId, block.timestamp);
    }

    // ─── End Session ──────────────────────────────────────────
    // No time-lock: the game server is authoritative on when a session ends
    // (timer expired OR last player standing). Only authorized callers can end.
    function endSession(uint256 sessionId, address winner)
        external
        onlyAuthorized
        sessionExists(sessionId)
        inState(sessionId, SessionState.ACTIVE)
    {
        Session storage s = sessions[sessionId];
        require(hasJoined[sessionId][winner], "Winner must be a player");

        s.state  = SessionState.ENDED;
        s.winner = winner;

        uint256 prize = s.vault.payout(winner);

        emit SessionEnded(sessionId, winner, prize);
    }

    // ─── Refund Session ───────────────────────────────────────
    // Safety valve: if all players disconnect and the timer has expired
    // with no winner declared, authorized caller can trigger full refunds.
    function refundSession(uint256 sessionId)
        external
        onlyAuthorized
        sessionExists(sessionId)
        inState(sessionId, SessionState.ACTIVE)
    {
        Session storage s = sessions[sessionId];
        require(
            block.timestamp > s.startTime + s.duration + 2 hours,
            "Grace period not elapsed"
        );

        s.state = SessionState.ENDED;
        s.vault.refundAll(s.players);

        emit SessionRefunded(sessionId);
    }

    // ─── Views ────────────────────────────────────────────────
    function getPlayers(uint256 sessionId) external view returns (address[] memory) {
        return sessions[sessionId].players;
    }

    function getPlayerCount(uint256 sessionId) external view returns (uint256) {
        return sessions[sessionId].players.length;
    }

    function getVault(uint256 sessionId) external view returns (address) {
        return address(sessions[sessionId].vault);
    }

    function getSession(uint256 sessionId) external view returns (
        address creator,
        uint256 entryFee,
        uint256 maxPlayers,
        uint256 duration,
        uint256 startTime,
        SessionState state,
        address winner,
        address vault
    ) {
        Session storage s = sessions[sessionId];
        return (s.creator, s.entryFee, s.maxPlayers, s.duration, s.startTime, s.state, s.winner, address(s.vault));
    }

    // ─── Withdrawal ──────────────────────────────────────────
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        payable(owner).transfer(balance);
    }

    receive() external payable {}
}
