# Project Capture Document for d2l-gradebook-csv-to-canvas-gradebook-csv
#### *Author: Seth Bolander*
#### *Stakeholder(s): Arlen Wilcock, Corey Moore*
#### *Date: March 3, 2019*


## Background

Some courses on Brightspace have grades in gradebooks that need to be imported to Canvas. This process is extremely clunky and without file conversion would require a lot of user-unfriendly labor.

-----

## Definition of Done

This project intends to create less effort to recreate a gradebook CSV for Canvas Gradebook Imports from Brightspace Gradebook Exports.

-----

# Requirements

**Note:** Teacher-level access for each Canvas course is required for whomever will import a gradebook into said course. If teacher-level access would not be given to whomever transforms a gradebook the output CSV file(s) should be delivered to someone who can be given/has teacher-level access to those courses.

### Input Requirements

#### Source of Inputs

The D2L-Gradebook-CSV file can be obtained from a Brightspace Course through an admin account.

#### Definition of Inputs

To obtain the correct Gradebook CSV file read **Get D2L Gradebook CSV** under **How to Use** in [README.md](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/README.md).

---

### Output Requirements
#### Destination

The created Canvas Gradebook CSV file is output to `.\d2l-gradebook-csv-to-canvas-gradebook-csv\output` under a similar name to your input file.
From here, it can be imported to a Canvas Course Gradebook; and user footwork to ensure these grades are correctly imported begins here (more on this in [README.md](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/README.md)).

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

User Interface does not exist for this project. Read [README.md](https://github.com/byuitechops/d2l-gradebook-csv-to-canvas-gradebook-csv/blob/master/README.md) to learn how to use this project.

-----

## Expectations

### Timeline

### Best Mode of Contact

### Next Meeting


### Action Items
If the project is required in the future there may be extensive updates to create more user-friendly use.
Teacher-level access for each course is required to whomever will be importing these gradebooks into said Canvas courses.
#### TechOps
#### Stakeholder

-----

#### *Approved By:* 
#### *Approval Date:*
