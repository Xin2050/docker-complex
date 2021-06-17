const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mysql = require('mysql2');

const pool = new mysql.createPool({
    user: keys.MYSQLUser,
    host: keys.MYSQLHost,
    database: keys.MYSQLDatabase,
    password: keys.MYSQLPassword,
    port: keys.MYSQLPort,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


pool.getConnection((err,conn) => {
    conn.query("CREATE TABLE IF NOT EXISTS `values` (`number` INT)")
    pool.releaseConnection(conn);
});

const promisePool = pool.promise();

const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
    res.send("Hi");
});

app.get('/values/all', async (req, res) => {
    const [rows,fields] = await promisePool.query('SELECT * FROM `values`');
    res.send(rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    })
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('index too high');
    }
    redisClient.hset('values', index, "Nothing yet!");
    redisPublisher.publish('insert', index);

    await promisePool.execute('INSERT INTO `values` (number) values(?)', [index]);

    res.send({working:true});
});

app.listen(5000,()=>{
    console.log('port 5000 is listening');
});
