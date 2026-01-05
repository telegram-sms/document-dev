# Telegram SMS Developer Documentation

Official developer documentation repository for the Telegram SMS project, built with [VitePress](https://vitepress.dev/).

## 🌍 Language

- 🇬🇧 English only

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Local Development

Start the local development server with hot reload:

```bash
npm run docs:dev
```

The server will start at `http://localhost:5173`.

### Build for Production

Build the static site:

```bash
npm run docs:build
```

Build output will be located in the `.vitepress/dist` directory.

### Preview Production Build

Preview the site after building:

```bash
npm run docs:preview
```

## 🔧 Configuration

The main configuration file is located at `.vitepress/config.mts`, containing:

- Developer documentation navigation
- Sidebar structure for technical guides
- Theme customization settings
- Search functionality configuration

## 📋 Contributing Guidelines

### Adding New Documentation

1. Create a Markdown file in the `docs/` directory
2. Add navigation links in `.vitepress/config.mts` sidebar configuration
3. Follow the established documentation structure and style

### Markdown Writing Standards

- Use standard Markdown syntax
- Specify language for code blocks (e.g., ```typescript```, ```kotlin```)
- Maintain consistent heading hierarchy (starting from `#`)
- Add appropriate links and cross-references
- Keep technical documentation clear and concise

## 🛠️ Tech Stack

- **Framework**: [VitePress](https://vitepress.dev/) v1.5.0
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Code Formatter**: Prettier

## 📦 Dependencies

```json
{
  "vitepress": "^1.5.0",
  "typescript": "~5.7.2",
  "prettier": "^3.4.2",
  "@types/node": "^22.10.2"
}
```

## 🔍 Search Functionality

The documentation includes built-in local search functionality for quick access to technical information.

## 📄 License

This documentation follows the same [BSD 3-Clause License](https://github.com/telegram-sms/telegram-sms/blob/master/LICENSE) as the main Telegram SMS project.

## 🔗 Related Links

- [Telegram SMS Main Repository](https://github.com/telegram-sms/telegram-sms)
- [Configuration Generator](https://config.telegram-sms.com/)
- [Telegram Channel](https://t.me/tg_sms_changelog_eng)
- [Community Forum](https://reall.uk)

## 💬 Getting Help

For questions or suggestions:

- Submit a [GitHub Issue](https://github.com/telegram-sms/telegram-sms/issues)
- Join the Telegram channel for discussions
- Check the documentation for technical guides

---

**Maintainer**: Telegram SMS Team  
**Last Updated**: January 4, 2026


