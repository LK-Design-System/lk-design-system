export function assertAccessibleChart(canvasElement, label) {
  const chart = canvasElement.querySelector(`[role="img"][aria-label="${label}"]`);
  if (!chart) throw new Error(`${label} must expose a named image role.`);
  const ids = chart.getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean) || [];
  if (!ids.length || ids.some((id) => !canvasElement.ownerDocument.getElementById(id)?.textContent?.trim())) {
    throw new Error(`${label} must reference non-empty description and summary text.`);
  }
  return chart;
}
