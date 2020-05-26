const knex = require("knex");
require("dotenv").config();

const knexInstance = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

// knexInstance
//   .select("product_id", "name", "price", "category")
//   .from("amazong_products")
//   .where({ name: "Point of view gun" })
//   .first()
//   .then((res) => console.log(res));

function searchByProduceName(searchTerm) {
  knexInstance
    .select("product_id", "name", "price", "category")
    .from("amazong_products")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then((res) => console.log(res));
}

// searchByProduceName('holo')

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select("product_id", "name", "price", "category")
    .from("amazong_products")
    .limit(productsPerPage)
    .offset(offset)
    .then((res) => console.log(res));
}

// paginateProducts(2);

function getProductsWithImages() {
  knexInstance
    .select("product_id", "name", "price", "category", "image")
    .from("amazong_products")
    .whereNotNull("image")
    .then((res) => console.log(res));
}

// getProductsWithImages()

function mostPopularVideosForXDays(days) {
  knexInstance
    .select("video_name", "region")
    .count("date_viewed AS views")
    .where(
      "date_viewed",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from("whopipe_video_views")
    .groupBy("video_name", "region")
    .orderBy([
      { column: "region", order: "ASC" },
      { column: "views", order: "DESC" },
    ])
    .then((res) => console.log(res));
}

mostPopularVideosForXDays(30);
