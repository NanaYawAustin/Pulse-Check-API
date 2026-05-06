const express = require("express");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(port, () => {
  console.log(`Pulse-Check-API listening on http://localhost:${port}`);
});
