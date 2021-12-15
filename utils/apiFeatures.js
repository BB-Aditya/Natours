class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    let queryObj = { ...this.queryStr };
    const excludedFields = ['path', 'fields', 'sort', 'limit', 'page'];

    excludedFields.forEach((val) => {
      delete queryObj[val];
    });
    let samp = JSON.stringify(queryObj);

    samp = samp.replace(/\b(gte|lte|gt|lt)\b/g, (el) => `$${el}`);
    queryObj = JSON.parse(samp);
    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('createdAt');
    }
    return this;
  }

  limitField() {
    if (this.queryStr.fields) {
      const field = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(field);
    } else this.query = this.query.select('-__v');
    return this;
  }

  pagination() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const toskip = (page - 1) * limit;

    this.query = this.query.skip(toskip).limit(limit);

    // console.log(Tour.countDocuments());
  
    return this;
  }
}
module.exports =  APIFeatures;