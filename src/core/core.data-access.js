const assert = require('assert');

class BaseDataAccess {
  constructor(BaseModel) {
    assert(BaseModel, 'BaseModel is required');

    this.BaseModel = BaseModel;
    this.populateOptions = [];
  }

  async _getAll(query = {}) {
    return this.BaseModel.find(query)
      .populate(this.populateOptions)
      .lean({ virtuals: true })
      .exec();
  }

  async _getAllPaginated(query = {}, options = {}) {
    options.populate = this.populateOptions;
    options.lean = { virtuals: true };
    return this.BaseModel.paginate(query, options);
  }

  async _get(query) {
    return this.BaseModel.findOne(query)
      .populate(this.populateOptions)
      .lean({ virtuals: true })
      .exec();
  }

  async _update(query, updateQuery) {
    return this.BaseModel.findOneAndUpdate(query, updateQuery)
      .lean({ virtuals: true })
      .exec();
  }

  async _delete(query) {
    return this.BaseModel.deleteOne(query).exec();
  }

  async _create(data) {
    return this.BaseModel.create(data);
  }
}

module.exports = BaseDataAccess;
