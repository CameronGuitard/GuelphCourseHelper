import express from 'express';
import compression from 'compression';
import cors from 'cors';

import routes from './routes';
import { scrape } from './crons';
import { createAndFillCourses, createAndFillMajors, makeQuery } from './dbconfig/dbcommands';
import { scrapeMajors } from './majorScraper';

const app = express();
const PORT = 8080;
const BASE_URL = '/api';

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup middleware
app.use(cors());
app.options('*', cors()); // configure cors properly if we want to when productionalizing

// middleware request logging
app.use((req, res, next) => {
  const current_datetime = new Date();
  // prettier-ignore
  const formatted_date = `${current_datetime.getFullYear()} - ${current_datetime.getMonth() + 1} - ${current_datetime.getDate()} ${current_datetime.getHours()}:${current_datetime.getMinutes()}:${current_datetime.getSeconds()}`;
  const method = req.method;
  const url = req.url;
  const status = res.statusCode;
  const log = `[${formatted_date}] ${method}:${url} ${status} - ${req.get('host')}`;
  console.log(log);
  next();
});

// set routes
app.use(BASE_URL, routes);

// setup database
createAndFillCourses();
createAndFillMajors();

// uncomment to scrape majors
// scrapeMajors();

// start crons
scrape.start();

app.listen(PORT, () => {
  console.log(`⚡️ Server is running at https://localhost:${PORT}`);
});
