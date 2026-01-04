# Telegram SMS Documentation

Official documentation repository for the Telegram SMS project, built with [VitePress](https://vitepress.dev/).

## 📚 Documentation Structure

```
docs/
├── develop/                    # English developer documentation
├── es_es/                      # Spanish documentation
├── ja_jp/                      # Japanese documentation
├── ru_ru/                      # Russian documentation
├── zh_cn/                      # Simplified Chinese documentation
├── zh_tw/                      # Traditional Chinese documentation
├── index.md                    # English homepage
├── user-manual.md              # User manual
├── Q&A.md                      # Frequently Asked Questions
└── privacy-policy.md           # Privacy policy
```

## 🌍 Supported Languages

- 🇬🇧 English (default)
- 🇪🇸 Español (Spanish)
- 🇯🇵 日本語 (Japanese)
- 🇷🇺 Русский (Russian)
- 🇨🇳 简体中文 (Simplified Chinese)
- 🇹🇼 繁體中文 (Traditional Chinese)

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

- Multi-language routing configuration
- Sidebar navigation structure
- Theme customization settings
- Search functionality configuration

## 📋 Contributing Guidelines

### Adding New Documentation

1. Create a Markdown file in the appropriate language directory
2. Add navigation links in `.vitepress/config.mts`
3. Ensure all language versions stay synchronized

### Translating Documentation

When adding documentation for a new language:

1. Create a new language directory under `docs/` (e.g., `fr_fr/`)
2. Copy and translate all necessary files
3. Add language configuration in the `locales` section of `config.mts`
4. Update the sidebar and navigation menus

### Markdown Writing Standards

- Use standard Markdown syntax
- Specify language for code blocks (e.g., ````markdown```kotlin`)
- Maintain consistent heading hierarchy (starting from `#`)
- Add appropriate links and cross-references

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

The documentation includes built-in local search functionality, supporting full-text search across all languages.

## 📄 License

This documentation follows the same [BSD 3-Clause License](https://github.com/telegram-sms/telegram-sms/blob/master/LICENSE) as the main Telegram SMS project.

## 🔗 Related Links

- [Telegram SMS Main Repository](https://github.com/telegram-sms/telegram-sms)
- [Configuration Generator](https://config.telegram-sms.com/)
- [Telegram Channel](https://t.me/tg_sms_changelog)
- [Community Forum](https://reall.uk)

## 💬 Getting Help

For questions or suggestions:

- Submit a [GitHub Issue](https://github.com/telegram-sms/telegram-sms/issues)
- Join the Telegram channel for discussions
- Check the [Q&A documentation](./docs/Q&A.md)

---

**Maintainer**: Telegram SMS Team  
**Last Updated**: January 2, 2026


