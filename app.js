const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const app = express();
const port = 8081;

// Set Templating Enginge
app.set('view engine', 'ejs');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Navigation
app.get('', (req, res) => {
  res.render('index');
});

app.get('/signup', (req, res) => {
  res.render('signup', { user: req.app.get('user') });
});

app.post(
  '',
  urlencodedParser,
  [
    check('first_name', 'First name is required.')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('last_name', 'Last name is required.')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('email', 'Email is not valid').isEmail().normalizeEmail(),
    check('password', 'Password field should have at least 8 characters')
      .exists()
      .isLength({ min: 8 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render('', {
        alert,
      });
    } else {
      req.app.set('user', req.body);
      return res.redirect('/signup');
    }
  }
);

app.listen(port, () => console.info(`App listening on port: ${port}`));
