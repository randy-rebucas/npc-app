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

mailjet.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

mailjet.post("send").request({
  "FromEmail": "contact@example.com",
  "FromName": "John Doe",
  "Subject": "Your email subject",
  "Text-part": "Hello World",

  default physicians


  Email address: rebucasrandy1986@gmail.com
Phone number: 09179157515
Username: randyrs
New password: Xxrr7cPf

should redirect to onboarding page if user is not onboarded