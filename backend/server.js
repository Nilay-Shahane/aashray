const app = require("./app");
const connectdb = require("./db/connectdb");
const dotenv = require("dotenv");
dotenv.config();


connectdb();

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});