// tracker.js
(function(){
  // Affichage d'un message d'accueil centré
  const div = document.createElement('div');
  div.textContent = 'Bienvenue ! Suivi en cours...';
  div.style.position = 'fixed';
  div.style.top = '50%';
  div.style.left = '50%';
  div.style.transform = 'translate(-50%, -50%)';
  div.style.background = '#0D1C40';
  div.style.color = 'white';
  div.style.padding = '1em 2em';
  div.style.borderRadius = '8px';
  div.style.zIndex = '9999';
  document.body.appendChild(div);

  setTimeout(() => div.remove(), 3000); // disparaît après 3 secondes

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

      fetch(`https://hmb-tech-php.onrender.com:3000/tracker.php`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
    });
})();