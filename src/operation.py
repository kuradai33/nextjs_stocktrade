import csv

datas = []

with open('./src/datas/7203T.csv') as f:
    data = csv.reader(f)
    for line in data:
        if line[0] == 'Date':
            continue
        devided_date = line[0].split("-")
        datas.append([1, line[0], (int(devided_date[0]) - 2000) * 366 + (int(devided_date[1]) - 1) * 31 + int(devided_date[2]) - 1, float(line[1]), float(line[4]), float(line[2]), float(line[3]), int(float(line[6]))])

with open('./src/datas/7203.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerows(datas)