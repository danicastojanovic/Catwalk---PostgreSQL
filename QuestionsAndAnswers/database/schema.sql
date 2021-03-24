CREATE SCHEMA qna;

CREATE TABLE qna.questions (
  question_id serial primary key,
  product_id int,
  question_body varchar(500),
  question_date date,
  asker_name varchar(80),
  asker_email varchar(80),
  question_reported boolean,
  question_helpfulness int
);

CREATE TABLE qna.answers (
  answer_id serial primary key,
  question_id int references qna.questions(question_id),
  answer_body varchar(500),
  answer_date date,
  answerer_name varchar(80),
  answerer_email varchar(80),
  answer_reported boolean,
  answer_helpfulness int
);

CREATE TABLE qna.photos (
  id serial primary key,
  answer_id int references qna.answers(answer_id),
  photo_url varchar(500)
);

CREATE INDEX product ON qna.questions(product_id);
CREATE INDEX question ON qna.answers(question_id);
CREATE INDEX answer ON qna.photos(answer_id);