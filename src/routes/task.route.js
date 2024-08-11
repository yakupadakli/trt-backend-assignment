const { Router } = require('express');

const authenticate = require('../middlewares/auth');

const { validateBody, validateQuery } = require('../middlewares/validate');
const {
  taskCreateSchema,
  taskUpdateSchema,
  taskFilterSchema,
} = require('../validations/task.validation');
const { paginateQuerySchema } = require('../validations/common.validation');
const {
  taskList,
  taskDetail,
  taskCreate,
  taskUpdate,
  taskDelete,
} = require('../controllers/task.controller');
const mongoErrorHandler = require('../middlewares/mongoErrorHandler');
const { TaskNotFoundError } = require('../errors/task.errors');

const router = Router();

router.use(authenticate);

const paginateAndFilterSchema = paginateQuerySchema.concat(taskFilterSchema);

router.get('/', validateQuery(paginateAndFilterSchema), taskList);
router.get('/:taskId', taskDetail);
router.post('/', validateBody(taskCreateSchema), taskCreate);
router.patch('/:taskId', validateBody(taskUpdateSchema), taskUpdate);
router.delete('/:taskId', taskDelete);

router.use((err, req, res, next) =>
  mongoErrorHandler(err, req, res, next, TaskNotFoundError),
);

module.exports = router;
