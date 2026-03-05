export const HOST = import.meta.env.VITE_SERVER_URL;

export const API_URL = `${HOST}/api`;

export const AUTH_URL = `${API_URL}/auth`;
export const LOGIN_URL = `${AUTH_URL}/login`;
export const REGISTER_URL = `${AUTH_URL}/register`;
export const LOGOUT_URL = `${AUTH_URL}/logout`;
export const GET_ME_URL = `${AUTH_URL}/me`;

export const USER_URL = `${API_URL}/user`;
