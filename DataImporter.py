"""
Populates MySQL database information from CSV file

Authors: Oma Mika Hameed, Yumna Ahmed and Cole Vulpis
"""

import csv
import mysql.connector

# Read SQL file
schema_file = open("Schema.sql", "r")
schema_string = schema_file.read()
schema_file.close()
 
# Connect to MySQL
connection = mysql.connector.connect(user='root', password='123456', host='localhost')
cursor = connection.cursor()

# Drop, create, and use database, throw errors if unsuccessful
databaseName = "Dining"

try:
	cursor.execute("DROP DATABASE IF EXISTS {}".format(databaseName))
except mysql.connector.Error as error_descriptor:
	print("Failed dropping database: {}".format(error_descriptor))
	exit(1)

try:
	cursor.execute("CREATE DATABASE {}".format(databaseName))
except mysql.connector.Error as error_descriptor:
	print("Failed creating database: {}".format(error_descriptor))
	exit(1)

try:
	cursor.execute("USE {}".format(databaseName))
except mysql.connector.Error as error_descriptor:
	print("Failed using database: {}".format(error_descriptor))
	exit(1)

# Run the content of Schema.sql
try:
	for result in cursor.execute(schema_string, multi=True):
		pass
except mysql.connector.Error as error_descriptor:
	if error_descriptor.errno == mysql.connector.errorcode.ER_TABLE_EXISTS_ERROR:
		print("Table already exists: {}".format(error_descriptor))
	else:
		print("Failed creating schema: {}".format(error_descriptor))
	exit(1)

# Close cursor and reconnect to put in tuples, throw errors if unsuccessful
cursor.close()
cursor = connection.cursor()

try:
	cursor.execute("USE {}".format(databaseName))
except mysql.connector.Error as error_descriptor:
	print("Failed using database: {}".format(error_descriptor))
	exit(1)

# function for adding quotes around non-null Strings
def add_quotes(str):
	if str == "NULL":
		return str 
	else:
		return "'" + str + "'"

# Will ingredient names to id for revisisted ingredients
i_dict = {}
food_id = 0 # incremented
ingredient_id = 0 # incremented
with open("food.csv", "r", encoding="UTF-8") as file:
	csvreader = csv.DictReader(file)
	for row in csvreader:

		# insert all values for food table
		location = row["location"] # won't be null
		food_name = row["food"] # won't be null
		food_price = row["price"] # number, so doesn't need quotes despite null possibility
		meal_time = row["time"] # won't be null
		is_vegan = add_quotes(row["vegan"])
		is_vegetarian = add_quotes(row["vegetarian"])
		has_gluten = add_quotes(row["gluten"])
		has_dairy = add_quotes(row["dairy"])
		has_eggs = add_quotes(row["eggs"])
		data_string = "INSERT INTO food VALUES (%s, '%s', '%s', %s, '%s', %s, %s, %s, %s, %s);" % \
			(food_id, location, food_name, food_price, meal_time, is_vegan, is_vegetarian, has_gluten,\
	 has_dairy, has_eggs)
		
		try: 
			cursor.execute(data_string)
		except mysql.connector.Error as error_descriptor:
			print("Failed inserting tuple: {}".format(error_descriptor))

		# insert all unique ingredients until we get to end of ingredients list
		for i in range (91):
			i_name = row[str(i)] #already made lower case in csvEditor
			if i_name == '':
				break
			if not i_name in i_dict:
				i_dict[i_name] = ingredient_id # map name to current id
				data_string =  "INSERT INTO ingredient VALUES (%s, '%s');" % (ingredient_id, i_name)
				try: 
					cursor.execute(data_string)
				except mysql.connector.Error as error_descriptor:
					print("Failed inserting tuple: {}".format(error_descriptor))
				ingredient_id = ingredient_id + 1 # new ingredient so increment
			
			# Add food id to ingredient id of ingredient
			data_string = "INSERT INTO contains VALUES (%s, %s);" % (food_id, i_dict[i_name])
			try: 
				cursor.execute(data_string)
			except mysql.connector.Error as error_descriptor:
				print("Failed inserting tuple: {}".format(error_descriptor))
		
		# each row is a food, so now we increment
		food_id = food_id + 1




# Commit and close
cursor.close()
connection.commit()
connection.close()