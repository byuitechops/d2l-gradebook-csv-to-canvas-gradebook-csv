# Project Capture Document for d2l-gradebook-csv-to-canvas-gradebook-csv
#### *Author: Seth Bolander*
#### *Stakeholder(s): *
#### *Date: March 3, 2019*


## Background

Some courses on Brightspace have grades in gradebooks that need to be imported to Canvas. This process is extremely clunky and without file conversion would require a lot of user-unfriendly labor. This project clears much of the user labor.

-----

## Definition of Done

This project intends to create less effort to recreate a gradebook CSV for Canvas Gradebook Imports from Brightspace Gradebook Exports.

-----

# Requirements

### Input Requirements

#### Source of Inputs

The D2L-Gradebook-CSV file can be obtained from a Brightspace Course through an admin account. The course must be predetermined.

#### Definition of Inputs

To obtain the correct Gradebook CSV file do the following:

1. Login to D2L/Brightspace with an administrator account.
2. Search for the course you would like to obtain a gradebook for and go to its homepage.
3. Press the **'My Grades'** Tab and press **'Grades'**.
4. Press **'Export'**.
5. Select the following **'Export Options'**:
  - **Key Field:** Both
  - **Grade Values:** Grade Scheme
  - **User Details:** Last Name & First Name
  - **Choose Grades to Export:** (select the desired assignments you would like to export, do not include **'Groups'**, **'Subtotals'**, **'Final Calculated Grade'**, or **'Final Adjusted Grade'**)
6. Press **'Export to CSV'**.

You may then edit the variable **'var d2lCSV'** located on line 1 of **main.js** to be the file path of your CSV. 
For naming conventions it is best to locate it in the local folder named **csv** (**.\d2l-gradebook-csv-to-canvas-gradebook-csv\csv**).

---

### Output Requirements
#### Destination

The created Canvas Gradebook CSV file is output to **.\d2l-gradebook-csv-to-canvas-gradebook-csv\output** under a similar name to your input file.
From here, it can be imported to a Canvas Course Gradebook; and user footwork to ensure these grades are correctly imported begins here.

#### Definition of Outputs

A **(course_name)_GradeImport_Canvas.csv** file is included in the location described above.
It includes:
- **Student Name**
- **SIS User ID** <_I-Number_>
- **SIS Login ID** <_Student Canvas Login_>
- **Root Account** <_byui.instructure.com_>
- **Assignments** <_Student's Percent Grade for Exported Assignments_>

---

### User Interface

#### Type:

User Interface does not exist for this project. The project is executed via Brightspace Gradebook Export, **main.js**, and running **node .\main.js**.

-----

## Expectations

### Timeline

### Best Mode of Contact

### Next Meeting


### Action Items
If the project is required in the future there may be extensive updates to create more user-friendly use.
#### TechOps
#### Stakeholder

-----

#### *Approved By:* 
#### *Approval Date:*
