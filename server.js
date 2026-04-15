const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/token", async (req, res) => {
  try {
    const body = new URLSearchParams({
      client_id: process.env.GUESTY_CLIENT_ID,
      client_secret: process.env.GUESTY_CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "open-api"
    });
    const r = await fetch("https://open-api.guesty.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
      body: body.toString()
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/reservations", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const url = "https://open-api.guesty.com/v1/reservations?" + new URLSearchParams(req.query);
    const r = await fetch(url, { headers: { Authorization: token, Accept: "application/json" } });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Actif sur " + PORT));
