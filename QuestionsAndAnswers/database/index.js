const {Client, Pool} = require('pg');

// need to setup global variables in a file and gitignore
const pool = new Pool({
  host: '3.133.150.33',
  port: 5432,
  database: 'questionsandanswers',
  user: 'danica',
  password: '',
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}
