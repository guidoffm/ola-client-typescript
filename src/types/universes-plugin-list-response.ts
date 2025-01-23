export interface Plugin {
    name: string;
    id: string;
    active: boolean;
    enabled: boolean;
}

export interface Universe {
    id: number;
    input_ports: number;
    name: string;
    output_ports: number;
    rdm_deices: number
}

export interface UniversesPluginListResponse {  
    plugins: Plugin[];
    universes: Universe[];
}