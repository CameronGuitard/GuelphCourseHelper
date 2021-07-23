# How to extract "Department(s):"

Note: \
-Any string that starts with "Department(s):..." will be used

Ex. "Department(s):Dean's Office, College of Arts"

# Steps to extract:
1. Split String by ':' to get ["Department(s)","Dean's Office, College of Arts"]

2. Split Second String by ',' to get ["Dean's Office","College of Arts"]


# How to extract department descriptions:

Ex.\
'The Department of Sociology and Anthropology offers three types of courses: sociology',\
'courses  with  the  prefix  SOC*;  anthropology  courses  with  the  prefix  ANTH*;  and',\
'departmental courses with the prefix SOAN*.',\
'Courses will normally be offered in the semesters designated. For information on other',\
'semesters  these  courses  will  be  offered  and  the  semesters  those  courses  without',\
'designations will be offered, please check with the department. In addition to regularly',\
'scheduled courses, students may elect to do independent study. A student who wishes to',\
'do a reading course should first consult the professor with whom they wish to work. Please',\
'note: a student is allowed a total of 1.00 credits only for reading courses.',\
'SOAN courses will be used towards the Sociology specializations.',\
'Please note: The availability of third and fourth year seminar courses will vary. Students',\
'must  check  with  the  Department  of  Sociology  and  Anthropology  to  see  when  seminar',\
'courses are available.',"

# Note: 
-based on Alex's parsing, we can use the regex expression 
```.*\*.*\[.*\]``` to identify the line at which a course begins\
-second line is the beginning of the department descriptions

# Steps to extract: 
1. create an empty string at the second line where the department description starts.
As we iterate over each line, the code will use the regex used to determine the beginning
of the course. Until that line, keep appending to the empty string created.  
