// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Grabbing our models

var db = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { Op } = require("sequelize");

// Routes
// =============================================================
module.exports = function (app) {

    // GET route for getting all of the users
    app.get("/api/handymans", function (req, res) {
        let condition = {
            include: [{ model: db.ServiceRequest, required: false }]
        };

        if (req.query.date) {
            let date = moment(req.query.date);
            date = date.startOf('day');
            let date2 = moment(req.query.date);
            date2 = date2.endOf('day');
            condition = {
                include: [{
                    model: db.ServiceRequest,
                    where: {
                        startTime: {
                            [Op.gte]: date,
                            [Op.lte]: date2
                        }
                    },
                    required: false
                }]
            }
        }

        db.HandyMan.findAll(condition).then(function (dbHandyman) {
            res.json(dbHandyman);
        }).catch(err => {
            return res.status(500).json(err.message);
        });
    });

    // GET Handyman by ID
    app.get("/api/handymans/:id", (req, res) => {
        db.HandyMan.findOne({ where: { id: req.params.id } })
            .then(function (dbHandyman) {
                res.status(200).json(dbHandyman);
            }).catch(err => {
                res.status(404).end();
            });
    });

    // This is Handyman updating their info
    // PUT route for updating users. The updated Handyman data will be available in req.body
    app.put("/api/handymans/:id", function (req, res) {
        db.HandyMan.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(function (dbHandyman) {
            res.json(dbHandyman);
        });
    });

    // post for handyman login, JWT Auth
    app.post("/handyman-login", function (req, res) {
        /* Get user&password from the Auth header */
        // we expect the header to be 'Basic btoa(username:password)'
        // authHedr is the base64 encoded string "username:password"
        let authHedr = req.get('Authorization').split(" ")[1];
        // we convert the base64 buffer to a string
        authHedr = Buffer.from(authHedr, 'Base64').toString();
        // we extract the username and password by spliting on :
        const username = authHedr.split(":")[0];
        const password = authHedr.split(":")[1];

        db.User.findOne({
            /**
             * We use ES6 Object Deconstruction here on "username".
             * Because the variable name "username" is the same as
             * the key in the table "username", Javascript knows we
             * mean {"username":username}.
             */
            where: { username }
        }).then(function (dbUser) {
            if (!dbUser) {
                req.session.user = false;
                req.session.error = "No User Found";
                req.session.isHandy = false;
                return res.status(404).json("No user found");
            }

            const result = bcrypt.compareSync(password, dbUser.password);
            if (!result) return res.status(401).json("Username or Password incorrect");

            db.HandyMan.findOne({
                where: {
                    UserId: dbUser.id
                }
            }).then(handyman => {
                if (!handyman) {
                    req.session.user = false;
                    req.session.error = "No User Found";
                    return res.status(404).json("No User Found");
                }

                const user = { id: dbUser.id, username: dbUser.username, isAdmin: dbUser.isAdmin, isHandy: true };
                req.session.user = user;
                req.session.error = "";
                req.session.isHandy = true;
                req.session.isAdmin = dbUser.isAdmin;
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn });

                res.status(200).json({ user: user, handyman, "access_token": accessToken, "expires_in": expiresIn });
            })
        }).catch(err => {
            req.session.user = false;
            req.session.error = "Failed creating handyman";
            req.session.isHandy = false;
            if (err.parent && err.parent.sqlMessage) {
                return res.status(500).json(err.parent.sqlMessage);
            } else {
                return res.status(500).json(err.stack);
            }
        });
    });

    /**
     * ROUTE: /handyman-register
     * @description POST request for creating a new Handyman User
     * @accepts User and Handyman information over req.body
     */
    app.post("/handyman-register", function (req, res) {
        /* Get user&password from the Auth header */
        // we expect the header to be 'Basic btoa(username:password)'
        // authHedr is the base64 encoded string "username:password"
        let authHedr = req.get('Authorization').split(" ")[1];
        // we convert the base64 buffer to a string
        authHedr = Buffer.from(authHedr, 'Base64').toString();
        // we extract the username and password by spliting on :
        const username = authHedr.split(":")[0];
        let password = authHedr.split(":")[1];
        password = bcrypt.hashSync(password);
        const isAdmin = req.body.isAdmin || 1;

        db.User.create({ username, password, isAdmin }).then(function (dbUser) {
            const user = { id: dbUser.id, username: dbUser.username, isAdmin, isHandy: true };
            const handyman = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                streetAddress: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipCode,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                UserId: dbUser.id
            }

            db.HandyMan.create(handyman).then(function (dbHandyman) {
                req.session.user = user;
                req.session.isHandy = true;
                req.session.error = "";
                req.session.isAdmin = user.isAdmin;
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn });
                res.status(200).json({ user, "handymanInfo": dbHandyman, "access_token": accessToken, "expires_in": expiresIn });
            }).catch(err => {
                req.session.user = false;
                req.session.error = "Failed creating handyman";
                req.session.isHandy = false;
                res.status(500).json(err.stack);
            })
        }).catch(err => {
            req.session.user = false;
            req.session.error = "Failed creating User prior to handyman";
            req.session.isHandy = false;
            res.status(500).json(err.parent.sqlMessage);
        });
    });
};


