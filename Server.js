const express = require(“express”);
const cors = require(“cors”);
const path = require(“path”);
const app = express();

app.use(cors());
app.use(express.json());

// Servir le dashboard HTML
app.use(express.static(path.join(__dirname)));

// POST /token — obtenir le token Guesty
app.post(”/token”, async (req, res) => {
try {
const { clientId, clientSecret } = req.body;
const r = await fetch(“https://open-api.guesty.com/oauth2/token”, {
method: “POST”,
headers: { “Content-Type”: “application/json”, “Accept”: “application/json” },
body: JSON.stringify({ clientId, clientSecret, grantType: “client_credentials” })
});
const data = await r.json();
res.json(data);
} catch (e) {
res.status(500).json({ error: e.message });
}
});

// GET /reservations — fetcher les réservations
app.get(”/reservations”, async (req, res) => {
try {
const token = req.headers.authorization;
const url = `https://open-api.guesty.com/v1/reservations?${new URLSearchParams(req.query)}`;
const r = await fetch(url, {
headers: { Authorization: token, Accept: “application/json” }
});
const data = await r.json();
res.json(data);
} catch (e) {
res.status(500).json({ error: e.message });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dashboard Guesty actif sur port ${PORT}`));
