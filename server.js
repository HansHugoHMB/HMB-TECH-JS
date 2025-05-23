const express = require('express');
const request = require('request');
const app = express();

// Route d'accueil
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Accueil Proxy</title>
        <style>
          body {
            margin: 0;
            height: 100vh;
            background-color: #0D1C40;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
          }
        </style>
      </head>
      <body>
        <h1>Bienvenue sur mon serveur proxy</h1>
      </body>
    </html>
  `);
});

// Proxy
app.use('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Erreur: paramètre url manquant.');

  request({ url, headers: { Host: 'www.orange.cd' } }).pipe(res);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
