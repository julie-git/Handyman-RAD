// HTML Routes
// =============================================================
module.exports = function (app) {

    // GET route for getting all of the todos
    app.get("/", function (req, res) {
        // reset session user
        if (!req.session.user) {
            req.session.user = false;
            req.session.error = "";
            req.session.isHandy = false;
            req.session.isAdmin = false;
            res.render("index");
        } else if (!req.session.isHandy) {
            res.redirect("/service-menu");
        } else {
            res.redirect("/update-service");
        }
    });

    // GET route for creating a register
    app.get("/register", function (req, res) {
        // reset session user
        req.session.user = false;
        req.session.error = "";
        req.session.isHandy = false;
        req.session.isAdmin = false;
        res.render("register");
    });

    // GET route for creating a register
    app.get("/login", function (req, res) {
        // reset session user
        req.session.user = false;
        req.session.error = "";
        req.session.isHandy = false;
        req.session.isAdmin = false;
        res.render("login");
    });


    app.get("/handyman-login", function (req, res) {
        // reset session user
        req.session.user = false;
        req.session.error = "";
        req.session.isHandy = true;
        res.render("handyman-login");
    });

    app.get("/handyman-register", function (req, res) {
        // reset session user
        req.session.user = false;
        req.session.error = "";
        req.session.isHandy = false;
        res.render("handyman-register");
    });

    app.get("/select-slot", function (req, res) {
        if (req.session.user) {
            res.render("service-selection");
        } else {
            res.render("login");
        }
    });

    app.get("/confirm", function (req, res) {
        if (req.session.user) {
            res.render("confirm");
        } else {
            res.render("login");
        }
    });

    app.get("/update-service", function (req, res) {
        if (req.session.user) {
            let isHandy = req.session.isHandy;
            let isAdmin = req.session.isAdmin;
            res.render("assignments", { isHandy, isAdmin });
        } else {
            res.render("login");
        }
    });
};
