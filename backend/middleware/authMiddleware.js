const jwt = require('jsonwebtoken');

exports.verifyUser = (req, res, next) => {
    const token = req.headers.token;
    if (!token) return res.status(403).json("Access Denied");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json("Token is invalid!");
        req.user = user;
        next();
    });
};

exports.verifyAdmin = (req, res, next) => {
    this.verifyUser(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed!");
        }
    });
};