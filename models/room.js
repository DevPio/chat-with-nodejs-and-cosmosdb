const { db } = require("../cosmo");

const getAllRoom = async () => {
  const context = await db();

  const query = {
    query: "SELECT * from c",
  };

  const items = await context.items.query(query).fetchAll();

  return items;
};

const newRoom = async (name) => {
  const context = await db();
  const newItem = {
    name,
  };

  const createdItem = await context.items.create(newItem);

  return createdItem;
};

module.exports = {
  newRoom,
  getAllRoom,
};
