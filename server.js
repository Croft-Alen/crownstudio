import { App } from './dist/server/entry.mjs';

const app = new App();
const port = process.env.PORT || 4321;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});