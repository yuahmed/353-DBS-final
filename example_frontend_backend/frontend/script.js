// Creating section buttons
document.getElementById('homeBtn').addEventListener('click', function () { showSection('Home'); });
document.getElementById('foodBtn').addEventListener('click', function () { showSection('Foods'); });
document.getElementById('contactBtn').addEventListener('click', function () { showSection('Contact'); });


function showSection(sectionName) {
    // Hide all sections
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('foodSection').style.display = 'none';
    document.getElementById('contactSection').style.display = 'none';

    // Show the selected section
    switch (sectionName) {
        case 'Home':
            // Show the home section using a 'block'
            document.getElementById('homeSection').style.display = 'block';
            break;
        case 'Foods':
            // Show the food section using a 'block'
            document.getElementById('foodSection').style.display = 'block';
            break;
        case 'Contact':
            // Show the contact section using a 'block'
            document.getElementById('contactSection').style.display = 'block';
            break;
        default:
            // If no section matches, do nothing
            console.log('No matching section');
            break;
    }
}

// Helper function to create a row with cells used in table population
function createRowWithCells(dataArray, cellType) {
    let row = document.createElement('tr');
    dataArray.forEach(text => {
        let cell = document.createElement(cellType);
        cell.innerText = text || 'No data'; // Set 'No data' if the text is null
        row.appendChild(cell);
    });
    return row;
}

let foodData = []; // Global variable to store food data and manipulate it

// Fetches food data based on inputted results and button click
document.getElementById('foodFetchBtn').addEventListener('click', fetchFoodData);
function fetchFoodData() {
    var i_name = document.getElementById('i_name').value; // User inputted values
    var searchParams = new URLSearchParams({ i_name: i_name }); // Stored variables

    // Fetches result from querying with users parameters
    const responsePromise = fetch(`/foods?${searchParams}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
        
    // Call populate function or display error if no response from server
    responsePromise.then(
        async (response) => {
            foodData = await response.json();
            populateFoodTable(foodData);
        },
        (error) => {
            alert("Cannot obtain food");
        }
    );
}

// // Display sorting buttons --> will become filter buttons
// document.getElementById('sortDrawBtn').addEventListener('click', sortByDrawSize);
// document.getElementById('reverseSortDrawBtn').addEventListener('click', reverseSortByDrawSize);
// document.getElementById('sortNameBtn').addEventListener('click', sortByName);
// document.getElementById('reverseSortNameBtn').addEventListener('click', reverseSortByName);
// document.getElementById('sortDateBtn').addEventListener('click', sortByStartDate);
// document.getElementById('reverseSortDateBtn').addEventListener('click', reverseSortByStartDate);
// document.getElementById('sortLevelBtn').addEventListener('click', sortByLevel);
// document.getElementById('reverseSortLevelBtn').addEventListener('click', reverseSortByLevel);

// // Sort alphabetically by name
// function sortByName() {
//     tournamentData.sort((a, b) => a.tourney_name.localeCompare(b.tourney_name));
//     populateTourneyTable(tournamentData);
// }

// // Reverse sort alphabetically by name
// function reverseSortByName() {
//     tournamentData.sort((a, b) => b.tourney_name.localeCompare(a.tourney_name));
//     populateTourneyTable(tournamentData);
// }

// // Sort by draw size (numerical increasing order)
// function sortByDrawSize() {
//     tournamentData.sort((a, b) => a.draw_size - b.draw_size);
//     populateTourneyTable(tournamentData);
// }

// // Reverse sort by draw size
// function reverseSortByDrawSize() {
//     tournamentData.sort((a, b) => b.draw_size - a.draw_size);
//     populateTourneyTable(tournamentData);
// }


// // Sort by start date (chronological)
// function sortByStartDate() {
//     tournamentData.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
//     populateTourneyTable(tournamentData);
// }

// // Reverse sort by start date
// function reverseSortByStartDate() {
//     tournamentData.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
//     populateTourneyTable(tournamentData);
// }

// // Sort by level (alphabetical)
// function sortByLevel() {
//     tournamentData.sort((b, a) => b.level.localeCompare(a.level));
//     populateTourneyTable(tournamentData);
// }

// // Reverse sort by level
// function reverseSortByLevel() {
//     tournamentData.sort((a, b) => b.level.localeCompare(a.level));
//     populateTourneyTable(tournamentData);
// }

// Populates table with tournamnet information (same process as populatePlayerTable)
function populateFoodTable(results) {
    let table = document.getElementById("foodTable");
    table.innerHTML = ''; // Clear the table

    // If the queried table is empty, display error
    if (results.length === 0) {
        alert("No results found. Make sure to enter valid data");
        return;
    }

    // Define headers
    const headers = ["Location", "Food"];

    // Create and append the header row
    let headerRow = createRowWithCells(headers, 'th');
    table.appendChild(headerRow);

    // Create and append rows for each result
    results.forEach(element => {

        // Map the element properties to match the headers order
        const foodData = [
            element.loc_name,
            element.food_name,
        ];
        let dataRow = createRowWithCells(foodData, 'td'); // Will display 'no data' for null values
        table.appendChild(dataRow);
    });

}