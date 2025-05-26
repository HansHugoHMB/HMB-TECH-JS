(function () {
  const showMessage = (message, isError = false) => {
    const div = document.createElement('div');
    div.innerText = message;
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.left = "50%";
    div.style.transform = "translateX(-50%)";
    div.style.backgroundColor = "#0D1C49";
    div.style.color = "gold";
    div.style.padding = "20px 40px";
    div.style.borderRadius = "10px";
    div.style.fontFamily = "Arial, sans-serif";
    div.style.zIndex = "9999";
    div.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    div.style.border = "2px solid gold";
    document.body.appendChild(div);

    setTimeout(() => div.remove(), 5000);
  };

  const sendVisit = (data) => {
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
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        showMessage('✨ Bienvenue sur HMB Tech ! ✨');
      } else {
        showMessage('Une erreur est survenue', true);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showMessage('Une erreur est survenue', true);
    });
  };

  const trackVisitor = () => {
    fetch('https://ip-api.io/json')
      .then(res => res.json())
      .then(data => {
        sendVisit(data);
      })
      .catch(error => {
        console.error('Error fetching IP data:', error);
        showMessage('Une erreur est survenue lors du chargement', true);
      });
  };

  trackVisitor();
})();