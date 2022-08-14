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

const client = new Client({
    user: settings.user,
    password: settings.password,
    database: settings.database,
    host: settings.host,
    port: settings.port
});

(async () => {
    await client.connect();
})();

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

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let id = 0;

    let checkArgs = async (username, password) => {
        const selectResult = await client.query(`SELECT id from users where username = '${username}' and password = '${md5(password)}'`);

        let exist = false;
        if (selectResult.rows.length !== 0) {
            exist = true;
            id = selectResult.rows[0].id;
        }

        return exist;
    }

    (async () => {
        let result = await checkArgs(username, password)

        if (result) {
            let session = req.session;
            session.userid = id;
            session.username = username;

            res.redirect('/paint');
        } else {
            res.render(__dirname + '/static/views/login.html', {error: 1});
        }
    })();
});

app.get('/paint', (req, res) => {
    let session = req.session;
    if (session.userid) {
        res.sendFile(__dirname + '/static/views/paint.html');
    } else {
        res.redirect("/login");
    }
});

app.listen(port, () => console.log(`This app is listening on port ${port}`));
