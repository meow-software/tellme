
export interface AuthPayload {
  sub: string;
  userId: string;
  email: string;
}

export interface AuthDecodePayload extends AuthPayload{
  iat: number;
  exp: number;
}
