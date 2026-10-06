const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  }
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
  return response;
};

export const api = {
  // Authentication
  auth: {
    login: (credentials) =>
      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      }).then(handleResponse),
    getMe: () =>
      fetch(`${API_BASE}/auth/me`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    changePassword: (data) =>
      fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
  },

  // Profile
  profile: {
    get: () =>
      fetch(`${API_BASE}/profile`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    update: (data) =>
      fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
  },

  // Education
  education: {
    list: () =>
      fetch(`${API_BASE}/education`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    create: (data) =>
      fetch(`${API_BASE}/education`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (id, data) =>
      fetch(`${API_BASE}/education/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/education/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
  },

  // Skills
  skills: {
    list: (category = '') =>
      fetch(`${API_BASE}/skills${category ? `?category=${encodeURIComponent(category)}` : ''}`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    create: (data) =>
      fetch(`${API_BASE}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (id, data) =>
      fetch(`${API_BASE}/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/skills/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
  },

  // Courses & GPA
  courses: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/courses${qs ? `?${qs}` : ''}`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse);
    },
    get: (id) =>
      fetch(`${API_BASE}/courses/${id}`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    create: (data) =>
      fetch(`${API_BASE}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (id, data) =>
      fetch(`${API_BASE}/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/courses/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    getStats: () =>
      fetch(`${API_BASE}/courses/stats`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    getGradesConfig: () =>
      fetch(`${API_BASE}/courses/grades-config`).then(handleResponse),
    updateGradesConfig: (mappings) =>
      fetch(`${API_BASE}/courses/grades-config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ mappings }),
      }).then(handleResponse),
    addTopic: (courseId, topic) =>
      fetch(`${API_BASE}/courses/${courseId}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(topic),
      }).then(handleResponse),
    updateTopic: (courseId, topicId, data) =>
      fetch(`${API_BASE}/courses/${courseId}/topics/${topicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    deleteTopic: (courseId, topicId) =>
      fetch(`${API_BASE}/courses/${courseId}/topics/${topicId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
  },

  // Resources
  resources: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/resources${qs ? `?${qs}` : ''}`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse);
    },
    get: (id) =>
      fetch(`${API_BASE}/resources/${id}`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    create: (data) =>
      fetch(`${API_BASE}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (id, data) =>
      fetch(`${API_BASE}/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/resources/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
  },

  // Certificates
  certificates: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/certificates${qs ? `?${qs}` : ''}`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse);
    },
    create: (data) =>
      fetch(`${API_BASE}/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (id, data) =>
      fetch(`${API_BASE}/certificates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/certificates/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
  },

  // Projects
  projects: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/projects${qs ? `?${qs}` : ''}`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse);
    },
    get: (id) =>
      fetch(`${API_BASE}/projects/${id}`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    create: (data) =>
      fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (id, data) =>
      fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
  },

  // Learning Progress & Roadmaps
  learning: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/learning${qs ? `?${qs}` : ''}`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse);
    },
    create: (data) =>
      fetch(`${API_BASE}/learning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (id, data) =>
      fetch(`${API_BASE}/learning/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/learning/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    getStats: () =>
      fetch(`${API_BASE}/learning/stats`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    getLogs: () =>
      fetch(`${API_BASE}/learning/logs`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    createLog: (data) =>
      fetch(`${API_BASE}/learning/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    deleteLog: (id) =>
      fetch(`${API_BASE}/learning/logs/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
  },

  // Interests
  interests: {
    list: () =>
      fetch(`${API_BASE}/interests`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    create: (data) =>
      fetch(`${API_BASE}/interests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (id, data) =>
      fetch(`${API_BASE}/interests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/interests/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
  },

  // Dashboard & Search
  dashboard: {
    getOverview: () =>
      fetch(`${API_BASE}/dashboard/overview`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
    search: (query) =>
      fetch(`${API_BASE}/dashboard/search?q=${encodeURIComponent(query)}`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
  },

  // Upload
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: formData,
    }).then(handleResponse);
  },

  // Export
  export: {
    getCoursesCsvUrl: () => `${API_BASE}/export/courses/csv`,
    getCertificatesCsvUrl: () => `${API_BASE}/export/certificates/csv`,
    getLearningCsvUrl: () => `${API_BASE}/export/learning/csv`,
    getAcademicSummary: () =>
      fetch(`${API_BASE}/export/academic-summary`, {
        headers: { ...getAuthHeaders() },
      }).then(handleResponse),
  },
};
