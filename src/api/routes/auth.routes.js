const express = require('express');
const passport = require('passport');
const router = express.Router();

const authenticateJWT = require('../middlewares/authenticateJWT');
const {
  registerUser,
  loginUser,
  googleCallback,
  getProfile,
} = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

// Registro e Login
router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);

// Rota protegida JWT para pegar perfil do usuário
router.get('/profile', authenticateJWT, getProfile);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

module.exports = router;
