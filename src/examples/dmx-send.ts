// import { OlaClient } from "../ola-client";

import { OlaClient } from "../ola-client";

(async () => {
    console.log("Hello via Bun!");

    async function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const client = new OlaClient();

    const ports = await client.getPorts();
    // pretty print the ports
    console.log(JSON.stringify(ports, null, 2));

    const serverStats = await client.getServerStats();
    console.log(serverStats);

    const universesPluginList = await client.universePluginList();
    console.log(universesPluginList);

    await client.setDmx('1', [255, 255, 0, 0]);
    await sleep(1000);

    await client.setDmx('1', [255, 0, 255, 0]);
    await sleep(1000);

    await client.setDmx('1', [255, 0, 0, 255]);
    await sleep(1000);

    await client.setDmx('1', []);
})();