# d2l-gradebook-csv-to-canvas-gradebook-csv
## Description

D2L (Brightspace) Gradebook CSV files and Canvas Gradebook CSV files have a lot of key differences. If one wanted to import a D2L gradebook into Canvas, it would not work well. This project solves this (while still requiring some user handywork) by creating a Canvas Gradebook CSV using the data from a D2L CSV.

---
## How to Install

To install `d2l-gradebook-csv-to-canvas-gradebook-csv` program, execute:

```sh
# Clone the repository
$ git clone https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv.git

# Step into the created folder
$ cd ./d2l-gradebook-csv-to-canvas-gradebook-csv

# Install dependencies
$ npm i
```

---
## How to Use
### Get D2L Gradebook CSV

To obtain the correct Gradebook CSV file do the following:

1. Login to D2L/Brightspace with an administrator account. ![step1](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/walkthrough/Slide1.PNG)
2. Search for the course you would like to obtain a gradebook for and go to its homepage. ![step2](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/walkthrough/Slide2.PNG)
3. Press the **'My Grades'** Tab and press **'Grades'**. ![step3](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/walkthrough/Slide3.PNG)
4. Press **'Export'**. ![step4](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/walkthrough/Slide4.PNG)
5. Select the following **'Export Options'**: 
  - **Key Field:** Both
  - **Grade Values:** Grade Scheme
  - **User Details:** Last Name, First Name, and Email
  - **Choose Grades to Export:** (select the desired assignments you would like to export, do not include **'Groups'**, **'Subtotals'**, **'Final Calculated Grade'**, or **'Final Adjusted Grade'**)
6. Press **'Export to CSV'**. ![step5-6](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/walkthrough/Slide5.PNG)

For naming conventions it is best to locate it in the local folder named **csv** (`./d2l-gradebook-csv-to-canvas-gradebook-csv/csv/_filename_`) and to leave the file named as it is output from D2L exports.

---
### Filter by Student Email

You may include a CSV file containing student emails to ensure your output file only includes those students' grades. Generally you will include this in the local folder **csv**, but it can be located anywhere you can specify its path.

Your CSV may include any information, but should have correct layout like so:
```csv
Last Name,First Name,Email
Tryle,Alice,alicetryle@byui.edu
Tryle,Bob,bobtryle@byui.edu
Tryle,Charlie,charlietryle@byui.edu
Tryle,David,davidtryle@byui.edu
Tryle,Eugene,eugenetryle@byui.edu
Tryle,Faith,faithtryle@byui.edu
Tryle,Guy,guytryle@byui.edu
Tryle,Hope,hopetryle@byui.edu
Tryle,Ima,imatryle@byui.edu

```

You must at least have a column entitled **Email**:
```csv
Email
alicetryle@byui.edu
bobtryle@byui.edu
charlietryle@byui.edu
davidtryle@byui.edu
eugenetryle@byui.edu
faithtryle@byui.edu
guytryle@byui.edu
hopetryle@byui.edu
imatryle@byui.edu

```

The next section discusses how to filter by email. If you do not wish to filter by email, but include all students, you may disregard this.

---
### Convert CSV

After exporting a D2L gradebook, you may then edit the variable `var d2lCSV` located on line 2 of **main.js** to be the file path of your CSV (as mentioned above).
If you have a **emailList.csv** to filter through your `d2LCSV`, make `const useList = true` located on line 5 of **main.js** and `var emailCSV` on line 6 to be the file path of your email list CSV.
If you do not wish to filter by email make sure `const useList = false`.
To create the Canvas CSV, execute:

```sh
$ node .\\main.js
```

Repeat this process for as many exported gradebooks you require. Your output file(s) will be located in `./d2l-gradebook-csv-to-canvas-gradebook-csv/output/` folder.

---
### Import to Canvas

To import a Gradebook CSV into Canvas do the following:

1. Ensure you have teacher-level access to the course. You can be added as a teacher for a course by doing the following:
  - Login to Canvas and go to the course's **People** tab (https://byui.instructure.com/courses/_coursecode_/users).
  - Press **+ People**.
  - Add user(s) by **Email Address** and input your administrator email (not the same as your student email).
  - Select **Teacher** for **Role** (a Section does not/should not need to be included).
  - Press **Next**, select the user associated with that email, and follow the steps in your admin email.
  ![step7](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/walkthrough/Slide6.PNG)
2. Once you have teacher level-access to the course, navigate to the **Grades** tab (https://byui.instructure.com/courses/_coursecode_/gradebook).
3. Under the **Actions** tab, select **Import**, press **Choose File**, then **Upload Data**.
  - Depending on the course's format there may not be an **Actions** tab, but the **Import** button will be located near the left of the window.
  ![step8-9](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/walkthrough/Slide7.PNG)
4. Most likely you will be redirected to a page with **There was some stuff I couldn't figure out with the data that you uploaded:**.
5. Match each Canvas **Assignment in question** name to your CSV's column names. Do not fill in the **Points Possible** input; the CSV contains percentages and Canvas will calculate the grades.
  - If the CSV has grades for an assignment that is not listed under **Assignment in question**, select **A new assignment** and input **Points Possible** if known. If not known assign **Points Possible** to **10** and contact someone who may know after upload is done and they can change it to the correct grade. Canvas should correctly change it based on percentage.
  ![step10-11](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/walkthrough/Slide8.PNG)
6. Once step 5 is done successfully you will be directed to a new page with the new grades. Press **Save Changes**. You will be redirected back to the **Grades** tab, if you reload this page you should see the calculated grades for each imported grade.
  - Most errors on this page can be disregarded, but you may need to contact someone if something went wrong from step 5 to step 6.
  ![step12](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/walkthrough/Slide5.PNG)

---
## Create New CSV
As part of the original project intent, students need to be enrolled into Canvas before they have their grades input. In order to enroll the students from the Canvas GradeBook CSV into the correct sections, [this](https://github.com/byuitechops/canvas-enroll-students) repository was created. However, students without Canvas accounts (for various reasons) would create a lot of clicking while importing grades manually. To get around this the **./create_new_csv** folder contains a way to make your D2L GradeBook CSV reflect only the grades of students who are enrolled in Canvas. Running this code on your original export creates a new D2L GradeBook CSV that can be run through the converter by following the steps above. The output of this program is located in **./create_new_csv/output**.

To run use:
```sh
$ node .\\create_new_csv\\createNew.js
```