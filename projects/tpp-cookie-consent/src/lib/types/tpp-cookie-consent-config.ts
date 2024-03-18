import { InjectionToken } from "@angular/core";
import { TppBannerBlock } from "./tpp-banner-block";
import { TppBannerButton } from "./tpp-banner-button";
import { TppBannerLink } from "./tpp-banner-link";

export interface TppCookieConsentConfig {
    buttonText?: string;
    bannerTitle?: string;
    bannerText?: string;
    bannerBlocks?: TppBannerBlock[];
    bannerButtons?: TppBannerButton[];
    bannerLinks?: TppBannerLink[];
    alignment?: string;
    addCookieButtonOnStart?: boolean;
}

export const TPPCC_CONFIG = new InjectionToken<TppCookieConsentConfig>('TPPCC_CONFIG');