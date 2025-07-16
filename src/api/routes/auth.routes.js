const express = require('express');
const passport = require('passport');
const router = express.Router();
const { registerUser, loginUser, googleCallback } = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);

// Rota de Autenticação com Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rota de Callback do Google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);


module.exports = router;