const { Router } = require('express');
const { validateBody } = require('../middlewares/validate');
const { loginSchema } = require('../validations/user.validation');
const { login } = require('../controllers/user.controller');

const router = Router();

router.post('/login', validateBody(loginSchema), login);

module.exports = router;
