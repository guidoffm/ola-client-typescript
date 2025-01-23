export interface Port {

    description: string;
    device: string;
    id: string;
    is_output: boolean;
    priority: {
        current_mode: string;
        priority_capability: string;
        value: number;
    } | {};
}