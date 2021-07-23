# `server`

> TODO: description

## Usage

```
const server = require('server');

// TODO: DEMONSTRATE API
```

## VM Info

Host: `ssh sysadmin@cis4250-04.socs.uoguelph.ca`
Pass: `FoamedAdmitted`

## DB Info

Postgres Login: `psql -h cis4250-04.socs.uoguelph.ca -d courses -U team4 -W`

# `cli`

_note these instructions may be out of date as they were used when this was a standalone CLI_

## Running the App

- run `npm i` in the main directory
- run `npm run dev` to start the app

- run `npm run test` to run all of the tests
- run `npm run test -- TestFileName` to run a specific test file

## Dependencies

- Ensure that `2021_courses.pdf` is in `src/assets`
- Ensure that `mappings.json` is in `src/assets`

## Contributing

### Branching

- When contributing, make sure to branch off of the latest version of `master`
- Create your branch with prefix `feature/` if it's a feature, or `bug-fix/` or `chore/` or `docs/` (depending on the type of task)
- Your branch name should have issue number and brief description of the feature or fix
- When creating your Pull/Merge Request:
  - Make sure your local `master` is up to date (if rebasing off of local)
  - Rebase off of the `master` branch
  - Push your branch to remote

### Creating a Merge Request

- Create a new merge request
- Fill out the required fields; the title and give brief description of what your PR contains
- Make sure to link the issue number in the title or description
- Request review from all team members
- Move your issue on the board to the `In PR` column

### Merging Your PR

- You need minimum 1 person from the team to review the PR
- Ideal if we can have 2 or 3 team members review the PR as well
- Otherwise once we can get minimum 1 reviewer to approve the PR you can merge the branch into master
- The branch should get automatically deleted once merged in
- Move your issue on the board to the `Closed` column

### Note

-An error will occur due to main being run when the CLI file is being imported during the unit.test.ts
-This will say that the tests will fail, but it is just an NPM error that will be dealt with during refactoring in later sprints
