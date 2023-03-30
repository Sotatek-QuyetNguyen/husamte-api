export interface JwtPayload {
  sub: string;
  email: string;
  roles: number[];
  createdAt?: number | undefined | null;
}

export interface Payload {
  userId: string;
  email: string;
  roles: number[];
  createdAt?: number | undefined | null;
  checkToken?: boolean | undefined | null;
}
