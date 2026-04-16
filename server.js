app.post("/token", async (req, res) => {
  try {
    // Essai 1: JSON
    let r = await fetch("https://open-api.guesty.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        clientId: process.env.GUESTY_CLIENT_ID,
        clientSecret: process.env.GUESTY_CLIENT_SECRET,
        grantType: "client_credentials"
      })
    });
    let data = await r.json();
    
    // Si pas de token, essai 2: form-urlencoded
    if (!data.access_token) {
      const body = new URLSearchParams({
        client_id: process.env.GUESTY_CLIENT_ID,
        client_secret: process.env.GUESTY_CLIENT_SECRET,
        grant_type: "client_credentials",
        scope: "open-api"
      });
      r = await fetch("https://open-api.guesty.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
        body: body.toString()
      });
      data = await r.json();
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
