const knex = require("knex");
const ShoppingListService = require("../src/shopping-list-service");

describe("Shopping List Object", function () {
  let db;
  // test products for each test
  let testProducts = [
    {
      id: 1,
      name: "First test item!",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      price: "12.00",
      checked: false,
      category: "Main",
    },
    {
      id: 2,
      name: "Second test item!",
      date_added: new Date("2100-05-22T16:28:32.615Z"),
      price: "21.00",
      category: "Snack",
      checked: false,
    },
    {
      id: 3,
      name: "Third test item!",
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      price: "3.00",
      category: "Lunch",
      checked: false,
    },
    {
      id: 4,
      name: "Third test item!",
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      price: "0.99",
      category: "Breakfast",
      checked: false,
    },
  ];
  // set up database connection for before and after
  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.DATABASE_URL,
    });
  });

  before(() => db("shopping_list").truncate());

  afterEach(() => db("shopping_list").truncate());
  after(() => db.destroy());

  context("Given the shopping_list has data", () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testProducts);
    });

    // begin of tests
    // get ALL test
    it(`getAllProducts() resolves all articles from "shopping_list" table`, () => {
      // test that ArticlesService.getAllArticles gets data from table
      return ShoppingListService.getAllProducts(db).then((actual) => {
        expect(actual).to.eql(testProducts);
      });
    });
    //get ONE test
    it('getById() resolves a product by id from "shopping_list" table', () => {
      const secondId = 2;
      const secondTestProduct = testProducts[secondId - 1];
      return ShoppingListService.getById(db, secondId).then((actual) => {
        expect(actual).to.eql({
          id: secondId,
          name: secondTestProduct.name,
          date_added: secondTestProduct.date_added,
          price: secondTestProduct.price,
          category: secondTestProduct.category,
          checked: secondTestProduct.checked,
        });
      });
    });

    // delete ONE test
    it('deleteProduct() removes a product by id from "shopping_list" table', () => {
      const productId = 4;
      return ShoppingListService.deleteProduct(db, productId).then(() => {
        return ShoppingListService.getAllProducts(db).then((allProducts) => {
          const expected = testProducts.filter(
            (product) => product.id !== productId
          );
          expect(allProducts).to.eql(expected);
        });
      });
    });

    // update ONE test
    it('updateProduct() updates a product from the "shopping_list" table', () => {
      const idOfProductToUpdate = 1;
      const newProductData = {
        name: "GOOD NAME!!!!!!",
        date_added: new Date(),
        price: "9999.99",
        category: "Main",
        checked: true,
      };
      return ShoppingListService.updateProduct(
        db,
        idOfProductToUpdate,
        newProductData
      )
        .then(() => ShoppingListService.getById(db, idOfProductToUpdate))
        .then((product) => {
          expect(product).to.eql({
            id: idOfProductToUpdate,
            ...newProductData,
          });
        });
    });
  });

  // NO prelim data tests
  context('Given "shopping_list" has NO data', () => {
    it("getAllProducts() resolves an empty array", () => {
      return ShoppingListService.getAllProducts(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });
    it('insertProduct() inserts a new product and resolves the new product with an "id"', () => {
      const newProduct = {
        name: "WOOOOOOOOOW",
        date_added: new Date(),
        price: "4.99",
        category: "Main",
        checked: false,
      };
      return ShoppingListService.insertProduct(db, newProduct).then(
        (actual) => {
          expect(actual).to.eql({
            id: 1,
            name: newProduct.name,
            price: newProduct.price,
            date_added: newProduct.date_added,
            category: newProduct.category,
            checked: newProduct.checked,
          });
        }
      );
    });
  });
});
