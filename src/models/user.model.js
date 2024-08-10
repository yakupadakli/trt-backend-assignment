const mongoose = require('mongoose');

const { globalSettingsPlugin } = require('../utils/plugins');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String },
  surname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.plugin(globalSettingsPlugin);

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
