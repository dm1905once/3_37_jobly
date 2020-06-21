const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate")

class Companies{

    static async getCompanies(parameters){
        const conditions = [];
        const values = [];
        let index=1;

        if (parameters.min_employees) { conditions.push(`num_employees >= $${index++}`); values.push(parameters.min_employees); }
        if (parameters.max_employees) { conditions.push(`num_employees <= $${index++}`); values.push(parameters.max_employees); }
        if (parameters.search) { conditions.push(`name LIKE $${index++}`); values.push(`%${parameters.search}%`); }

        const selectQuery = "SELECT handle, name FROM companies " + (conditions.length ? ("WHERE " + conditions.join(" AND ")) : "");
        const companies = await db.query(selectQuery,values);

        return companies.rows;
    }

    static async getCompany(handle){
        const company = await db.query(
            `SELECT handle, name, num_employees, description, logo_url
            FROM companies
            WHERE handle = $1`,
            [handle]
        );
        return company.rows[0];
    }

    static async createCompany(companyObject){
        const newCompany = await db.query(
            `INSERT INTO Companies(
                handle,
                name,
                num_employees,
                description,
                logo_url)
            VALUES($1, $2, $3, $4, $5)
            RETURNING
                handle,
                name,
                num_employees,
                description,
                logo_url`,
            [
                companyObject.handle,
                companyObject.name,
                companyObject.num_employees,
                companyObject.description,
                companyObject.logo_url
            ]);
            return newCompany.rows[0];
    }

    static async updateCompany(companyObject, handle){
        let updateObject = {}; 
        if (companyObject.handle) updateObject['handle'] = companyObject.handle; 
        if (companyObject.name) updateObject['name'] = companyObject.name; 
        if (companyObject.num_employees) updateObject['num_employees'] = companyObject.num_employees; 
        if (companyObject.description) updateObject['description'] = companyObject.description; 
        if (companyObject.logo_url) updateObject['logo_url'] = companyObject.logo_url; 
        const updateQuery = partialUpdate("companies", updateObject, "handle", handle);
        const updatedCompany = await db.query(updateQuery.query, updateQuery.values);
        return updatedCompany.rows[0];
    }

    static async deleteCompany(handle){
        const company = await db.query(`DELETE FROM companies 
        WHERE handle = $1
        RETURNING handle`,
        [handle]);

        if (company.rows.length === 0) {
            throw { message: `Company ${handle} does not exist`, status: 404 }
          } else {
              return company.rows[0];
          }
    }

}


module.exports = Companies;