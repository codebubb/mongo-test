var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const passport = require('passport');

router.get('/secret', ensureLoggedIn(), (req, res, next) => {
  res.send('Secret area');
});

router.get('/login', (req, res, next) => {
  res.render('login');
})

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res, next) => {
    res.redirect('/secret');
  }
);

/* GET home page. */
router.get('/', (req, res, next) => {
  const users = req.app.locals.users;
  users
    .find({})
    .toArray()
    .then(data => res.json(data));
});

router.post('/', (req,res, next) => {
  const users = req.app.locals.users;
  const document = req.body;
  users
    .insert(document)
    .then(data => res.json(data));
});

router.get('/:id', (req, res, next) => {
  const users = req.app.locals.users;
  const id = ObjectId(req.params.id);
  users
    .findOne({ _id: id })
    .then(data => res.json(data));
});

router.patch('/:id/languages', (req,res, next) => {
  const users = req.app.locals.users;
  const id = ObjectId(req.params.id);
  const languages = req.body.languages;
  users
    .updateOne({ _id: id }, { $set: { languages: languages }})
    .then(data => res.json(data));
});

router.put('/:id', (req,res, next) => {
  const users = req.app.locals.users;
  const id = ObjectId(req.params.id);
  const document = req.body;
  users
    .replaceOne({ _id: id }, document)
    .then(data => res.json(data));
});

router.delete('/:id', (req,res, next) => {
  const users = req.app.locals.users;
  const id = ObjectId(req.params.id);
  users
    .deleteOne({ _id: id })
    .then(data => res.json(data));
});



module.exports = router;
