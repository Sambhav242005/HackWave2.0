// src/lib/api.ts
import axios from 'axios';

// Use relative URLs for Next.js API routes
const apiClient = axios.create({
  baseURL: '', // This will use the same origin (Next.js server)
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Start a new conversation
  startConversation: async (request: { text_input: string; image_input?: string; audio_input?: string }) => {
    const response = await apiClient.post('/api/conversation/start', request);
    return response.data;
  },

  // Continue the clarifier conversation
  continueClarifier: async (request: { thread_id: string; answers: string[] }) => {
    const response = await apiClient.post('/api/conversation/continue', request);
    return response.data;
  },

  // Run the workflow
  runWorkflow: async (request: { thread_id: string }) => {
    const response = await apiClient.post('/api/workflow/run', request);
    return response.data;
  },

  // Get workflow result
  getResult: async (threadId: string) => {
    const response = await apiClient.get(`/api/workflow/result/${threadId}`);
    return response.data;
  },

  // Get workflow progress
  getProgress: async (threadId: string) => {
    const response = await apiClient.get(`/api/workflow/progress/${threadId}`);
    return response.data;
  },

  // Run workflow with streaming
  runWorkflowStream: async (request: { text_input: string; image_input?: string; audio_input?: string }) => {
    const response = await fetch('/api/workflow/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.body;
  },

  // Get user projects (placeholder - implement as needed)
  getUserProjects: async (userId: string) => {
    const response = await apiClient.get(`/api/user/${userId}/projects`);
    return response.data;
  },
};

export default apiClient;