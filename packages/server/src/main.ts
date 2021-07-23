import program from 'commander';
import clear from 'clear';
import figlet from 'figlet';
import chalk from 'chalk';
import ora from 'ora';
import { getInput } from './cli';
import { setupUniversity } from './parsing';
import { scrapeWebAdvisor } from './scraper';
import { version } from './utility';

// always commit at latest version
import scrapedCourseInfo from './assets/scrapedCourseInfo.json';
/**
 * The main code that gets run on startup
 * Does some of the parsing of the pdf, and calls the command line interface
 */
export async function main(): Promise<void> {
  // spinners
  const dataStructureSpinner = ora('Setting up Guelph Data Structure');
  const webAdvisorScraperSpinner = ora('Guelph courses are out of date. Scraping new course info');

  try {
    // continue to create cli
    clear();
    console.log(chalk.red(figlet.textSync('Course Parser', { horizontalLayout: 'full' })));

    program
      .version(version)
      .description('Course parser Command Line Interface')
      .option('lookup', 'Lookup a specific course\t-\tEx. lookup CIS*4250')
      .option('overview', 'Overview of all courses\t-\tEx. overview CIS')
      .option('quit', 'Quit the command line interface')
      .parse(process.argv);

    if (!process.argv.slice(2).length) {
      program.outputHelp();
      console.log('\n');
    }

    // TODO: we will probably have to pass this into setupUniversity()?
    const rawScrapedCourseData = scrapedCourseInfo;

    // scrape new web advisor courses if last scrape was more than a day ago
    const lastScraped = new Date(rawScrapedCourseData.lastScraped);
    const oneDay = 24 * 60 * 60 * 1000;
    if (lastScraped.getTime() + oneDay < new Date().getTime()) {
      webAdvisorScraperSpinner.start();
      // overwrite the old imported data with the newly scraped data
      await scrapeWebAdvisor();
      webAdvisorScraperSpinner.succeed();
    }

    // main university data structure that holds all course information
    dataStructureSpinner.start();
    const guelph = await setupUniversity();
    dataStructureSpinner.succeed();

    let continueProgram = true;
    while (continueProgram) {
      continueProgram = await getInput(guelph);
    }
  } catch (error) {
    dataStructureSpinner.fail();
    webAdvisorScraperSpinner.fail();
    console.log(chalk.red('Error running course parser program'), error);
  }
}

main();
