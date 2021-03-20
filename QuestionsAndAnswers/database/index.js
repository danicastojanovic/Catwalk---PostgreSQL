const {Client, Pool} = require('pg');

// need to setup global variables in a file and gitignore
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'questionsandanswers',
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}
