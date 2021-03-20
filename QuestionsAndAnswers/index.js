const app = require('express')();
const {apiRouter} = require('./api');

app.use('/', apiRouter);
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000);
