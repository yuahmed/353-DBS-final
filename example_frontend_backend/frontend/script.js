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
function createRowWithCells(foodName, dataArray, cellType) {
  let row = document.createElement("tr");

  dataArray.forEach((text,index) => {
    let cell = document.createElement(cellType);
    cell.innerText = text || "Unknown"; // Set 'No data' if the text is null
     // Add "ingredient-display" class only to the first <td> element
     if (index === 0) {
      cell.classList.add("ingredient-display");
    }
    row.appendChild(cell);
  });
  return row;
}

let foodData = []; // Global variable to store food data and manipulate it

// Fetches food data based on inputted results and button click
document
  .getElementById("foodFetchBtn")
  .addEventListener("click", fetchFoodData);
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
document
  .getElementById("reverseSortPriceBtn")
  .addEventListener("click", reverseSortByPrice);

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

// Populates table with tournamnet information (same process as populatePlayerTable)

// idea: do it with array somehow
function populateFoodTable(results) {
  let table = document.getElementById("foodTable");
  table.innerHTML = ""; // Clear the table
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

  let tbody = document.createElement("tbody");
  // If the queried table is empty, display error
  if (results.length === 0) {
    alert("No results found. Make sure to enter valid data");
    return;
  }


  // Create and append rows for each result
  results.forEach((element) => {
    // Map the element properties to match the headers order
    const foodData = [
      element.food_name,
      element.loc_name,
      mealTime(element.meal_time),
      YNC(element.is_vegan),
      YNC(element.is_vegetarian),
      YNC(element.has_eggs),
      YNC(element.has_dairy),
      YNC(element.has_gluten),
      toSwipes(element.food_price),
    ];
    let dataRow = createRowWithCells(foodData[0], foodData, "td"); // Will display 'no data' for null values
    tbody.appendChild(dataRow);
  });
  table.appendChild(tbody);
  let script = document.getElementById("theFilter");
  //script.innerHTML = "window.onload = () => { console.log(document.querySelector(\"#foodTable > tbody > tr:nth-child(1) > td:nth-child(2) \").innerHTML);};getUniqueValuesFromColumn()"
  table.appendChild(thead);
  getUniqueValuesFromColumn();
  
  var ingDispAll = document.querySelectorAll('.ingredient-display');

// Add an event listener to each element
  ingDispAll.forEach(element => {
    element.addEventListener('click', fetchIngredients);
});
}

// make sure the CSV is correct
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

function toSwipes(price) {
  if (price == -1) {
    return "Meal Swipe";
  }
  return price;
}

// Get unique values for the desired columns
function getUniqueValuesFromColumn() {
  var unique_col_values_dict = {};
  unique_col_values_dict[2] = new Array("Davis Cafe");
  unique_col_values_dict[2].push("Vail Commons");
  unique_col_values_dict[2].push("Wildcat Den");
  unique_col_values_dict[2].push("Qdoba");

  unique_col_values_dict[3] = new Array("Breakfast");
  unique_col_values_dict[3].push("Lunch");
  unique_col_values_dict[3].push("Dinner");

  for (let i = 4; i <= 8; i++) {
    unique_col_values_dict[i] = new Array("Yes");
    unique_col_values_dict[i].push("No");
    unique_col_values_dict[i].push("Customizable");
    unique_col_values_dict[i].push("Contains Traces");
    unique_col_values_dict[i].push("Unknown");
  }

  unique_col_values_dict[9] = new Array("Meal Swipe");
  unique_col_values_dict[9].push("Unknown");
  unique_col_values_dict[9].push(".");


  updateSelectOptions(unique_col_values_dict);
}

// Add <option> tags to the desired columns based on the unique values

function updateSelectOptions(unique_col_values_dict) {
  allFilters = document.querySelectorAll(".table-filter");

  allFilters.forEach((filter_i) => {
    col_index = filter_i.parentElement.getAttribute("col-index");

    unique_col_values_dict[col_index].forEach((i) => {
      filter_i.innerHTML =
        filter_i.innerHTML + `\n<option value="${i}">${i}</option>`;
    });
  });
}

function filter_rows() {
  allFilters = document.querySelectorAll(".table-filter");
  var filter_value_dict = {};

  allFilters.forEach((filter_i) => {
    col_index = filter_i.parentElement.getAttribute("col-index");

    value = filter_i.value;
    if (value != "all") {
      filter_value_dict[col_index] = value;
    }
  });

  var col_cell_value_dict = {};

  const rows = document.querySelectorAll("#foodTable tbody tr");
  rows.forEach((row) => {
    var display_row = true;

    allFilters.forEach((filter_i) => {
      col_index = filter_i.parentElement.getAttribute("col-index");
      col_cell_value_dict[col_index] = row.querySelector(
        "td:nth-child(" + col_index + ")"
      ).innerHTML;
    });

    for (var col_i in filter_value_dict) {
      filter_value = filter_value_dict[col_i];
      row_cell_value = col_cell_value_dict[col_i];

      if (row_cell_value.indexOf(filter_value) == -1 && filter_value != "all") {
        display_row = false;
        break;
      }
    }

    if (display_row == true) {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  });
}

function fetchIngredients(event) {
  // Access the target element from the event object
  var targetElement = event.target;

  // Now, you can get information about the clicked element
  var f_name = targetElement.innerText;
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
      console.log(ingredientData); //----------to remove
      populateIngredients(ingredientData);
    },
    (error) => {
      alert("Cannot obtain ingredients");
    }
  );
}

function populateIngredients(results) {
  let str = "INGREDIENTS: ";
  results.forEach((element) => {
    str += element.i_name + ", ";
  });

  str = str.substring(0, str.length - 2);
  alert(str);
}
