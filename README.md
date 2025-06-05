# wretched-designs
Wretched Designs

## Git Hooks

This project uses a Husky pre-commit hook to automatically replace any
`{{AUTO_TIMESTAMP}}` placeholder in `TODO.md` with the current ISO time. The hook
executes `scripts/update-todo-timestamp.js` before each commit.

After cloning the repository, run `npm install` once to set up Husky. The hook
will run on every commit and update the timestamp.

## Continuous Integration

A GitHub Actions workflow verifies that `TODO.md` does not contain the timestamp
placeholder. Pull requests will fail if `{{AUTO_TIMESTAMP}}` is still present.

