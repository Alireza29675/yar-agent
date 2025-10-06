import { hashPassword } from './utils'

export class AuthService {
  private users = new Map<string, string>()

  async login(username: string, password: string): Promise<boolean> {
    const stored = this.users.get(username)
    if (!stored) return false

    const hashed = await hashPassword(password)
    return stored === hashed
  }

  async register(username: string, password: string): Promise<void> {
    // Bug: No password validation
    const hashed = await hashPassword(password)
    this.users.set(username, hashed)
  }
}
