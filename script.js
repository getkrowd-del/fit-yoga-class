const PRICES = { general: 4500, duo: 8000 };
const LABELS = { general: 'General Admission', duo: 'Bring a Friend (2-Pack)' };
const TICKET_COUNTS = { general: 1, duo: 2 }; // tickets per unit
let qty = { general: 1, duo: 0 };
let timerInterval;

function changeQty(type, delta) {
  qty[type] = Math.max(0, Math.min(10, qty[type] + delta));
  document.getElementById(type === 'general' ? 'gen-qty' : 'duo-qty').textContent = qty[type];
  document.getElementById(type === 'general' ? 'gen-minus' : 'duo-minus').disabled = qty[type] === 0;
  document.getElementById(type === 'general' ? 'gen-plus' : 'duo-plus').disabled = qty[type] === 10;
  document.getElementById(type === 'general' ? 'opt-general' : 'opt-duo').classList.toggle('selected', qty[type] > 0);
  updateSummary();
}

function updateSummary() {
  const total = qty.general * PRICES.general + qty.duo * PRICES.duo;
  const totalTickets = qty.general * TICKET_COUNTS.general + qty.duo * TICKET_COUNTS.duo;
  let lines = '';
  if (qty.general > 0) lines += `<div class="summary-line"><span>${qty.general} x ${LABELS.general}</span><span>$${(qty.general * PRICES.general / 100).toFixed(2)}</span></div>`;
  if (qty.duo > 0) lines += `<div class="summary-line"><span>${qty.duo} x ${LABELS.duo}</span><span>$${(qty.duo * PRICES.duo / 100).toFixed(2)}</span></div>`;
  if (!lines) lines = '<div class="summary-line subtle"><span>No tickets selected</span><span>—</span></div>';
  document.getElementById('summary-lines').innerHTML = lines;
  document.getElementById('summary-subtotal').textContent = '$' + (total / 100).toFixed(2);
  document.getElementById('summary-fees').textContent = '$0.00';
  document.getElementById('summary-total').textContent = '$' + (total / 100).toFixed(2);
  document.getElementById('summary-eticket').textContent = totalTickets > 0 ? totalTickets + ' x eTicket' : '';
  document.getElementById('checkout-btn').disabled = total === 0;
  document.getElementById('checkout-price-display').textContent = '$' + (total / 100).toFixed(2);
}

function openModal() {
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  showStep('tickets');
}
function closeModal() {
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = '';
  clearInterval(timerInterval);
}
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

function showStep(step) {
  document.getElementById('step-tickets').classList.toggle('active', step === 'tickets');
  document.getElementById('step-checkout').classList.toggle('active', step === 'checkout');
}

function goToCheckout() {
  const total = qty.general * PRICES.general + qty.duo * PRICES.duo;
  if (total === 0) return;
  showStep('checkout');
  startTimer();
}
function goBack() {
  showStep('tickets');
  clearInterval(timerInterval);
}

function startTimer() {
  let seconds = 600;
  clearInterval(timerInterval);
  function tick() {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    document.getElementById('timer-val').textContent = m + ':' + (s < 10 ? '0' : '') + s;
    if (seconds <= 0) { clearInterval(timerInterval); closeModal(); }
    seconds--;
  }
  tick();
  timerInterval = setInterval(tick, 1000);
}

function placeOrder() {
  const email = document.getElementById('email').value;
  const fname = document.getElementById('fname').value;
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
  if (!fname) { alert('Please enter your first name.'); return; }
  const total = qty.general * PRICES.general + qty.duo * PRICES.duo;
  if (typeof window.__processDonation === 'function') {
    const lname = document.getElementById('lname').value;
    window.__processDonation({
      amount: total,
      email: email,
      name: (fname + ' ' + lname).trim(),
      productName: 'Fit Yoga Class Ticket'
    });
  } else {
    alert('Payment system loading. Please try again.');
  }
}

updateSummary();