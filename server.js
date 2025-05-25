// tracker.js
(function(){
  fetch('https://ip-api.io/json')
    .then(res => res.json())
    .then(data => {
      const payload = {
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
      
      fetch('https://tonsite.com/tracker.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
    });
})();

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
