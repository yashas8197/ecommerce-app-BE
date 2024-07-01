const { initializeDatabase } = require("./db/db.connect");
const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");

const Products = require("./models/products.models");
const Categories = require("./models/categories.models");

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

initializeDatabase();

const jsonData = fs.readFileSync("newproducts.json", "utf8");
const productsData = JSON.parse(jsonData);

async function getAllProducts() {
  try {
    const allProducts = await Products.find();
    return allProducts;
  } catch (error) {
    throw error;
  }
}

app.get("/products", async (req, res) => {
  try {
    const products = await getAllProducts();
    if (products.length !== 0) {
      res.status(200).json({
        message: "fetched all Products successfully",
        product: products,
      });
    } else {
      res.status(404).json({ error: "Products not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch" });
  }
});

async function getProductById(productId) {
  try {
    const productById = await Products.findById(productId);
    return productById;
  } catch (error) {
    throw error;
  }
}

app.get("/products/:productId", async (req, res) => {
  try {
    const product = await getProductById(req.params.productId);
    if (product.length !== 0) {
      res.status(200).json({
        message: "fetched Product successfully",
        product: product,
      });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

async function getAllCategory() {
  try {
    const allProductByCategory = await Categories.find();
    return allProductByCategory;
  } catch (error) {
    throw error;
  }
}

app.get("/categories", async (req, res) => {
  try {
    const categories = await getAllCategory();
    if (categories) {
      res.status(200).json({
        categories: categories,
      });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

async function getCategoryById(categoryId) {
  try {
    const categoryById = await Categories.findById(categoryId);
    return categoryById;
  } catch (error) {
    throw error;
  }
}

app.get("/categories/:categoryId", async (req, res) => {
  try {
    const category = await getCategoryById(req.params.categoryId);
    if (category) {
      res.status(200).json({ cat: category });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch" });
  }
});

// for search suggestions apis

async function getSearchSuggestionByTitle(productTitle) {
  try {
    const productSearchByTitle = await Products.find({
      title: { $regex: productTitle, $options: "i" },
    });
    return productSearchByTitle;
  } catch (error) {
    throw error;
  }
}

app.get("/products/search/:query", async (req, res) => {
  try {
    const matchesProductTitle = await getSearchSuggestionByTitle(
      req.params.query,
    );
    if (matchesProductTitle) {
      res.status(200).json({ products: matchesProductTitle });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to fetch" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server connected to port ${PORT}`);
});
