import { useGameStore } from '../store';
import './Results.css';

function fmtTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function arbiscanTx(hash) {
  return `https://sepolia.arbiscan.io/tx/${hash}`;
}

export default function Results() {
  const { winner, payout, payoutTx, walletAddress, localMode, myTreasure, setScreen,
          lobbyDuration, timeLeft, lobbyFee, lobbyMax } = useGameStore();

  // Prefer on-chain tx stored at session creation/join; fall back to payoutTx
  const arbTx       = localStorage.getItem('fog_arb_tx') || payoutTx || null;
  const onChainId   = localStorage.getItem('fog_arb_session');

  const timePlayed = lobbyDuration - (timeLeft ?? 0);
  const prizePool  = payout || ((lobbyMax || 0) * (lobbyFee || 0) * 0.9).toFixed(4);

  // local mode: player was killed by a bot
  if (localMode) {
    return (
      <div className="results">
        <div className="results__bg" />
        <div className="results__content">
          <div className="results__crown">💀</div>
          <div className="results__eyebrow loser">ELIMINATED</div>
          <h2 className="results__title results__title--lose">YOU FELL IN THE FOG</h2>
          <div className="results__winner-card">
            <div className="results__winner-label">SCORE</div>
            <div className="results__payout">
              <span className="payout__val">◆ {myTreasure}</span>
            </div>
            <div className="results__stat-row">
              <span className="results__stat-label">TIME SURVIVED</span>
              <span className="results__stat-val">{fmtTime(timePlayed)}</span>
            </div>
            <div className="results__payout-sub">Treasures collected before elimination</div>
          </div>
          <div className="results__actions">
            <button className="results__btn results__btn--primary"
              onClick={() => {
                useGameStore.setState({
                  myHp: 100, myTreasure: 0, timeLeft: 300,
                  myPos: { x: 64, y: 64 },
                  localMode: false,
                });
                // small delay so Game unmounts before re-entering local mode
                setTimeout(() => {
                  useGameStore.setState({ localMode: true, screen: 'game' });
                }, 50);
              }}>
              ⚔ TRY AGAIN
            </button>
            <button className="results__btn results__btn--secondary" onClick={() => setScreen('landing')}>
              MAIN MENU
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isWinner = winner === walletAddress;

  return (
    <div className="results">
      <div className="results__bg" />

      <div className="results__content">
        {isWinner ? (
          <>
            <div className="results__crown">👑</div>
            <div className="results__eyebrow winner">VICTORY</div>
            <h2 className="results__title results__title--win">YOU EXTRACTED</h2>
          </>
        ) : (
          <>
            <div className="results__crown">💀</div>
            <div className="results__eyebrow loser">ELIMINATED</div>
            <h2 className="results__title results__title--lose">YOU FELL IN THE FOG</h2>
          </>
        )}

        <div className="results__winner-card">
          <div className="results__winner-label">WINNER</div>
          <div className="results__winner-addr">
            {winner?.slice(0, 6)}...{winner?.slice(-6)}
          </div>
          <div className="results__payout">
            <span className="payout__val">{prizePool}</span>
            <span className="payout__unit">ETH</span>
          </div>
          <div className="results__stat-row">
            <span className="results__stat-label">SESSION DURATION</span>
            <span className="results__stat-val">{fmtTime(lobbyDuration || 300)}</span>
          </div>
          <div className="results__stat-row">
            <span className="results__stat-label">YOUR TREASURES</span>
            <span className="results__stat-val results__stat-val--gold">◆ {myTreasure}</span>
          </div>
          {onChainId && (
            <div className="results__stat-row">
              <span className="results__stat-label">ON-CHAIN SESSION</span>
              <span className="results__stat-val">#{onChainId}</span>
            </div>
          )}
          <div className="results__payout-sub">90% prize pool · Arbitrum Sepolia</div>
        </div>

        <div className="results__actions">
          <button className="results__btn results__btn--primary" onClick={() => setScreen('lobby')}>
            ⚔ ENTER AGAIN
          </button>
          <button className="results__btn results__btn--secondary" onClick={() => setScreen('landing')}>
            BACK TO LOBBY
          </button>
        </div>

        <div className="results__tx">
          <span className="dot dot--green" />
          {arbTx ? (
            <>
              Arbitrum TX:&nbsp;
              <a
                className="tx-hash"
                href={arbiscanTx(arbTx)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {arbTx.slice(0, 8)}…{arbTx.slice(-6)}
              </a>
              &nbsp;·&nbsp;
              <a
                className="tx-hash"
                href="https://sepolia.arbiscan.io/address/0xA234a8D716cB592E9a39668821cca8f382213fD9"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Contract
              </a>
            </>
          ) : (
            <span className="tx-hash tx-hash--pending">Awaiting on-chain settlement…</span>
          )}
        </div>
      </div>
    </div>
  );
}
