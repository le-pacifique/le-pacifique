# Le Pacifique Studio

Standalone Sanity Studio for Le Pacifique Records.

Use Node `20.19.5` or newer compatible with the installed Sanity CLI.

From the repository root:

```bash
nvm use
npm run studio:login
npm run studio:dev
npm run studio:deploy
```

From this `studio/` folder:

```bash
npm run login
npm run dev
npm run deploy
```

Avoid running bare `sanity login`; that can hit an old globally installed CLI instead of this workspace's local CLI.

The deployed Studio host defaults to `le-pacifique.sanity.studio`.
