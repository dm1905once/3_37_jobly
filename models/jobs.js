const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate")

class Jobs{

    static async getJobs(parameters){
        const conditions = [];
        const values = [];
        let index=1;

        if (parameters.min_salary) { conditions.push(`salary >= $${index++}`); values.push(parameters.min_salary); }
        if (parameters.min_equity) { conditions.push(`equity >= $${index++}`); values.push(parameters.min_equity); }
        if (parameters.search) { conditions.push(`title LIKE $${index++}`); values.push(`%${parameters.search}%`); }

        const selectQuery = "SELECT title, company_handle FROM jobs " + 
        (conditions.length ? ("WHERE " + conditions.join(" AND ")) : "") + 
        " ORDER BY date_posted DESC";
        const jobs = await db.query(selectQuery,values);

        return jobs.rows;
    }

    static async getJob(id){
        const job = await db.query(
            `SELECT id, title, salary, equity, company_handle, date_posted
            FROM jobs
            WHERE id = $1`,
            [id]
        );
        return job.rows[0];
    }

    static async createJob(jobObject){
        const newJob = await db.query(
            `INSERT INTO Jobs(
                title,
                salary,
                equity,
                company_handle)
            VALUES($1, $2, $3, $4)
            RETURNING
                id,
                title,
                salary,
                equity,
                company_handle,
                date_posted`,
            [
                jobObject.title,
                jobObject.salary,
                jobObject.equity,
                jobObject.company_handle
            ]);
            return newJob.rows[0];
    }

    static async updateJob(jobObject, id){
        let updateObject = {}; 
        if (jobObject.title) updateObject['title'] = jobObject.title; 
        if (jobObject.salary) updateObject['salary'] = jobObject.salary; 
        if (jobObject.equity) updateObject['equity'] = jobObject.equity; 
        if (jobObject.company_handle) updateObject['company_handle'] = jobObject.company_handle; 
        const updateQuery = partialUpdate("jobs", updateObject, "id", id);
        const updatedJob = await db.query(updateQuery.query, updateQuery.values);
        return updatedJob.rows[0];
    }

    static async deleteJob(id){
        const job = await db.query(`DELETE FROM jobs 
        WHERE id = $1
        RETURNING id`,
        [id]);

        if (job.rows.length === 0) {
            throw { message: `Job ${id} does not exist`, status: 404 }
          } else {
              return job.rows[0];
          }
    }

}


module.exports = Jobs;