// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FogVault {
    // ─── State ────────────────────────────────────────────────
    address public session;
    uint256 public entryFee;
    uint256 public totalPool;
    bool    public paid;

    uint256 public constant HOUSE_CUT    = 10;
    uint256 public constant WINNER_SHARE = 90;

    mapping(address => uint256) public deposits;

    // ─── Events ───────────────────────────────────────────────
    event Deposited(address indexed player, uint256 amount);
    event Paid(address indexed winner, uint256 prize, uint256 houseCut);
    event Refunded(address indexed player, uint256 amount);

    // ─── Modifiers ────────────────────────────────────────────
    modifier onlySession() {
        require(msg.sender == session, "Only session contract");
        _;
    }

    // ─── Constructor ──────────────────────────────────────────
    constructor(address _session, uint256 _entryFee) {
        session  = _session;
        entryFee = _entryFee;
    }

    // ─── Deposit ──────────────────────────────────────────────
    function deposit(address player) external payable onlySession {
        require(msg.value == entryFee, "Wrong deposit amount");
        require(deposits[player] == 0, "Already deposited");

        deposits[player] = msg.value;
        totalPool += msg.value;

        emit Deposited(player, msg.value);
    }

    // ─── Payout ───────────────────────────────────────────────
    function payout(address winner) external onlySession returns (uint256) {
        require(!paid, "Already paid out");
        require(totalPool > 0, "Empty pool");

        paid = true;

        uint256 prize    = (totalPool * WINNER_SHARE) / 100;
        uint256 houseFee = totalPool - prize;

        payable(winner).transfer(prize);
        payable(session).transfer(houseFee);

        emit Paid(winner, prize, houseFee);

        return prize;
    }

    // ─── Refund ───────────────────────────────────────────────
    // Called by FogSession.refundSession when a session ends with no winner.
    // Each player gets their exact deposit back.
    function refundAll(address[] calldata players) external onlySession {
        require(!paid, "Already paid out");

        paid = true;

        for (uint256 i = 0; i < players.length; i++) {
            uint256 amount = deposits[players[i]];
            if (amount > 0) {
                deposits[players[i]] = 0;
                payable(players[i]).transfer(amount);
                emit Refunded(players[i], amount);
            }
        }
    }

    // ─── View ─────────────────────────────────────────────────
    function getPool() external view returns (uint256) {
        return totalPool;
    }

    receive() external payable {}
}
