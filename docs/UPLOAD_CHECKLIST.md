# Private Repository Upload Checklist

Use this checklist before the first commit and push.

## Before Commit

- Confirm the repository name, for example `lk-design-system`.
- Keep the root folder contents together. Static cards depend on relative paths.
- Review `readme.md` for the intended private-repo description.
- Keep `docs/original-mojibake/` until the team is comfortable that no useful original text was lost.
- Decide later whether `scratch/`, `screenshots/`, and `uploads/` should remain in the long-term repo. They are currently retained.

## Git Setup

Recommended first-time commands from this folder:

```powershell
git init
git add .
git commit -m "Add LK design system export"
git branch -M main
git remote add origin <private-repo-url>
git push -u origin main
```

If the remote repository already exists and has commits, pull or clone it first instead of forcing this folder over it.

## After Upload

- Open the repo page and confirm the README renders correctly.
- Confirm images, fonts, and `.thumbnail` files were committed.
- Open a few HTML cards from the repo checkout to verify relative paths still work.
- Decide whether to turn this artifact repository into a package repository. If yes, add `package.json`, build scripts, dependency declarations, and explicit exports.
