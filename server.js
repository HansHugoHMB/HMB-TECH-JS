const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Page HTML améliorée avec l'inclusion du tracker
const html = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HMB Tech</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #0D1C49;
        color: gold;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: Arial, sans-serif;
        font-size: 2em;
      }
      .container {
        text-align: center;
        padding: 20px;
        border: 2px solid gold;
        border-radius: 10px;
        background-color: rgba(13, 28, 73, 0.9);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>HMB Tech</h1>
      <p>Bienvenue sur notre serveur !</p>
    </div>
    <!-- Inclusion du tracker -->
    <script src="/tracker.js"></script>
  </body>
  </html>
`;

const server = http.createServer((req, res) => {
  // Ajouter les headers CORS pour permettre l'accès depuis n'importe quel domaine
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer les requêtes OPTIONS (pre-flight CORS)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Gérer les différentes routes
  if (req.method === 'GET') {
    switch (req.url) {
      case '/':
        res.writeHead(200, { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(html);
        break;

      case '/tracker.js':
        fs.readFile(path.join(__dirname, 'tracker.js'), (err, content) => {
          if (err) {
            console.error('Erreur de lecture du tracker.js:', err);
            res.writeHead(500);
            res.end('Erreur interne du serveur');
            return;
          }
          res.writeHead(200, { 
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          });
          res.end(content);
        });
        break;

      case '/ping':
        // Route de test pour vérifier que le serveur fonctionne
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
        break;

      default:
        res.writeHead(404);
        res.end('404 Not Found');
    }
  }
  // Gérer les requêtes POST du tracker
  else if (req.method === 'POST' && req.url === '/track') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
      // Limiter la taille des données pour éviter les attaques
      if (body.length > 1e6) {
        req.connection.destroy();
      }
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Nouvelle visite détectée:', {
          time: new Date().toISOString(),
          ip: req.socket.remoteAddress,
          ...data
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          message: 'Visite enregistrée'
        }));
      } catch (err) {
        console.error('Erreur de traitement des données:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'error',
          message: 'Données invalides'
        }));
      }
    });
  }
  else {
    res.writeHead(404);
    res.end('404 Not Found');
  }
});

// Gestion des erreurs du serveur
server.on('error', (err) => {
  console.error('Erreur serveur:', err);
});

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`Serveur HMB Tech actif sur le port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});

// Gestion propre de l'arrêt du serveur
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Serveur arrêté proprement');
    process.exit(0);
  });
});