import jwt from "jsonwebtoken";

export interface DecodedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function verifyAuth(req: Request): DecodedUser | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1]; // ambil token dari "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as DecodedUser;
  } catch (err) {
    return null;
  }
}
