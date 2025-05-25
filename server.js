(function () {
  const showWelcome = () => {
    const div = document.createElement('div');
    div.innerText = "Bienvenue sur notre site !";
    div.style.position = "fixed";
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.backgroundColor = "#0D1C40";
    div.style.color = "gold";
    div.style.padding = "20px";
    div.style.borderRadius = "10px";
    div.style.fontFamily = "Arial, sans-serif";
    div.style.zIndex = "9999";
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
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
  };

  const trackVisitor = () => {
    fetch('https://ip-api.io/json')
      .then(res => res.json())
      .then(data => {
        sendVisit(data);
        showWelcome();
      });
  };

  trackVisitor();
})();