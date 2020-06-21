const express = require("express");
const jsonschema = require("jsonschema");
const ExpressError = require("../helpers/expressError");
const newCompanySchema = require("../schemas/newCompanySchema.json")
const Companies = require("../models/companies")
const Jobs = require("../models/jobs")

const router = new express.Router();

router.get("/", async function(req, res, next){
    const parameters = req.query;
    if (Object.keys(parameters).includes("min_employees") && Object.keys(parameters).includes("max_employees")){
        if (parseInt(parameters['min_employees']) > parseInt(parameters['max_employees'])){
            const error = new ExpressError("min_employees cannot be greater than max_employees", 400);
            return next(error);
        }
    }
    const allCompanies = await Companies.getCompanies(parameters);
    res.json({companies: allCompanies})
})


router.post("/", async function(req, res, next){
    try{
        const validBook = jsonschema.validate(req.body, newCompanySchema);
        if (validBook.valid){
            const company = await Companies.createCompany(req.body);
            return res.status(201).json({company: company});
        } else {
            const errors = validBook.errors.map(error => error.stack);
            const error = new ExpressError(errors, 400);
            return next(error);
        }
    } catch (err) {
    return next(err);
  }
});

router.get("/:handle", async function(req, res, next){
    try{
        const company = await Companies.getCompany(req.params.handle);
        const companyJobs = await Jobs.getJobsByCompany(req.params.handle);
        return res.json( 
            {company: {
                    handle: company.handle,
                    name: company.name,
                    num_employees: company.num_employees,
                    description: company.description,
                    logo_url: company.logo_url,
                    jobs: companyJobs
                }
            }
        );
    } catch (err) {
    return next(err);
  }
});

router.patch("/:handle", async function(req, res, next){
    try{
        const company = await Companies.updateCompany(req.body, req.params.handle);
        return res.json({company});
    } catch (err) {
    return next(err);
  }
});

router.delete("/:handle", async function(req, res, next){
    try{
        const company = await Companies.deleteCompany(req.params.handle);
        if (company) return res.json({"message": "Company deleted"});
    } catch (err) {
    return next(err);
  }
});


module.exports = router;