const passport = require('passport');
const { Router } = require('express');
const { validateBody } = require('../middlewares/validate');
const {
  loginSchema,
  registerSchema,
} = require('../validations/user.validation');
const { login, register } = require('../controllers/user.controller');

const router = Router();

router.post('/login', validateBody(loginSchema), login);
router.get('/login/federated/google', passport.authenticate('google'));
router.post('/registration', validateBody(registerSchema), register);

module.exports = router;
