const leanVirtuals = require('mongoose-lean-virtuals');

const globalSettingsPlugin = (schema) => {
  schema.set('timestamps', true);
  schema.set('versionKey', false);

  schema.virtual('id').get(function () {
    return this._id.toHexString();
  });

  const transformFunction = (doc, ret) => {
    return ret;
  };

  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: transformFunction,
  });

  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: transformFunction,
  });

  schema.plugin(leanVirtuals);
};

module.exports = { globalSettingsPlugin };
