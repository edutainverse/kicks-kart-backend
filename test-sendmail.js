import 'dotenv/config';
import { sendMail } from './src/utils/mailer.js';
import { welcomeEmailTemplate } from './src/utils/emailTemplates.js';

async function main() {
  try {
    const { html, trackingId } = welcomeEmailTemplate('Test User');
    await sendMail({
      to: 'nvnjwl2@gmail.com',
      subject: 'KicksKart Test Email - Beautiful Template',
      html,
      trackingId,
      emailType: 'welcome',
      metadata: { name: 'Test User' }
    });
    console.log('Beautiful test email sent successfully with tracking ID:', trackingId);
  } catch (e) {
    console.error('Failed to send test email:', e);
  }
}

main();
