DROP SCHEMA IF EXISTS Dining;

CREATE SCHEMA Dining;

USE Dining;

CREATE TABLE location (
	location_id	INT,
	loc_name VARCHAR(15),
	PRIMARY KEY (location_id)
);

CREATE TABLE food (
	food_id INT, 
	location_id INT,
	food_name VARCHAR(50),
	food_price NUMERIC(4,2), 
	is_vegan VARCHAR(1),
	is_vegetarian VARCHAR(1),
	has_gluten VARCHAR(1),
	has_dairy VARCHAR(1),
	has_eggs VARCHAR(1),
	FOREIGN KEY (location_id) REFERENCES location(location_id),
	PRIMARY KEY (food_id)
);

CREATE TABLE ingredients (
	ingredient_id INT,
	i_name VARCHAR(50),
	PRIMARY KEY (ingredient_id)
);

CREATE TABLE contains (
	food_id INT, 
	ingredient_id INT,
	FOREIGN KEY (food_id) REFERENCES food (food_id),
	FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id),
	PRIMARY KEY(food_id, ingredient_id),
);
