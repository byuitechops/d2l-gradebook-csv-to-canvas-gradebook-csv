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

1. Login to D2L/Brightspace with an administrator account. ![step1](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/development/Inputs_Walkthrough/Slide1.PNG)
2. Search for the course you would like to obtain a gradebook for and go to its homepage. ![step2](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/development/Inputs_Walkthrough/Slide2.PNG)
3. Press the **'My Grades'** Tab and press **'Grades'**. ![step3](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/development/Inputs_Walkthrough/Slide3.PNG)
4. Press **'Export'**. ![step4](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/development/Inputs_Walkthrough/Slide4.PNG)
5. Select the following **'Export Options'**: 
  - **Key Field:** Both
  - **Grade Values:** Grade Scheme
  - **User Details:** Last Name & First Name
  - **Choose Grades to Export:** (select the desired assignments you would like to export, do not include **'Groups'**, **'Subtotals'**, **'Final Calculated Grade'**, or **'Final Adjusted Grade'**)
6. Press **'Export to CSV'**. ![step5-6](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/development/Inputs_Walkthrough/Slide5.PNG)

For naming conventions it is best to locate it in the local folder named **csv** (`./d2l-gradebook-csv-to-canvas-gradebook-csv/csv/_filename_`) and to leave the file named as it is output from D2L exports.

---
### Convert CSV

After exporting a D2L gradebook, you may then edit the variable `var d2lCSV` located on line 2 of **main.js** to be the file path of your CSV (as mentioned above).
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
  - Press **Next** and follow the steps in your admin email.
2. Once you have teacher level-access to the course, navigate to the **Grades** tab (https://byui.instructure.com/courses/_coursecode_/gradebook).
3. Under the **Actions** tab, select **Import**, press **Choose File**, then **Upload Data**
4. Most likely you will be redirected to a page with **There was some stuff I couldn't figure out with the data that you uploaded:**.
5. Match each Canvas **Assignment in question** name to your CSV's column names. Do not fill in the **Points Possible** input; the CSV contains percentages and Canvas will calculate the grades.
  - If the CSV has grades for an assignment that is not listed under **Assignment in question**, select **A new assignment** and input **Points Possible** if known. If not known assign **Points Possible** to **10** and contact someone who may know after upload is done and they can change it to the correct grade. Canvas should correctly change it based on percentage.
6. Once step 5 is done successfully you will be directed to a new page with the new grades. Press **Save Changes** and you're all done!
  - Many errors on this page can be disregarded, but you may need to contact someone if something went wrong from step 5 to step 6.