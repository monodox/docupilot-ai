# Contributing to DocuPilot AI

Thank you for your interest in contributing to DocuPilot AI! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case and motivation**
- **Proposed solution**
- **Alternative solutions considered**

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
6. **Push to the branch** (`git push origin feature/AmazingFeature`)
7. **Open a Pull Request**

## Development Setup

### Prerequisites

- Node.js >= 20.0.0
- Adobe ColdFusion 2025
- XAMPP (MySQL)
- Git

### Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/docupilot-ai.git
   cd docupilot-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup database:
   ```bash
   type database\schema.sql | C:\xampp\mysql\bin\mysql.exe -u root
   ```

4. Configure environment:
   ```bash
   cp .env.example .env.local
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## Coding Standards

### JavaScript/TypeScript

- Use TypeScript for type safety
- Follow ESLint configuration
- Use functional components with hooks
- Prefer const over let
- Use meaningful variable names
- Add comments for complex logic

### React Components

- One component per file
- Use PascalCase for component names
- Props should be typed with TypeScript
- Use destructuring for props
- Keep components small and focused

### ColdFusion

- Use cfqueryparam for all queries
- Follow Adobe ColdFusion best practices
- Add error handling with cftry/cfcatch
- Use meaningful variable names
- Add comments for complex logic

### CSS/Styling

- Use TailwindCSS utility classes
- Follow mobile-first approach
- Use dark mode classes where applicable
- Keep custom CSS minimal

### Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Examples:
```
feat: Add document export functionality
fix: Resolve login authentication issue
docs: Update installation guide
style: Format code with prettier
refactor: Simplify dashboard component
test: Add unit tests for auth service
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Test on multiple browsers
- Test responsive design
- Test dark/light themes

## Documentation

- Update README.md for new features
- Add JSDoc comments for functions
- Update API documentation
- Include code examples

## Project Structure

```
src/
├── app/              # Next.js pages
├── components/       # React components
├── lib/              # Utilities and helpers
└── styles/           # Global styles

cfml-server/
└── api/              # ColdFusion endpoints
```

## Questions?

Feel free to reach out:
- Email: hrudu.shibu@monodox.com
- Open an issue for discussion

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
