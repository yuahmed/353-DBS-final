import csv

with open('foodEdited.txt', 'w') as f:
    with open("food.csv", "r", encoding="UTF-8") as file:
        csvreader = csv.DictReader(file)
        for row in csvreader:
            addStr = "," # weird error where can't read first column
            i_set = set() # prevents on ingredient from being there twice
            addStr += row["location"] + ","
            addStr += row["food"] + ","
            addStr += row["price"] + ","
            addStr += row["time"] + ","
            addStr += row["vegan"] + ","
            addStr += row["vegetarian"] + ","
            addStr += row["gluten"] + ","
            addStr += row["dairy"] + ","
            addStr += row["eggs"] + ","

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
            f.write(addStr + '\n')
            