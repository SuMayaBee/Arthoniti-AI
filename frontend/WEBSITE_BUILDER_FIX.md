# Website Builder Double Request Fix

## Problem
The website builder was sending duplicate requests to AI endpoints (`/ai-chat`, `/generate-code`, `/enhance-prompt`, `/projects`), causing:
- Double API calls and increased costs
- Duplicate responses in the UI
- Poor user experience
- Potential race conditions

## Root Causes
1. **React StrictMode** - Causes components to render twice in development
2. **Multiple useEffect triggers** - Auto-continue logic triggering multiple times
3. **Rapid state updates** - Causing re-renders that trigger effects again
4. **No request deduplication** - Same requests being sent simultaneously

## Solution

### 1. Zustand State Management (`store/website-builder.ts`)
- Created a centralized store to track request states
- Prevents duplicate requests by checking if a request is already in progress
- Generates unique request IDs for tracking
- Manages loading states for all website builder endpoints

### 2. Request Deduplication at API Level (`lib/api/client.ts`)
- Added request caching mechanism
- Deduplicates identical POST requests to AI endpoints
- Returns cached promises for duplicate requests
- Automatically cleans up cache on completion

### 3. Custom Hook for Effect Deduplication (`hooks/use-prevent-double-effect.ts`)
- Prevents useEffect from running twice in React StrictMode
- Particularly useful for initial data fetching
- Uses ref-based tracking with optional keys

### 4. Enhanced Request Handling
- Added request state checks before making API calls
- Implemented proper cleanup on component unmount
- Added debouncing for auto-continue functionality
- Enhanced logging for debugging

## Implementation Details

### Store Structure
```typescript
interface WebsiteBuilderState {
  aiChatRequest: RequestState;
  generateCodeRequest: RequestState;
  enhancePromptRequest: RequestState;
  createProjectRequest: RequestState;
  
  // Actions to manage states
  setAiChatLoading: (isLoading: boolean, requestId?: string) => void;
  // ... other setters
  
  // Helper methods
  isRequestInProgress: (type: string) => boolean;
  generateRequestId: () => string;
}
```

### Request Flow
1. Check if request is already in progress using Zustand store
2. Generate unique request ID
3. Set loading state in store
4. Make API call (with deduplication at client level)
5. Clear loading state on completion/error

### Key Files Modified
- `store/website-builder.ts` - New Zustand store
- `hooks/use-prevent-double-effect.ts` - New custom hook
- `lib/api/client.ts` - Added request deduplication
- `app/website-builder/page.tsx` - Updated to use store
- `app/website-builder/[websiteId]/page.tsx` - Updated to use store

## Benefits
- ✅ Eliminates duplicate API requests
- ✅ Improves user experience with proper loading states
- ✅ Reduces API costs and server load
- ✅ Prevents race conditions
- ✅ Better error handling and debugging
- ✅ Centralized request state management

## Testing
To verify the fix:
1. Open browser dev tools and monitor Network tab
2. Create a new website project
3. Send messages in the chat
4. Use the enhance prompt feature
5. Verify only single requests are made for each action

## Future Improvements
- Add request retry logic with exponential backoff
- Implement request cancellation for user-initiated cancellations
- Add request timeout handling
- Consider adding request queuing for better UX