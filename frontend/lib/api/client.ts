import axios from "axios";
import { toast } from "sonner";
import { getCookie, deleteCookie } from "@/lib/utils";

// Request deduplication cache with timestamps
const pendingRequests = new Map<string, { promise: Promise<any>, timestamp: number }>();

// Clean up old cache entries (older than 30 seconds)
function cleanupCache() {
  const now = Date.now();
  const maxAge = 30000; // 30 seconds
  
  for (const [key, entry] of pendingRequests.entries()) {
    if (now - entry.timestamp > maxAge) {
      pendingRequests.delete(key);
    }
  }
}

// Clean up cache periodically
if (typeof window !== "undefined") {
  setInterval(cleanupCache, 10000); // Clean every 10 seconds
}

// Generate a cache key for request deduplication
function generateCacheKey(config: any): string {
  const { method, url, data } = config;
  const dataHash = data ? JSON.stringify(data) : '';
  return `${method?.toUpperCase()}-${url}-${dataHash}`;
}

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/$/,
  ""
);

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 0, // No timeout for any request
  // Removed withCredentials since we're using Bearer token auth, not cookie auth
});

// Request interceptor to add auth token from cookie (if backend expects Bearer)
apiClient.interceptors.request.use(
  (config) => {
    // Debug logging for client-side requests
    if (typeof window !== "undefined") {
      console.log("🌐 API Request:", {
        method: config.method?.toUpperCase(),
        url: (config.baseURL || '') + (config.url || ''),
        headers: config.headers,
        data: config.data
      });
      
      const token = getCookie("access_token");
      if (token) {
        (config.headers as any).Authorization = `Bearer ${token}`;
      }

      // If sending FormData, let the browser set the proper multipart boundary
      if (typeof FormData !== "undefined" && config.data instanceof FormData) {
        if (config.headers) {
          delete (config.headers as any)["Content-Type"];
        }
      }

      // Temporarily disable request deduplication to fix OPTIONS request issues
      // TODO: Re-implement with better CORS handling
      /*
      // Add request deduplication for POST requests to specific endpoints
      // Exclude OPTIONS requests (CORS preflight) from deduplication
      const method = config.method?.toLowerCase();
      const isDeduplicatable = method === 'post' && 
        method !== 'options' &&
        (config.url?.includes('/ai-chat') || 
         config.url?.includes('/generate-code') || 
         config.url?.includes('/enhance-prompt') ||
         config.url?.includes('/projects'));

      if (isDeduplicatable) {
        const cacheKey = generateCacheKey(config);
        const cachedEntry = pendingRequests.get(cacheKey);
        
        if (cachedEntry) {
          console.log("🔄 Deduplicating request:", cacheKey);
          // Return the existing promise instead of making a new request
          return Promise.reject({ 
            __isDuplicate: true, 
            promise: cachedEntry.promise 
          });
        }
        // Mark this request as pending
        config.__cacheKey = cacheKey;
      }
      */
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Temporarily disabled request deduplication wrapper
// const originalRequest = apiClient.request.bind(apiClient);
// apiClient.request = function(config: any) {
//   const cacheKey = config.__cacheKey;
//   
//   if (cacheKey && typeof window !== "undefined") {
//     // Create the promise and cache it with timestamp
//     const requestPromise = originalRequest(config)
//       .then((response) => {
//         // Remove from cache on success
//         pendingRequests.delete(cacheKey);
//         return response;
//       })
//       .catch((error) => {
//         // Remove from cache on error
//         pendingRequests.delete(cacheKey);
//         throw error;
//       });
//     
//     pendingRequests.set(cacheKey, {
//       promise: requestPromise,
//       timestamp: Date.now()
//     });
//     return requestPromise;
//   }
//   
//   return originalRequest(config);
// };

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Debug logging for successful responses
    if (typeof window !== "undefined") {
      console.log("✅ API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Temporarily disabled deduplication handling
    // if (error.__isDuplicate && error.promise) {
    //   console.log("🔄 Returning cached promise for duplicate request");
    //   return error.promise;
    // }

    // Debug logging for errors
    if (typeof window !== "undefined") {
      console.error("❌ API Error:", {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data
      });

      // Build a user-facing error message and toast it
      try {
        const data = error.response?.data;
        const detail = data?.detail;
        let detailMsg: string | undefined;
        if (Array.isArray(detail)) {
          detailMsg = detail
            .map((d: any) => d?.msg || d?.message || (typeof d === 'string' ? d : JSON.stringify(d)))
            .join("; ");
        } else if (typeof detail === "string") {
          detailMsg = detail;
        }

        const fallbackMsg = data?.message || error.message || "Request failed";
        const timeoutMsg = (error.code === 'ECONNABORTED') ? "Request timed out. Please try again." : undefined;
        const networkMsg = (!error.response && error.message) ? error.message : undefined;
        const msg = timeoutMsg || detailMsg || networkMsg || fallbackMsg;
        // Toast once per failure path
        toast.error(typeof msg === 'string' ? msg : "Something went wrong");
      } catch {
        toast.error("Something went wrong");
      }
    }
    
    if (error.response?.status === 401) {
      // Clear auth cookie and redirect to login (client-side only)
      if (typeof window !== "undefined") {
        deleteCookie("access_token");
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
