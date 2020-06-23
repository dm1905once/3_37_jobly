const express = require("express");
const ExpressError = require("../helpers/expressError");
const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");
const router = new express.Router();



router.post("/", async function(req, res, next){
    try{
        const {username, password}= req.body;
        const isAuthenticated = await Users.authenticateUser(username, password);
        if (isAuthenticated) {
            const user = await Users.getUserToken(username);
            const token = jwt.sign(user, SECRET_KEY)
            return res.json({ token: token });
        } else {
            const error = new ExpressError("Invalid username or password", 401);
            return next(error);
        }
    } catch (err) {
        return next(err);
    }
})


module.exports = router;