require('dotenv').config();
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');
require('./middleware/auth.js')();

const port = process.env.PORT;

const app = express();
app.use(passport.initialize());
app.use(bodyParser.json());

let posts_ = [];

app.get(
  '/posts',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = req.user;
    const posts = posts_.filter((post) => post.createdBy === user.sub);
    res.json(posts);
  },
);

app.get(
  '/posts/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const post = posts_.find(
      (post) => post.id === id && post.createdBy === user.sub,
    );
    if (!post) throw Error(`Post with id ${id} does not exist!`);

    res.json(post);
  },
);

app.post(
  '/posts',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = req.user;
    const text = req.body.text;
    const post = {
      id: randomUUID(),
      createdBy: user.sub,
      text: text,
    };
    posts_.push(post);

    res.status(201).json(post);
  },
);

app.patch(
  '/posts/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const text = req.body.text;
    const post = posts_.find(
      (post) => post.id === id && post.createdBy === user.sub,
    );
    if (!post) throw Error(`Post with id ${id} does not exist!`);

    post.text = text;

    res.json(post);
  },
);

app.delete(
  '/posts/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.params.id;
    const user = req.user;
    posts_ = posts_.filter(
      (post) => post.id === id && post.createdBy === user.sub,
    );

    res.sendStatus(200);
  },
);

app.listen(port, () => {
  console.log(`Posts-API listening on port ${port}`);
});

