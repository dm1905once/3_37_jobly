const express = require("express");
const jsonschema = require("jsonschema");
const ExpressError = require("../helpers/expressError");
const newJobSchema = require("../schemas/newJobSchema.json")
const Jobs = require("../models/jobs")
const Companies = require("../models/companies")

const router = new express.Router();

router.get("/", async function(req, res, next){
    const parameters = req.query;
    const allJobs = await Jobs.getJobs(parameters);
    res.json({jobs: allJobs})
})


router.post("/", async function(req, res, next){
    try{
        const validJob = jsonschema.validate(req.body, newJobSchema);
        if (validJob.valid){
            const newJob = await Jobs.createJob(req.body);
            return res.status(201).json({job: newJob});
        } else {
            const errors = validJob.errors.map(error => error.stack);
            const error = new ExpressError(errors, 400);
            return next(error);
        }
    } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function(req, res, next){
    try{
        const job = await Jobs.getJob(req.params.id);
        const company = await Companies.getCompany(job.company_handle);

        return res.json(
        {
            id: job.id,
            title: job.title,
            company: company,
            date_posted: job.date_posted
        }
        );
    } catch (err) {
    return next(err);
  }
});

router.patch("/:id", async function(req, res, next){
    try{
        const job = await Jobs.updateJob(req.body, req.params.id);
        return res.json({job});
    } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async function(req, res, next){
    try{
        const job = await Jobs.deleteJob(req.params.id);
        if (job) return res.json({"message": "Job deleted"});
    } catch (err) {
    return next(err);
  }
});


module.exports = router;