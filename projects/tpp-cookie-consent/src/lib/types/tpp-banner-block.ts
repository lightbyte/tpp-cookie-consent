export interface TppBannerBlock {
    id: string;
    title: string;
    allwaysActive?: boolean;
    allwaysActiveText?: string;
    description: string;
    status?: 'allow' | 'deny' | 'dismiss';
}