const sqlForPartialUpdate = require("../../helpers/partialUpdate");

describe("partialUpdate()", () => {
  it("should generate a proper partial update query",
      function () {

        items = { 
          "_id": 3,
          "first_name" : "First", 
          "last_name": "Last",
          "_occupation": "None"
        }

    const newQuery = sqlForPartialUpdate("users", items, "id", 3);
    expect(newQuery.query).toEqual(`UPDATE users SET first_name=$1, last_name=$2 WHERE id=$3 RETURNING *`);
    expect(newQuery.values).toEqual([ 'First', 'Last', 3]);

  });
});
