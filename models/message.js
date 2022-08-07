const { messageDb } = require("../cosmo");

const getAllMessage = async (id) => {
  try {
    const context = await messageDb();

    const queryDb = {
      query: `SELECT * FROM c WHERE c.roomId = "${id}"`,
    };

    const items = await context.items.query(queryDb).fetchAll();

    return items.resources;
  } catch (error) {
    console.log(error);

    return [];
  }
};

const newMessage = async ({ message, roomId, userName }) => {
  const context = await messageDb();
  const newItem = {
    message,
    roomId,
    userName,
  };

  const createdItem = await context.items.create(newItem);

  return createdItem;
};

module.exports = { getAllMessage, newMessage };
