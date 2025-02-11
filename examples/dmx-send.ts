import { OlaClient } from "../src/index";

(async () => {

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

    const universes = universesPluginList.universes;

    if (universes.length > 0) {
        const universeId = universes[0].id;

        await client.setDmx(universeId, [255, 255, 0, 0]);
        await sleep(1000);

        await client.setDmx(universeId, [255, 0, 255, 0]);
        await sleep(1000);

        await client.setDmx(universeId, [255, 0, 0, 255]);
        await sleep(1000);

        await client.setDmx(universeId, []);
    }
})();