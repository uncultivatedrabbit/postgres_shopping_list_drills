const knex = require("knex");
require("dotenv").config();

const knexInstance = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

function getItemsWithText(searchTerm) {
  knexInstance
    .select("*")
    .from("shopping_list")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then((res) => console.log(res));
}

//getItemsWithText('burger');

function getItemsPaginated(pageNumber) {
  const productsPerPage = 6;
  const offset = productsPerPage * (pageNumber - 1);
  knexInstance
    .select("*")
    .from("shopping_list")
    .limit(productsPerPage)
    .offset(offset)
    .then((res) => console.log(res));
}

//getItemsPaginated(2)

function getItemsAfterDate(daysAgo) {
  knexInstance
    .select("*")
    .from("shopping_list")
    .where(
      "date_added",
      "<",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then((res) => console.log(res));
}

//getItemsAfterDate(12);

function getTotalCostForCategory() {
  knexInstance
    .select("category")
    .sum("price as total")
    .from("shopping_list")
    .groupBy("category")
    .then((result) => {
      console.log(result);
    });
}

// getTotalCostForCategory();
