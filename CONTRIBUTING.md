# Contributing to Stadium AI

Thank you for your interest in contributing to Stadium AI! This document provides guidelines for contributing.

## Development Setup

```bash
git clone https://github.com/Ayushrai987/Stadium-ai.git
cd Stadium-ai
npm install
npm run dev
```

## Code Quality Standards

Before submitting changes, ensure:

1. **TypeScript** — Zero `any` types, strict mode enabled
2. **ESLint** — `npm run lint` must pass with 0 errors
3. **Tests** — `npm run test:run` must pass all tests
4. **Build** — `npm run build` must complete without errors

## Project Structure

- `src/types/` — All TypeScript interfaces and type definitions
- `src/infrastructure/` — Business logic, simulation, state management, security
- `src/presentation/` — React components and pages
- `src/utils/` — Pure utility functions
- `src/constants/` — Configuration and magic number extraction
- `src/__tests__/` — Test files (unit, component, integration)

## Coding Conventions

- Use `useShallow` for all Zustand store selectors
- Use `useMemo`/`useCallback` for expensive computations and event handlers
- Use `React.memo` for pure presentational components
- Use `type` imports for TypeScript types (`import type { ... }`)
- Extract inline styles to CSS classes where possible
- Add JSDoc comments to all exported functions and components
- Add ARIA attributes to all interactive elements

## Testing

```bash
npm run test           # Watch mode
npm run test:run       # Single run
npm run test:coverage  # With coverage report
```

## Commit Messages

Use conventional commits:
- `feat:` — New features
- `fix:` — Bug fixes
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `docs:` — Documentation changes
- `style:` — Code formatting (no logic changes)
- `perf:` — Performance improvements
