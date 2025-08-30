import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import EmailTracking from '../models/emailTracking.model.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE === 'true',
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});

export async function sendMail({ to, subject, html, text, trackingId, emailType, userId, metadata = {} }) {
  // Save tracking record if provided
  if (trackingId && emailType) {
    try {
      await EmailTracking.create({
        trackingId,
        emailType,
        userId,
        email: to,
        metadata: new Map(Object.entries(metadata))
      });
    } catch (error) {
      console.error('Failed to save email tracking:', error);
    }
  }

  return transporter.sendMail({
    from: env.SMTP_FROM || env.SMTP_USER,
    to,
    subject,
    html,
    text
  });
}
