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

export const EMPLOYEE_URL = `${API_URL}/employee`;
export const GET_EMPLOYEES_URL = (projectId: string, params?: string) =>
  `${EMPLOYEE_URL}/${projectId}${
    params?.toString() ? `?${params.toString()}` : ""
  }`;
export const ADD_EMPLOYEE_URL = (projectId: string) =>
  `${EMPLOYEE_URL}/${projectId}`;
export const UPDATE_EMPLOYEE_ROLE_URL = (
  projectId: string,
  employeeId: string,
) => `${EMPLOYEE_URL}/${projectId}/${employeeId}/role`;
export const REMOVE_EMPLOYEE_URL = (projectId: string, employeeId: string) =>
  `${EMPLOYEE_URL}/${projectId}/${employeeId}`;
export const GET_EMPLOYEE_URL = (projectId: string, employeeId: string) =>
  `${EMPLOYEE_URL}/${projectId}/${employeeId}`;
export const SEARCH_USERS_URL = (projectId: string) =>
  `${EMPLOYEE_URL}/search-users/${projectId}`;

export const SKILLS_URL = `${API_URL}/skills`;
export const SEARCH_SKILLS_URL = `${SKILLS_URL}/search-skills`;
export const FIND_SKILL_BY_NAME = `${SKILLS_URL}/find-by-name`;
export const ADD_USER_SKILL_URL = `${SKILLS_URL}/add-user-skill`;
export const REMOVE_USER_SKILL_URL = `${SKILLS_URL}/remove-user-skill`;

export const PROJECT_URL = `${API_URL}/project`;
export const GET_MY_PROJECTS_URL = `${PROJECT_URL}/get-my-projects`;
export const CREATE_PROJECT_URL = `${PROJECT_URL}/create`;
export const GET_PROJECT_URL = (projectId: string) =>
  `${PROJECT_URL}/get/${projectId}`;

export const TASKS_URL = `${API_URL}/tasks`;
export const CREATE_TASK_URL = `${TASKS_URL}/create`;
export const GET_TASK_URL = (projectId: string, taskId: string) =>
  `${TASKS_URL}/get/${projectId}/${taskId}`;
export const UPDATE_TASK_URL = (projectId: string, taskId: string) =>
  `${TASKS_URL}/update/${projectId}/${taskId}`;
export const DELETE_TASK_URL = (projectId: string, taskId: string) =>
  `${TASKS_URL}/delete/${projectId}/${taskId}`;
export const GET_TASKS_URL = (projectId: string, params?: string) =>
  `${TASKS_URL}/get-tasks/${projectId}${params ? `?${params}` : ""}`;
export const GET_TASK_CANDIDATES_URL = (taskId: string) =>
  `${TASKS_URL}/${taskId}/candidates`;
export const ASSIGN_TASK_URL = (taskId: string, employeeId: string) =>
  `${TASKS_URL}/${taskId}/assign/${employeeId}`;
export const SEND_TASK_MESSAGE_URL = (taskId: string, projectId: string) =>
  `${TASKS_URL}/send-message/${projectId}/${taskId}`;
export const GET_MY_TASKS_URL = (params?: string) =>
  `${TASKS_URL}/get-my-tasks${params ? `?${params}` : ""}`;

export const ASSIGNMENT_URL = `${API_URL}/assignment`;
export const GET_AVAILABLE_ASSIGNMENT_STATUSES_URL = (assignmentId: string) =>
  `${ASSIGNMENT_URL}/${assignmentId}/available-statuses`;
export const UPDATE_ASSIGNMENT_STATUS_URL = (assignmentId: string) =>
  `${ASSIGNMENT_URL}/${assignmentId}/status`;
export const DELETE_ASSIGNMENT_URL = (assignmentId: string) =>
  `${ASSIGNMENT_URL}/${assignmentId}`;

export const FILES_URL = `${API_URL}/files`;
export const UPLOAD_FILE_URL = `${FILES_URL}/upload`;
