const mongoose = require('mongoose');

const { globalSettingsPlugin } = require('../utils/plugins');

const TaskSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
});

TaskSchema.plugin(globalSettingsPlugin);

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;
