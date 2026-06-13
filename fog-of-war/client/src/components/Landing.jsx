import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store';
import { createSession, listSessions, joinSession, watchLobby, loginWithEthAddress } from '../socket';
import { useArbitrumWallet, useArbitrumSession } from '../arbitrum/useArbitrum.js';
import { formatEther } from 'viem';
import './Landing.css';

const CHAR_NAMES = [
  'knight_m', 'elf_m', 'lizard_m', 'wizzard_m',
  'dwarf_m', 'orc_warrior', 'knight_f', 'elf_f',
];
const SPRITE_BASE = '/assets/0x72_DungeonTilesetII_v1.7/frames/';

const playClick = () => {
  const audio = new Audio('/assets/sounds/kenney_rpg-audio/Audio/metalClick.ogg');
  audio.volume = 0.3;
  audio.play().catch(() => {});
};

export default function Landing() {
  const store = useGameStore();
  const { setWallet, setScreen, walletAddress } = store;
  const canvasRef = useRef(null);

  const arb = useArbitrumWallet();
  const arbSession = useArbitrumSession();

  // 'home' | 'host' | 'browse'
  const [mode,    setMode]    = useState('home');
  const [busy,    setBusy]    = useState(false);
  const [error,   setError]   = useState('');
  const [txHash,  setTxHash]  = useState('');

  // host form
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [duration,   setDuration]   = useState(300);
  const [botCount,   setBotCount]   = useState(4);

  // browse list
  const [sessions, setSessions] = useState([]);

  // sync Arbitrum wallet to store and auto-login with Go server
  useEffect(() => {
    if (arb.isConnected && arb.address) {
      setWallet(arb.address, arb.balance);
      const stored = localStorage.getItem('fog_eth_address');
      if (stored !== arb.address) {
        loginWithEthAddress(arb.address).catch(console.error);
      }
    }
  }, [arb.isConnected, arb.address, arb.balance]);

  // particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const COLS = 40, ROWS = 25;
    const cells = Array.from({ length: COLS * ROWS }, () => ({
      v: Math.random(), speed: 0.002 + Math.random() * 0.004,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cw = canvas.width / COLS, ch = canvas.height / ROWS;
      cells.forEach((c, i) => {
        c.v = (c.v + c.speed) % 1;
        const a = c.v < 0.5 ? c.v * 0.15 : (1 - c.v) * 0.15;
        ctx.fillStyle = `rgba(255,107,0,${a})`;
        ctx.fillRect((i % COLS) * cw + 1, Math.floor(i / COLS) * ch + 1, cw - 2, ch - 2);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const handleSoloPlay = () => {
    store.setLocalMode(true);
    store.setMyId('local');
    store.setWallet('SOLO MODE', 0);
    store.setScreen('game');
  };

  const handleHost = async (e) => {
    e.preventDefault();
    if (!arb.isConnected) { setError('Connect your wallet first'); return; }
    if (arb.isWrongNetwork) { setError('Switch MetaMask to Arbitrum Sepolia'); return; }
    setBusy(true); setError(''); setTxHash('');
    try {
      // 1. Pay creation fee + register session on Arbitrum
      const { sessionId: onChainId, txHash: hash } = await arbSession.createSessionOnChain(maxPlayers, duration);
      setTxHash(hash);

      // 2. Register with Go server (game state / matchmaking)
      const res = await createSession(maxPlayers, 0, duration, botCount, onChainId);
      if (res.error) throw new Error(res.error);

      // Store the on-chain tx so Results screen can show it
      localStorage.setItem('fog_arb_tx', hash);
      localStorage.setItem('fog_arb_session', String(onChainId));

      store.setLocalMode(false);
      store.setSessionId(res.session_id);
      store.setIsHost(true);
      store.setMyId(arb.address);
      watchLobby(res.session_id);
      setScreen('lobby');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleBrowse = async () => {
    setBusy(true); setError('');
    try {
      const list = await listSessions();
      setSessions(list);
      setMode('browse');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleJoin = async (sessionData) => {
    if (!arb.isConnected) { setError('Connect your wallet first'); return; }
    if (arb.isWrongNetwork) { setError('Switch MetaMask to Arbitrum Sepolia'); return; }

    const serverSessionId = typeof sessionData === 'string' ? sessionData : sessionData.session_id;
    const onChainId       = sessionData.onchain_session_id;

    setBusy(true); setError(''); setTxHash('');
    try {
      // 1. Pay entry fee on Arbitrum if the session has an on-chain ID
      if (onChainId != null) {
        const hash = await arbSession.joinSessionOnChain(onChainId);
        setTxHash(hash);
        localStorage.setItem('fog_arb_tx', hash);
      }

      // 2. Tell Go server the player joined
      const res = await joinSession(serverSessionId);
      if (!res.success) throw new Error(res.error || 'Join failed');

      store.setLocalMode(false);
      store.setSessionId(serverSessionId);
      store.setIsHost(false);
      store.setMyId(arb.address);
      watchLobby(serverSessionId);
      setScreen('lobby');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="landing">
      <canvas ref={canvasRef} className="landing__bg" />

      <div className="landing__content">
        <div className="landing__eyebrow">ARBITRUM SEPOLIA · BATTLE ROYALE</div>

        <h1 className="landing__title">
          <span className="landing__title-fog">FOG</span>
          <span className="landing__title-of"> OF </span>
          <span className="landing__title-war">WAR</span>
        </h1>

        <p className="landing__sub">
          Pay. Spawn. Hunt. Extract.<br />
          <span className="accent">90% of the pool</span> goes to the last one standing.
        </p>

        {error && <div className="landing__error">{error}</div>}

        {/* ── Home ───────────────────────────────────────────── */}
        {mode === 'home' && (
          <div className="landing__actions">
            {/* Arbitrum wallet connect */}
            {!arb.isConnected ? (
              <div className="landing__connect-row">
                {arb.connectors.map(c => (
                  <button
                    key={c.id}
                    className="enter-btn enter-btn--connect"
                    onClick={() => { playClick(); arb.connect({ connector: c }); }}
                    disabled={arb.isConnecting}
                  >
                    {arb.isConnecting ? 'CONNECTING...' : `CONNECT ${c.name.toUpperCase()}`}
                  </button>
                ))}
              </div>
            ) : (
              <>
                {arb.isWrongNetwork && (
                  <div className="landing__error">Switch MetaMask to Arbitrum Sepolia (chain 421614)</div>
                )}
                <div className="landing__game-btns">
                  <button className="enter-btn" onClick={() => { playClick(); setMode('host'); }} disabled={busy || arb.isWrongNetwork}>
                    <span className="enter-btn__icon">⚔</span>
                    HOST GAME
                  </button>
                  <button className="enter-btn enter-btn--secondary" onClick={() => { playClick(); handleBrowse(); }} disabled={busy}>
                    <span className="enter-btn__icon">◎</span>
                    {busy ? 'LOADING...' : 'JOIN GAME'}
                  </button>
                </div>
              </>
            )}
            <button className="solo-btn" onClick={() => { playClick(); handleSoloPlay(); }}>
              PLAY SOLO (NO WALLET)
            </button>

            {/* Character Selector */}
            <div className="character-selector">
              <div className="character-selector__label">SELECT YOUR HERO</div>
              <div className="character-selector__grid">
                {CHAR_NAMES.map((name, i) => (
                  <button
                    key={i}
                    className={`char-btn ${store.selectedCharacter === i ? 'char-btn--selected' : ''}`}
                    onClick={() => { playClick(); store.setSelectedCharacter(i); }}
                    title={name.replace('_', ' ')}
                  >
                    <img 
                      src={`${SPRITE_BASE}${name}_idle_anim_f0.png`} 
                      alt={name}
                      className="char-btn__img"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Host form ──────────────────────────────────────── */}
        {mode === 'host' && (
          <form className="session-form" onSubmit={handleHost}>
            <div className="session-form__title">CREATE SESSION</div>

            <label className="session-form__field">
              <span>MAX PLAYERS</span>
              <input type="number" min="2" max="50" value={maxPlayers}
                onChange={e => setMaxPlayers(Number(e.target.value))} />
            </label>

            <label className="session-form__field">
              <span>DURATION (SEC)</span>
              <input type="number" min="60" step="60" value={duration}
                onChange={e => setDuration(Number(e.target.value))} />
            </label>

            <label className="session-form__field">
              <span>AI BOTS (0–20)</span>
              <input type="number" min="0" max="20" value={botCount}
                onChange={e => setBotCount(Number(e.target.value))} />
            </label>

            <div className="session-form__preview">
              Entry fee: <strong>{formatEther(arbSession.entryFee)} ETH</strong> per player
              <br />
              Creation fee: <strong>{formatEther(arbSession.creationFee)} ETH</strong> (one-time)
              {botCount > 0 && <span className="session-form__bots"> · {botCount} AI bots</span>}
            </div>

            {txHash && (
              <div className="session-form__tx">
                Arbitrum tx: <a
                  href={`https://sepolia.arbiscan.io/tx/${txHash}`}
                  target="_blank" rel="noopener noreferrer"
                  className="session-form__tx-link"
                >
                  {txHash.slice(0, 10)}…{txHash.slice(-6)}
                </a>
              </div>
            )}

            <div className="session-form__actions">
              <button type="submit" className="enter-btn" disabled={busy}>
                {busy ? 'CONFIRMING ON ARBITRUM...' : 'CREATE & ENTER LOBBY'}
              </button>
              <button type="button" className="solo-btn" onClick={() => { setMode('home'); setError(''); }}>
                BACK
              </button>
            </div>
          </form>
        )}

        {/* ── Browse sessions ────────────────────────────────── */}
        {mode === 'browse' && (
          <div className="session-list">
            <div className="session-list__title">OPEN SESSIONS</div>
            {sessions.length === 0 && (
              <div className="session-list__empty">
                No open sessions. Host one!
              </div>
            )}
            {sessions.map(s => (
              <div key={s.session_id} className="session-row">
                <div className="session-row__info">
                  <span className="session-row__players">
                    {s.current_players}/{s.max_players} PLAYERS
                  </span>
                  <span className="session-row__fee">{s.entry_fee > 0 ? `${formatEther(BigInt(s.entry_fee))} ETH` : 'FREE'}</span>
                  <span className="session-row__time">
                    {Math.floor(s.duration_seconds / 60)}MIN
                  </span>
                </div>
                <button
                  className="enter-btn enter-btn--sm"
                  onClick={() => handleJoin(s)}
                  disabled={busy}
                >
                  {s.entry_fee > 0 ? `JOIN · ${formatEther(BigInt(s.entry_fee))} ETH` : 'JOIN FREE'}
                </button>
              </div>
            ))}
            <div className="session-list__footer">
              <button className="solo-btn" onClick={() => { setMode('home'); setError(''); }}>
                BACK
              </button>
              <button className="solo-btn" onClick={handleBrowse} disabled={busy}>
                REFRESH
              </button>
            </div>
          </div>
        )}

        {arb.isConnected && (
          <div className="landing__wallet-info">
            <span className="dot dot--green" />
            {arb.address?.slice(0, 6)}…{arb.address?.slice(-4)} · {arb.balance} ETH · Arbitrum Sepolia
            <button className="wallet-disconnect" onClick={() => arb.disconnect()}>✕</button>
          </div>
        )}
      </div>

      <div className="landing__footer">
        <span>BLOOD HUNT activates at 5 min remaining</span>
        <span>·</span>
        <span>10% house fee on-chain</span>
        <span>·</span>
        <span>Powered by Arbitrum</span>
        <span>·</span>
        <a
          href={`https://sepolia.arbiscan.io/address/${arbSession.contractAddress}`}
          target="_blank" rel="noopener noreferrer"
          className="landing__footer-link"
        >
          View Contract
        </a>
      </div>
    </div>
  );
}
