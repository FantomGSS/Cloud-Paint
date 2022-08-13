const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const md5 = require('md5');
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const client = new Client({
    user: '****',
    host: '****',
    database: '****',
    password: '****',
    port: ****
});

(async () => {
    await client.connect();
})();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
});

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let checkArgs = async (username, password) => {
        const res = await client.query(`SELECT id from users where username = '${username}' and password = '${md5(password)}'`);

        let exist = false;
        if (res.rows.length !== 0) {
            exist = true;
        }

        return exist;
    }

    (async () => {
        let result = await checkArgs(username, password)

        if (result) {
            res.send("Success!");
        } else {
            res.render(__dirname + '/static/login.html', {error: 1});
        }
    })();
});

app.listen(port, () => console.log(`This app is listening on port ${port}`));
