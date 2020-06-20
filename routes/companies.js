const express = require("express");
const router = new express.Router();

router.get("/", function(req, res, next){
    const parameters = req.query;
    console.log(Object.keys(parameters));
    console.log(parameters['algo']);
})


router.get("/:handle", function(req, res, next){
    console.log(req.params.handle);
})




module.exports = router;