
export default class CategoryModel {
  constructor(mongoose) {
    this.mongoose = mongoose;
    return this.registerSchema();
  }

  registerSchema() {
    const schema = new this.mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      displayOrder: {
        type: String,
        required: true,
      },
      displayType: {
        type: String,
        required: true,
      },
      level: {
        type: String,
        required: true,
      },
      parent: {
        type: this.mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
      enable: {
        type: Boolean,
        required: true,
        default: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
      {
        timestamps: {
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
        },
      },
    );

    return this.mongoose.model('Category', schema);
  }
}
