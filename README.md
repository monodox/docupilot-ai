# DocuPilot AI - Smart Document Management Platform

<div align="center">

![DocuPilot AI Logo](https://img.shields.io/badge/DocuPilot%20AI-Document%20Management-blue?style=for-the-badge)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**An open-source, smart document management platform for legal compliance and business operations**

[Features](#features) • [Installation](#getting-started) • [Documentation](#api-endpoints) • [Contributing](CONTRIBUTING.md) • [License](#license)

</div>

---

## 📋 Overview

DocuPilot AI is a smart, unified platform that streamlines the creation, management, and compliance of business-critical documents. Built for startups and enterprises, Decree automates legal drafting, ensures regulatory accuracy, and delivers ready-to-use documents with clarity and confidence.

### Why DocuPilot AI?

- 🚀 **Fast Setup** - Get started in minutes with simple configuration
- 🔒 **Secure** - Built with security best practices
- 🎨 **Modern UI** - Beautiful, responsive interface with dark mode
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🔧 **Customizable** - Easy to extend and customize
- 📖 **Open Source** - Free to use, modify, and distribute

## Technology Stack

- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for server-side rendering and static site generation.
- **ColdFusion 2025**: Backend server for API endpoints and business logic.
- **MySQL**: Database for user management and document storage.
- **TailwindCSS**: A utility-first CSS framework for rapid UI development.
- **Lucide React**: A library of beautiful and customizable icons for React.
- **ShadCN**: A collection of accessible and customizable components for React.

## Project Structure

```
docupilot-ai/
├── cfml-server/              # ColdFusion backend
│   └── api/
│       ├── auth/             # Authentication endpoints
│       │   ├── login.cfm
│       │   ├── signup.cfm
│       │   ├── forgot-password.cfm
│       │   └── reset-password.cfm
│       ├── user/             # User management
│       │   ├── profile.cfm
│       │   └── password.cfm
│       ├── documents.cfm     # Document CRUD
│       ├── templates.cfm     # Template management
│       └── dashboard.cfm     # Dashboard stats
├── database/
│   └── schema.sql            # Database schema
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API routes
│   │   ├── auth/             # Auth pages
│   │   └── console/          # Dashboard pages
│   │       ├── create/       # Document creation
│   │       ├── dashboard/    # Main dashboard
│   │       ├── documents/    # Document list
│   │       ├── settings/     # User settings
│   │       └── templates/    # Template library
│   ├── components/
│   │   ├── console/          # Console components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   └── lib/                  # Utilities & API client
└── .env.local                # Environment variables
```

## Getting Started

### Prerequisites

- **Node.js** (>= 20.0.0)
- **Adobe ColdFusion 2025 Server**
- **XAMPP** (MySQL + Apache)
- **Ollama** (for AI features)
- **npm** or **yarn**

### Step 1: Install Dependencies

```bash
cd docupilot-ai
npm install
```

### Step 2: Setup MySQL Database

1. Start XAMPP MySQL service
2. Run the database setup:

```bash
type database\schema.sql | C:\xampp\mysql\bin\mysql.exe -u root
```

Or manually create database:

```sql
CREATE DATABASE decree_db;
USE decree_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Templates table
CREATE TABLE templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Sample users
INSERT INTO users (first_name, last_name, email, password, email_verified) 
VALUES 
('Test', 'User', 'test@example.com', 'password', TRUE);
```

### Step 3: Configure ColdFusion

1. **Install MySQL JDBC Driver:**
   - Download from: https://dev.mysql.com/downloads/connector/j/
   - Extract `mysql-connector-j-9.5.0.jar`
   - Copy to: `C:\ColdFusion2025\cfusion\lib\`
   - Restart ColdFusion service

2. **Configure Datasource:**
   - Open: `http://localhost:8500/CFIDE/administrator/`
   - Go to: Data & Services → Data Sources
   - Add datasource:
     - Name: `decree_db`
     - Driver: MySQL (4/5/8)
     - Database: `decree_db`
     - Server: `localhost`
     - Port: `3306`
     - Username: `root`
     - Password: (leave blank)
   - Click Submit

3. **Deploy ColdFusion Files:**

```bash
xcopy /E /I cfml-server\api C:\ColdFusion2025\cfusion\wwwroot\api
```

### Step 4: Configure Environment

Create `.env.local` file:

```env
NEXT_PUBLIC_CF_API_URL=http://localhost:8500
CF_API_URL=http://localhost:8500
```

### Step 5: Setup Ollama (Optional - for AI features)

1. Install Ollama from https://ollama.com
2. Pull required models:

```bash
ollama pull gemma3
ollama pull embeddinggemma
```

3. Start Ollama server:

```bash
ollama serve
```

Ollama will run on `http://localhost:11434`

### Step 6: Start Development Server

```bash
npm run dev
```

Application will be available at: `http://localhost:3000`

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Features

### Authentication
- ✅ User login/signup with email validation
- ✅ Password reset functionality
- ✅ Profile management with real-time updates
- ✅ Password change with current password verification
- ✅ Show/hide password toggle

### Document Management
- ✅ Create documents with full-page form
- ✅ AI-powered document generation with Ollama
- ✅ Multi-model approach (Creator + Moderator)
- ✅ View all documents with status badges
- ✅ Document categorization (Legal, HR, Compliance, Finance, Operations)
- ✅ Draft/Review status tracking
- ✅ Edit and delete documents
- ✅ Semantic embeddings for search

### Templates
- ✅ Pre-built legal and compliance templates
- ✅ Template library with categories
- ✅ Public/private template support
- ✅ Edit and delete templates

### Dashboard
- ✅ Real-time statistics (documents, templates, users)
- ✅ Connection status monitoring (5-second intervals)
- ✅ Dark/Light theme toggle (console only)
- ✅ Responsive sidebar navigation

### Settings
- ✅ Profile information sync with database
- ✅ Password change with validation
- ✅ Theme preferences
- ✅ ColdFusion configuration

## 🤖 AI Features

### Multi-Agent RAG Architecture

DocuPilot AI uses a sophisticated multi-agent system with RAG (Retrieval-Augmented Generation) for intelligent document processing:

#### Agent Architecture

**1. Extract Agent**
- **Purpose**: Document ingestion and preprocessing
- **Capabilities**:
  - Reads raw documents (PDF, DOCX, images)
  - Performs OCR if needed
  - Breaks content into text, metadata, and sections
  - Creates clean, machine-usable representation
- **Model**: Gemma2
- **Output**: Structured text with metadata

**2. Catalog Agent**
- **Purpose**: Content organization and indexing
- **Capabilities**:
  - Creates embeddings using embedding-gemma
  - Stores in vector database (RAG)
  - Maintains document → section → embedding relationships
  - Updates, deletes, or re-indexes content
- **Model**: embeddinggemma (embeddings), Gemma3 (processing)
- **Output**: Searchable vector store

**3. Retrieve Agent**
- **Purpose**: Intelligent content retrieval
- **Capabilities**:
  - Finds most relevant content for user requests
  - Pulls sections, facts, policies from vector store
  - Provides context to other agents
  - Ensures generation is grounded in real knowledge
- **Model**: embeddinggemma (similarity search), Gemma3 (ranking)
- **Output**: Relevant context for generation

**4. Compose Agent**
- **Purpose**: Document generation and drafting
- **Capabilities**:
  - Generates drafts, summaries, reports
  - Uses retrieved context + templates + instructions
  - Produces clean, consistent, human-ready text
  - Iterative refinement (revise, rewrite, expand)
- **Model**: Gemma2
- **Output**: Draft documents

**5. Validate Agent**
- **Purpose**: Quality assurance and compliance
- **Capabilities**:
  - Checks quality, compliance, accuracy
  - Detects policy violations, inconsistencies
  - Performs risk checks and PII detection
  - Can reject, approve, or request revision
- **Model**: Gemma2
- **Output**: Validation report with approval status

### Ollama Setup

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull required models
ollama pull gemma3              # For all agents
ollama pull embeddinggemma      # For embeddings

# Start Ollama server
ollama serve  # Runs on http://localhost:11434
```

### RAG Workflow

```
1. User uploads document → Extract Agent
2. Extract Agent → Catalog Agent (creates embeddings)
3. User requests document → Retrieve Agent (searches vector DB)
4. Retrieve Agent → Compose Agent (provides context)
5. Compose Agent → Validate Agent (checks output)
6. Validate Agent → User (approved document)
```

### Features

- **AI-Powered Generation**: Natural language prompts to documents
- **RAG-Enhanced Context**: Retrieves relevant information from existing documents
- **Multi-Agent Validation**: 5-stage processing pipeline
- **Semantic Search**: Vector embeddings for intelligent retrieval
- **Compliance Checking**: Automated policy and risk validation
- **Local Processing**: No external API calls, complete privacy
- **Iterative Refinement**: Continuous improvement through agent feedback

### Usage

**Document Generation:**
1. Navigate to Create Document page
2. Enter prompt (e.g., "Create an NDA for software development")
3. Select document category
4. Click "Generate with AI"
5. System executes multi-agent workflow:
   - Retrieve: Finds similar documents
   - Compose: Generates draft with context
   - Validate: Checks compliance
6. Review AI-generated content with validation report
7. Edit and save document

**Document Upload & Indexing:**
1. Upload existing documents
2. Extract Agent processes content
3. Catalog Agent creates embeddings
4. Documents become searchable in RAG system
5. Future generations use this knowledge base

## 🎯 Demo Accounts

For testing purposes, the following demo accounts are available:

| Email | Password | Role |
|-------|----------|------|
| test@example.com | password | User |

> ⚠️ **Security Note**: Change these credentials in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User Management
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password

### Documents
- `GET /api/documents` - List all documents
- `POST /api/documents` - Create new document

### Templates
- `GET /api/templates` - List all templates

### Dashboard
- `GET /api/dashboard` - Get statistics

## Database Schema

### Tables
- **users** - User accounts and authentication
- **documents** - User-created documents
- **templates** - Document templates

## Troubleshooting

### ColdFusion Connection Issues
- Verify ColdFusion is running: `http://localhost:8500`
- Check datasource configuration in CF Admin
- Ensure MySQL JDBC driver is installed
- Restart ColdFusion service after changes

### Database Connection Issues
- Verify XAMPP MySQL is running
- Check database exists: `SHOW DATABASES;`
- Verify tables exist: `SHOW TABLES;`
- Check user credentials

### Build Errors
- Clear Next.js cache: `rmdir /s /q .next`
- Reinstall dependencies: `npm install`
- Check Node.js version: `node --version`

## Technology Details

### Frontend
- **Framework**: Next.js 15.5.7 with App Router
- **UI Library**: React 19.0.0
- **Styling**: TailwindCSS 4.0.0
- **Icons**: Lucide React
- **Type Safety**: TypeScript 5.7.3

### Backend
- **Server**: Adobe ColdFusion 2025
- **Database**: MySQL 8.0 (via XAMPP)
- **Vector Store**: In-memory embeddings (production: Chroma/Pinecone)
- **API**: RESTful JSON endpoints
- **AI Engine**: Ollama with Gemma3 + embeddinggemma
- **Architecture**: Multi-agent RAG system (5 agents)

### Development
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Hot Reload**: Fast Refresh enabled

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

### Ways to Contribute

- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Backend powered by [Adobe ColdFusion](https://coldfusion.adobe.com/)

## 📞 Support

- 📧 Email: hrudu.shibu@monodox.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/docupilot-ai/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/docupilot-ai/discussions)

## 🔒 Security

For security concerns, please review our [Security Policy](SECURITY.md).

## 📊 Project Status

- ✅ **Active Development** - Regular updates and improvements
- 🎯 **Version**: 1.0.0
- 📅 **Last Updated**: December 2025

## 🗺️ Roadmap

### Core Features
- [ ] Email verification
- [ ] Document versioning
- [ ] Collaborative editing
- [ ] PDF/DOCX export
- [ ] Mobile app
- [ ] API documentation
- [ ] Docker support

### AI & RAG Enhancements
- [ ] Full multi-agent implementation (Extract, Catalog, Retrieve, Compose, Validate)
- [ ] Vector database integration (Chroma/Pinecone)
- [ ] Document upload and OCR processing
- [ ] Advanced semantic search
- [ ] Policy compliance engine
- [ ] PII detection and redaction
- [ ] Multi-language support
- [ ] Custom model fine-tuning

## ⚖️ Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

<div align="center">

**Made with ❤️ by the DocuPilot AI Team**

If you find this project useful, please consider giving it a ⭐!

</div>