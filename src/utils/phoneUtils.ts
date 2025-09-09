export const sanitizePhone = (phone: string): string => {
  // Remove all non-digit characters except +
  return phone.replace(/[^\d+]/g, '');
};

export const buildTelUrl = (phone: string): string => {
  const sanitized = sanitizePhone(phone);
  return `tel:${sanitized}`;
};

export const buildWhatsappUrl = (phone: string, message?: string): string => {
  const sanitized = sanitizePhone(phone);
  // Remove + from the beginning for WhatsApp
  const whatsappNumber = sanitized.startsWith('+') ? sanitized.slice(1) : sanitized;
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${whatsappNumber}${message ? `?text=${encodedMessage}` : ''}`;
};

export const buildSmsUrl = (phone: string, message?: string): string => {
  const sanitized = sanitizePhone(phone);
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `sms:${sanitized}${message ? `?body=${encodedMessage}` : ''}`;
};