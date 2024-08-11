const mongoose = require('mongoose');

const { globalSettingsPlugin } = require('../utils/plugins');
const { TASK_STATUSES } = require('../constants');

const { Schema } = mongoose;

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, required: true },
  status: {
    type: String,
    enum: Object.values(TASK_STATUSES),
    default: TASK_STATUSES.PENDING,
  },
  dueDate: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

TaskSchema.plugin(globalSettingsPlugin);

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;
