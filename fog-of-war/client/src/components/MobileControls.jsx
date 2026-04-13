import './MobileControls.css';

export default function MobileControls({ onMove, onAttack }) {
  const btn = (label, dx, dy) => (
    <button
      key={`${dx}-${dy}`}
      className="dpad__btn"
      onPointerDown={(e) => {
        e.preventDefault();
        onMove(dx, dy);
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="mobile-controls">
      <div className="dpad">
        <div className="dpad__row dpad__row--top">
          {btn('▲', 0, -1)}
        </div>
        <div className="dpad__row dpad__row--middle">
          {btn('◀', -1, 0)}
          <div className="dpad__center" />
          {btn('▶', 1, 0)}
        </div>
        <div className="dpad__row dpad__row--bottom">
          {btn('▼', 0, 1)}
        </div>
      </div>

      <button
        className="atk-btn"
        onPointerDown={(e) => {
          e.preventDefault();
          onAttack();
        }}
      >
        ATK
      </button>
    </div>
  );
}
