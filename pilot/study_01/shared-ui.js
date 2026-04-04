// Progress bar — call updateProgress(current, total) from any scale page
function updateProgress(current, total) {
  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text');
  if (fill) fill.style.width = `${Math.round((current / total) * 100)}%`;
  if (text) text.textContent = `${current} / ${total}`;
}