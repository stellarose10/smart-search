import express from "express";
import { extractEntities } from "./utils/extractEntities";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Smart Search API");
});

app.get("/search", async (req, res) => {
  const searchTerm = req.query.q as string;

  if (!searchTerm) {
    return res.status(400).send("Query parameter q is required");
  }

  try {
    const entities = await extractEntities(searchTerm);
    console.log(entities, "entities");

    res.json(entities);
  } catch (error) {
    console.error("Error extracting entities:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
