import crypto from 'crypto';

export function verifySignature(rawBodyBuffer, header, secret) {
  if (!header) return false;
  try {
    const parts = Object.fromEntries(
      header.split(',').map((p) => {
        const [k, v] = p.split('=');
        return [k.trim(), v];
      })
    );
    const signature = parts.sig;
    if (!signature) return false;

    const digest = crypto.createHmac('sha256', secret).update(rawBodyBuffer).digest('hex');
    const a = Buffer.from(signature, 'hex');
    const b = Buffer.from(digest, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (_e) {
    return false;
  }
}
