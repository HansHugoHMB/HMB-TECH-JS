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
    // Création du payload avec les noms de champs corrects
    const payload = {
      ip: data.ip,
      country: data.country_name,    // Utilisation du bon nom de champ
      region: data.region_name,      // Utilisation du bon nom de champ
      city: data.city,
      lat: data.latitude,            // Utilisation du bon nom de champ
      lon: data.longitude,           // Utilisation du bon nom de champ
      isp: data.isp,
      ua: navigator.userAgent,
      time: new Date().toLocaleString()
    };

    // Ajout d'un console.log pour debug
    console.log('Sending payload:', payload);

    fetch('https://hmb-tech-php.onrender.com/tracker.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => console.log('Response:', data))
    .catch(error => console.error('Error:', error));
  };

  const trackVisitor = () => {
    fetch('https://ip-api.io/json')
      .then(res => res.json())
      .then(data => {
        console.log('IP API Data:', data); // Debug log
        sendVisit(data);
        showWelcome();
      })
      .catch(error => console.error('Error fetching IP data:', error));
  };

  trackVisitor();
})();