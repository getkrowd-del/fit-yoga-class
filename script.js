// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }});
}, { threshold: 0.15 });
reveals.forEach(el => observer.observe(el));

// Ticket purchase
function handleTicket() {
  const email = document.getElementById('email').value;
  const name = document.getElementById('fullname').value;
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
  if (!name) { alert('Please enter your name.'); return; }
  if (typeof window.__processDonation === 'function') {
    window.__processDonation({
      amount: 4500,
      email: email,
      name: name,
      productName: 'Fit Yoga Class Ticket'
    });
  } else {
    alert('Payment system is loading. Please try again in a moment.');
  }
}