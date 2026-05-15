import type { seller, users } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      user?: users | seller
      role?: 'USER' | 'SELLER'
    }
  }
}

export {}
