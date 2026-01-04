import { DefaultTheme } from "vitepress/theme";
import Config = DefaultTheme.Config;

export interface FooterNavLink {
    /**
     * Link text
     */
    text: string;
    /**
     * Link URL
     */
    link: string;
}

export interface FooterNavItem {
    /**
     * Navigation section title
     */
    title: string;
    /**
     * Navigation items under this section
     */
    items: FooterNavLink[];
}

export interface ExtendedConfig extends Config {
    /**
     * Footer navigation configuration
     */
    footerNav?: FooterNavItem[];
}
