---
sidebar_position: 4
---

# Contributing Guide

Learn how to contribute to TamagoTcheat.

## Getting Started

Before contributing, make sure you have:
1. Completed the [Development Setup](./setup)
2. Read the project architecture documentation
3. Familiarized yourself with our code style guidelines

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/tamagotcheat.git
cd tamagotcheat
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Changes

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run linting
npm run lint

# Run tests (if available)
npm test

# Test the build
npm run build
```

### 5. Submit a Pull Request

1. Push your changes to your fork
2. Open a Pull Request on GitHub
3. Describe your changes clearly
4. Link any related issues

## Code Style

### TypeScript
- Use TypeScript for all new code
- Follow ts-standard linting rules
- Define proper types for all props and functions

### React Components
- Use functional components with hooks
- Follow the SOLID principles
- Keep components small and focused
- Use meaningful prop names

### Naming Conventions
- Components: PascalCase (e.g., `MonsterCard.tsx`)
- Files: kebab-case for utilities, PascalCase for components
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

## Commit Messages

Follow conventional commits:

```
feat: add new monster template
fix: resolve state decay issue
docs: update API documentation
style: format button component
refactor: simplify monster service
test: add tests for XP system
```

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] No linting errors
- [ ] Commits are meaningful and atomic

### PR Description
- Clearly describe what changes were made
- Explain why the changes were necessary
- Include screenshots for UI changes
- Reference related issues

## Questions?

If you have questions or need help:
- Open a discussion on GitHub
- Check existing documentation
- Review similar PRs

Thank you for contributing to TamagoTcheat! 🎮
