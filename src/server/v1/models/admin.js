
export default class CategoryModel {
  constructor(mongoose) {
    this.mongoose = mongoose;
    return this.registerSchema();
  }

  registerSchema() {
    const schema = new this.mongoose.Schema({
      email: {
        type: String,
        required: true,
      },
      displayName: {
        type: String,
      },
      token: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['inactive', 'active', 'suspended'],
        default: 'inactive',
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

    return this.mongoose.model('User', schema);
  }
}
