const disposableDomains = new Set([
  'yopmail.com',
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'dispostable.com',
  'getairmail.com',
  'sharklasers.com',
  'maildrop.cc',
  'trashmail.com',
  'tempmailaddress.com',
  'burnermail.io',
  'fakeinbox.com',
  'generator.email',
  'mailnesia.com',
  'mailcatch.com',
  'moakt.com',
  'crazymailing.com',
  'tempmail.net',
  'tempmail.co',
]);

/**
 * Checks if an email belongs to a temporary/disposable domain.
 * @param email Email to validate
 */
export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes('@')) {
    return false;
  }
  
  const domain = email.split('@')[1].toLowerCase().trim();
  return disposableDomains.has(domain);
}
