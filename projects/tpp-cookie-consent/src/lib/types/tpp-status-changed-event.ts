export interface TppStatusChangedEvent {
    id: string;
    status: 'allow' | 'deny' | 'dismiss';
}