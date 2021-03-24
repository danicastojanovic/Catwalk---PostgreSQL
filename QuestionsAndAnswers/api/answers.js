const db = require('../database/index.js');
const { Router } = require('express');
const bodyParser = require('body-parser');

const answersRouter = Router();
answersRouter.use(bodyParser.urlencoded({ extended: true}));

// Mark answer as helpful --completed
answersRouter.put('/:answer_id/helpful', (req, res) => {
  db
    .query(`UPDATE qna.answers SET answer_helpfulness = answer_helpfulness + 1 WHERE answer_id=$1`, [req.params.answer_id], (err, data) => {
      if (err) {
        res.status(500).send(err);
      }
    })
    res.status(204).end();
})

// Report answer --completed
answersRouter.put('/:answer_id/report', (req, data) => {
  db
    .query(`UPDATE qna.answers SET answer_reported = 't' WHERE answer_id=$1`, [req.params.answer_id], (err, res) => {
      if (err) {
        res.status(500).send(err);
      }
    })
    res.status(204).end();
})

module.exports = {
  answersRouter,
}