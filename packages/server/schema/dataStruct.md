## Hierarchy

* Section/Subject Area (Single)
    * Department (One or More)
    * Courses (Multiple)
        * Course Code
            * Subject Area
            * Class Level
        * Offering
        * Credit Weight
        * Class Level
        * Pre-Requisites
        * Restrictions
        * Co-requisites
        * Equates


### Example

BIOL*3020 Population Genetics F (4-0) [0.50]

Section/Subject Area: Biology
Department: Department of Integrative Biology
Course Code: BIOL*3020
Offering(s): Fall
Credit Weight: 0.50
Class Level: 3000
Pre-requisite(s): MGB*2040


## Types

```
type SubjectArea = {
    department: Department[],
    courses: Course[],
}

type Course = {
    courseCode: Code,
    offering: Offering[],
    creditWeight: number,
    description: string,
    equates?: Course[],
    restrictions?: Course[],
    preRequisites?: Course[],
    coRequisites?: Course[],
}

type Code = {
    subjectArea: SubjectArea,
    classLevel: int,
}

type Department = {
    name: string,
    college: string,
}

type Offering = {
    semester: Semester,
}

enum SubjectArea = {
    BIOL = "Biology",
}

enum Offering = {
    F = "Fall",
    W = "Winter",
    S = "Summer",
    U = "Undecided",
}


```


## Data Structure

```

class University {

    name: string;
    allCourses: <subjectAreaName: string, <CourseName, Course>>

    set name(subjectName: string, course: Course) {

        if (!subjectName) {
            throw new Error("Subject name cannot be empty");
        }

        this.subjectName = subjectName;
        if ( !course.value(subjectAreaName) ) {

            new map: courseToAdd = <course.name, course>

            this.allCourse = <subjectName, courseToAdd>;

        }
        
    }

    getCourses(subjectName: name, classLevel?: number) {

        return allCourses.value(subjectName)
    }

}

```


* Search all courses by subject area
* Assign the courses object to the hashmap 
* Course name will map to the course object that has all the details of the course
* So searching for subject area will display all courses in that subject area
* And searching for course name in the course hashmap will show details of that course
