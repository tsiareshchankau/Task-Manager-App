# Task Manager App

A simple task management application built with React Native and Expo. This app allows users to create, view, edit, and delete tasks, with persistent storage using Redux and AsyncStorage.



https://github.com/user-attachments/assets/82251e7b-46cf-4e50-9cc2-13a22f631d10



## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- For mobile development: Expo Go app on your device, or Android Studio/iOS Simulator

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tsiareshchankau/Task-Manager-App.git
   cd Task-Manager-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   npx expo start
   ```

4. Run on your preferred platform:
   - For web: Press `w` in the terminal or `npm run web`
   - For Android: Press `a` or `npm run android`
   - For iOS: Press `i` or `npm run ios`
   - For Expo Go: Scan the QR code with the Expo Go app

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start on web browser
- `npm run lint` - Run ESLint for code linting

## Architecture Explanation

Modular structure with clear separation of concerns:

```
src/
├── components/     # Reusable UI components
├── navigation/     # React Navigation setup
├── screens/        # Home, AddTask, TaskDetails
├── store/          # Redux state management (slices + config)
└── types/          # TypeScript interfaces
```

**Tech Stack**: React Navigation (routing) → Redux Toolkit (state) → Redux Persist + AsyncStorage (offline storage)

**Design Focus**: Modularity for scalability. New features are added as independent Redux slices without refactoring existing code. Enables easy API integration, consistent error handling, and predictable data flow.

## State Management Explanation

**Why Redux over Context?** Redux Thunks handle async API calls cleanly, new slices add features without refactoring, and DevTools enable debugging. Context would require complex nesting as features grow.

**Store**: Root store combines slices via `combineReducers`. Only `tasks` slice is persisted to AsyncStorage via Redux Persist.

**Task State**:
```typescript
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  seeded: boolean;
}
```

**Actions**: `addTask`, `toggleTask`, `updateTask`, `deleteTask`, `loadDummyTasks` (async thunk)

**Why Redux Persist?** Handles rehydration automatically, supports versioning, and scales trivially—just add new slices to the whitelist. Better than custom AsyncStorage wrapper for maintainability and team onboarding. 

## Assumptions and Tradeoffs

### Design Rationale

This app was architected with **modularity and extensibility** as primary concerns. Trade-offs were made to enable:

- **Easy Feature Addition**: New Redux slices can be added independently (userId, preferences, notifications, etc.)
- **Offline-First Architecture**: Redux Persist ensures the app works reliably without network connectivity
- **Central State Management**: All data transformations flow through Redux, making the app predictable and debuggable

### Assumptions

- **Network Availability**: The app assumes internet connectivity for loading initial dummy data, but gracefully handles offline scenarios by using cached data
- **Local Storage**: Tasks are stored locally via AsyncStorage; no cloud synchronization (enables future API integration without refactoring)
- **Simple Task Model**: Tasks have basic properties (title, description, completion status) to keep the initial implementation focused
- **Single User**: No authentication or multi-user support (can be added as a new Redux slice)


### Tradeoffs

- **Redux Over Context**: Added bundle size and learning curve in exchange for scalability, middleware support, and better API handling
- **Redux Persist Over Custom AsyncStorage**: Added dependency in exchange for reliability, versioning support, and reduced boilerplate
- **No Offline Sync**: Changes are local only; no conflict resolution for multi-device usage (but designed to support this via future middleware)
- **Simple UI**: Prioritized functionality and modularity over complex animations or advanced UI patterns
- **No Testing**: Focused on core functionality and architecture without comprehensive test coverage
- **Platform Compatibility**: Optimized for mobile but supports web with basic adaptations

## What Can Be Improved with More Time

### Technical Improvements

- **Isolated component development**: Component library with documented, accessible, and themeable primitives; Storybook integration for interactive development and documentation; visual regression tests for UI stability.
- **Testing**: Redux reducers and selectors are pure functions, trivial to unit test; integration tests via async thunks
- **Error Handling**: Add error boundary components + enhanced Redux error middleware
- **Telemetry**: for analytics and crash reporting
  
### Features 

- **Search and Filtering**: Add `filterSlice` for UI state, extend `Home` screen with search logic
- **Task Categories/Tags**: New `tagSlice` and `categorySlice`, extend `Task` model
- **Due Dates and Reminders**: New `reminderSlice` with async notification handling
- **Task Prioritization**: Extend `taskSlice` with priority field and sorting reducers
- **User Preferences**: New `preferenceSlice` for theme, notification settings, etc.
- **Calendar View**: Alternative view for tasks with due dates (new screen, new `calendarSlice`)
- **Drag and Drop**: Reorder tasks using `react-native-gesture-handler` (already installed)
- **Bulk Operations**: New reducer in `taskSlice` for batch operations


