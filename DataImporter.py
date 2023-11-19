"""
Populates MySQL database information from CSV files

Authors: Oma Mika Hameed, Yumna Ahmed and Cole Vulpis
"""

import csv
import glob
import mysql.connector
from datetime import datetime

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

# Run the content of Tennis.sql
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

food_map = {}
ingredients_map = {}
locations = set()
def add_quotes(str):
	if str == "NULL":
		return str 
	else:
		return "'" + str + "'"

with open("food.csv", "r", encoding="UTF-8") as file:
	csvreader = csv.DictReader(file)
	for row in csvreader:
		food_id = 0
		ingredient_id = 0

		# Collect data & insert data for new loser & winner players
		location = row["location"] # Note: primary keys have to be not null, so don't need to call to_null
		if location not in locations:
			locations.add(location)
			data_string = "INSERT INTO location VALUES ('%s');" % (location)

# Commit and close
cursor.close()
connection.commit()
connection.close()