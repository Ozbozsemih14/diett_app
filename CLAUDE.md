# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SemiHealth is a full-stack AI-powered diet and nutrition assistant that combines React/TypeScript frontend with Python Flask backend and local LLM integration via LM Studio.

## Architecture

- **Frontend**: React 19 + TypeScript + Material-UI located in `src/frontend/diet-assistant-ui/`
- **Backend**: Flask API in `src/backend/api/app.py` with modular Python services
- **AI Integration**: Local LLM via LM Studio (OpenAI-compatible API at `http://127.0.0.1:1234`)
- **Data**: CSV-based food database in `data/` directory
- **APIs**: Google Places API for restaurant/store discovery

## Key Directories

- `src/frontend/diet-assistant-ui/` - React application with TypeScript
- `src/backend/` - Flask API server and requirements
- `src/` - Core Python modules (diet_generator.py, llm_integration.py, etc.)
- `data/` - Food database and other data files

## Development Commands

### Frontend Development
```bash
# Install frontend dependencies
npm run install:frontend

# Start React development server
cd src/frontend/diet-assistant-ui && npm start

# Build frontend
npm run build:frontend

# Run tests
cd src/frontend/diet-assistant-ui && npm test
```

### Backend Development
```bash
# Create virtual environment
python -m venv venv
./venv/Scripts/activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install Python dependencies
cd src/backend && pip install -r requirements.txt

# Run Flask API server
python src/backend/api/app.py

# Alternative: Run simple mock server
python simple_server.py
```

### Full Stack Development
```bash
# Run both frontend and backend concurrently
npm run dev
```

## Environment Setup

### Required Environment Variables (.env)
```
GOOGLE_PLACES_API_KEY=your_google_api_key_here
FLASK_ENV=development
FLASK_DEBUG=1
```

### LM Studio Setup
- Install LM Studio from https://lmstudio.ai/
- Download **Phi 3.1 Mini 128k Instruct** model (IQ3_M or Q4_K_M)
- Start OpenAI-compatible server at `http://127.0.0.1:1234`

## Core Components Architecture

### Frontend (React/TypeScript)
- `Dashboard.tsx` - Main dashboard with macro controls and water calculator
- `DietPlan.tsx` - AI-generated personalized diet plans
- `Workouts.tsx` - Fitness tracking and exercise library
- `Achievements.tsx` - Gamification and progress tracking
- `Navigation.tsx` - Sidebar navigation with routing

### Backend (Python)
- `app.py` - Main Flask API with CORS configuration
- `llm_integration.py` - LM Studio integration for meal suggestions
- `diet_generator.py` - Core diet plan generation logic
- `nutritional_analysis.py` - Macro/micro nutrient calculations
- `user_management.py` - User profile and preferences

## Key Features Implementation

### LLM Integration
- All AI requests go through `llm_integration.py`
- Uses OpenAI-compatible API format
- Configured for local LM Studio server
- Handles meal suggestions and diet explanations

### State Management
- React Context API for user profiles (`UserContext.tsx`)
- Progress tracking via `ProgressContext.tsx`
- Mock data integration via `mockApi.ts`

### UI/UX Patterns
- Material-UI components with consistent dark theme
- Responsive grid layouts for mobile/desktop
- Framer Motion animations for smooth transitions
- Color-coded progress bars and interactive sliders

## Testing and Quality

### Available Test Commands
```bash
# Frontend tests (React Testing Library + Jest)
cd src/frontend/diet-assistant-ui && npm test
```

### Code Style
- TypeScript strict mode enabled
- Material-UI component patterns
- Consistent naming: camelCase for variables, PascalCase for components
- No ESLint/Prettier configuration detected - follow existing code style

## Common Development Tasks

### Adding New Components
1. Follow existing component structure in `src/frontend/diet-assistant-ui/src/components/`
2. Use Material-UI components and existing theme
3. Import and integrate with `Navigation.tsx` for routing
4. Update `App.tsx` for new routes

### Modifying Diet Logic
1. Backend changes in `src/diet_generator.py` or related modules
2. Update API endpoints in `src/backend/api/app.py`
3. Frontend integration via `src/frontend/diet-assistant-ui/src/api/mockApi.ts`

### LLM Prompt Changes
- Edit prompts in `src/llm_integration.py`
- Model name must match LM Studio configuration
- Test with LM Studio server running locally

## Dependencies and Versions

### Frontend Stack
- React 19.0.0 + TypeScript 4.9.5
- Material-UI 6.4.7 with Emotion styling
- React Router 7.3.0 for navigation
- Axios 1.8.2 for API calls
- Framer Motion 12.5.0 for animations

### Backend Stack
- Flask 2.0.1 with Flask-CORS 3.0.10
- Pandas 2.0.3 + NumPy 1.24.3 for data processing
- Scikit-learn 1.2.2 for ML features
- Requests for external API calls

## Troubleshooting

### Common Issues
- **LLM not responding**: Verify LM Studio server is running and model is loaded
- **CORS errors**: Check Flask-CORS configuration in `app.py`
- **Module import errors**: Ensure Python path includes `src/` directory
- **Frontend build issues**: Run `npm install` in `src/frontend/diet-assistant-ui/`

### Development Server URLs
- Frontend: http://localhost:3000
- Flask API: http://localhost:5000
- LM Studio: http://127.0.0.1:1234