const db = require('../database/index.js');
// const bodyParser = require('body-parser');
const { Router } = require('express');
const express = require('express');

const questionsRouter = Router();
questionsRouter.use(express.json());

// NEED TO DO: get questions, get answers, post answer

// Get all questions for specific product
// Pagination?
// GET /qa/questions
// parameters: product_id, page=1, count=5
// response: status 200
// {
//   "product_id": "17067",
//   "results": [
//       {
//           "question_id": 104598,
//           "question_body": "Does this product run big or small?",
//           "question_date": "2019-01-17T00:00:00.000Z",
//           "asker_name": "jbilas",
//           "question_helpfulness": 8,
//           "reported": false,
//           "answers": {
//               "1443570": {
//                   "id": 1443570,
//                   "body": "HideThisYouFool",
//                   "date": "2021-03-07T00:00:00.000Z",
//                   "answerer_name": "brotherBear",
//                   "helpfulness": 0,
//                   "photos": []
//               },
//               "1443575": {
//                   "id": 1443575,
//                   "body": "GarethNeedsHelp",
//                   "date": "2021-03-07T00:00:00.000Z",
//                   "answerer_name": "gareth",
//                   "helpfulness": 0,
//                   "photos": []
//               }
//           }
//       },
//     }
//   }
questionsRouter.get('/', (req, res) => {
  db
    .query(`SELECT `, [req.params.product_id, req.params.page, req.params.count], (err, data) => {
      if (err) {
        console.error(err);
      }
      res.status(200).json(res);
    })
})

// Add a questions -- completed
questionsRouter.post('/', (req, res) => {
  db
    .query(`INSERT INTO qna.questions VALUES (DEFAULT, $1, $2, CURRENT_DATE, $3, $4, 'f', 0)`, [req.body.product_id, req.body.body, req.body.name, req.body.email], (err, data) => {
      if (err) {
        console.error(err);
      }
    })
  res.status(201).send('Created');
})

// Mark question as helpful --completed
questionsRouter.put('/:question_id/helpful', (req, res) => {
  db
    .query(`UPDATE qna.answers SET question_helpfulness = question_helpfulness + 1 WHERE question_id=$1`, [req.params.question_id], (err, data) => {
      if (err) {
        console.error(err);
      }
    })
    res.status(204).end();
})

// Report question --completed
questionsRouter.put('/:question_id/report', (req, res) => {
  db
    .query(`UPDATE qna.questions SET question_reported = 't' WHERE question_id=$1`, [req.params.question_id], (err, data) => {
      if (err) {
        console.error(err);
      }
    })
    res.status(204).end();
})

// GET /qa/questions/:question_id/answers
// query parameters: page=1, count=5
// response: status 200
// {
//   "question": "104598",
//   "page": 1,
//   "count": 5,
//   "results": [
//       {
//           "answer_id": 1443570,
//           "body": "HideThisYouFool",
//           "date": "2021-03-07T00:00:00.000Z",
//           "answerer_name": "brotherBear",
//           "helpfulness": 0,
//           "photos": []
//       },
//       {
//           "answer_id": 1443575,
//           "body": "GarethNeedsHelp",
//           "date": "2021-03-07T00:00:00.000Z",
//           "answerer_name": "gareth",
//           "helpfulness": 0,
//           "photos": []
//       }
//   ]
// }
questionsRouter.get('/:question_id/answers', (req, res) => {
  db
    .query(`SELECT * FROM qna.answers INNER JOIN qna.photos ON qna.answers.answer_id=qna.photos.answer_id WHERE question_id=$1 AND answer_reported='f'`, [req.params.question_id], (err, data) => {
      if (err) {
        console.error(err);
      }
      let answer = {
        "question": req.params.question_id.toString(),
        "page": 1,
        "count": 5,
        "results": []
      };
      for (let i = 0; i < data.rows.length; i++) {
        answer.results.push({
          "answer_id": data.rows[i].answer_id,
          "body": data.rows[i].answer_body,
          "date": data.rows[i].answer_date,
          "answerer_name": data.rows[i].answerer_name,
          "helpfulness": data.rows[i].answer_helpfulness,
          "photos": data.rows[i].photo_url, // have to create array with query
        })
      }
      // console.log(data);
      res.status(200).json(answer);
    })
})

// Add an answer with photos --completed
questionsRouter.post('/:question_id/answers', (req, res) => {
  db
    .query(`INSERT INTO qna.answers VALUES (DEFAULT, $1, $2, CURRENT_DATE, $3, $4, 'f', 0) RETURNING answer_id`, [req.params.question_id, req.body.body, req.body.name, req.body.email], (err, data) => {
      if (err) {
        console.error(err);
      } else {
        for (let i = 0; i < req.body.photos.length; i++) {
          db.query(`INSERT INTO qna.photos VALUES (DEFAULT, $1, $2)`, [data.rows[0].answer_id, req.body.photos[i]], (err, data2) => {
            if (err) {
              console.error(err);
            }
          })
        }
      }
    })
  res.status(201).send('Created');
})

module.exports = {
  questionsRouter,
}