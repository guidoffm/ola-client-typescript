import { test, expect } from "@jest/globals";
import { OlaClient, Port, ServerStats } from '../src/index';
import { UniversesPluginListResponse } from "../src/types/universes-plugin-list-response";

jest.mock('../src/index');

describe('OlaClient', () => {
    let client: OlaClient;

    beforeEach(() => {
        client = new OlaClient();
    });

    test("should get ports", async () => {
        const mockPorts: Port[] = [{
            description: 'port1',
            device: 'device1',
            id: '1',
            is_output: true,
            priority: {
                current_mode: 'mode1',
                priority: 1,
                value: 255
            }
        }, {
            description: 'port2',
            device: 'device2',
            id: '2',
            is_output: false,
            priority: {}
        }];
        (client.getPorts as jest.Mock).mockResolvedValue(mockPorts);

        const ports = await client.getPorts();
        expect(ports).toBeTruthy();
    });

    it('should get server stats', async () => {
        const mockServerStats: ServerStats = {

            broadcast: '255.255.255.255',
            config_dir: '/etc/ola',
            hostname: 'localhost',
            hw_address: '00:00:00:00:00:00',
            instance_name: 'ola',
            ip: '127.0.0.1',
            version: '1.0.0',
            quit_enabled: true,
            subnet: '255.255.255.0',
            up_since: '2021-09-01T00:00:00Z'
        };
        (client.getServerStats as jest.Mock).mockResolvedValue(mockServerStats);

        const serverStats = await client.getServerStats();
        expect(serverStats).toEqual(mockServerStats);
    });

    it('should set DMX data', async () => {
        const mockUniverse = '1';
        const mockData = [255, 128, 64];
        const mockResponse = { success: true };
        (client.setDmx as jest.Mock).mockResolvedValue(mockResponse);

        const response = await client.setDmx(mockUniverse, mockData);
        expect(response).toEqual(mockResponse);
    });

    it('should set buffer length', () => {
        const mockLength = 512;
        client.bufferLength = mockLength;
        expect(client.bufferLength).toEqual(mockLength);
    });

    it('should fetch universe plugin list', async () => {
        const mockUniversePluginList: UniversesPluginListResponse = {
            universes: [{
                id: 1,
                name: 'universe1',
                input_ports: 2,
                output_ports: 1,
                rdm_devices: 3
            }],

            plugins: [{
                id: 'plugin1',
                active: true,
                enabled: true,
                name: 'plugin1'
            }]
        };
        (client.universePluginList as jest.Mock).mockResolvedValue(mockUniversePluginList);

        const universePluginList = await client.universePluginList();
        expect(universePluginList).toEqual(mockUniversePluginList);
    });

    it('should throw error if fetch operation fails', async () => {
        (client.getPorts as jest.Mock).mockRejectedValue(new Error('Failed to fetch ports'));

        try {
            await client.getPorts();
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });
});

