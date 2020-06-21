const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Companies = require("../../models/companies");
const Jobs = require("../../models/jobs");

describe("Jobs Tests", function() {
    beforeEach(async function(){
        await db.query("DELETE FROM jobs");

        // At least one company must exist before a job is created
        await request(app)
            .post("/companies")
            .send(
                {
                    "handle": "company1",
                    "name": "company one",
                    "num_employees": 11,
                    "description": "The Company One",
                    "logo_url": "http://asdf.com/comp1"
                }
            );
    });

    describe("POST /jobs", function(){

        test("Create a new job", async function(){
            const response = await request(app)
            .post("/jobs")
            .send(
                {
                    "title": "Job title 1",
                    "salary": 11100.11,
                    "equity": 0.1,
                    "company_handle": "company1"
                }
            );
            expect(response.statusCode).toEqual(201);
        })


        test("Create a new job - missing salary", async function(){
            const response = await request(app)
            .post("/jobs")
            .send(
                {
                    "title": "Job title 2",
                    "equity": 0.2,
                    "company_handle": "company1"
                }
                );
            expect(response.statusCode).toEqual(400);
            expect(response.text).toContain("instance requires property");
        });
    });
});


describe("Update/Delete an existing job", function() {
    let jobId;
    beforeEach(async function(){
        await db.query("DELETE FROM companies");

        await Companies.createCompany(
            {
                "handle": "company1",
                "name": "company one",
                "num_employees": 11,
                "description": "The Company One"
            }
        );

        const newJob = await Jobs.createJob(
                {
                    "title": "Job title 1",
                    "salary": 11100.11,
                    "equity": 0.1,
                    "company_handle": "company1"
                }
            );
        jobId = newJob.id;

    });

    describe("PATCH /jobs", function(){
        test("Update salary", async function(){
            const response = await request(app)
            .patch(`/jobs/${jobId}`)
            .send(
                {
                    "salary": 40000
                }
            );
            expect(response.statusCode).toEqual(200);
        });

    });


    describe("DELETE /jobs", function(){

        test("DELETE a job", async function(){
            const response = await request(app)
            .delete(`/jobs/${jobId}`);
            expect(response.statusCode).toEqual(200);
            expect(response.text).toContain("Job deleted");
        });
    });
});



afterAll(async function () {
    await db.end();
  });