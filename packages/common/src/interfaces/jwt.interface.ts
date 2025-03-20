
export interface AuthPayload {
  sub: BigInt | string;
  userId: BigInt | string;
  email: string;
}

export interface AuthDecodePayload extends AuthPayload{
  iat: number;
  exp: number;
}
