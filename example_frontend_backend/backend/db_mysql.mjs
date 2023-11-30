import { createConnection } from 'mysql2';

// Conect to database
var connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'Tennis'
});
function connect() {
    connection.connect();
}

// Setting up query for player data, tournament data, and player stats
function playerQueryCallback(playerName, callback) {
    connection.query("SELECT * FROM players WHERE player_name = ?", [playerName], (error, results, fields) => {
        if (error) throw error;
        console.log(results)
        callback(results);
    });
}
function tourneyQueryCallback(tourneyYear, callback) {
    connection.query("SELECT * FROM tournaments WHERE YEAR(start_date) = ?", [tourneyYear], (error, results, fields) => {
        if (error) throw error;
        console.log(results)
        callback(results);
    });
}
function playerStatsQueryCallback(name, startDate, finishDate, callback) {
    connection.query("CALL ShowAggregateStatistics(?, ?, ?)", [name, startDate, finishDate], (error, results, fields) => {
        if (error) throw error;
        console.log(results[0][0])
        callback(results[0]); // Makes sure we only get tuple with data
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
    playerQueryCallback,
    tourneyQueryCallback,
    playerStatsQueryCallback,
    disconnect
}

// For testing:
// connect()
// queryCallback(r => console.log(r))
// disconnect()