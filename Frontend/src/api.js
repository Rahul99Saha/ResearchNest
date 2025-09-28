import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:5001/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Student Dashboard Functions ---
export const getMyProgress = () => API.get("/progress/me");
export const updateNodeStatus = (nodeId, status) =>
  API.patch(`/progress/node/${nodeId}`, { status });

// --- NEW: Faculty Dashboard Functions ---/

/**
 * Fetches a summary list of all students for the logged-in faculty member.
 * Makes a GET request to: /api/faculty/my-students (This is a proposed new endpoint)
 */
export const getFacultyStudents = () => API.get("/faculty/my-students");

/**
 * Allows a faculty member to override the status of a specific node for a student.
 * Makes a POST request to: /api/progress/:studentId/node/:nodeId/override
 * @param {string} studentId - The ID of the student.
 * @param {string} nodeId - The ID of the node to override.
 * @param {'Completed' | 'In Progress' | 'Locked'} status - The new status to enforce.
 */
export const overrideStudentNodeStatus = (studentId, nodeId, status) =>
  API.post(`/progress/${studentId}/node/${nodeId}/override`, { status });
