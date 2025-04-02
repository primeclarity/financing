   // Smooth scrolling for navigation links
   document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      targetElement.scrollIntoView({ behavior: 'smooth' });
      
      // Close mobile menu after clicking a link
      document.querySelector('.nav-links').classList.remove('active');
    });
  });
  
  // Scroll to Contact section on button click
  function scrollToContact() {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }

  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate menu toggle icon
    mobileMenuToggle.classList.toggle('active');
  });

  // Particle.js Configuration
  particlesJS('particles-js', {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } },
      color: { value: '#ffffff' },
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: false },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
      move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { 
        onhover: { enable: true, mode: 'repulse' }, 
        onclick: { enable: true, mode: 'push' }, 
        resize: true 
      }
    },
    retina_detect: true
  });

// Booking Modal functionality
const RECIPIENT_EMAIL = 'mufazzalmohammed26@gmail.com'; // Company's email address

const bookingLink = document.getElementById('booking-link');
const bookingModal = document.getElementById('booking-modal');
const bookingModalClose = document.querySelector('.booking-modal-close');
const bookingForm = document.getElementById('booking-form');
const bookingConfirmation = document.getElementById('booking-confirmation');

// Open booking modal
bookingLink.addEventListener('click', (e) => {
  e.preventDefault();
  bookingModal.style.display = 'flex';
});

// Close booking modal
bookingModalClose.addEventListener('click', () => {
  bookingModal.style.display = 'none';
});

// Close modal if clicked outside
bookingModal.addEventListener('click', (e) => {
  if (e.target === bookingModal) {
    bookingModal.style.display = 'none';
  }
});

// Handle booking form submission
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect form data
  const clientName = document.getElementById('client-name').value;
  const clientEmail = document.getElementById('client-email').value;
  const serviceType = document.getElementById('service-type').value;
  const consultationDate = document.getElementById('consultation-date').value;
  const consultationTime = document.getElementById('consultation-time').value;

  // Prepare email details
  const emailDetails = {
    to: RECIPIENT_EMAIL,
    from: clientEmail,
    subject: `New Consultation Booking - ${serviceType}`,
    body: `
      New Consultation Booking:
      
      Name: ${clientName}
      Email: ${clientEmail}
      Service: ${serviceType}
      Date: ${consultationDate}
      Time: ${consultationTime}
    `
  };

  try {
    // Send data to backend
    const response = await fetch('/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailDetails)
    });

    const result = await response.json();

    if (response.ok) {
      // Simulate booking confirmation
      bookingConfirmation.innerHTML = `
        Thank you, ${clientName}! 
        Your consultation is booked for ${consultationDate} at ${consultationTime}.
        A confirmation email has been sent to ${RECIPIENT_EMAIL}.
      `;
    } else {
      throw new Error(result.error || 'Failed to send email');
    }
  } catch (error) {
    console.error('Error:', error.message);
    bookingConfirmation.innerHTML = `
      Oops! Something went wrong. Please try again later.
    `;
  }

  // Reset form
  bookingForm.reset();

  // Optional: Close modal after a few seconds
  setTimeout(() => {
    bookingModal.style.display = 'none';
    bookingConfirmation.innerHTML = '';
  }, 3000);
});
// Constrain date selection
const today = new Date().toISOString().split('T')[0];
document.getElementById('consultation-date').setAttribute('min', today);