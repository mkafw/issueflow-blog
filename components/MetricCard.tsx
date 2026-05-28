export function MetricCard({ label, value, status }: { label: string; value: string | number; status?: string }) {
  return (
    <div className="metric-glass">
      <span className="metric-label">{label}</span>
      <span className="metric-value text-gold">{value}</span>
      {status && <span className="metric-status">{status}</span>}
    </div>
  );
}
