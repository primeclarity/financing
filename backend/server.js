// Install the package:
// npm install @sendgrid/mail

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Booking endpoint
app.post('/api/book-consultation', async (req, res) => {
  try {
    const { clientName, clientEmail, serviceType, consultationDate, consultationTime } = req.body;
    
    // Validate required fields
    if (!clientName || !clientEmail || !serviceType || !consultationDate || !consultationTime) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Email to business owner
    const businessEmail = {
      to: 'tejasamirth@gmail.com',
      from: process.env.FROM_EMAIL, // Your verified sender email in SendGrid
      subject: `New Consultation Booking - ${serviceType}`,
      html: `
        <h2>New Consultation Booking</h2>
        <p><strong>Name:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${clientEmail}</p>
        <p><strong>Service:</strong> ${serviceType}</p>
        <p><strong>Date:</strong> ${consultationDate}</p>
        <p><strong>Time:</strong> ${consultationTime}</p>
      `
    };
    
    // Email to client
    const clientConfirmationEmail = {
      to: clientEmail,
      from: process.env.FROM_EMAIL, // Your verified sender email in SendGrid
      subject: 'Your Consultation Booking Confirmation',
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${clientName},</p>
        <p>Thank you for booking a consultation with us. Here are your booking details:</p>
        <p><strong>Service:</strong> ${serviceType}</p>
        <p><strong>Date:</strong> ${consultationDate}</p>
        <p><strong>Time:</strong> ${consultationTime}</p>
        <p>We look forward to meeting with you!</p>
        <p>Best regards,<br>Your Company Name</p>
      `
    };
    
    // Send both emails
    await sgMail.send(businessEmail);
    await sgMail.send(clientConfirmationEmail);
    
    // Respond to client
    res.status(200).json({ 
      success: true, 
      message: 'Booking submitted successfully' 
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process booking' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});