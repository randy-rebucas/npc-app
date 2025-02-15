import * as Brevo from '@getbrevo/brevo';

interface EmailRecipient {
  email: string;
  name?: string;
}

interface EmailSender {
  name: string;
  email: string;
}

interface EmailParams {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  sender?: EmailSender;
  replyTo?: EmailSender;
  attachments?: Array<{
    name: string;
    content: string;
    contentType?: string;
  }>;
}

export class EmailService {
  private apiInstance: Brevo.TransactionalEmailsApi;
  private defaultSender: EmailSender;

  constructor(defaultSender?: EmailSender) {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY environment variable is not set');
    }

    // const config = new Brevo.Configuration();
    this.apiInstance = new Brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    this.defaultSender = defaultSender || {
      name: process.env.BREVO_SENDER_NAME || 'Your Name',
      email: process.env.BREVO_SENDER_EMAIL || 'your-verified-sender@domain.com'
    };
  }

  async sendEmail(params: EmailParams): Promise<Brevo.CreateSmtpEmail> {
    try {
      const sendSmtpEmail = new Brevo.SendSmtpEmail();
      
      sendSmtpEmail.subject = params.subject;
      sendSmtpEmail.htmlContent = params.htmlContent;
      sendSmtpEmail.textContent = params.textContent;
      sendSmtpEmail.sender = params.sender || this.defaultSender;
      sendSmtpEmail.replyTo = params.replyTo;
      
      // Handle single recipient or array of recipients
      sendSmtpEmail.to = Array.isArray(params.to) 
        ? params.to 
        : [params.to];

      // Handle attachments if present
      if (params.attachments?.length) {
        sendSmtpEmail.attachment = params.attachments.map(attachment => ({
          name: attachment.name,
          content: attachment.content,
          contentType: attachment.contentType
        }));
      }

      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return response.body;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to send email';
      
      console.error('Error sending email:', error);
      throw new Error(`Email sending failed: ${errorMessage}`);
    }
  }
} 