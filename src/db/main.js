const { Pool, Client } = require('pg')
// const pool = new Pool({
//     user: 'unfriend',
//     host: 'localhost',
//     database: 'postgres',
//     password: '',
//     port: 5432,
// })
// pool.query('SELECT NOW()', (err, res) => {
// pool.query('SELECT * from article', (err, res) => {
//     // console.log(err, res)
//     console.log(res)
//     pool.end()
// })
const client = new Client({
    user: 'unfriend',
    host: 'localhost',
    database: 'postgres',
    password: '',
    port: 5432,
})
client.connect()
// client.query('SELECT NOW()', (err, res) => {
const salary = Math.round(Math.random() * 100000) + 100;
client.query(`INSERT INTO employee VALUES (400,'Nisha','Marketing',${salary});`, (err, res) => {
    // console.log(res.rows)
    // console.log(err, res)
    // client.end()
})
client.query('SELECT * from employee', (err, res) => {
    console.log(res.rows)
    // console.log(err, res)
    client.end()
})

