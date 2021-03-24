const app = require('express')();
const {apiRouter} = require('./api');

app.use('/', apiRouter);
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/loaderio-3dbd58a25d92a3a80036a99801e927a3/', (req, res) => res.send('loaderio-3dbd58a25d92a3a80036a99801e927a3'));

app.listen(3000);
