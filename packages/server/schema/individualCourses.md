## Overall Idea
The following information is the strategy for parsing courses:

When a subject area section is met, it will take note of the course letter code. An example of this is ACCT for the accounting subject area.

String split can be used to accomplish the line parsing

## First line parsing
When a line starts with the noted course letter code, a new course will be made for that subject area.

The first string in the line that matches the letter code will be stored as the classes course code. 

Next, the description will be set to the string until one ofthe following end line is matched, not including the match(or quotes): "F," "W," "S," "U," "F (" "W (" "S (" "U (
After this, the string within the brackets () will be stored as the lecLabs.

Next, the number within the brace brackets [] at the end of the line will be set to the weight.


## Rest of course information parsing

After the first line is parsed into the different information, the rest of the course will be parsed the following way.

Until the keywords (Prerequisite(s), Equate(s), Department(s), Offering(s), Restriction(s), Co-requisite(s)) are found at the beginning of the line, each line will be appended
to the desciption of the course.

When a keyword is matched, it will get the string after the ":" in the line and set it to the respective keyword.

After the department(s) keyword is found, it will create the course object with the gathered information and move onto the next course.

