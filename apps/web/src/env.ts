let env = process.env

const isServer = typeof window === 'undefined'

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 */
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
  REDIS_URL: process.env.REDIS_URL,
} as const

env = new Proxy(processEnv, {
  get: (target, name) => {
    if (typeof name !== 'string') return undefined

    if (!isServer && !name.startsWith('NEXT_PUBLIC_')) {
      throw new Error(
        process.env.NODE_ENV === 'production'
          ? '❌ Attempted to access a server-side environment variable on the client'
          : `❌ Attempted to access server-side environment variable '${name}' on the client`
      )
    }

    return target[name as keyof typeof target]
  },
})

export default env as typeof processEnv
