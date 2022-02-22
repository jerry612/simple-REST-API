const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const crimesRoutes = require("./routes/crimes");
app.use(express.json());
app.use("/crimes", crimesRoutes);

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
