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

// Get results from user requests for food and perform query
app.get('/foods', function (request, response) {
    let i_name = request.query.i_name
    db.foodQueryCallback(i_name, (results) => {
        response.json(results)
    })
});

// Get results from user requests for ingredients and perform query
app.get('/ingredients', function (request, response) {
    let f_name = request.query.f_name
    db.ingredientQueryCallback(f_name, (results) => {
        response.json(results)
    })
});

// Starting server; disconnecting from database upon exit
app.listen(port, () => console.log('Server is starting on PORT,', port))
process.on('exit', () => {
    db.disconnect()
})