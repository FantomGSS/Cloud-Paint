const settings = require('./settings');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const { Client } = require('pg');
const favicon = require('serve-favicon');
const md5 = require('md5');

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));
app.use(favicon(__dirname + '/favicon.ico'));

app.use(sessions({
    secret: "secret-key-2908-1443",
    saveUninitialized: true,
    cookie: { maxAge: settings.sessionTime },
    resave: false
}));
app.use(cookieParser());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const dbClient = new Client({
    user: settings.user,
    password: settings.password,
    database: settings.database,
    host: settings.host,
    port: settings.port
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/views/index.html');
});

app.get('/login', (req, res) => {
    let session = req.session;
    if (session.userid) {
        res.redirect('/paint');
    } else {
        res.sendFile(__dirname + '/static/views/login.html');
    }
});

app.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let id = 0;

    const selectResult = await dbClient.query(`SELECT id from users where username = '${username}' and password = '${md5(password)}'`);

    let exists = false;
    if (selectResult.rows.length !== 0) {
        exists = true;
        id = selectResult.rows[0].id;
    }

    if (exists) {
        let session = req.session;
        session.userid = id;
        session.username = username;

        res.redirect('/paint');
    } else {
        res.render(__dirname + '/static/views/login.html', {error: 1});
    }
});

app.get('/paint', (req, res) => {
    let session = req.session;
    if (session.userid) {
        res.render(__dirname + '/static/views/paint.html', {username: session.username});
    } else {
        res.redirect("/login");
    }
});

const server = app.listen(port, async () => {
    await dbClient.connect();
    console.log('Database client has connected!')

    console.log(`This app is listening on port ${port}`);
});

async function exit() {
    await dbClient.end();
    console.log('Database client has disconnected!')

    server.close(() => {
        console.log('Server closed!');
    });
}

process.on("SIGINT", exit);
process.on("SIGTERM", exit);
process.on("SIGHUP", exit);


