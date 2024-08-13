const { Router } = require('express');
const { validateBody } = require('../middlewares/validate');
const {
  loginSchema,
  registerSchema,
  changePasswordSchema,
} = require('../validations/user.validation');
const {
  login,
  register,
  profile,
  changePassword,
} = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth');

const router = Router();

router.post('/login', validateBody(loginSchema), login);
router.post('/register', validateBody(registerSchema), register);

router.get('/profile', authenticate, profile);
router.patch(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  changePassword,
);

module.exports = router;
