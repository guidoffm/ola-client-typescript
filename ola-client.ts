
/**
 * The `OlaClient` class provides methods to interact with an OLA (Open Lighting Architecture) server.
 * It allows setting DMX data for a specified universe.
 *
 * @example
 * ```typescript
 * const client = new OlaClient('localhost', 9090);
 * await client.setDmx('1', [255, 128, 64]);
 * ```
 */
/// <reference types="node" />

import type { Port } from "./types/port";
import type { ServerStats } from "./types/server-stats";

export class OlaClient {

    private _baseUrl: string;
    private _buffer: Buffer;

    constructor(host: string = 'localhost', port: number = 9090, private bufferLength: number = 512) {
        this._baseUrl = `http://${host}:${port}`;
        //create a buffer with bufferLength bytes
        this._buffer = Buffer.alloc(bufferLength);
    }

    /**
     * Fetches the list of ports from the server.
     *
     * @returns {Promise<Port[]>} A promise that resolves to an array of Port objects.
     * @throws {Error} If the fetch operation fails or the response cannot be parsed as JSON.
     */
    async getPorts(): Promise<Port[]> {
        const response = await fetch(`${this._baseUrl}/json/get_ports`);
        const data = await response.json();
        return data as Port[];
    }

    /**
     * Fetches server statistics from the server.
     *
     * @returns {Promise<ServerStats>} A promise that resolves to the server statistics.
     */
    async getServerStats(): Promise<ServerStats> {
        const response = await fetch(`${this._baseUrl}/json/server_stats`);
        const data = await response.json();
        return data as ServerStats;
    }

    /**
     * Sets the DMX data for a specified universe.
     *
     * @param universe - The identifier of the DMX universe.
     * @param data - An array of numbers representing the DMX data to be set.
     * @returns A promise that resolves when the DMX data has been successfully set.
     *
     * The function creates a buffer of a specified length and fills it with the provided DMX data.
     * If the provided data is shorter than the buffer length, the remaining buffer space is filled with zeros.
     * The buffer is then converted to a comma-separated string and sent to the server via a POST request.
     *
     * Example usage:
     * ```typescript
     * await setDmx('1', [255, 128, 64]);
     * ```
     */
    async setDmx(universe: string, data: number[]): Promise<void> {
        const buffer = this._buffer;

        for (let i = 0; i < data.length; i++) {
            buffer[i] = data[i];
        }

        // fill up the rest of the buffer with 0
        for (let i = data.length; i < this.bufferLength; i++) {
            buffer[i] = 0;
        }

        await this.setDmxFromBuffer(universe, buffer);
    }


    /**
     * Sets the DMX data for a given universe from a buffer.
     *
     * @param universe - The universe identifier to set the DMX data for.
     * @param buffer - The buffer containing the DMX data.
     * @returns A promise that resolves when the DMX data has been set.
     *
     * @throws Will throw an error if the fetch request fails.
     */
    async setDmxFromBuffer(universe: string, buffer: Buffer): Promise<void> {

        const dataString = buffer.join(',');
        // console.log(dataString);

        await fetch(`${this._baseUrl}/set_dmx`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ u: universe, d: dataString }).toString()
        })
            // .then(response => response.text())
            // .then(data => console.log(data))
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    }

}