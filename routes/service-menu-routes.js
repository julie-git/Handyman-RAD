var db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = function (app) {

  app.post("/api/menu", function (req, res) {
    db.ServiceMenu.create(req.body).then(function (dbServiceMenu) {
      res.redirect("/service-menu");
    });
  });


  //this is covered in service-menu-routes
  app.get("/service-menu", function (req, res) {
    if (req.session.user) {
      db.ServiceMenu.findAll({ raw: true }).then(function (data) {
        var datObject = {
          servicemenus: data,
          isHandy: req.session.isHandy
        };
        res.render("service-menu", datObject);
      })
        .catch(err => console.log(err));
    } else {
      res.render("login");
    }
  })


  app.get("/api/menu", function (req, res) {
    db.ServiceMenu.findAll({ raw: true }).then(function (dbServiceMenu) {
      console.log(dbServiceMenu)
      res.render("service-menu", { servicemenus: dbServiceMenu });
    }).catch(err => console.log(err));
  });
  app.get("/api/menu/:title", function (req, res) {
    db.ServiceMenu.findAll({
      where: {
        title: {
          [Op.like]: "%" + req.params.title + "%"
        }
      }
    }).then(function (dbServiceMenu) {
      res.json(dbServiceMenu);
    });
  });


  app.put("/api/menu/:id", function (req, res) {
    db.ServiceMenu.update(req.body, {
      where: { id: req.params.id }
    }).then(function (dbServiceMenu) {
      res.json(dbServiceMenu);
    });
  });


  app.delete("/api/menu/:id", function (req, res) {
    db.ServiceMenu.destroy({ where: { id: req.params.id } }).then(function (dbServiceMenu) {
      res.render("service-menu", dbServiceMenu);
    });
  });

};
