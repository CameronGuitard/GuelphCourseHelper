import puppeteer from 'puppeteer';
import { getInput } from '../src/cli';
import { version } from '../src/utility';
import { mockUniversity } from './mock-data/mocks';

jest.mock('readline-sync', () => ({
  question: () => cliInput,
}));

let cliInput = '';
let programOutput = '';
// override console.log to catch program output
console.log = data => {
  programOutput += data;
};

beforeEach(() => {
  programOutput = '';
});

describe('test basic commands and error handling', () => {
  test('test invalid input', async () => {
    cliInput = '';
    await getInput(mockUniversity);
    expect(programOutput).toBe('Invalid command!');
    programOutput = '';

    cliInput = 'asdfsadfa';
    await getInput(mockUniversity);
    expect(programOutput).toBe('Invalid command!');
  });

  test('version command', async () => {
    cliInput = '-v';
    await getInput(mockUniversity);
    expect(programOutput).toBe(version);
    programOutput = '';

    cliInput = '-V';
    await getInput(mockUniversity);
    expect(programOutput).toBe(version);
    programOutput = '';

    cliInput = '--version';
    await getInput(mockUniversity);
    expect(programOutput).toBe(version);
  });

  test('help command', async () => {
    cliInput = 'help';
    await getInput(mockUniversity);
    expect(programOutput).toContain(
      'This is a program designed to provide a convenient way to lookup the important information of any course or department at the University of Guelph.',
    );
    programOutput = '';

    cliInput = '-h';
    await getInput(mockUniversity);
    expect(programOutput).toContain(
      'This is a program designed to provide a convenient way to lookup the important information of any course or department at the University of Guelph.',
    );
    programOutput = '';

    cliInput = '--help';
    await getInput(mockUniversity);
    expect(programOutput).toContain(
      'This is a program designed to provide a convenient way to lookup the important information of any course or department at the University of Guelph.',
    );
  });

  test('quit command', async () => {
    cliInput = 'help';
    let isRunning = await getInput(mockUniversity);
    expect(isRunning).toBe(true);

    cliInput = 'quit';
    isRunning = await getInput(mockUniversity);
    expect(isRunning).toBe(false);

    cliInput = 'exit';
    isRunning = await getInput(mockUniversity);
    expect(isRunning).toBe(false);
  });
});

describe('test overview command', () => {
  test('invalid overview command', async () => {
    cliInput = 'overview';
    await getInput(mockUniversity);
    expect(programOutput).toContain('You must specify a valid subject area');
  });

  test('overview of CIS courses capitalized', async () => {
    cliInput = 'overview CIS';
    await getInput(mockUniversity);
    // first and last course in mock
    expect(programOutput).toContain('CIS*1500 - Introduction to Programming');
    expect(programOutput).toContain('CIS*2520 - Data Structures and Algorithms');
  });

  test('overview of CIS courses not capitalized', async () => {
    cliInput = 'overview cis';
    await getInput(mockUniversity);
    expect(programOutput).toContain('CIS*1500 - Introduction to Programming');
    expect(programOutput).toContain('CIS*2520 - Data Structures and Algorithms');
  });
});

describe('web advisor scraper', () => {
  jest.setTimeout(70000);
  jest.retryTimes(3);
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  test('try to parse info from web advisor', async () => {
    page = await browser.newPage();

    // remove default page timeout as this could take a long time
    await page.setDefaultNavigationTimeout(0);

    // navigate to main web advisor page
    const webAdvisorResponse = (await page.goto('https://webadvisor.uoguelph.ca')).status();
    expect(webAdvisorResponse).toBe(200);
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // select student tab
    const studentTabResponse = await Promise.all([
      page.click('#sidebar > div > div.subnav > ul > li:nth-child(2) > a'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    expect(studentTabResponse[1].status()).toBe(200);

    // select search for sections tab
    const sectionsTabResponse = await Promise.all([
      page.click('#sidebar > div > ul:nth-child(2) > li > a'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    expect(sectionsTabResponse[1].status()).toBe(200);

    // fill out query info
    await Promise.all([
      // W21 term
      page.select('#VAR1', 'W21'),
      // location to Guelph
      page.select('#VAR6', 'G'),
      // narrow testing query
      page.select('#LIST_VAR1_1', 'CIS'),
      page.select('#LIST_VAR2_1', '400'),
    ]);
    await page.evaluate(() => {
      (<HTMLInputElement>document.querySelector('#LIST_VAR3_1')).value = '4250';
    });

    // hit submit
    const submitResponse = await Promise.all([
      page.click('#content > div.screen.WESTS12A > form > div > input'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    expect(submitResponse[1].status()).toBe(200);

    // this is evaluated in the browser
    const courseInfo = await page.evaluate(() => {
      const courses = document.querySelectorAll('#GROUP_Grp_WSS_COURSE_SECTIONS > table > tbody > tr');
      const courseColumns = (<HTMLTableRowElement>courses[2]).cells;
      return [
        courseColumns[1].innerText,
        courseColumns[2].innerText,
        courseColumns[3].innerText,
        courseColumns[4].innerText,
        courseColumns[5].innerText,
        courseColumns[6].innerText,
        courseColumns[8].innerText,
        courseColumns[10].innerText,
      ];
    });

    expect(courseInfo[0]).toBe('Winter 2021');
    expect(courseInfo[1]).toBe('Open');
    expect(courseInfo[2]).toBe('CIS*4250*01 (5309) Software Design V');
    expect(courseInfo[3]).toBe('Guelph');
    expect(courseInfo[4]).toBe(
      'LAB Tues, Thur\n08:30AM - 09:50AM\nAD-S, Room VIRTUAL\nLAB Tues, Thur\n11:30AM - 12:50PM\nAD-S, Room VIRTUAL',
    );
    expect(courseInfo[5]).toBe('G. Klotz');
    expect(courseInfo[6]).toBe('0.50');
    expect(courseInfo[7]).toBe('Undergraduate');

    await browser.close();
  });
});
