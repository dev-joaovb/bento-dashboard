# Bento Dashboard

> Educational Repository: This project contains intentionally seeded bugs and incomplete features across easy, medium, and hard difficulty levels. Perfect for learning React 19, Vite 6, Tailwind CSS v4, and Zustand while practicing open source contributions.

## About This Project

Bento Dashboard is a modular, grid-based personal dashboard application where users can add and customize widgets including weather displays, sticky notes, pomodoro timer, task manager, calendar, and more. The application demonstrates modern React patterns, state management with Zustand, and responsive design with Tailwind CSS v4.

This repository serves as a hands-on learning platform for developers who want to practice contributing to open source projects. Each issue is carefully crafted to teach specific concepts and skills while contributing to a real, functional application.

### Key Features

- **Modular Widget System**: Add, remove, and customize dashboard widgets
- **Pomodoro Timer**: Focus timer with customizable work/break intervals
- **Sticky Notes**: Create and manage colorful notes with different colors
- **Task Manager**: Todo list with priorities, due dates, and filtering
- **Weather Widget**: Current weather conditions with location search
- **Calendar**: Monthly calendar view with event tracking
- **Theme Support**: Light, dark, and system theme modes
- **Local Storage**: Persistent data across browser sessions

## Learning Objectives

By contributing to this repository, you will:

- Learn React 19 hooks and component patterns
- Practice state management with Zustand
- Work with Tailwind CSS v4 utility classes
- Write and debug TypeScript code
- Practice the full open source contribution workflow
- Understand testing with Vitest and Testing Library

## Quick Start

### Prerequisites

- Node.js 20 or higher
- npm, yarn, or pnpm
- Git

### Installation

#### Standard Setup

```bash
# Clone the repository
git clone https://github.com/anxkhn/bento-dashboard.git
cd bento-dashboard

# Install dependencies
npm install

# Run the application
npm run dev

# Run tests (some will fail initially - that's expected!)
npm run test
```

#### Using pnpm (Recommended)

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install dependencies
pnpm install

# Run the application
pnpm dev
```

### Verification

After installation, you should see:

- The development server running at `http://localhost:5173`
- A dashboard with several default widgets
- The ability to add, remove, and interact with widgets

Note: Some tests will fail initially - this is intentional. Your job is to fix them by resolving the issues.

## Current Known Issues

This project has 30 issues ready for contribution:

- **10 Easy (good-first-issue)**: Great for beginners - documentation, typos, simple bugs
- **10 Medium (intermediate)**: Moderate challenges - logic bugs, missing features
- **10 Hard (advanced)**: Complex problems - architecture, security, performance

[View all issues](https://github.com/anxkhn/bento-dashboard/issues)

## Project Structure

```
bento-dashboard/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # CI pipeline for lint, typecheck, build
│   │   └── pr-check.yml        # PR title and description validation
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── pull_request_template.md
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Main dashboard component
│   │   ├── ThemeToggle.tsx     # Theme switcher
│   │   ├── WidgetRegistry.ts   # Widget type definitions
│   │   └── widgets/
│   │       ├── CalendarWidget.tsx
│   │       ├── ClockWidget.tsx
│   │       ├── NotesWidget.tsx
│   │       ├── PomodoroWidget.tsx
│   │       ├── QuoteWidget.tsx
│   │       ├── SearchWidget.tsx
│   │       ├── TasksWidget.tsx
│   │       └── WeatherWidget.tsx
│   ├── hooks/                  # Custom React hooks
│   ├── store/
│   │   └── dashboardStore.ts   # Zustand state management
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Root component
│   ├── index.css               # Global styles with Tailwind v4
│   └── main.tsx                # Application entry point
├── tests/
│   ├── setup.ts                # Test setup and mocks
│   ├── ClockWidget.test.tsx
│   ├── Dashboard.test.tsx
│   ├── NotesWidget.test.tsx
│   ├── PomodoroWidget.test.tsx
│   ├── TasksWidget.test.tsx
│   └── ThemeToggle.test.tsx
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── package.json
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

### Security

Note content is sanitized before being stored, removing HTML markup and script content. Notes are rendered as plain text to prevent user-supplied HTML from being persisted as executable markup.

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx vitest run tests/ClockWidget.test.tsx
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:

- How to pick an issue
- Development workflow
- Code style guide
- Submitting pull requests

## Issue Labels Guide

| Label | Description | Time Estimate |
|-------|-------------|---------------|
| `good-first-issue` | Perfect for newcomers | 15-30 minutes |
| `intermediate` | Moderate difficulty | 1-2 hours |
| `advanced` | Complex challenges | 3-6 hours |
| `bug` | Something isn't working correctly | Varies |
| `documentation` | Improvements to docs | 15-30 minutes |
| `tests` | Related to testing | 30-60 minutes |
| `enhancement` | New feature or request | Varies |
| `security` | Security-related issues | 1-3 hours |
| `performance` | Performance optimization | 1-3 hours |
| `refactoring` | Code quality improvements | 1-2 hours |

## Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)

## Getting Help

- Create an issue for questions or help requests
- Check existing issues for similar problems
- Review the CONTRIBUTING.md for guidance

## License

MIT License - Feel free to use this for learning!

## Acknowledgments

This is an educational project designed to help developers learn React, Vite, Tailwind CSS, and Zustand through hands-on practice. Each issue is crafted to teach specific concepts while contributing to a real, functional application.

---

Ready to contribute? Check out [CONTRIBUTING.md](CONTRIBUTING.md) and pick your first issue!
