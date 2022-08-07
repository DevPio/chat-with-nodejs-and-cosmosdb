const { messageDb } = require("../cosmo");

const getAllMessage = async (id) => {
  const context = await messageDb();

  const queryDb = {
    query: `SELECT * from c WHERE c.roomId = ${id}`,
  };

  const items = await context.items.query(queryDb).fetchAll();

  return items;
};

const newMessage = async ({ message, roomId }) => {
  const context = await messageDb();
  const newItem = {
    message,
    roomId,
  };

  const createdItem = await context.items.create(newItem);

  return createdItem;
};

module.exports = { getAllMessage, newMessage };
