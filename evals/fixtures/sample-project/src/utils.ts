import crypto from 'crypto'

export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function validateEmail(email: string): boolean {
  // Simple regex for email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
