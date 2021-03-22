const db = require('../database/index.js');
// const bodyParser = require('body-parser');
const { Router } = require('express');
const express = require('express');

const questionsRouter = Router();
questionsRouter.use(express.json());

// NEED TO DO: get questions

// Get all questions for specific product
// doesn't include reported questions
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
    .query(`SELECT qna.questions.question_id, question_body, question_date, asker_name, question_helpfulness, question_reported, qna.answers.answer_id, answer_body, answer_date, answerer_name, answer_helpfulness, photo_url FROM qna.questions LEFT JOIN qna.answers ON qna.questions.question_id=qna.answers.question_id LEFT JOIN qna.photos ON qna.answers.answer_id=qna.photos.answer_id WHERE product_id=$1 AND question_reported='f' AND answer_reported='f'`, [req.params.product_id], (err, data) => {
      if (err) {
        console.error(err);
      }
      // console.log(data.rows);
      // let answer = {
      //   "product_id": req.params.product_id.toString(),
      //   "results": []
      // };
      // let temp1 = {};
      // let temp2 = {};
      // for (let i = 0; i < data.rows.length; i++) {
      //   if ( Object.keys(temp1).includes( data.rows[i].question_id.toString() ) ) {
      //     if ( Object.keys(temp2).includes( data.rows[i].answer_id.toString() ) ) {
      //       temp2[data.rows[i].answer_id].photos.push(data.rows[i].photo_url);
      //     } else {
      //       temp2[data.rows[i].answer_id] = {
      //         "id": data.rows[i].answer_id,
      //         "body": data.rows[i].answer_body,
      //         "date": data.rows[i].answer_date,
      //         "answerer_name": data.rows[i].answerer_name,
      //         "helpfulness": data.rows[i].answer_helpfulness,
      //         "photos": data.rows[i].photo_url ? [data.rows[i].photo_url] : [],
      //       }
      //     }
      //   } else {
      //     temp1[data.rows[i].question_id] = {
      //       "question_id": data.rows[i].question_id,
      //       "question_body": data.rows[i].question_body,
      //       "question_date": data.rows[i].question_date,
      //       "asker_name": data.rows[i].asker_name,
      //       "question_helpfulness": data.rows[i].question_helpfulness,
      //       "reported": false,
      //       "answers": {},
      //     }
      //   }
      // }
      // Object.keys(temp1).sort(function(a, b) {
      //   return a - b;
      // }).forEach(q => {
      //   answer.results.push(temp1[q]);
      // })
      console.log(data.rows);
      res.status(200).end();
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

// Get answers for specific question --completed (without page, count)
questionsRouter.get('/:question_id/answers', (req, res) => {
  db
    .query(`select qna.answers.answer_id, answer_body, answer_date, answerer_name, answerer_email, answer_helpfulness, id, photo_url from qna.answers left join qna.photos on qna.photos.answer_id=qna.answers.answer_id where question_id=$1 and answer_reported='f'`, [req.params.question_id], (err, data) => {
      if (err) {
        console.error(err);
      }
      let answer = {
        "question": req.params.question_id.toString(),
        "page": 1,
        "count": 5,
        "results": []
      };
      let temp = {};
      for (let i = 0; i < data.rows.length; i++) {
        if ( Object.keys(temp).includes( data.rows[i].answer_id.toString() ) ) {
          temp[data.rows[i].answer_id].photos.push({id: data.rows[i].id, url: data.rows[i].photo_url});
        } else {
          temp[data.rows[i].answer_id] = {
            "answer_id": data.rows[i].answer_id,
            "body": data.rows[i].answer_body,
            "date": data.rows[i].answer_date,
            "answerer_name": data.rows[i].answerer_name,
            "helpfulness": data.rows[i].answer_helpfulness,
            "photos": data.rows[i].photo_url ? [{id: data.rows[i].id, url: data.rows[i].photo_url}] : [],
          }
        }

      }
      Object.keys(temp).sort(function(a, b) {
        return a - b;
      }).forEach(ans => {
        answer.results.push(temp[ans]);
      })
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