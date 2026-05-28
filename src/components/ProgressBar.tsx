import { useScrollProgress } from '../hooks/useScrollProgress';

export function ProgressBar() {
  const pct = useScrollProgress();
  return (
    <div id="prog">
      <div id="prog-bar" style={{ width: `${pct}%` }} />
    </div>
  );
}
