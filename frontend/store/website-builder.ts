import { create } from "zustand";

interface RequestState {
  isLoading: boolean;
  requestId: string | null;
}

interface WebsiteBuilderState {
  // Request tracking to prevent duplicates
  aiChatRequest: RequestState;
  generateCodeRequest: RequestState;
  enhancePromptRequest: RequestState;
  createProjectRequest: RequestState;
  
  // Actions to manage request states
  setAiChatLoading: (isLoading: boolean, requestId?: string) => void;
  setGenerateCodeLoading: (isLoading: boolean, requestId?: string) => void;
  setEnhancePromptLoading: (isLoading: boolean, requestId?: string) => void;
  setCreateProjectLoading: (isLoading: boolean, requestId?: string) => void;
  
  // Helper to check if a request is already in progress
  isRequestInProgress: (type: 'aiChat' | 'generateCode' | 'enhancePrompt' | 'createProject') => boolean;
  
  // Helper to generate unique request IDs
  generateRequestId: () => string;
}

export const useWebsiteBuilderStore = create<WebsiteBuilderState>((set, get) => ({
  // Initial states
  aiChatRequest: { isLoading: false, requestId: null },
  generateCodeRequest: { isLoading: false, requestId: null },
  enhancePromptRequest: { isLoading: false, requestId: null },
  createProjectRequest: { isLoading: false, requestId: null },
  
  // Actions
  setAiChatLoading: (isLoading: boolean, requestId?: string) =>
    set({ aiChatRequest: { isLoading, requestId: requestId || null } }),
    
  setGenerateCodeLoading: (isLoading: boolean, requestId?: string) =>
    set({ generateCodeRequest: { isLoading, requestId: requestId || null } }),
    
  setEnhancePromptLoading: (isLoading: boolean, requestId?: string) =>
    set({ enhancePromptRequest: { isLoading, requestId: requestId || null } }),
    
  setCreateProjectLoading: (isLoading: boolean, requestId?: string) =>
    set({ createProjectRequest: { isLoading, requestId: requestId || null } }),
  
  // Helper methods
  isRequestInProgress: (type: 'aiChat' | 'generateCode' | 'enhancePrompt' | 'createProject') => {
    const state = get();
    switch (type) {
      case 'aiChat':
        return state.aiChatRequest.isLoading;
      case 'generateCode':
        return state.generateCodeRequest.isLoading;
      case 'enhancePrompt':
        return state.enhancePromptRequest.isLoading;
      case 'createProject':
        return state.createProjectRequest.isLoading;
      default:
        return false;
    }
  },
  
  generateRequestId: () => `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
}));