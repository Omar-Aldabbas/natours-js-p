const Tour = require('../models/tourModel')
class APIFeatures {
  // query ==> the Tour.find()
  // queryString ==> req.query
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1) Advance Filtring
    this.query = Tour.find(this.buildMongoQuery(queryObj));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt, -ratingsAverage');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  buildMongoQuery(queryObj) {
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    const raw = JSON.parse(queryStr);
    const mongoQuery = {};

    for (let key in raw) {
      if (key.includes('[')) {
        const [field, op] = key.split('[');
        const operator = op.replace(']', '');
        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field][operator] = raw[key];
      } else {
        mongoQuery[key] = raw[key];
      }
    }

    return mongoQuery;
  }
}

module.exports = APIFeatures;
