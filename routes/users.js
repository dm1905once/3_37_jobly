const express = require("express");
const jsonschema = require("jsonschema");
const ExpressError = require("../helpers/expressError");
const newUserSchema = require("../schemas/newUserSchema.json");
const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");
const {ensureCorrectUser} = require("../middleware/auth");
const router = new express.Router();

router.get("/", async function(req, res, next){
    const allUsers = await Users.getUsers();
    res.json({users: allUsers});
})


router.post("/", async function(req, res, next){
    try{
        const validUser = jsonschema.validate(req.body, newUserSchema);
        if (validUser.valid){
            const newUser = await Users.createUser(req.body);
            if (newUser){
                const token = jwt.sign(newUser, SECRET_KEY)
                return res.status(201).json({ token: token });
            } else {
                const error = new ExpressError("Unable to create new user", 400);
                return next(error);
            }
        } else {
            const errors = validUser.errors.map(error => error.stack);
            const error = new ExpressError(errors, 400);
            return next(error);
        }
    } catch (err) {
    return next(err);
  }
});

router.get("/:username", async function(req, res, next){
    try{
        const user = await Users.getUser(req.params.username);
        return res.json({user: user});
    } catch (err) {
    return next(err);
  }
});

router.patch("/:username", ensureCorrectUser, async function(req, res, next){
    try{
        const user = await Users.updateUser(req.body, req.params.username);
        return res.json(
            {user: 
                {
                    username:user.username, 
                    first_name: user.first_name, 
                    last_name: user.last_name,
                    email: user.email,
                    photo_url: user.photo_url
                }
            }
        )
    } catch (err) {
    return next(err);
  }
});

router.delete("/:username", ensureCorrectUser, async function(req, res, next){
    try{
        const user = await Users.deleteUser(req.params.username);
        if (user) return res.json({"message": "User deleted"});
    } catch (err) {
    return next(err);
  }
});


module.exports = router;