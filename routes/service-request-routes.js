var db = require("../models");
var moment = require("moment");

module.exports = function (app) {
  app.post("/api/request", function (req, res) {
    // find customer by userid in session
    if (!req.session.user) // needs to be updated for production - testing currently
      req.session.user.id = 1;
    db.Customer.findOne({
      include: [{
        model: db.User,
        where: { Id: req.session.user.id }
      }]
    }).then(userData => {
      // store CustomerId on body
      req.body.CustomerId = userData.id;
      req.body.streetAddress = userData.streetAddress;
      req.body.city = userData.city;
      req.body.state = userData.state;
      req.body.zipCode = userData.zipCode;
      req.body.startTime = moment(req.body.startDate)
      req.body.startTime.hour(req.body.sHour)

      delete req.body.sHour;
      delete req.body.startDate;
      // submit ServiceRequest query
      db.ServiceRequest.create(req.body).then(function (dbServiceRequest) {
        res.json(dbServiceRequest);
      });
    });
  });

  // facing customer , returns customers's service reqest
  app.get("/api/request", function (req, res) {
    db.ServiceRequest.findAll().then(function (dbServiceRequest) {
      res.json(dbServiceRequest);
    });
  });
  app.get("/api/request/:id", function (req, res) {
    db.ServiceRequest.findAll({
      where: {
        CustomerId: req.params.id
      }
    }).then(function (dbServiceRequest) {
      res.json(dbServiceRequest);
    });
  });


  // facing handyman, should return all SRs assigned to handyman
  app.get("/api/request/:handymanId", function (req, res) {
    db.ServiceRequest.findAll({
      where: {
        CustomerId: req.params.id
      }
    }).then(function (dbServiceRequest) {
      res.json(dbServiceRequest);
    });
  });


  app.put("/api/request/:id", function (req, res) {
    db.ServiceRequest.update(req.body, {
      where: { id: req.params.id }
    }).then(function (dbServiceRequest) {
      res.json(dbServiceRequest);
    });
  });
  app.delete("/api/request/:id", function (req, res) {
    db.ServiceRequest.destroy({ where: { id: req.params.id } }).then(function (dbServiceRequest) {
      res.json(dbServiceRequest);
    });
  });
};
