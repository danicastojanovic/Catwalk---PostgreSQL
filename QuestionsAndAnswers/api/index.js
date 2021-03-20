const { Router } = require('express');
const { questionsRouter } = require('./questions.js');
const { answersRouter } = require('./answers.js');

const apiRouter = Router();

apiRouter.use('/qa/questions', questionsRouter);
apiRouter.use('/qa/answers', answersRouter);

module.exports = {
  apiRouter,
}