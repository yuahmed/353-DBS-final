// This is a framework to handle server-side content
import express from 'express';
import * as db from "./db_mysql.mjs";
import path from 'path'

// Connecting to database
var app = express();
let port = 3001
db.connect();

// Serve static HTML files in the current directory (called '.')
app.use(express.static(path.join(path.resolve(), '../frontend')));

// Get results from user requests and perform queries
app.get('/players', function (request, response) {
    let playerName = request.query.name
    db.playerQueryCallback(playerName, (results) => {
        response.json(results)
    })
});
app.get('/tournaments', function (request, response) {
    let tourneyYear = request.query.year
    db.tourneyQueryCallback(tourneyYear, (results) => {
        response.json(results)
    })
});
app.get('/playerStats', function (request, response) {
    let playerName = request.query.name;
    let startDate = request.query.startDate;
    let endDate = request.query.endDate;
    db.playerStatsQueryCallback(playerName, startDate, endDate, (results) => {
        console.log('server: ', results.avg_aces)
        response.json(results)
    }
    )
});

// Starting server; disconnecting from database upon exit
app.listen(port, () => console.log('Server is starting on PORT,', port))
process.on('exit', () => {
    db.disconnect()
})