// Creating section buttons
document.getElementById("homeBtn").addEventListener("click", function () {
  showSection("Home");
});
document.getElementById("foodBtn").addEventListener("click", function () {
  showSection("Foods");
});
document.getElementById("contactBtn").addEventListener("click", function () {
  showSection("Contact");
});

function showSection(sectionName) {
  // Hide all sections
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("foodSection").style.display = "none";
  document.getElementById("contactSection").style.display = "none";

  // Show the selected section
  switch (sectionName) {
    case "Home":
      // Show the home section using a 'block'
      document.getElementById("homeSection").style.display = "block";
      break;
    case "Foods":
      // Show the food section using a 'block'
      document.getElementById("foodSection").style.display = "block";
      break;
    case "Contact":
      // Show the contact section using a 'block'
      document.getElementById("contactSection").style.display = "block";
      break;
    default:
      // If no section matches, do nothing
      console.log("No matching section");
      break;
  }
}

// Helper function to create a row with cells used in table population
function createRowWithCells(dataArray, cellType) {
  let row = document.createElement("tr");

  dataArray.forEach((text,index) => {
    let cell = document.createElement(cellType);
    cell.innerText = text || "Unknown"; // Set 'No data' if the text is null

     // Add "ingredient-display" class only to the first <td> element; used for buttons later
     if (index === 0) {
      cell.classList.add("ingredient-display");
    }
    row.appendChild(cell);
  });
  return row;
}

let foodData = []; // Global variable to store food data and manipulate it

// Fetches food data based on inputted results and button click
document.getElementById("foodFetchBtn").addEventListener("click", fetchFoodData);

// Get food data based on user inputter value
function fetchFoodData() {
  var i_name = document.getElementById("i_name").value; // User inputted values
  i_name = "%" + i_name + "%"; // allows for contain searching searching
  var searchParams = new URLSearchParams({ i_name: i_name }); // Stored variables

  // Fetches result from querying with users parameters
  const responsePromise = fetch(`/foods?${searchParams}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
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

// Display sorting buttons
document.getElementById("sortPriceBtn").addEventListener("click", sortByPrice);
document.getElementById("reverseSortPriceBtn").addEventListener("click", reverseSortByPrice);

// Sort by price (numerical increasing order)
function sortByPrice() {
  foodData.sort((a, b) => a.food_price - b.food_price);
  populateFoodTable(foodData);
}

// Reverse sort by price
function reverseSortByPrice() {
  foodData.sort((a, b) => b.food_price - a.food_price);
  populateFoodTable(foodData);
}

// Populates table with food information information (same process as populatePlayerTable)
function populateFoodTable(results) {
  let table = document.getElementById("foodTable");
  table.innerHTML = ""; // Clear the table

  // Fill header with informationn (do it here so it doesn't show until something is entered)
  // Give proper columns selection drop downs (note filter_rows() is called for filtering)
  let thead = document.createElement("thead");
  thead.innerHTML =
    '<th col-index = 1>Food</th>\
    <th col-index = 2>Location <select class="table-filter" onchange="filter_rows()">\
        <option value="all"></option></select></th>\
        <th col-index = 3>Meal Time <select class="table-filter" onchange="filter_rows()">\
        <option value="all"></option></select></th>\
        <th col-index = 4>Vegan <select class="table-filter" onchange="filter_rows()">\
        <option value="all"></option></select></th>\
        <th col-index = 5>Vegetarian <select class="table-filter" onchange="filter_rows()">\
        <option value="all"></option></select></th>\
        <th col-index = 6>Contains Eggs <select class="table-filter" onchange="filter_rows()">\
        <option value="all"></option></select></th>\
        <th col-index = 7>Contains Dairy <select class="table-filter" onchange="filter_rows()">\
        <option value="all"></option></select></th>\
        <th col-index = 8>Contains Gluten <select class="table-filter" onchange="filter_rows()">\
        <option value="all"></option></select></th>\
        <th col-index = 9>Price </th>';
  table.appendChild(thead);
  
  let tbody = document.createElement("tbody");
  // If the queried table is empty, display error
  if (results.length === 0) {
    alert("Cannot find any foods with this ingredient.");
    return;
  }


  // Create and append rows for each result
  results.forEach((element) => {
    // Map the element properties to match the headers order
    const foodData = [
      element.food_name,
      element.loc_name,
      mealTime(element.meal_time), // turns meal time code into words
      YNC(element.is_vegan), // turns allergy/diet code into words
      YNC(element.is_vegetarian),
      YNC(element.has_eggs),
      YNC(element.has_dairy),
      YNC(element.has_gluten),
      toSwipes(element.food_price), // turns price information into words
    ];
    let dataRow = createRowWithCells(foodData, "td"); // Will display 'unknown' for null values
    tbody.appendChild(dataRow);
  });
  table.appendChild(tbody);
  
  updateSelectOptions(); // updates selection (needs to be called here b/c th is created here)
  
  // All foods in the first col will become buttons
  var ingDispAll = document.querySelectorAll('.ingredient-display'); //1st col b/c createRowWithCells
  ingDispAll.forEach(element => {
    element.addEventListener('click', fetchIngredients);
});
}

// turns meal time code into words (because of checks in SQL, this represents all possible codes)
function mealTime(time) {
  if (time == "B") {
    return "Breakfast";
  }
  if (time == "L") {
    return "Lunch";
  }
  if (time == "D") {
    return "Dinner";
  }
  if (time == "L;D") {
    return "Lunch & Dinner";
  }
  if (time == "B;L;D") {
    return "Breakfast, Lunch & Dinner";
  }

  return time;
}

// Turns code about diet or allergy into words for table
function YNC(char) {
  if (char == "Y") {
    return "Yes";
  }
  if (char == "N") {
    return "No";
  }
  if (char == "C") {
    return "Customizable";
  }
  if (char == "T") {
    return "Contains Traces";
  }
  return char;
}

// Concerts price code into words, if necessary
function toSwipes(price) {
  if (price == -1) {
    return "Meal Swipe"; // Meal swipes were denoted as having -1 price
  }
  return price;
}

// Soruce for next 2 functions: https://github.com/zangetsu-isshin/dropdown-filter/blob/main/filter.js
// We adapted these functions for our purposes and added comments for understandng.

// Create select options for foodTable
function updateSelectOptions() {
  var unique_col_values_dict = {};

  /* We could have these selections form dynamiclly, but hard code because that way if one of the
  possibilities doesn't exist for a queried option, the user can clearly see this.
  All hard-coded values represent all possible values because of SQL checks.
  Columns correspond to th columns. */
  unique_col_values_dict[2] = new Array("Davis Cafe", "Vail Commons", "Wildcat Den", "Qdoba");
  unique_col_values_dict[3] = new Array("Breakfast", "Lunch", "Dinner"); //Still displays combinations
  for (let i = 4; i <= 8; i++) {
    //Non-allergies don't have "Contains Traces" as a possible value
    if(i <= 5) unique_col_values_dict[i] = new Array("Yes", "No", "Customizable", "Unknown");
    else unique_col_values_dict[i]= new Array("Yes", "No", "Customizable", "Contains Traces", "Unknown");
  }

  allFilters = document.querySelectorAll(".table-filter"); // class added to each th

  // For each column, add to the selection each value in the array associated to the columns
  allFilters.forEach((filter_i) => {
    col_index = filter_i.parentElement.getAttribute("col-index");
    unique_col_values_dict[col_index].forEach((i) => {
      filter_i.innerHTML = filter_i.innerHTML + `\n<option value="${i}">${i}</option>`;
    });
  });
}

function filter_rows() {
  allFilters = document.querySelectorAll(".table-filter");
  var filter_value_dict = {};

  // Get values of every column in filter
  allFilters.forEach((filter_i) => {
    col_index = filter_i.parentElement.getAttribute("col-index");
    value = filter_i.value;

    // In the creation of th, all values were already given an "all" value, if not all, add to dict
    if (value != "all") {
      filter_value_dict[col_index] = value; // Will be whatever filter option is selected by user
    }
  });

  var col_cell_value_dict = {}; // dict for getting cell values

  // Preform filtering on rows
  const rows = document.querySelectorAll("#foodTable tbody tr");
  rows.forEach((row) => {
    var display_row = true;

    // Fill in dictionary of cell values for columns in filter 
    allFilters.forEach((filter_i) => {
      col_index = filter_i.parentElement.getAttribute("col-index");
      col_cell_value_dict[col_index] = row.querySelector("td:nth-child(" + col_index + ")"
      ).innerHTML;
    });

    // Don't show rows that don't have a value in the column that doesn't correspond to the 
    for (var col_i in filter_value_dict) {
      filter_value = filter_value_dict[col_i]; // User selected filter value
      row_cell_value = col_cell_value_dict[col_i]; // Value of cell

      // If the cell value does not match the filter value and the filter isn't all don't display
      if (row_cell_value.indexOf(filter_value) == -1 && filter_value != "all") {
        display_row = false;
        break;
      }
    }

    // Display rows according to which didn't become false by line above
    if (display_row == true) {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  });
}

// Fetch ingredients for specific food
function fetchIngredients(event) {
  // Access the target element from the event object (based on location on page)
  var targetElement = event.target;

  // Now, you can get information about the clicked element
  var f_name = targetElement.innerText; // Text will be the food in cell row
  var searchParams = new URLSearchParams({ f_name: f_name }); // Stored variables

  // Fetches result from querying with food name
  const responsePromise = fetch(`/ingredients?${searchParams}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  // Call populate function or display error if no response from server
  responsePromise.then(
    async (response) => {
      ingredientData = await response.json();
      populateIngredients(ingredientData);
    },
    (error) => {
      alert("Cannot obtain ingredients");
    }
  );
}

// Display alert box based on results from query
function populateIngredients(results) {

  // Format in list
  let str = "INGREDIENTS: ";
  results.forEach((element) => {
    str += element.i_name + ", ";
  });

  str = str.substring(0, str.length - 2); // Remove comma and space at end
  alert(str);
}
