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
databaseName = "Schema"

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
try:
	cursor.execute(schema_string, multi=True)
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
	for result in cursor.execute(schema_string, multi=True):
		pass
except mysql.connector.Error as error_descriptor:
	print("Failed using database: {}".format(error_descriptor))
	exit(1)

food_map = set()
ingredients_map = set()
# add quotes arouond non null values
# Open all CSV files containing Tennis match information
for filename in glob.glob("tennis_atp-master/*.csv"):
	with open(filename, "r", encoding="UTF-8") as file:
		csvreader = csv.DictReader(file)
		for row in csvreader:

			# Collect data & insert data for new loser & winner players
			winner_id = row["winner_id"] # Note: primary keys have to be not null, so don't need to call to_null
			if winner_id not in player_set:
				player_set.add(winner_id)
				w_name = to_null(row["winner_name"].replace("'", "''"))
				w_hand = to_null(row["winner_hand"])
				w_ioc = to_null(row["winner_ioc"])
				w_height = to_null(row["winner_ht"])

				data_string = "INSERT INTO players VALUES ('%s', %s, %s, %s, %s);" % \
					(winner_id, w_name, w_hand, w_ioc, w_height)
				try:
					cursor.execute(data_string)
				except mysql.connector.Error as error_descriptor:
					print("Failed inserting tuple: {}".format(error_descriptor))
			
			loser_id = row["loser_id"] 
			if loser_id not in player_set:
				player_set.add(loser_id)
				l_name = to_null(row["loser_name"].replace("'", "''"))
				l_hand = to_null(row["loser_hand"])
				l_ioc = to_null(row["loser_ioc"])
				l_height = to_null(row["loser_ht"])
				data_string = "INSERT INTO players VALUES ('%s', %s, %s, %s, %s);" % \
					(loser_id, l_name, l_hand, l_ioc, l_height)

				try:
					cursor.execute(data_string)
				except mysql.connector.Error as error_descriptor:
					print("Failed inserting tuple: {}".format(error_descriptor))

				# Collect data & insert data for new tournaments
				# Note: start data is converted to SQL DATE format
				tourney_id = row["tourney_id"]
				if tourney_id not in tournament_set:
					tournament_set.add(tourney_id)
					tourney_name = to_null(row["tourney_name"].replace("'", "''"))
					draw_size = to_null(row["draw_size"])
					start_date = "NULL" if to_null(row["tourney_date"]) == "NULL" else \
						"DATE('{}')".format(datetime.strptime(row["tourney_date"], '%Y%m%d').strftime('%Y-%m-%d'))
					level = to_null(row["tourney_level"])

					data_string = "INSERT INTO tournaments VALUES ('%s', %s, %s, %s, %s);" % \
						(tourney_id, tourney_name, draw_size, start_date, level)
					try: 
						cursor.execute(data_string)
					except mysql.connector.Error as error_descriptor:
						print("Failed inserting tuple: {}".format(error_descriptor))

				# Collect data & insert data for matches
				match_num = row["match_num"]
				surface = to_null(row["surface"])
				score = to_null(row["score"])
				best_of = to_null(row["best_of"])

				data_string = "INSERT INTO matches VALUES ('%s', '%s', %s, %s, %s);" % \
					(tourney_id, match_num, surface, score, best_of)
				try: 
					cursor.execute(data_string)
				except mysql.connector.Error as error_descriptor:
					print("Failed inserting tuple: {}".format(error_descriptor))

			# Collect data & insert data for match_stats
			w_rank = to_null(row["winner_rank"])
			w_aces = to_null(row["w_ace"])
			w_df = to_null(row["w_df"])
			w_sp = to_null(row["w_svpt"])
			w_bpf = to_null(row["w_bpFaced"])
			w_bps = to_null(row["w_bpSaved"])

			data_string = "INSERT INTO match_stats VALUES ('%s', '%s', '%s', 'W', %s, %s, %s, %s, %s, %s);" % \
				(winner_id, tourney_id, match_num, w_rank, w_aces, w_df, w_sp, w_bpf, w_bps)
			try: 
				cursor.execute(data_string)
			except mysql.connector.Error as error_descriptor:
				print("Failed inserting tuple: {}".format(error_descriptor))

			l_rank = to_null(row["loser_rank"])
			l_aces = to_null(row["l_ace"])
			l_df = to_null(row["l_df"])
			l_sp = to_null(row["l_svpt"])
			l_bpf = to_null(row["l_bpFaced"])
			l_bps = to_null(row["l_bpSaved"])

			data_string = "INSERT INTO match_stats VALUES ('%s', '%s', '%s', 'L', %s, %s, %s, %s, %s, %s);" % \
				(loser_id, tourney_id, match_num, l_rank, l_aces, l_df, l_sp, l_bpf, l_bps)
			try: 
				cursor.execute(data_string)
			except mysql.connector.Error as error_descriptor:
				print("Failed inserting tuple: {}".format(error_descriptor))

# Commit and close
cursor.close()
connection.commit()
connection.close()