
# coding: utf-8

# In[ ]:

import psycopg2
import csv
import random
import json


# In[ ]:

conn = psycopg2.connect(database="librarymgmt", user="mihir", password="librarymgmt", host="163.172.144.135", port="5432")


# In[ ]:

csvReader = csv.reader(open('data/book32-listing.csv', 'r', encoding='latin_1'))


# In[ ]:

qry_tmplt = "INSERT INTO books(id, book_title, isbn, total_copies, available_copies, image_url, author, category) VALUES ({});".format(
    ",".join(["%s"]*8))
qry_tmplt


# In[ ]:

cur = conn.cursor()
for i, r in enumerate(csvReader):
    if r[6]=='Calendars':
        continue
    if r[6] != 'Science Fiction & Fantasy':
        continue
    total_copies = random.randint(1, 8)
    available_copies = total_copies
    cur.execute(qry_tmplt, (r[0].strip(), r[3].strip(), r[0].strip(), str(total_copies), str(available_copies), r[2].strip(), r[4].strip(), r[6].strip()))
    if i%10 == 0:
        conn.commit()


# In[ ]:




# In[ ]:




# In[ ]:




# In[ ]:




# In[ ]:



