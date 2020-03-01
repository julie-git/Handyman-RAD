const express = require('express');
const hbs = require('express-handlebars');
var hbs2 = require('hbs');
require('handlebars-form-helpers').register(hbs2.handlebars);
const app = express();
const PORT = process.env.PORT || 3300;
const db = require("./models");
const session = require('express-session');
require('dotenv').config();

app.engine("handlebars", hbs({ defaultDisplay: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// init session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true, saveUninitialized: true,
  cookie: { maxAge: 7200000 }
}));

// Routes
require("./routes/html-routes")(app);
require("./routes/customer-routes")(app);
require("./routes/handyman-routes")(app);
require("./routes/service-menu-routes")(app);
require("./routes/service-request-routes")(app);
require("./routes/admin-routes")(app);

db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function (err) {
    if (err) throw err;
    console.log("Server Listening on " + PORT);
  });
});
