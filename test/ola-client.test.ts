import { test, expect } from "@jest/globals";
import { OlaClient } from '../src/index';

jest.mock('../src/index');

describe('OlaClient', () => {
    let client: OlaClient;

    beforeEach(() => {
        client = new OlaClient();
    });

    test("should get ports", async () => {
        const mockPorts = [{ name: 'port1' }, { name: 'port2' }];
        (client.getPorts as jest.Mock).mockResolvedValue(mockPorts);

        const ports = await client.getPorts();
        expect(ports).toBeTruthy();
    });

    it('should get server stats', async () => {
        const mockServerStats = { uptime: 12345, version: '1.0.0' };
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
});

