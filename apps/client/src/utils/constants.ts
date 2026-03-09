export const HOST = import.meta.env.VITE_SERVER_URL;

export const API_URL = `${HOST}/api`;

export const AUTH_URL = `${API_URL}/auth`;
export const LOGIN_URL = `${AUTH_URL}/login`;
export const REGISTER_URL = `${AUTH_URL}/register`;
export const LOGOUT_URL = `${AUTH_URL}/logout`;
export const GET_ME_URL = `${AUTH_URL}/me`;

export const USER_URL = `${API_URL}/user`;
export const UPDATE_PROFILE_URL = `${USER_URL}/update-profile`;
export const GET_PROFILE_URL = (userId: string) => `${USER_URL}/get/${userId}`;

export const SKILLS_URL = `${API_URL}/skills`;
export const SEARCH_SKILLS_URL = `${SKILLS_URL}/search-skills`;
export const ADD_USER_SKILL_URL = `${SKILLS_URL}/add-user-skill`;
export const REMOVE_USER_SKILL_URL = `${SKILLS_URL}/remove-user-skill`;
