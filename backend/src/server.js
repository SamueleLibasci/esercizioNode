var express = require("express");
var path = require("path");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../../frontend/public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/about.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/contact.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/signup.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/login.html"));
});

app.get("/weather", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/weather.html"));
});

app.post('/weather', async (req, res) => {
    const city = String(req.body.city || '').trim();

    if (!city) {
        return res.status(400).json({
            ok: false,
            message: 'Inserisci il nome di una città.'
        });
    }

    try {
        const apiKey = process.env.OPENWEATHER_API_KEY || '11285f08bb363a34dda96432d5c6eb8b';
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=it`
        );
        const data = await response.json();

        if (!response.ok || data.cod !== 200) {
            return res.status(response.status || 400).json({
                ok: false,
                message: data.message || 'Città non trovata.'
            });
        }

        return res.json({
            ok: true,
            city: data.name,
            condition: data.weather[0].description,
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            wind: data.wind.speed,
            message: `Meteo a ${data.name}: ${data.weather[0].description} con ${Math.round(data.main.temp)}°C.`
        });
    } catch (error) {
        console.error('Weather API error:', error);
        return res.status(500).json({
            ok: false,
            message: 'Errore nel server durante la richiesta meteo.'
        });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        res.send('Login è avvenuto con successo!');
    } else {
        res.send('Login fallito. <br> Username inserito: ' + username + ' <br> Password inserita: ' + password + '.');
    }
});

app.listen(port, () => {
    console.log("Server in ascolto alla porta " + port);
    console.log('accedi all indirizzo http://localhost:' + port);
});