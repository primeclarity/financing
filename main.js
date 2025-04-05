// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      
      // Close mobile menu after clicking a link
      document.querySelector('.nav-links').classList.remove('active');
    }
  });
});

// Scroll to Contact section on button click
function scrollToContact() {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle && navLinks) {
  mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  });
}

// Particle.js Configuration
if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
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
} else {
  console.warn("Particles.js not loaded or container missing");
}

// Booking Modal functionality
document.addEventListener('DOMContentLoaded', () => {
  const RECIPIENT_EMAIL = 'makewebsite26@gmail.com'; // Should ideally come from environment variables
  const bookingLink = document.getElementById('booking-link');
  const bookingModal = document.getElementById('booking-modal');
  const bookingModalClose = document.querySelector('.booking-modal-close');
  const bookingForm = document.getElementById('booking-form');
  const bookingConfirmation = document.getElementById('booking-confirmation');
  
  if (!bookingLink || !bookingModal || !bookingModalClose || !bookingForm || !bookingConfirmation) {
    console.error('One or more booking elements not found');
    return;
  }

  // Date input constraints
  const dateInput = document.getElementById('consultation-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    dateInput.setAttribute('min', today);
    dateInput.setAttribute('max', nextYear.toISOString().split('T')[0]);
  }

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
    
    // Show loading state
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }
    
    bookingConfirmation.innerHTML = 'Processing your request...';

    // Collect form data
    const formData = {
      clientName: document.getElementById('client-name')?.value.trim() || '',
      clientEmail: document.getElementById('client-email')?.value.trim() || '',
      serviceType: document.getElementById('service-type')?.value || '',
      consultationDate: document.getElementById('consultation-date')?.value || '',
      consultationTime: document.getElementById('consultation-time')?.value || ''
    };

    // Validate form data
    if (!formData.clientName || !formData.clientEmail || !formData.serviceType || 
        !formData.consultationDate || !formData.consultationTime) {
      bookingConfirmation.innerHTML = '<div class="error-message">Please fill in all required fields.</div>';
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Book Consultation';
      }
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.clientEmail)) {
      bookingConfirmation.innerHTML = '<div class="error-message">Please enter a valid email address.</div>';
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Book Consultation';
      }
      return;
    }

    try {
      // Send data to backend
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: RECIPIENT_EMAIL,
          replyTo: formData.clientEmail,  // Use replyTo instead of from
          subject: `New Consultation Booking - ${formData.serviceType}`,
          clientName: formData.clientName,
          body: `
            New Consultation Booking:
            
            Name: ${formData.clientName}
            Email: ${formData.clientEmail}
            Service: ${formData.serviceType}
            Date: ${formData.consultationDate}
            Time: ${formData.consultationTime}
          `
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to send email');
      }

      // Show success message
      bookingConfirmation.innerHTML = `
        <div class="success-message">
          Thank you, ${formData.clientName}! 
          Your consultation is booked for ${formData.consultationDate} at ${formData.consultationTime}.
          A confirmation email has been sent to ${RECIPIENT_EMAIL}.
        </div>
      `;

      // Reset form
      bookingForm.reset();

      // Close modal after success
      setTimeout(() => {
        bookingModal.style.display = 'none';
        bookingConfirmation.innerHTML = '';
      }, 5000);

    } catch (error) {
      console.error('Error:', error);
      bookingConfirmation.innerHTML = `
        <div class="error-message">
          Oops! Something went wrong: ${error.message}.<br>
          Please try again later or contact us directly.
        </div>
      `;
    } finally {
      // Reset button state
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Book Consultation';
      }
    }
  });
});