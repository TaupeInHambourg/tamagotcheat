------

sidebar_position: 1sidebar_position: 1

------



# Introduction# Tutorial Intro



Welcome to the **Tamagotcheat** technical documentation.Let's discover **Docusaurus in less than 5 minutes**.



## 🎮 What is Tamagotcheat?## Getting Started



Tamagotcheat is a modern virtual pet application that lets users create, raise, and care for their own unique digital creatures. Built with cutting-edge web technologies and following industry best practices, it provides an engaging and delightful user experience.Get started by **creating a new site**.



## ✨ Key FeaturesOr **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**.



- **Create Custom Monsters**: Choose from 4 unique creature types with distinct personalities### What you'll need

- **Interactive Care System**: Feed, play, and interact with your virtual pets

- **Level Progression**: Watch your monsters grow and evolve- [Node.js](https://nodejs.org/en/download/) version 20.0 or above:

- **Beautiful UI**: Cozy autumn-themed design inspired by Animal Crossing  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

- **Responsive Design**: Works seamlessly on desktop and mobile

## Generate a new site

## 🛠️ Tech Stack

Generate a new Docusaurus site using the **classic template**.

### Frontend

- **Next.js 15.5.4** - React framework with App RouterThe classic template will automatically be added to your project after you run the command:

- **React 19.1.0** - Latest React with modern features

- **TypeScript** - Type-safe development```bash

- **TailwindCSS 4** - Utility-first CSS frameworknpm init docusaurus@latest my-website classic

```

### Backend & Database

- **MongoDB** - NoSQL database for data persistenceYou can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

- **Mongoose** - ODM for MongoDB

- **Better-auth** - Modern authentication solutionThe command also installs all necessary dependencies you need to run Docusaurus.



### Build & Development## Start your site

- **Turbopack** - Next-generation bundler

- **ts-standard** - TypeScript lintingRun the development server:



## 🏗️ Architecture Principles```bash

cd my-website

This project follows **Clean Architecture** and **SOLID** principles:npm run start

```

- **Single Responsibility**: Each module has one clear purpose

- **Open/Closed**: Extensible without modificationThe `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there.

- **Liskov Substitution**: Proper interface implementation

- **Interface Segregation**: Focused, small interfacesThe `npm run start` command builds your website locally and serves it through a development server, ready for you to view at http://localhost:3000/.

- **Dependency Inversion**: Depend on abstractions

Open `docs/intro.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes.

### Architecture Layers

```
┌─────────────────────────────────────┐
│     Presentation Layer (Actions)     │ ← Next.js Server Actions
├─────────────────────────────────────┤
│     Business Logic (Services)        │ ← Validation & Rules
├─────────────────────────────────────┤
│     Data Access (Repositories)       │ ← Database Operations
├─────────────────────────────────────┤
│     Database (MongoDB)               │ ← Data Persistence
└─────────────────────────────────────┘
```

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/TaupeInHambourg/tamagotcheat.git

# Install dependencies
cd tamagotcheat
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📚 Documentation Structure

- **[Architecture](./architecture/overview)** - System design and patterns
- **[Components](./components/overview)** - UI component documentation
- **[API Reference](./api/overview)** - Server actions and services
- **[Guides](./guides/setup)** - Development and deployment guides
- **[Design System](./design/colors)** - Visual design guidelines

## 🤝 Contributing

We follow strict coding standards:
- **Clean Code** principles
- **SOLID** design patterns
- **Comprehensive documentation** (JSDoc)
- **Type safety** with TypeScript
- **Code reviews** required

See our [Contributing Guide](./guides/contributing) for more details.

## 📝 License

This project is part of a learning exercise following modern web development best practices.
