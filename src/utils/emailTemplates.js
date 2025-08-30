// Email templates with Edutainverse branding and pixel tracking
import crypto from 'crypto';

const EDUTAINVERSE_URL = 'https://www.edutainverse.com/';
const TRACKING_BASE_URL = process.env.APP_URL || 'http://localhost:4000';

// Generate unique tracking pixel ID
function generateTrackingId() {
  return crypto.randomBytes(16).toString('hex');
}

// Base template with Edutainverse branding
function baseTemplate(content, trackingId) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KicksKart - A Product by Edutainverse</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
        .header p { color: #ffffff; margin: 5px 0 0 0; font-size: 14px; }
        .content { padding: 30px; }
        .footer { background-color: #333; color: #ffffff; padding: 20px; text-align: center; font-size: 12px; }
        .footer a { color: #667eea; text-decoration: none; }
        .footer a:hover { text-decoration: underline; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .btn:hover { background-color: #5a6fd8; }
        .order-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏷️ KicksKart</h1>
            <p>A Product by <a href="${EDUTAINVERSE_URL}" style="color: #ffffff; text-decoration: underline;">Edutainverse</a></p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>© 2025 KicksKart - A Product by <a href="${EDUTAINVERSE_URL}">Edutainverse</a></p>
            <p>Empowering education and innovation worldwide</p>
            <p><a href="${EDUTAINVERSE_URL}">Visit Edutainverse</a> | <a href="${EDUTAINVERSE_URL}">Our Products</a></p>
        </div>
    </div>
    <!-- Tracking Pixel -->
    <img src="${TRACKING_BASE_URL}/api/track/email/${trackingId}" width="1" height="1" style="display:none;" alt="">
</body>
</html>`;
}

export function welcomeEmailTemplate(name, trackingId = generateTrackingId()) {
  const content = `
    <h2>Welcome to KicksKart! 👋</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for joining KicksKart, the ultimate destination for premium footwear!</p>
    <p>We're excited to have you as part of our community. Get ready to discover amazing shoes and exclusive deals.</p>
    <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.APP_URL || 'http://localhost:5173'}" class="btn">Start Shopping</a>
    </div>
    <p>Happy shopping!</p>
    <p>The KicksKart Team</p>
  `;
  return { html: baseTemplate(content, trackingId), trackingId };
}

export function forgotPasswordEmailTemplate(name, resetLink, trackingId = generateTrackingId()) {
  const content = `
    <h2>Password Reset Request 🔐</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset your KicksKart account password.</p>
    <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
    <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" class="btn">Reset Password</a>
    </div>
    <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
    <p>For security reasons, please don't share this email with anyone.</p>
    <p>Best regards,<br>The KicksKart Team</p>
  `;
  return { html: baseTemplate(content, trackingId), trackingId };
}

export function orderPlacedEmailTemplate(name, orderId, items, amount, trackingId = generateTrackingId()) {
  const itemsList = items.map(item => `
    <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
        <strong>Product:</strong> ${item.productId}<br>
        <strong>Size:</strong> ${item.size}<br>
        <strong>Quantity:</strong> ${item.qty}<br>
        <strong>Price:</strong> $${item.price}
    </div>
  `).join('');

  const content = `
    <h2>Order Confirmation 📦</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for your order! We're excited to get your new kicks to you.</p>
    <div class="order-details">
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Total Amount:</strong> $${amount}</p>
        <h4>Items Ordered:</h4>
        ${itemsList}
    </div>
    <p>We'll send you another email when your order ships with tracking information.</p>
    <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.APP_URL || 'http://localhost:5173'}/orders/${orderId}" class="btn">Track Your Order</a>
    </div>
    <p>Thank you for choosing KicksKart!</p>
    <p>The KicksKart Team</p>
  `;
  return { html: baseTemplate(content, trackingId), trackingId };
}

export function orderShippedEmailTemplate(name, orderId, trackingNumber, trackingId = generateTrackingId()) {
  const content = `
    <h2>Your Order Has Shipped! 🚚</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Great news! Your KicksKart order is on its way to you.</p>
    <div class="order-details">
        <h3>Shipping Details</h3>
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
    </div>
    <p>You can track your package using the tracking number above or click the button below.</p>
    <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.APP_URL || 'http://localhost:5173'}/orders/${orderId}" class="btn">Track Package</a>
    </div>
    <p>We hope you love your new kicks!</p>
    <p>The KicksKart Team</p>
  `;
  return { html: baseTemplate(content, trackingId), trackingId };
}

export function paymentSuccessEmailTemplate(name, orderId, amount, trackingId = generateTrackingId()) {
  const content = `
    <h2>Payment Successful! ✅</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>We've successfully processed your payment for order #${orderId}.</p>
    <div class="order-details">
        <h3>Payment Details</h3>
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Amount Paid:</strong> $${amount}</p>
        <p><strong>Status:</strong> Payment Confirmed</p>
    </div>
    <p>Your order is now being prepared for shipment. You'll receive another email when it ships.</p>
    <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.APP_URL || 'http://localhost:5173'}/orders/${orderId}" class="btn">View Order</a>
    </div>
    <p>Thank you for your purchase!</p>
    <p>The KicksKart Team</p>
  `;
  return { html: baseTemplate(content, trackingId), trackingId };
}
