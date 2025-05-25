const http = require('http');

const PORT = process.env.PORT || 3000;

const html = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Bienvenue</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #0D1C40;
        color: gold;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: sans-serif;
        font-size: 2em;
      }
    </style>
  </head>
  <body>
    Bienvenue sur le serveur HMB-Tech !
  </body>
  </html>
`;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  else if (req.method === 'POST' && req.url === '/tracker') {
    let body = '';

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Visiteur:', data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'OK' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'Erreur', message: err.message }));
      }
    });
  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Serveur actif sur le port ${PORT}`);
});