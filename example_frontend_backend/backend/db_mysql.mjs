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

    // Querying for all indredinets with a name that contains what is searchec
    connection.query("SELECT food_name, loc_name, food_price, meal_time, is_vegan,\
        is_vegetarian, has_dairy, has_eggs, has_gluten FROM (SELECT loc_name, food_id,\
        food_name, food_price, meal_time, is_vegan, is_vegetarian, has_dairy, has_eggs,\
        has_gluten, CASE WHEN i_name LIKE ? THEN 1 ELSE 0 END AS is_ingredient FROM food \
        NATURAL JOIN contains NATURAL JOIN ingredient) AS A GROUP BY food_id \
        HAVING SUM(is_ingredient) >= 1", [i_name], (error, results, fields) => {
        if (error) throw error;

        callback(results);
    });
}

//Query setup to retrieve ingredients data from DB.
function ingredientQueryCallback(food_name, callback){
    connection.query("SELECT i_name FROM ingredient i ,`contains` c, food f \
        WHERE c.food_id = f.food_id AND f.food_name= ? \
        AND c.ingredient_id = i.ingredient_id ",[food_name] ,(error, results, fields) => {
        if (error) throw error;
        
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
    ingredientQueryCallback,
    disconnect
}

// For testing:
// connect()
// queryCallback(r => console.log(r))
// disconnect()