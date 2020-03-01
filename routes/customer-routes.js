var db = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const acronym = require('acronym');
const radTitle = "Handyman R.A.D";


module.exports = function (app) {

    // update customer info view
    app.get("/user-info", function (req, res) {
        if (!req.session.user) {
            req.session.user = false;
            req.session.error = "No session, please login"
            req.session.isHandy = false;
            return res.redirect("/");
        } else {
            if (!req.session.isHandy) {
                db.Customer.findOne({
                    where: {
                        UserId: req.session.user.id
                    },
                    include: [db.User]
                }).then(dbCustomer => {
                    const customer = {
                        id: dbCustomer.id,
                        firstName: dbCustomer.firstName,
                        lastName: dbCustomer.lastName,
                        streetAddress: dbCustomer.streetAddress,
                        city: dbCustomer.city,
                        state: dbCustomer.state,
                        zipCode: dbCustomer.zipCode,
                        phoneNumber: dbCustomer.phoneNumber,
                        email: dbCustomer.email,
                        userId: dbCustomer.userId,
                        isHandy: false,
                        title: radTitle
                    }
                    res.render("customer-info", customer);
                });
            } else {
                db.HandyMan.findOne({
                    where: {
                        UserId: req.session.user.id
                    },
                    include: [db.User]
                }).then(dbHandyman => {
                    const handyMan = {
                        id: dbHandyman.id,
                        firstName: dbHandyman.firstName,
                        lastName: dbHandyman.lastName,
                        streetAddress: dbHandyman.streetAddress,
                        city: dbHandyman.city,
                        state: dbHandyman.state,
                        zipCode: dbHandyman.zipCode,
                        phoneNumber: dbHandyman.phoneNumber,
                        email: dbHandyman.email,
                        userId: dbHandyman.userId,
                        isHandy: true,
                        title: radTitle
                    }
                    res.render("customer-info", handyMan);
                });
            }
        }
    });

    /**
     * ROUTE - /api/customers
     * @description Get all customers
     */
    app.get("/api/customers", function (req, res) {
        db.Customer.findAll({}).then(function (dbUser) {
            res.json(dbUser);
        });
    });

    /**
     * ROUTE - /api/customers/:id
     * @description Get customer by ID
     * @expects id to be on req.params (url parameter)
     */
    app.get("/api/customers/:id", (req, res) => {
        db.Customer.findOne({ where: { id: req.params.id } })
            .then(function (dbCustomer) {
                res.status(200).json(dbCustomer);
            });
    });

    /**
     * ROUTE - /api/customers/:id
     * @description PUT route for updating users. The updated Customer data will be available in req.body
     */
    app.put("/api/customers/:id", function (req, res) {
        if (req.session.user && req.session.isHandy) {
            db.HandyMan.update(req.body, {
                where: {
                    id: req.params.id
                }
            }).then(function (dbHandyMan) {
                res.json(dbHandyMan);
            });
        } else {
            db.Customer.update(req.body, {
                where: {
                    id: req.params.id
                }
            }).then(function (dbCustomer) {
                res.json(dbCustomer);
            });
        }
    });

    /**
     * ROUTE - /login
     * @description Customer Login
     * @expects User info on req.body, username & password
     * @returns Auth token, User and Customer info
     */
    app.post("/login", function (req, res) {
        /* Get user&password from the Auth header */
        // we expect the header to be 'Basic btoa(username:password)'
        // authHedr is the base64 encoded string "username:password"
        let authHedr = req.get('Authorization').split(" ")[1];
        // we convert the base64 buffer to a string
        authHedr = Buffer.from(authHedr, 'Base64').toString();
        // we extract the username and password by spliting on :
        const username = authHedr.split(":")[0];
        const password = authHedr.split(":")[1];

        // find user by username
        db.User.findOne({
            where: {
                username
            }
        }).then(function (dbUser) {
            // if no user, return 404
            if (!dbUser) return res.status(404).json("No user found");

            // compare password with bcrypt
            const result = bcrypt.compareSync(password, dbUser.password);
            // if password not correct, return 401
            if (!result) return res.status(401).json("Password incorrect");

            // look for customer with Userid
            db.Customer.findOne({
                where: {
                    UserId: dbUser.id
                }
            }).then(customer => {
                // customer not found with that userid, return 404
                if (!customer) return res.status(404).json("No User Found");

                /* Successful login */
                // create a user object to store in the session
                const user = { id: dbUser.id, username: dbUser.username, isAdmin: dbUser.isAdmin };
                const expiresIn = 24 * 60 * 60;

                // store session user
                req.session.user = user;
                req.session.error = "";
                req.session.isHandy = false;

                // JWT token
                const accessToken = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn });

                // return status 200, and user info and access token
                res.status(200).json({ user, customer, "access_token": accessToken, "expires_in": expiresIn });
            })
        }).catch(err => {
            // remove session user
            req.session.user = false;
            req.session.error = "Failed creating customer";
            req.session.isHandy = false;

            // return error message
            if (err.parent && err.parent.sqlMessage) {
                res.status(500).json(err.parent.sqlMessage);
            } else {
                res.status(500).json(err.stack);
            }
        });
    });

    /**
     * ROUTE - /register
     * @description Create new User and Customer
     * @expects User and Customer info in req.body
     * @returns Auth token, User and Customer info
     */
    app.post("/register", function (req, res) {
        /* Get user&password from the Auth header */
        // we expect the header to be 'Basic btoa(username:password)'
        // authHedr is the base64 encoded string "username:password"
        let authHedr = req.get('Authorization').split(" ")[1];
        // we convert the base64 buffer to a string
        authHedr = Buffer.from(authHedr, 'Base64').toString();
        // we extract the username and password by spliting on :
        const username = authHedr.split(":")[0];
        let password = authHedr.split(":")[1];

        // encrypt the password
        password = bcrypt.hashSync(password);
        const isAdmin = req.body.isAdmin || 0;

        // Create user
        db.User.create({ username, password, isAdmin }).then(function (dbUser) {
            const user = { id: dbUser.id, username: dbUser.username, isAdmin: dbUser.isAdmin };
            const customer = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                streetAddress: req.body.address,
                city: req.body.city,
                state: req.body.state,
                email: req.body.email,
                zipCode: req.body.zipCode,
                phoneNumber: req.body.phoneNumber,
                UserId: dbUser.id
            }

            // Create customer
            db.Customer.create(customer).then(function (dbCustomer) {
                // create session user
                req.session.user = user;
                req.session.error = "";
                req.session.isHandy = false;
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn });
                res.status(200).json({ user, "customerInfo": dbCustomer, "access_token": accessToken, "expires_in": expiresIn });
            }).catch(err => {
                // remove session user
                req.session.user = false;
                req.session.error = "Failed creating customer";
                req.session.isHandy = false;

                // return error message
                if (err.parent && err.parent.sqlMessage) {
                    res.status(500).json(err.parent.sqlMessage);
                } else {
                    res.status(500).json(err.stack);
                }
            })
        }).catch(err => {
            // remove session user
            req.session.user = false;
            req.session.error = "Failed creating customer";
            req.session.isHandy = false;

            // return error message
            if (err.parent && err.parent.sqlMessage) {
                res.status(500).json(err.parent.sqlMessage);
            } else {
                res.status(500).json(err.stack);
            }
        });
    });
};
