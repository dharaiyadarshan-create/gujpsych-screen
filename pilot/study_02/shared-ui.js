// shared-ui.js — Study 02 UI helpers

document.addEventListener('DOMContentLoaded', () => {

  // Render step-dot indicators: <div class="step-dots" data-steps="5" data-current="2"></div>
  document.querySelectorAll('.step-dots[data-steps]').forEach(el => {
    const total   = parseInt(el.dataset.steps,   10);
    const current = parseInt(el.dataset.current, 10) || 1;
    el.innerHTML = '';
    for (let i = 1; i <= total; i++) {
      const d = document.createElement('span');
      d.className = 'step-dot' + (i < current ? ' done' : i === current ? ' active' : '');
      el.appendChild(d);
    }
  });

  // Render progress bars: <div data-progress="40"><div class="progress-fill"></div></div>
  document.querySelectorAll('[data-progress]').forEach(el => {
    const fill = el.querySelector('.progress-fill');
    if (fill) fill.style.width = parseFloat(el.dataset.progress) + '%';
  });

  // Highlight selected Likert option
  document.querySelectorAll('.likert-row').forEach(row => {
    row.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        row.querySelectorAll('label').forEach(l => l.classList.remove('selected'));
        radio.closest('label')?.classList.add('selected');
      });
    });
  });

});

/**
 * Validate a form: checks that all required radios have a selection
 * and all required text/select fields have values.
 * Returns true if valid, false otherwise.
 */
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;

  let ok = true;
  const radioNames = new Set();

  form.querySelectorAll('[required]').forEach(el => {
    if (el.type === 'radio') {
      radioNames.add(el.name);
    } else if (!el.value.trim()) {
      el.classList.add('invalid');
      ok = false;
    }
  });

  radioNames.forEach(name => {
    if (!form.querySelector(`[name="${name}"]:checked`)) ok = false;
  });

  if (!ok) alert('Please answer all questions before continuing.');
  return ok;
}
