const { Router } = require('express');
// const { validateBody } = require('../middlewares/validate');
// const { taskSchema, } = require('../validations/task.validation');
const { tasks } = require('../controllers/task.controller');

const router = Router();

router.get('/', tasks);

module.exports = router;
