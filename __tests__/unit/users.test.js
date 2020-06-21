const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Users = require("../../models/users");

describe("Users Tests", function() {
    beforeEach(async function(){
        await db.query("DELETE FROM users");
    });

    describe("POST /users", function(){

        test("Create a new user", async function(){
            const response = await request(app)
            .post("/users")
            .send(
                {
                    "username": "UserA",
                    "password": "asdfasdf",
                    "first_name": "A First Name",
                    "last_name": "A Last Name",
                    "email": "First@example.com",
                    "photo_url:": "http://asdfasdf.com/asdfa",
                    "is_admin": false
                }
            );
            expect(response.statusCode).toEqual(201);
        })


        test("Create a new user - missing username", async function(){
            const response = await request(app)
            .post("/users")
            .send(
                {
                    "password": "asdfasdf",
                    "first_name": "Second First Name",
                    "last_name": "Second Last Name",
                    "email": "Second@example.com",
                    "photo_url:": "http://asdfasdf.com/asdfa",
                    "is_admin": false
                }
            );
            expect(response.statusCode).toEqual(400);
            expect(response.text).toContain("instance requires property");
        });
    });
});


describe("Update/Delete an existing user", function() {
    beforeEach(async function(){
        await db.query("DELETE FROM users");

        await Users.createUser(
            {
                "username": "UserB",
                "password": "asdfasdf",
                "first_name": "B First Name",
                "last_name": "B Last Name",
                "email": "Second@example.com",
                "photo_url:": "http://asdfasdf.com/asdfa",
                "is_admin": false
            }
        );

    });

    describe("PATCH /username", function(){
        test("Add an optional field", async function(){
            const response = await request(app)
            .patch("/users/UserB")
            .send(
                {
                    "first_name": "Second First Name",
                    "last_name": "Second Last Name",
                    "photo_url:": "http://asdfasdf.com/asdfa",
                    "is_admin": true
                }
            );
            expect(response.statusCode).toEqual(200);
        });

    });


    describe("DELETE /users", function(){

        test("DELETE a user", async function(){
            const response = await request(app)
            .delete("/users/UserB");
            expect(response.statusCode).toEqual(200);
            expect(response.text).toContain("User deleted");
        });
    });
});



afterAll(async function () {
    await db.end();
  });