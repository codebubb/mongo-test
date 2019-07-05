var express = require('express');
var router = express.Router();
const passport = require('passport');

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.get('/secret', ensureAuthenticated, (req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.send('Secret area');
});

router.get('/login', (req, res, next) => {
  const  errors  = req.flash().error || [];
  res.render('login', { errors });
})

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.redirect('/login');
});

router.post('/login', 
  passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
  (req, res, next) => {

    res.redirect('/secret');
  }
);

module.exports = router;
