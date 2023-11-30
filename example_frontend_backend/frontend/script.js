// Creating section buttons
document.getElementById('playersBtn').addEventListener('click', function () { showSection('Players'); });
document.getElementById('tourneyBtn').addEventListener('click', function () { showSection('Tournaments'); });
document.getElementById('statsBtn').addEventListener('click', function () { showSection('Stats'); });


function showSection(sectionName) {
    // Hide all sections
    document.getElementById('playersSection').style.display = 'none';
    document.getElementById('tournamentsSection').style.display = 'none';
    document.getElementById('statsSection').style.display = 'none';

    // Show the selected section
    switch (sectionName) {
        case 'Players':
            // Show the players section using a 'block'
            document.getElementById('playersSection').style.display = 'block';
            break;
        case 'Tournaments':
            // Show the tournaments section using a 'block'
            document.getElementById('tournamentsSection').style.display = 'block';
            break;
        case 'Stats':
            // Show the stats section using a 'block'
            document.getElementById('statsSection').style.display = 'block';
            break;
        default:
            // If no section matches, do nothing
            console.log('No matching section');
            break;
    }
}

// Fetches player data based on inputted results and button click
document.getElementById('playerFetchBtn').addEventListener('click', fetchPlayersData);
function fetchPlayersData() {
    var playerName = document.getElementById('name').value; // Users inputted value
    var searchParams = new URLSearchParams({ name: playerName }); // Stores parameters

    // Fetches result from querying with users parameters
    const responsePromise = fetch(`/players?${searchParams}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    // Call populate function or display error if no response from server
    responsePromise.then(
        async (response) => {
            populatePlayersTable(await response.json());
        },
        (error) => {
            alert("Cannot obtain player");
        }
    );
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

// Populates table with player information
function populatePlayersTable(results) {
    let table = document.getElementById("playersTable");
    table.innerHTML = ''; // Clear the table

    // If the queried table is empty, display error
    if (results.length === 0) {
        alert("No results found. Make sure to enter valid data");
        return;
    }

    // Define headers
    const headers = ["Name", "Height (cm)", "Country", "Hand"];

    // Create and append the header row
    let headerRow = createRowWithCells(headers, 'th');
    table.appendChild(headerRow);

    // Create and append rows for each result
    results.forEach(element => {

        // Map the element properties to match the headers order
        const playerData = [
            element.player_name,
            element.height,
            element.ioc,
            element.hand
        ];
        let dataRow = createRowWithCells(playerData, 'td'); // Will display 'no data' for null values
        table.appendChild(dataRow);
    });
}

let tournamentData = []; // Global variable to store tournament data and manipulate it

// Fetches tourney data based on inputted results and button click (same process as fetchPlayerData)
document.getElementById('tourneyFetchBtn').addEventListener('click', fetchTourneyData);
function fetchTourneyData() {
    var tourneyYear = document.getElementById('tYear').value;
    var searchParams = new URLSearchParams({ year: tourneyYear });

    const responsePromise = fetch(`/tournaments?${searchParams}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    responsePromise.then(
        async (response) => {
            tournamentData = await response.json();
            populateTourneyTable(tournamentData);
        },
        (error) => {
            alert("Cannot obtain player");
        }
    );
}

// Display sorting buttons
document.getElementById('sortDrawBtn').addEventListener('click', sortByDrawSize);
document.getElementById('reverseSortDrawBtn').addEventListener('click', reverseSortByDrawSize);
document.getElementById('sortNameBtn').addEventListener('click', sortByName);
document.getElementById('reverseSortNameBtn').addEventListener('click', reverseSortByName);
document.getElementById('sortDateBtn').addEventListener('click', sortByStartDate);
document.getElementById('reverseSortDateBtn').addEventListener('click', reverseSortByStartDate);
document.getElementById('sortLevelBtn').addEventListener('click', sortByLevel);
document.getElementById('reverseSortLevelBtn').addEventListener('click', reverseSortByLevel);

// Sort alphabetically by name
function sortByName() {
    tournamentData.sort((a, b) => a.tourney_name.localeCompare(b.tourney_name));
    populateTourneyTable(tournamentData);
}

// Reverse sort alphabetically by name
function reverseSortByName() {
    tournamentData.sort((a, b) => b.tourney_name.localeCompare(a.tourney_name));
    populateTourneyTable(tournamentData);
}

// Sort by draw size (numerical increasing order)
function sortByDrawSize() {
    tournamentData.sort((a, b) => a.draw_size - b.draw_size);
    populateTourneyTable(tournamentData);
}

// Reverse sort by draw size
function reverseSortByDrawSize() {
    tournamentData.sort((a, b) => b.draw_size - a.draw_size);
    populateTourneyTable(tournamentData);
}


// Sort by start date (chronological)
function sortByStartDate() {
    tournamentData.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    populateTourneyTable(tournamentData);
}

// Reverse sort by start date
function reverseSortByStartDate() {
    tournamentData.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    populateTourneyTable(tournamentData);
}

// Sort by level (alphabetical)
function sortByLevel() {
    tournamentData.sort((b, a) => b.level.localeCompare(a.level));
    populateTourneyTable(tournamentData);
}

// Reverse sort by level
function reverseSortByLevel() {
    tournamentData.sort((a, b) => b.level.localeCompare(a.level));
    populateTourneyTable(tournamentData);
}

// Helper function for removing time information on tounament date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Populates table with tournamnet information (same process as populatePlayerTable)
function populateTourneyTable(results) {
    let table = document.getElementById("tourneyTable");
    table.innerHTML = '';

    if (results.length === 0) {
        alert("No results found. Make sure to enter valid data");
        return;
    }

    const headers = ["Name", "Draw Size", "Date", "Level"];
    let headerRow = createRowWithCells(headers, 'th');
    table.appendChild(headerRow);

    results.forEach(element => {
        const tourneyData = [
            element.tourney_name,
            element.draw_size,
            formatDate(element.start_date),
            element.level
        ];
        let dataRow = createRowWithCells(tourneyData, 'td');
        table.appendChild(dataRow);
    });

}
// Fetches stats data based on inputted results and button click (same process as fetchPlayerData)
document.getElementById('playerStatsFetchBtn').addEventListener('click', fetchPlayerStatsData);
function fetchPlayerStatsData() {
    var playerName = document.getElementById('psName').value;
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var searchParams = new URLSearchParams({
        name: playerName,
        startDate: startDate,
        endDate: endDate
    });

    const responsePromise = fetch(`/playerStats?${searchParams}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    responsePromise.then(
        async (response) => {

            populateStatsTable(await response.json());
        },
        (error) => {
            alert("Cannot obtain player stats");
        }
    );
}

// Populates table with player stats information
function populateStatsTable(results) {
    let table = document.getElementById("playerStatsTable");
    table.innerHTML = '';

    // Define list of attribute names for stat tables
    let attrNames = ["avg_aces", "avg_break_points_faced", "avg_break_points_saved", "avg_df", 
    "avg_serve_points", "total_aces", "total_break_points", "total_break_points_saved",
    "total_double_faults", "total_serve_points"];

    // If all attributes are null, then display error
    let hasAllNullResult = results.some(result => attrNames.every(attrNames => result[attrNames] === null));
    if (hasAllNullResult) {
        alert("No results found. Make sure to enter valid data. (Note: For earlier years, statistics may be unavailable.)");
        return; // Exit the function to prevent any further execution
    }

    // Now, we populate as done for the previous two populate functions
    const headers = ["Avg. Aces", "Avg. Break Points Faced", "Avg. Break Points Saved", 
        "Avg. Double Faults", "Avg. Serve Points", "Total Aces", "Total Break Points Faced",
        "Total Break Points Saved", "Total Double Faults", "Total Serve Points"];

    let headerRow = createRowWithCells(headers, 'th');
    table.appendChild(headerRow);

    results.forEach(element => {

        // Add stats using attribute names
        const stats = [];
        attrNames.forEach((attrNames) => {
            stats.push(element[attrNames]);
        });
        let dataRow = createRowWithCells(stats, 'td');
        table.appendChild(dataRow);
    });
}

