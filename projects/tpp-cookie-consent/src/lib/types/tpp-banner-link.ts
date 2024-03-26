export interface TppBannerLink {
    text: string;
    url: string;
    target?: string;
    isButton?: boolean;
    btnCallback?: () => void;
}