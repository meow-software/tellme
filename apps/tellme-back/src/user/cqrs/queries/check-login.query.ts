export class CheckLoginQuery {
  constructor(
    public readonly usernameOrEmail: string,
    public readonly password: string,
  ) {}
}