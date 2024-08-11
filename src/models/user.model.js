const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongoosePaginate = require('mongoose-paginate-v2');

const { globalSettingsPlugin } = require('../utils/plugins');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String },
  surname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
});

UserSchema.plugin(globalSettingsPlugin);
UserSchema.plugin(mongoosePaginate);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
