export default function AdminToggle({ checked = false, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`admin-toggle ${checked ? 'admin-toggle-on' : ''}`}
    >
      <span className="admin-toggle-thumb" />
    </button>
  );
}
