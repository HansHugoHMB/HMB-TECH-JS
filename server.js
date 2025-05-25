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
      
      fetch('https://hmb-tech-php.onrender.com/tracker.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
    });
})();
