export const sendEmail = async ({ to, subject, body }: { 
    to: string; 
    subject: string; 
    body: string; 
}) => {
    // Implement your email sending logic here
    // For now, just log it
    console.log('Sending email:', { to, subject, body });
} 