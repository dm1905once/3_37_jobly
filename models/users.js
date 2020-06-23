const db = require("../db");
const bcrypt = require("bcrypt");
const partialUpdate = require("../helpers/partialUpdate");


class Users{

    static async getUsers(){
        const users = await db.query(`SELECT username, first_name, last_name, email FROM users`)
        return users.rows;
    }

    static async getUser(username){
        const user = await db.query(
            `SELECT username, first_name, last_name, email, photo_url
            FROM users
            WHERE username = $1`,
            [username]
        );
        return user.rows[0];
    }

    static async authenticateUser(username, password) {
        const results = await db.query(
          `SELECT username, password, is_admin 
          FROM users
          WHERE username = $1`, 
          [username] );
        const user = results.rows[0];
        if (user){
          return await bcrypt.compare(password, user.password);
        } 
      }

    static async getUserToken(username){
        const user = await db.query(
            `SELECT username, is_admin
            FROM users
            WHERE username = $1`, 
            [username]);
        if (user) {
            return user.rows[0];
        }
    }

    static async createUser(userObject){
        const hashedPwd = await bcrypt.hash(userObject.password, 12);
        const newUser = await db.query(
            `INSERT INTO users(
                username,
                password,
                first_name,
                last_name,
                email,
                photo_url,
                is_admin)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING
                username,
                is_admin`,
            [
                userObject.username,
                hashedPwd,
                userObject.first_name,
                userObject.last_name,
                userObject.email,
                userObject.photo_url,
                userObject.is_admin
            ]);
            return newUser.rows[0];
    }

    static async updateUser(userObject, username){
        let updateObject = {}; 
        if (userObject.first_name) updateObject['first_name'] = userObject.first_name; 
        if (userObject.last_name) updateObject['last_name'] = userObject.last_name; 
        if (userObject.email) updateObject['email'] = userObject.email; 
        if (userObject.photo_url) updateObject['photo_url'] = userObject.photo_url; 
        if (userObject.is_admin) updateObject['is_admin'] = userObject.is_admin; 
        const updateQuery = partialUpdate("users", updateObject, "username", username);
        const updatedUser = await db.query(updateQuery.query, updateQuery.values);
        return updatedUser.rows[0];
    }

    static async deleteUser(username){
        const user = await db.query(`DELETE FROM users 
        WHERE username = $1
        RETURNING username`,
        [username]);

        if (user.rows.length === 0) {
            throw { message: `User ${username} does not exist`, status: 404 }
          } else {
              return user.rows[0];
          }
    }

}


module.exports = Users;