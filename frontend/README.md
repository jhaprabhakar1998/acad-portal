# VMC Academic Portal - Frontend

React application for VMC Vidyamandir Classes student/parent portal.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # UI component library (Button, Input, Radio, Card)
│   ├── Logo.jsx        # VMC Logo component
│   └── RadioGroup.jsx  # Radio button group component
├── pages/              # Page components
│   └── LoginPage.jsx  # Login/OTP page
├── services/           # API services
│   └── api.js         # API client and endpoints
├── utils/              # Utility functions
│   └── htmlParser.js  # HTML parsing utilities
├── hooks/              # Custom React hooks (future)
├── context/            # React context providers (future)
└── styles.css          # Global styles
```

## Component Library

The UI component library (`components/ui/`) provides reusable, consistent components:

- **Button**: Primary, secondary, outline, and ghost variants
- **Input**: Text input with label, error states, and validation
- **Radio**: Radio button with custom styling
- **Card**: Container component with header, body, and footer

## Features

### Login Flow
1. **Roll Number Input**: User enters their roll number
2. **Request OTP**: Validates roll number and fetches available phone numbers
3. **Phone Selection**: User selects from masked phone numbers
4. **Send OTP**: Sends OTP to selected phone number (to be implemented)

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Design Patterns

### Component Architecture
- **Atomic Design**: Components are organized from smallest (UI components) to largest (Pages)
- **Separation of Concerns**: UI, business logic, and API calls are separated
- **Reusability**: Common components are in the UI library
- **Consistency**: All components follow the same design system

### State Management
- Local state for component-specific data
- API service layer for data fetching
- Future: Context API or state management library for global state

### Styling
- CSS Modules approach (component-specific CSS files)
- CSS Variables for theming
- Responsive design with mobile-first approach

## API Integration

The app uses a centralized API service (`services/api.js`) that:
- Handles all HTTP requests
- Provides consistent error handling
- Supports environment-based configuration

## Extensibility

The structure is designed to be easily extended:

1. **New Pages**: Add to `pages/` directory
2. **New Components**: Add to `components/` or `components/ui/`
3. **New Services**: Add to `services/` directory
4. **New Utilities**: Add to `utils/` directory
5. **Routing**: Can easily integrate React Router when needed

## Future Enhancements

- [ ] React Router for navigation
- [ ] Context API for global state
- [ ] Custom hooks for common logic
- [ ] Form validation library
- [ ] Loading states and error boundaries
- [ ] Unit and integration tests

