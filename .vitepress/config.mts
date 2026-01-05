import { defineConfigWithTheme } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import { ExtendedConfig } from "./theme/types";

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<ExtendedConfig>({
    srcDir: "docs",
    title: "Telegram SMS Developer",
    description: "Developer documentation for Telegram SMS project.",
    head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
    themeConfig: {
        search: {
            provider: "local",
        },
        logo: "/logo.svg",
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "Home", link: "/" },
            { text: "Telegram SMS Nightly", link: "https://github.com/telegram-sms/telegram-sms-nightly" },
        ],
        footer: {
            message: "Released under the <a href=\"https://github.com/telegram-sms/telegram-sms/blob/master/LICENSE\">BSD 3-Clause License</a>.",
            copyright: "Copyright 2018-2025 Reall System LTD, Telegram is a trademark of Telegram Messenger LLP.",
        },
        sidebar: [
            {
                text: "Project Summary & Instructions",
                items: [
                    { text: "Development Manual", link: "/" },
                    { text: "Project Introduction", link: "/instructions/project.instructions" },
                ],
            },
            {
                text: "Developer",
                items: [
                    { text: "Crypto Module Documentation", link: "/CRYPTO_DOC" },
                    { text: "Data Structure Version Management", link: "/DATA_STRUCTURE_VERSION_EN" },
                    { text: "Data Structure - Quick Guide", link: "/DATA_STRUCTURE_VERSION_QUICK_EN" },
                    { text: "Self-hosted Bot API", link: "/self_hosted_bot_api" },
                    { text: "Carbon Copy Provider Implementation", link: "/CarbonCopyProvider" },
                    { text: "String Resources Organization", link: "/STRING_RESOURCES" },
                ],
            },
            {
                text: "Development Summary",
                items: [
                    { text: "Language Pack Update Summary", link: "/summary/LANGUAGE_PACK_UPDATE_SUMMARY" },
                    { text: "Template Update Summary", link: "/summary/TEMPLATE_UPDATE_SUMMARY" },
                ],
            },
            {
                text: "CI",
                items: [
                    { text: "Translation Checker", link: "/ci/TRANSLATION_CHECKER" },
                ],
            }
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/telegram-sms/telegram-sms" },
            { icon: "telegram", link: "https://t.me/tg_sms_changelog_eng" },
        ],
        footerNav: [
            {
                title: "Projects",
                items: [
                    { text: "Telegram SMS", link: "https://github.com/telegram-sms/telegram-sms" },
                    { text: "Telegram SMS Compat", link: "https://github.com/telegram-sms/telegram-sms-compat" },
                    { text: "Telegram Remote Control", link: "https://github.com/telegram-sms/telegram-rc" },
                ],
            },
            {
                title: "Tools",
                items: [
                    { text: "Documentation", link: "/user-manual" },
                    { text: "Config Generator", link: "https://config.telegram-sms.com/" },
                ],
            },
            {
                title: "Community",
                items: [
                    { text: "GitHub", link: "https://github.com/telegram-sms" },
                    { text: "Telegram Channel", link: "https://t.me/tg_sms_changelog_eng" },
                    { text: "Forum", link: "https://reall.uk" },
                ],
            },
        ],
    },
    vite: {
        resolve: {
            alias: [
                {
                    find: /^.*\/VPFooter\.vue$/,
                    replacement: fileURLToPath(
                        new URL("./components/CustomFooter.vue", import.meta.url),
                    ),
                },
            ],
        },
    },
});
