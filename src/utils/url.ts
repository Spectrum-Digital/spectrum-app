export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return `http://localhost:${process.env.PORT ?? 3000}`
  }
  if (process.env.DOMAIN_URL) {
    // optional reference for your domain
    return `https://${process.env.DOMAIN_URL}`
  }
  if (process.env.VERCEL_URL) {
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  }
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}
