const mongoose = require('mongoose');

const { globalSettingsPlugin } = require('../utils/plugins');

const { Schema } = mongoose;

const TaskSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

TaskSchema.plugin(globalSettingsPlugin);

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;
