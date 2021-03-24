const {Client, Pool} = require('pg');
const fs = require('fs');

const sql = fs.readFileSync('./schema.sql').toString();

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'danica',
});

var newPool;

pool
  .query('CREATE DATABASE questionsandanswers WITH OWNER danica')
  .then(() => {
    newPool = new Pool({
      database: 'questionsandanswers',
      user: 'danica',
    })
    return newPool.query(sql)
  })
  .then(() => {
    console.log('tables created');
    return newPool.query(`COPY qna.questions FROM '/Users/Dani/work/SDC-Team-C/QuestionsAndAnswers/data/questions.csv' DELIMITER ',' CSV HEADER; SELECT setval('qna.questions_question_id_seq', (SELECT MAX(question_id) FROM qna.questions)+1);`);
  })
  .then(() => {
    console.log('questions table populated');
    return newPool.query(`COPY qna.answers FROM '/Users/Dani/work/SDC-Team-C/QuestionsAndAnswers/data/answers.csv' DELIMITER ',' CSV HEADER; SELECT setval('qna.answers_answer_id_seq', (SELECT MAX(answer_id) FROM qna.answers)+1);`)
  })
  .then(() => {
    console.log('answers table populated');
    return newPool.query(`COPY qna.photos FROM '/Users/Dani/work/SDC-Team-C/QuestionsAndAnswers/data/answers_photos.csv' DELIMITER ',' CSV HEADER; SELECT setval('qna.photos_id_seq', (SELECT MAX(id) FROM qna.photos)+1);`)
  })
  .then(() => {
    console.log('photos table populated');
  })
  .catch(e => console.error(e))
