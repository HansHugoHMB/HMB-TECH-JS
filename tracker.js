(function() {
    const showMessage = () => {
        const div = document.createElement('div');
        div.innerText = "✨ Bienvenue sur HMB Tech ! ✨";
        div.style.position = "fixed";
        div.style.top = "20px";
        div.style.left = "50%";
        div.style.transform = "translateX(-50%)";
        div.style.backgroundColor = "#0D1C49";
        div.style.color = "gold";
        div.style.padding = "20px 40px";
        div.style.borderRadius = "10px";
        div.style.fontFamily = "Arial, sans-serif";
        div.style.border = "2px solid gold";
        div.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        div.style.zIndex = "9999";
        
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 5000);
    };

    fetch('https://ip-api.io/json')
        .then(res => res.json())
        .then(data => {
            showMessage();
            
            fetch('https://hmb-tech-php.onrender.com/tracker.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ip: data.ip,
                    country: data.country_name,
                    region: data.region_name,
                    city: data.city,
                    lat: data.latitude,
                    lon: data.longitude,
                    isp: data.isp,
                    ua: navigator.userAgent,
                    time: new Date().toLocaleString()
                })
            });
        })
        .catch(console.error);
})();