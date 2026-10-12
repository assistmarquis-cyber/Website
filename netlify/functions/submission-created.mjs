// Netlify runs this automatically after every verified form submission.
// It sends the "Got your application" auto-reply for Mindset Coaching applications
// from book@bigpicturearchitect.com through Hostinger's mail server.
//
// Needs these Netlify environment variables, set in the Netlify UI (never in code):
//   SMTP_PASSWORD    the password for book@bigpicturearchitect.com
//   MAILING_ADDRESS  the postal address shown in the email footer
import nodemailer from 'nodemailer';

const FROM = process.env.SMTP_USER || 'book@bigpicturearchitect.com';
const FORMS = ['mindset-application'];
// Postal address for the email footer (CAN-SPAM). Kept out of the public repo.
const ADDRESS = process.env.MAILING_ADDRESS || '';

const firstName = (name = '') => name.trim().split(/\s+/)[0] || 'there';

const body = (name) => `Hi ${firstName(name)}, thanks for applying. I read every application myself and will reply within 24 to 48 hours with next steps. In the meantime, there is nothing you need to do.

If you ever need urgent help, call or text 988 or call 911.

Marquis

Marquis Alan Experience LLC${ADDRESS ? `, ${ADDRESS}` : ''}. You received this because you submitted an application at bigpicturearchitect.com. To stop receiving emails, reply "unsubscribe."`;

export const handler = async (event) => {
  const { payload } = JSON.parse(event.body || '{}');
  if (!payload || !FORMS.includes(payload.form_name)) return { statusCode: 200 };

  const { name, email } = payload.data || {};
  if (!email || !process.env.SMTP_PASSWORD) {
    console.log('Auto-reply skipped:', !email ? 'no email' : 'SMTP_PASSWORD not set');
    return { statusCode: 200 };
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: { user: FROM, pass: process.env.SMTP_PASSWORD },
  });

  try {
    await transport.sendMail({
      from: `Marquis Harmon <${FROM}>`,
      to: email,
      subject: 'Got your application',
      text: body(name),
    });
  } catch (err) {
    // Never fail the submission because the auto-reply couldn't send.
    console.error('Auto-reply failed:', err.message);
  }
  return { statusCode: 200 };
};
