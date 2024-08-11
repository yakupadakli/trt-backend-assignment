const { Router } = require('express');

const authenticate = require('../middlewares/auth');

const { validateBody } = require('../middlewares/validate');
const {
  taskCreateSchema,
  taskUpdateSchema,
} = require('../validations/task.validation');
const {
  taskList,
  taskDetail,
  taskCreate,
  taskUpdate,
  taskDelete,
} = require('../controllers/task.controller');

const router = Router();

router.use(authenticate);

router.get('/', taskList);
router.get('/:taskId', taskDetail);
router.post('/', validateBody(taskCreateSchema), taskCreate);
router.patch('/:taskId', validateBody(taskUpdateSchema), taskUpdate);
router.delete('/:taskId', taskDelete);

module.exports = router;
