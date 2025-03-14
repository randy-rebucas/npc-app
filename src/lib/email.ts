import * as Brevo from '@getbrevo/brevo';

interface EmailRecipient {
  email: string;
  name?: string;
}

interface EmailSender {
  name: string;
  email: string;
}

interface EmailAttachment {
  name: string;
  content: string;
  contentType?: string;
}

interface EmailParams {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  sender?: EmailSender;
  replyTo?: EmailSender;
  attachments?: EmailAttachment[];
}

export class EmailService {
  private readonly apiInstance: Brevo.TransactionalEmailsApi;
  private readonly defaultSender: EmailSender;

  constructor(defaultSender?: EmailSender) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error('BREVO_API_KEY environment variable is not set');
    }

    this.apiInstance = new Brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

    this.defaultSender = defaultSender || {
      name: process.env.BREVO_SENDER_NAME || 'Default Sender',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@example.com'
    };
  }

  async sendEmail(params: EmailParams): Promise<Brevo.CreateSmtpEmail> {
    try {
      const sendSmtpEmail = new Brevo.SendSmtpEmail();
      
      // Required fields
      sendSmtpEmail.subject = params.subject;
      sendSmtpEmail.htmlContent = params.htmlContent;
      sendSmtpEmail.sender = params.sender || this.defaultSender;
      
      // Optional fields
      if (params.textContent) sendSmtpEmail.textContent = params.textContent;
      if (params.replyTo) sendSmtpEmail.replyTo = params.replyTo;
      
      // Handle recipients
      sendSmtpEmail.to = Array.isArray(params.to) ? params.to : [params.to];

      // Handle attachments
      if (params.attachments?.length) {
        sendSmtpEmail.attachment = params.attachments.map(({ name, content, contentType }) => ({
          name,
          content,
          contentType: contentType || this.getContentType(name)
        }));
      }

      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return response.body;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred while sending email';
      
      console.error('Email sending failed:', error);
      throw new Error(`Email sending failed: ${errorMessage}`);
    }
  }

  private getContentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png'
    };
    
    return mimeTypes[extension || ''] || 'application/octet-stream';
  }
} 