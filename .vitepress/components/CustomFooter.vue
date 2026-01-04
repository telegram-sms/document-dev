<template>
    <footer class="VPFooter" v-if="theme.footer && frontmatter.footer !== false" :class="{ 'has-sidebar': hasSidebar }">
        <div class="container">
            <div class="footerSection">
                <div class="footerLogoOuter">
                    <svg id="icon-logo" viewBox="0 0 2204 2387" class="footerLogo">
                        <g transform="translate(0 2387) scale(.1 -.1)">
                            <path
                                d="m2582 23849c-24-12-53-36-66-53-20-26-2428-5220-2493-5376-27-67-31-198-8-277 36-122 714-1001 1270-1648 1244-1446 2301-2287 3063-2435 132-26 333-29 438-6 199 42 361 136 547 314 578 557 1088 1817 1511 3733 211 956 399 2086 526 3169 16 140 30 281 30 312 0 81-32 158-88 216-45 45-145 91-2297 1056-2194 984-2252 1009-2320 1013-57 3-78 0-113-18z"></path>
                            <path
                                d="m17026 22855c-2460-1104-2310-1032-2360-1140-37-80-38-110-11-352 182-1596 495-3264 839-4463 413-1441 877-2330 1404-2694 76-52 223-121 300-141 538-138 1272 204 2191 1021 692 614 1534 1557 2300 2574 226 300 299 404 322 456 28 63 37 200 16 264-8 25-571 1249-1251 2720-874 1888-1247 2684-1269 2707-44 47-86 63-159 63-62-1-103-19-2322-1015z"></path>
                            <path
                                d="m10560 22170c-709-44-1445-177-2072-374-264-84-328-110-376-157-52-52-85-118-90-183-5-71 324-3149 344-3208 19-59 80-152 130-200 78-73 443-286 819-479 876-447 1472-611 1956-535 539 84 1311 416 2126 913 75 45 140 93 166 123 51 57 101 147 116 210 19 78 342 3153 336 3190-17 91-77 176-154 215-60 30-312 114-514 171-529 150-1080 248-1677 299-218 19-894 28-1110 15z"></path>
                            <path
                                d="m8145 16901c-22-10-47-27-57-37-29-33-5091-9977-5106-10029-18-68-11-198 15-257 30-66 3901-6488 3932-6522 51-56 144-73 212-38 19 10 865 677 1879 1482 1015 806 1865 1475 1889 1487 56 29 158 31 213 5 21-9 870-678 1888-1487 1018-808 1866-1478 1883-1487 63-34 171-15 218 38 36 40 3920 6498 3935 6542 19 55 22 189 6 247-7 22-1153 2279-2547 5015-2093 4106-2542 4981-2574 5012-28 27-51 38-85 43-62 10-95-4-237-97-401-264-983-546-1419-687-619-199-1158-248-1713-155-649 109-1445 437-2056 846-155 105-196 116-276 79zm1342-6843c714-314 1327-582 1363-595 76-26 224-31 305-10 28 7 644 275 1371 595 1382 609 1369 604 1422 566 55-38 52 66 52-1729 0-1513-1-1660-16-1691-21-44-66-68-113-61-20 3-628 266-1351 585-723 318-1330 584-1348 590-56 19-175 25-247 13-52-9-368-145-1408-602-1192-525-1346-590-1380-586-44 6-62 19-85 61-16 29-17 154-20 1646-2 888 0 1640 3 1669 9 74 53 121 114 121 32 0 315-121 1338-572z"></path>
                        </g>
                    </svg>
                </div>
                <div v-for="(e, i) in theme.footerNav" :key="i">
                    <h3 class="footerSectionTitle">{{ e.title }}</h3>
                    <ul class="footerSectionList">
                        <li v-for="(f, j) in e.items">
                            <template v-if="isExternalLink(f.link)">
                                <a class="footerSectionLink" :href="f.link" target="_blank">{{ f.text }}</a>
                            </template>
                            <template v-else>
                                <VPLink class="footerSectionLink" :href="f.link">{{ f.text }}</VPLink>
                            </template>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="footerText">
                <p v-if="message" class="footerMessage" v-html="message" />
                <p v-if="copyright" class="footerCopyright" v-html="copyright" />
            </div>
        </div>
    </footer>
</template>

<script lang="ts" setup>
import { useData } from "vitepress";
import { useSidebar, VPLink } from "vitepress/theme";
import { ExtendedConfig } from "../theme/types";

const { hasSidebar } = useSidebar();

const { theme, frontmatter, lang, page } = useData<ExtendedConfig>();
const message = theme.value?.footer?.message;
const copyright = theme.value?.footer?.copyright;

const isExternalLink = (link: string) => /^https?:\/\//.test(link)
</script>

<style scoped>
.VPFooter {
    padding: 24px;
    border-top: 1px solid var(--vp-c-divider);
}

.VPFooter.has-sidebar {
    display: none;
}

@media (min-width: 640px) {
    .VPFooter {
        padding: 24px 48px;
    }
}

@media (min-width: 960px) {
    .VPFooter {
        padding: 24px 64px;
    }
}

.container {
    margin: 0 auto;
    max-width: 1152px;
}

.footerSection {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 32px;
}

@media (min-width: 768px) {
    .footerSection {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }
}

@media (min-width: 1024px) {
    .footerSection {
        grid-template-columns: repeat(4, 1fr);
        /* gap: 16px; */
    }
}

.footerLogoOuter {
    display: none
}

@media (min-width: 1024px) {
    .footerLogoOuter {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.footerLogo {
    width: 100px;
    height: 100px;
    fill: var(--vp-c-text-3);
}

.footerSectionTitle {
    line-height: 1.5;
    font-size: 18px;
    font-weight: 600;
}

.footerSectionList {
    margin-top: 8px;
}

.footerSectionLink {
    line-height: 2;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-1);
}

.footerSectionLink:hover {
    color: var(--vp-c-brand-1);
}

.footerText {
    margin-top: 48px;
}

.footerMessage, .footerCopyright {
    text-align: center;
    font-size: 14px;
    line-height: 1.5;
    color: var(--vp-c-text-2);
}

/* .footerMessage {} */

.footerCopyright {
    margin-top: 4px;
}
</style>
