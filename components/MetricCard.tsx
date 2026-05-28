export function MetricCard({ label, value, status }: { label: string; value: string | number; status?: string }) {
  return (
    <div className="apple-glass p-5 text-center">
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
      {status && <span className="metric-status">{status}</span>}
    </div>
  );
}
