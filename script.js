// ===== TICKET PURCHASE HANDLER =====
    // Purpose: Sends the attendee to secure checkout for the $45 class ticket.
    // Triggers: When the signup form is submitted.
    document.getElementById('ticket-form').addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const name = document.getElementById('name').value.trim();

      if (!email) return;

      if (window.__processPayment) {
        window.__processPayment({
          amountCents: 4500,
          email: email,
          productName: 'Fit Yoga Class Ticket',
          productDescription: 'Admission to the Fit Yoga class experience',
          name: name
        });
      } else {
        alert('Payment system is loading. Please try again in a moment.');
      }
    });