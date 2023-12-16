"""
Edits CSV after copy and pasting in data from Dining services. Specifically,
some ingredients are listed twice for the same food. We copy and pasted
the resulting CSV file back into food.csv after completion (leaving header row).

Authors: Oma Mika Hameed, Yumna Ahmed and Cole Vulpis
"""

import csv

with open('foodEdited.txt', 'w') as f:
    with open("food.csv", "r", encoding="UTF-8") as file:
        csvreader = csv.DictReader(file)
        for row in csvreader:
            addStr = "," # csv reader sometimes struggles to read first column so make blank column
            i_set = set() # prevents on ingredient from being there twice

            # list all non-ingredients in row
            addStr += row["location"] + ","
            addStr += row["food"] + ","
            addStr += row["price"] + ","
            addStr += row["time"] + ","
            addStr += row["vegan"] + ","
            addStr += row["vegetarian"] + ","
            addStr += row["gluten"] + ","
            addStr += row["dairy"] + ","
            addStr += row["eggs"] + ","

            # Add all unique ingredients and empty columns to complete the row length (100)
            moreFoods = True
            for i in range (91):
                i_name = row[str(i)].lower()
                if i_name == '':
                    break
                if (not i_name in i_set) and moreFoods:
                    i_set.add(i_name)
                    addStr += i_name + ","
            commas = 91 - len(i_set)
            while commas > 0:
                addStr += ","
                commas = commas - 1

            # print first row of CSV
            f.write(addStr + '\n')
            