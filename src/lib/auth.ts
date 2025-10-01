import jwt from "jsonwebtoken"

export function verifyAuth(token?: string) {
    if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    return decoded as { id: string; email: string; name: string; role: string }
  } catch (err) {
    return null
  }
}
