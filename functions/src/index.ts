import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// ─── Rate Limiting (in-memory, per instance) ───

const ipRequests = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipRequests.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  ipRequests.set(ip, timestamps);
  return false;
}

// ─── Nodemailer Transport ───
// Set credentials via: firebase functions:config:set gmail.user="..." gmail.password="..."

function getTransporter() {
  const gmailConfig = functions.config().gmail || {};
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailConfig.user || 'REPLACE:gmail-user@gmail.com',
      pass: gmailConfig.password || 'REPLACE:gmail-app-password',
    },
  });
}

function getSenderAddress(): string {
  const gmailConfig = functions.config().gmail || {};
  return gmailConfig.user || 'REPLACE:gmail-user@gmail.com';
}

// ─── Validation ───

interface LeadFormRequest {
  tripType: 'fleet' | 'local-tour' | 'international';
  vehicleType?: string;
  pickupLocation?: string;
  pickupDate?: string;
  returnDate?: string;
  destination?: string;
  groupSize?: number;
  budgetRange?: string;
  travelDates?: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  website?: string; // honeypot — must be empty
}

function validate(body: LeadFormRequest): string | null {
  if (!body.tripType || !body.name || !body.phone || !body.email) {
    return 'Required fields: tripType, name, phone, email';
  }
  if (!/^[6-9]\d{9}$/.test(body.phone)) {
    return 'Enter a valid 10-digit Indian mobile number';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return 'Enter a valid email address';
  }
  return null;
}

// ─── Email Builders ───

function buildNotificationHtml(body: LeadFormRequest): string {
  const rows = Object.entries(body)
    .filter(([key]) => key !== 'website')
    .map(
      ([key, val]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;text-transform:capitalize">${key.replace(/([A-Z])/g, ' $1')}</td><td style="padding:8px 12px;border:1px solid #e2e8f0">${val ?? '—'}</td></tr>`
    )
    .join('');

  return `
    <h2 style="color:#0F766E">New Lead Enquiry</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px">${rows}</table>
    <p style="color:#64748b;font-size:13px;margin-top:16px">Submitted via iWay Tourism website lead form.</p>
  `;
}

function buildConfirmationHtml(name: string): string {
  return `
    <p>Hi ${name},</p>
    <p>Thank you for reaching out to iWay Tourism. We've received your enquiry and our team will review it promptly.</p>
    <p><strong>Expected response time:</strong> within 2 hours during business hours (Mon–Sat, 9:00 AM – 7:00 PM IST).</p>
    <p>If your request is urgent, feel free to call us directly.</p>
    <br/>
    <p>Warm regards,<br/>The iWay Tourism Team<br/>Marthandam, Tamil Nadu</p>
  `;
}

// ─── Cloud Function ───

export const submitLead = functions
  .region('asia-south1')
  .https.onRequest(async (req, res) => {
    // CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ success: false, message: 'Method not allowed' });
      return;
    }

    // Rate limiting
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';
    if (isRateLimited(ip)) {
      res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
      return;
    }

    const body: LeadFormRequest = req.body;

    // Honeypot — silently accept to not reveal the trap
    if (body.website) {
      res.status(200).json({ success: true, message: 'Enquiry submitted successfully' });
      return;
    }

    // Validation
    const validationError = validate(body);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    try {
      const transporter = getTransporter();
      const sender = getSenderAddress();

      // 1. Notification email to iWay team
      await transporter.sendMail({
        from: `"iWay Tourism" <${sender}>`,
        to: sender,
        subject: `New Lead: ${body.tripType} — ${body.name}`,
        html: buildNotificationHtml(body),
      });

      // 2. Confirmation email to submitter
      await transporter.sendMail({
        from: `"iWay Tourism" <${sender}>`,
        to: body.email,
        subject: 'We received your enquiry — iWay Tourism',
        html: buildConfirmationHtml(body.name),
      });

      res.status(200).json({ success: true, message: 'Enquiry submitted successfully' });
    } catch (error) {
      console.error('Email send error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
