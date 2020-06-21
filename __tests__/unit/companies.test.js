const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Companies = require("../../models/companies");

describe("Companies Tests", function() {
    beforeEach(async function(){
        await db.query("DELETE FROM companies");
    });

    describe("POST /companies", function(){

        test("Create a new company", async function(){
            const response = await request(app)
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
            expect(response.statusCode).toEqual(201);
        })

        test("Create a new company - mandatory fields only", async function(){
            const response = await request(app)
            .post("/companies")
            .send(
                {
                    "handle": "company2",
                    "name": "company two"
                }
            );
            expect(response.statusCode).toEqual(201);
        });


        test("Create a new company - missing handle", async function(){
            const response = await request(app)
            .post("/companies")
            .send({"name": "company three"});
            expect(response.statusCode).toEqual(400);
            expect(response.text).toContain("instance requires property");
        });
    });
});


describe("Update/Delete an existing company", function() {
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

    });

    describe("PATCH /companies", function(){
        test("Add an optional field", async function(){
            const response = await request(app)
            .patch("/companies/company1")
            .send(
                {
                    "logo_url": "http://asdf.com/comp1"
                }
            );
            expect(response.statusCode).toEqual(200);
        });

    });


    describe("DELETE /companies", function(){

        test("DELETE a company", async function(){
            const response = await request(app)
            .delete("/companies/company1");
            expect(response.statusCode).toEqual(200);
            expect(response.text).toContain("Company deleted");
        });
    });
});



afterAll(async function () {
    await db.end();
  });