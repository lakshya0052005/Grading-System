import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const API = axios.create({
    baseURL: API_URL
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Add response interceptor for error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            console.error('API Error:', status, data);
        } else if (error.request) {
            console.error('Network Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Users & Profile
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);
export const getAllUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Assignments
export const getAssignments = () => API.get('/assignments');
export const getAssignmentById = (id) => API.get(`/assignments/${id}`);
export const createAssignment = (data) => API.post('/assignments', data);
export const updateAssignment = (id, data) => API.put(`/assignments/${id}`, data);
export const deleteAssignment = (id) => API.delete(`/assignments/${id}`);

// Submissions
export const submitAssignment = (data) => API.post('/submissions', data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
export const getSubmissionsByAssignment = (id) => API.get(`/submissions/assignment/${id}`);
export const gradeSubmission = (id, data) => API.patch(`/submissions/${id}/grade`, data);
export const getStudentSubmissions = () => API.get('/submissions/student');
export const updateSubmission = (id, data) => API.put(`/submissions/${id}`, data);
export const deleteSubmission = (id) => API.delete(`/submissions/${id}`);
export const getSubmissionById = (id) => API.get(`/submissions/${id}`);
export const returnSubmission = (id, data) => API.patch(`/submissions/${id}/return`, data);

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markNotifAsRead = (id) => API.patch(`/notifications/${id}/read`);
export const markAllNotifsAsRead = () => API.patch('/notifications/read-all');
export const deleteNotif = (id) => API.delete(`/notifications/${id}`);

export default API;