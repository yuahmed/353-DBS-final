import { createConnection } from 'mysql2';

// Conect to database
var connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'Dining'
});
function connect() {
    connection.connect();
}

// Setting up query for food data
function foodQueryCallback(i_name, callback) {
    // make the string contain it instead of be it
    connection.query("SELECT food_name, loc_name FROM (SELECT loc_name, food_id, food_name, CASE WHEN i_name LIKE ? THEN 1 ELSE 0 END AS is_ingredient FROM food NATURAL JOIN contains NATURAL JOIN ingredients) AS A GROUP BY food_id HAVING SUM(is_ingredient) >= 1", [i_name], (error, results, fields) => {
        if (error) throw error;
        console.log(results)
        callback(results);
    });
}

// Disconnecting from the database
function disconnect() {
    connection.end();
}

// Setup exports to include the external variables/functions
export {
    connection,
    connect,
    foodQueryCallback,
    disconnect
}

// For testing:
// connect()
// queryCallback(r => console.log(r))
// disconnect()