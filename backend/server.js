require("dotenv").config(); // Load environment variables
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 10000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: "Too many requests, please try again later."
});

// Validate API key
const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY;
const MAILERSEND_API_URL = "https://api.mailersend.com/v1/email";

if (!MAILERSEND_API_KEY) {
    console.error("MailerSend API key is missing. Please check your .env file.");
    process.exit(1);
}

// Endpoint to send email
app.post("/send-email", limiter, async (req, res) => {
    try {
        const { to, from, subject, body } = req.body;

        // Validate input
        if (!to || !from || !subject || !body) {
            return res.status(400).json({ error: "Missing required fields: to, from, subject, body" });
        }

        // Sanitize input (optional)
        const validator = require("validator");
        if (!validator.isEmail(from)) {
            return res.status(400).json({ error: "Invalid sender email address" });
        }
        if (!validator.isEmail(to)) {
            return res.status(400).json({ error: "Invalid recipient email address" });
        }

        // Prepare email data
        const emailData = {
            from: { email: from, name: "Client Booking" },
            to: [{ email: to }],
            subject: subject,
            text: body,
            html: `<p>${body.replace(/\n/g, "<br>")}</p>` // Optional: HTML email support
        };

        // Send email via MailerSend API
        const response = await axios.post(MAILERSEND_API_URL, emailData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${MAILERSEND_API_KEY}`
            }
        });

        // Log API response
        console.log("MailerSend API Response:", response.data);

        // Respond to frontend
        res.status(200).json({ message: "Email sent successfully!", data: response.data });
    } catch (error) {
        console.error("Error sending email:", error.response?.data || error.message);

        // Respond with detailed error
        res.status(500).json({
            error: "Failed to send email",
            details: error.response?.data?.message || error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});