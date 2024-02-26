export interface IAuthState {
  isUserLoggedIn: boolean;
}

export interface AuthPayload {
  login: string;
  password: string;
}