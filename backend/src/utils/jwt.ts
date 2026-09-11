import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'researchpilot_super_secret_jwt_key_2026_hackathon';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  id?: string;
  userId: string;
  email: string;
  name: string;
  role?: string;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
