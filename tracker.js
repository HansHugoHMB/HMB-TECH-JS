const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Page d'accueil HTML
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
            padding: 20px;
            background-color: #0D1C49;
            color: gold;
            font-family: Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
    </style>
</head>
<body>
    <div id="welcome"></div>
    <script src="/tracker.js"></script>
</body>
</html>
`;

// Code du tracker à servir
const trackerCode = `
(function() {
    // Ne pas exécuter si on visite directement le fichier
    if (window.location.pathname === '/tracker.js') return;

    // Fonction pour afficher le message de bienvenue
    function showWelcome() {
        const div = document.createElement('div');
        div.innerHTML = '<h1>✨ Bienvenue sur HMB Tech ! ✨</h1>';
        div.style.position = 'fixed';
        div.style.top = '20px';
        div.style.left = '50%';
        div.style.transform = 'translateX(-50%)';
        div.style.backgroundColor = '#0D1C49';
        div.style.color = 'gold';
        div.style.padding = '20px 40px';
        div.style.borderRadius = '10px';
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.border = '2px solid gold';
        div.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        div.style.zIndex = '9999';
        
        document.body.appendChild(div);
        
        // Retirer le message après 5 secondes
        setTimeout(() => div.remove(), 5000);
    }

    // Afficher le message de bienvenue
    showWelcome();

    // Collecter les données de visite
    fetch('https://ip-api.io/json')
        .then(res => res.json())
        .then(data => {
            const visitData = {
                ip: data.ip,
                country: data.country_name,
                region: data.region_name,
                city: data.city,
                lat: data.latitude,
                lon: data.longitude,
                isp: data.isp,
                ua: navigator.userAgent,
                time: new Date().toLocaleString()
            };

            // Envoyer les données au serveur PHP
            fetch('https://hmb-tech-php.onrender.com/tracker.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visitData)
            });
        })
        .catch(console.error);
})();
`;

// Créer le serveur
const server = http.createServer((req, res) => {
    // Configurer les headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Gérer les requêtes OPTIONS pour CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Router les requêtes
    switch (req.url) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
            break;

        case '/tracker.js':
            res.writeHead(200, { 
                'Content-Type': 'application/javascript',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });
            res.end(trackerCode);
            break;

        default:
            res.writeHead(404);
            res.end('404 Not Found');
    }
});

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`🚀 Serveur HMB Tech démarré sur le port ${PORT}`);
    console.log(`📝 Logs du serveur :`);
});

// Gérer l'arrêt propre du serveur
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Serveur arrêté proprement');
        process.exit(0);
    });
});