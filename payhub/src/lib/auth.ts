/**
 * Auth adapter.
 *
 * !!! CLIENT-SIDE PLACEHOLDER — NOT REAL SECURITY !!!
 * Accounts and session live in this browser's localStorage. Anyone with access to the browser
 * (or devtools) can read, copy, edit or delete them, and nothing is verified by a server. The
 * PBKDF2 hash only avoids storing plaintext passwords; it does not make this secure.
 * Replace this module with a real backend (e.g. Supabase Auth) keeping the same exported API:
 * register / login / logout / currentSession, all Promise-based, failing with AuthError codes.
 */
import { storage } from '@/lib/storage'

export type AuthErrorCode = 'invalid_credentials' | 'email_taken' | 'invalid_email' | 'weak_password' | 'unknown'

export class AuthError extends Error {
  readonly code: AuthErrorCode
  constructor(code: AuthErrorCode) {
    super(code)
    this.name = 'AuthError'
    this.code = code
  }
}

export interface Session {
  email: string
  name?: string
  loggedAt: string
}

interface StoredUser {
  email: string
  name: string
  salt: string
  hash: string
  iterations: number
  createdAt: string
}

const USERS_KEY = 'payhub_users'
const SESSION_KEY = 'payhub_auth'
const ITERATIONS = 150_000
export const MIN_PASSWORD_LENGTH = 8
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normEmail = (e: string) => e.trim().toLowerCase()

function toB64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s)
}
function fromB64(b64: string): Uint8Array<ArrayBuffer> {
  const s = atob(b64)
  const out = new Uint8Array(new ArrayBuffer(s.length))
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i)
  return out
}

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256)
  return toB64(bits)
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const readUsers = () => storage.getJSON<StoredUser[]>(USERS_KEY, [])

function startSession(email: string, name: string): Session {
  const session: Session = { email, name, loggedAt: new Date().toISOString() }
  storage.setJSON(SESSION_KEY, session)
  return session
}

export async function register(input: { name: string; email: string; password: string }): Promise<Session> {
  const email = normEmail(input.email)
  if (!EMAIL_RE.test(email)) throw new AuthError('invalid_email')
  if (input.password.length < MIN_PASSWORD_LENGTH) throw new AuthError('weak_password')
  const users = readUsers()
  if (users.some((u) => u.email === email)) throw new AuthError('email_taken')
  try {
    const salt = crypto.getRandomValues(new Uint8Array(new ArrayBuffer(16)))
    const hash = await derive(input.password, salt, ITERATIONS)
    const name = input.name.trim()
    users.push({ email, name, salt: toB64(salt), hash, iterations: ITERATIONS, createdAt: new Date().toISOString() })
    storage.setJSON(USERS_KEY, users)
    return startSession(email, name)
  } catch {
    throw new AuthError('unknown')
  }
}

export async function login(input: { email: string; password: string }): Promise<Session> {
  const email = normEmail(input.email)
  const user = readUsers().find((u) => u.email === email)
  if (!user) throw new AuthError('invalid_credentials')
  let hash: string
  try {
    hash = await derive(input.password, fromB64(user.salt), user.iterations)
  } catch {
    throw new AuthError('unknown')
  }
  if (!timingSafeEqual(hash, user.hash)) throw new AuthError('invalid_credentials')
  return startSession(user.email, user.name)
}

export async function logout(): Promise<void> {
  storage.remove(SESSION_KEY)
}

/** Returns the stored session. Legacy sessions ({email, loggedAt} without name) stay valid. */
export async function currentSession(): Promise<Session | null> {
  return readSession()
}

/** Synchronous variant for initial React state (the local adapter has no async work to do). */
export function readSession(): Session | null {
  const s = storage.getJSON<Partial<Session> | null>(SESSION_KEY, null)
  if (!s || typeof s.email !== 'string' || !s.email) return null
  return { email: s.email, name: typeof s.name === 'string' ? s.name : undefined, loggedAt: s.loggedAt ?? new Date().toISOString() }
}
