const emailService = new EmailService();

// Simple usage
await emailService.sendEmail({
  to: { email: 'recipient@example.com' },
  subject: 'Hello',
  htmlContent: '<h1>Hello World</h1>'
});

// Advanced usage
await emailService.sendEmail({
  to: [
    { email: 'recipient1@example.com', name: 'John' },
    { email: 'recipient2@example.com', name: 'Jane' }
  ],
  subject: 'Hello',
  htmlContent: '<h1>Hello World</h1>',
  textContent: 'Hello World',
  replyTo: {
    name: 'Support',
    email: 'support@yourdomain.com'
  },
  attachments: [{
    name: 'document.pdf',
    content: 'base64-encoded-content',
    contentType: 'application/pdf'
  }]
});