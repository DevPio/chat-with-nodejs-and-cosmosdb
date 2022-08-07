const { CosmosClient } = require("@azure/cosmos");

const config = {
  endpoint: "https://localhost:8081",
  key: "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
  databaseId: "Chat",
  containerId: "Items",
  partitionKey: { kind: "Hash", paths: ["/category"] },
};

async function create(client, databaseId, containerId) {
  try {
    const partitionKey = config.partitionKey;

    const { database } = await client.databases.createIfNotExists({
      id: databaseId,
    });

    const { container } = await client
      .database(databaseId)
      .containers.createIfNotExists(
        { id: containerId, partitionKey },
        { offerThroughput: 400 }
      );

    return container;
  } catch (error) {
    console.log(error);
  }
}

const db = async () => {
  const { key, endpoint, databaseId, containerId } = config;
  const client = new CosmosClient({ key, endpoint });
  const containerResult = await create(client, databaseId, containerId);

  return containerResult;
};

const messageDb = async () => {
  const { key, endpoint, databaseId, containerId } = config;
  const client = new CosmosClient({ key, endpoint });
  const containerResult = await create(client, databaseId, "messages");

  return containerResult;
};

module.exports = { db, messageDb };
