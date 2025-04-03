
export class WebhookEventDto {
    constructor(
        public id: string,
        public webhook_id: string,
        public event: string,
        public payload: Record<string, any>,
        public published_at: Date,
    ) { }
}