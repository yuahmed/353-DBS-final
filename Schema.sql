DROP SCHEMA IF EXISTS Dining;

CREATE SCHEMA Dining;

USE Dining;

CREATE TABLE food (
	food_id INT, 
	loc_name VARCHAR(15) check (loc_name = 'Wildcat Den' OR loc_name = 'Vail Commons' OR 
										loc_name = 'Qdoba' OR loc_name = 'Davis Cafe'),
	food_name VARCHAR(50),
	food_price NUMERIC(4,2),
	meal_time VARCHAR(5) check (meal_time = 'B' OR meal_time = 'L' OR meal_time = 'D' OR
									meal_time = 'B;L' OR meal_time = 'B;D' OR meal_time = 'L;D' OR
										meal_time = 'B;L;D'),
	is_vegan VARCHAR(1) check (is_vegan = 'Y' OR is_vegan = 'N' OR is_vegan = 'C' OR is_vegan = 'T'),
	is_vegetarian VARCHAR(1) check (is_vegetarian = 'Y' OR is_vegetarian = 'N' OR is_vegetarian = 'C'
										 OR is_vegetarian = 'T'),
	has_gluten VARCHAR(1) check (has_gluten = 'Y' OR has_gluten = 'N' OR has_gluten = 'C' OR 
									has_gluten = 'T'),
	has_dairy VARCHAR(1) check (has_dairy = 'Y' OR has_dairy = 'N' OR has_dairy = 'C' OR 
									has_dairy = 'T'),
	has_eggs VARCHAR(1) check (has_eggs = 'Y' OR has_eggs = 'N' OR has_eggs = 'C' OR has_eggs = 'T'),
	PRIMARY KEY (food_id)
);

CREATE TABLE ingredient (
	ingredient_id INT,
	i_name VARCHAR(125),
	PRIMARY KEY (ingredient_id)
);

CREATE TABLE contains (
	food_id INT, 
	ingredient_id INT,
	FOREIGN KEY (food_id) REFERENCES food (food_id),
	FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id),
	PRIMARY KEY(food_id, ingredient_id)
);
