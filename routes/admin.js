require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const { makeStorable, readable } = require("./util");

// Importing product schema
const product = require("../models/productSchema");

router.use(
  session({
    secret: "*aw-kzcY8gH3pD+N",
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 1 * 60 * 60 * 1000 },
  })
);

console.log("Adsd");
// Checks do session exgist if not show error 404
router.use(async (req, res, next) => {
  let error;
  if (req.path != "/login") {
    if (req.session.loged === undefined) {
      return res.render("notFound.ejs");
    } else {
      await bcrypt
        .compare(process.env.ADMIN_SESSION_PASSWORD, req.session.loged)
        .then((result) => {
          if (!result)
            return (error = "A error what to do. Call Kanishk Ranjan dog!");
        });
    }
  }
  if (error !== undefined) return res.send(error);
  next();
});

router.get("/login", (req, res) => {
  if (req.session.loged) return res.redirect("/admin");
  if (req.query.psword === undefined) return res.render("notFound.ejs");
  res.render("admin/adminLogin.ejs");
});

router.get("/", (req, res) => {
  res.render("admin/adminPanel.ejs");
});

router.get("/add", (req, res) => {
  res.render("admin/adminAddproduct.ejs");
});

router.get("/view", async (req, res) => {
  till = req.query.skip || 0;
  await product
    .find()
    .sort({ date: -1 })
    .skip(parseInt(till))
    .limit(20)
    .then((doc) => {
      res.render("admin/adminView.ejs", { products: doc });
    });
});

//Getting showing product for admin
router.get("/view/:name", async (req, res) => {
  const result = await product.findOne({ name: req.params.name });
  if (result == null) {
    return res.render("admin/adminProductView.ejs");
  }
  max = Math.max.apply(
    null,
    result.productLinks.map((item) => {
      return item.cost;
    })
  );

  min = Math.min.apply(
    null,
    result.productLinks.map((item) => {
      return item.cost;
    })
  );

  if (result.length == 0) {
    res.render("admin/adminProductView.ejs");
  } else {
    res.render("admin/adminProductView.ejs", {
      productInformation: result,
      cost: { max, min },
      recommendeds: [],
    });
  }
});

// Deleting data
router.get("/delete/:id", async (req, res) => {
  await product.deleteOne({ _id: req.params.id });
  res.redirect("/admin/view");
});

router.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err)
      return res.send("<a href='/'>Go home</a><br><h1>Error: " + err + "<h2>");
    res.send("<a href='/'>Go home</a><br><h1>Worked done successful</h2>");
  });
});
router.get("/edit/:name", async (req, res) => {
  const result = await product
    .findOne({ name: req.params.name })
    .sort({ date: -1 });
  res.render("admin/editProduct.ejs", { values: result });
});

router.post("/login", async (req, res) => {
// Use anypassword

req.session.loged =
"$2b$10$GDlw3MuJlHVjZi1VSs0NS.d/yhzGp3PKWUNEg5B9HscwjCydmnl5a";
res.redirect("/admin");
});

router.post("/view", async (req, res) => {
  till = req.query.skip || 0;
  await product
    .find({ name: req.body.name })
    .sort({ date: -1 })
    .skip(parseInt(till))
    .limit(20)
    .then((doc) => {
      res.render("admin/adminView.ejs", { products: doc });
    });
});
//handling post requiest

router.post("/", async (req, res) => {
  // use schema
  const productData = new product(readable(req.body));

  // validating
  // const productData =  new product(makeStorable(req.body));
  await productData.validate();

  // Checking data if exgist

  product
    .find({ name: req.body.name })
    .sort({ date: -1 })
    .then((doc) => {
      if (doc.length !== 0) {
        // send if data exgist
        res.render("admin/adminPanel.ejs", {
          msg: "A product with same name already exgist",
        });
      } else {
        productData.save();
        res.render("admin/adminPanel.ejs", { msg: "" });
      }
    });
});

router.post("/edit/:id", async (req, res) => {
  await product.updateOne({ _id: req.params.id }, readable(req.body));
  res.redirect("/admin/view/" + req.body.name);
});

router.post("/view", async (req, res) => {
  const result = await product
    .find({ name: req.body.name })
    .sort({ data: -1 })
    .limit(20);
  const recommendeds = await product
    .find({ searchKeyWord: { $in: req.body.name } })
    .sort({ data: -1 })
    .limit(20);
  recommendeds.forEach((recommended) => {
    result.push(recommended);
  });
  res.render("admin/adminView.ejs", { products: result });
});

module.exports = router;
