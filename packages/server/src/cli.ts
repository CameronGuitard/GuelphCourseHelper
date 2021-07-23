import chalk from 'chalk';
import * as inputline from 'readline-sync';
import { University } from './university';
import { Course } from './course';
import mapping from './mappings';
/**
 * Requests input and displays program output to the command line
 * @param {University} uni the main university data structure that classes have been parsed into
 * @returns {Boolean} determines whether the user has requested to quit yet
 */
export async function getInput(uni: University): Promise<boolean> {
  // split user input on spaces
  const input = inputline.question('\nEnter your command: ').split(' ');
  // userCommand is first command entered, userInput is array of other inputs separated by spaces
  const [userCommand, ...userInput] = input;
  const tempJoin = userInput.join(' '); //Combine rest of input to allow for names of courses to be used
  switch (userCommand.toLowerCase()) {
    // looking up a specific course
    case 'lookup':
      if (!userInput.length) {
        console.log('You must specify a valid course');
        break;
      }
      const commandValue = mapping.getCourseNameMapping(tempJoin) || tempJoin?.toUpperCase();
      if (!!!commandValue || !commandValue.match(/^[A-Za-z]+\*[0-9]+ *$/gm)) {
        console.log('Invalid Course Syntax. Try again.');
        break;
      }
      const course = uni.getSpecificCourse(commandValue);
      if (course === null) {
        console.log('The course you are searching for does not exist.');
      } else {
        console.log(chalk.blue.underline.bold(`\n${course.courseCode} - ${course.name} [${course.weight}]`));
        console.log(`${chalk.blue('Description:\t\t')}${course.description}`);
        console.log(`${chalk.blue('Semester:\t\t')}${course.semesters}`);
        console.log(`${chalk.blue('Lecture/Labs:\t\t')}${course.lecsLabs}`);
        course.offerings && console.log(`${chalk.blue('Offerings:\t\t')}${course.offerings}`);
        course.equates && console.log(`${chalk.blue('Equates:\t\t')}${course.equates}`);
        course.prerequisites && console.log(`${chalk.blue('Prerequisite(s):\t')}${course.prerequisites.fullRawPrereq}`);
        course.corequisites && console.log(`${chalk.blue('Co-requisite(s):\t\t')}${course.corequisites}`);
        course.restrictions && console.log(`${chalk.blue('Restriction(s):\t\t')}${course.restrictions}`);
        course.location && console.log(`${chalk.blue('Location(s):\t\t')}${course.location}`);
        console.log(`${chalk.blue('Department(s):\t\t')}${course.departments}`);
        course.currentSpots && console.log(`${chalk.blue('Current Spot(s):\t')}${course.currentSpots}`);
        course.totalSpots && console.log(`${chalk.blue('Total Spot(s):\t\t')}${course.totalSpots}\n`);
      }
      break;
    // looking up all courses for a subject area
    case 'overview':
      if (!userInput.length) {
        console.log('You must specify a valid subject area');
        break;
      }
      const casedSubjectName = tempJoin?.toUpperCase();
      const subjectCode = mapping.getNameMapping(casedSubjectName) || casedSubjectName;
      const courses = uni.getCoursesOfDept(subjectCode);
      if (courses.size < 1) {
        console.log('There are no courses for this subject area.');
      } else {
        courses.forEach((value: Course) => {
          console.log(`${value.courseCode} - ${value.name}`);
        });
      }
      break;
    // exporting data to graph file
    // help
    case 'help':
    case '-h':
    case '--help':
      console.log();
      console.log(chalk.blue.bold('Course Parser'));
      console.log(
        'This is a program designed to provide a convenient way to lookup the important information of any course or department at the University of Guelph.',
      );
      console.log(
        'There are four (5) commands that can be called. Lookup, Overview, Export, Version, and Help. All four (4) can be called in the command line by typing in the name of the command when the prompt shows.',
      );
      console.log();
      console.log();
      console.log(chalk.blue.bold('Lookup'));
      console.log(
        'This command will display all of the information about the course. This includes the course Code, Name, Weight, Semesters Offered, Lectures/Lab Hours, Description, Prerequisites, Restrictions, Co-Requisites, Offerings, Equates, Location, and Location.',
      );
      console.log(
        'To use this command, simply type "lookup " followed by the full course code with a star in between the letters and numbers of the code.',
      );
      console.log();
      console.log();
      console.log(chalk.blue.bold('Overview'));
      console.log(
        'This command will display all of the courses in a department, showing the Course Code and Name of the class.',
      );
      console.log('To use this command, simply type "overview " followed by the department abbreviation.');
      console.log();
      console.log();
      console.log(chalk.blue.bold('Version'));
      console.log('Calling this command simply displays the version number.');
      console.log('To use this command, simply type "version" or "-v".');
      console.log();
      console.log();
      console.log(chalk.blue.bold('Help'));
      console.log(
        'Calling this command simply displays the commands that can be entered, as well as information about the commands.',
      );
      console.log('To use this command, simply type "help" or "-h".');
      console.log();
      console.log();
      console.log(chalk.blue.bold('Quit'));
      console.log('This will terminate the program');
      console.log();

      break;
    // version of program
    case 'version':
    case '-v':
    case '--version':
      const version = '1.0.0';
      console.log(version);
      break;
    // exit program
    case 'quit':
    case 'exit':
      return false;
    // error
    default:
      console.log('Invalid command!');
  }
  return true;
}
