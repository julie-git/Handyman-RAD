var db = require("../models");
const Handlebars = require('handlebars');
// const acronym = require('acronym');
const radTitle = "Handyman R.A.D"

module.exports = function (app) {
    app.get("/admin", function (req, res) {
        if (!req.session.isAdmin) {
            res.redirect("/");
        } else {
            // res.render('partials/admin/index', { isAdmin: req.session.isAdmin, isHandy: req.session.isHandy, title: acronym('RAD') });
            res.render('partials/admin/index', { isAdmin: req.session.isAdmin, isHandy: req.session.isHandy, title: radTitle });
        }
    });

    app.get("/admin/customers/:id", function (req, res) {
        if (!req.session.isAdmin) {
            res.redirect("/");
        } else {
            db.Customer.findOne({
                raw: true,
                include: [db.User]
            }).then(customer => {
                // res.render("partials/admin/edit-customer", { isAdmin: req.session.isAdmin, isHandy: req.session.isHandy, customer, title: acronym('RAD') });
                res.render("partials/admin/edit-customer", { isAdmin: req.session.isAdmin, isHandy: req.session.isHandy, customer, title: radTitle });
            });
        }
    })

    app.get("/admin/customers", function (req, res) {
        if (!req.session.isAdmin) {
            res.redirect("/");
        } else {
            db.Customer.findAll({
                raw: true,
                include: [{
                    model: db.User
                }]
            }).then(function (users) {
                users = users.map(c => {
                    c.User = {};
                    c.User.id = c['User.id']
                    c.User.username = c['User.username'];
                    c.User.isAdmin = c['User.isAdmin'];
                    return c;
                });
                res.render('partials/admin/admin-customers', { isAdmin: req.session.isAdmin, isHandy: req.session.isHandy, users });
            });
        }
    });

    app.get("/admin/handymen", function (req, res) {
        if (!req.session.isAdmin) {
            res.redirect("/");
        } else {
            db.HandyMan.findAll({
                raw: true,
                include: [{
                    model: db.User
                }]
            }).then(function (users) {
                users = users.map(c => {
                    c.User = {};
                    c.User.id = c['User.id']
                    c.User.username = c['User.username'];
                    c.User.isAdmin = c['User.isAdmin'];
                    return c;
                });
                res.render('partials/admin/admin-handymen', { isAdmin: req.session.isAdmin, isHandy: req.session.isHandy, users });
            });
        }
    });

    app.get("/admin/service-requests", function (req, res) {
        if (!req.session.isAdmin) {
            res.redirect("/");
        } else {
            db.ServiceRequest.findAll({ raw: true }).then(function (requests) {
                res.render('partials/admin/admin-requests', { isAdmin: req.session.isAdmin, isHandy: req.session.isHandy, requests });
            });
        }
    });

    app.get("/admin/services", function (req, res) {
        if (!req.session.isAdmin) {
            res.redirect("/");
        } else {
            db.ServiceMenu.findAll({ raw: true }).then(services => {
                res.render('partials/admin/admin-services', { isAdmin: req.session.isAdmin, isHandy: req.session.isHandy, services });
            });
        }
    });
};
