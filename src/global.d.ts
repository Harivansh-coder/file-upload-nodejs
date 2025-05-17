interface RequestUser {
  id: string;
}

declare namespace Express {
  interface Request {
    user: RequestUser;
  }
}
