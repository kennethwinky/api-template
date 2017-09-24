import Joi from 'joi';

export default {

  // POST /api/users
  createAdmin: {
    body: {
      email: Joi.string().required().label('電郵').options({ language: { any: { required: '{{key}}必須填寫' } } }),
      password: Joi.string().required().label('密碼').options({ language: { any: { required: '{{key}}必須填寫' } } }),
      confirmPassword: Joi.any()
        .valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: '{{key}}與密碼不相同' } } })
        .label('確認密碼'),
    },
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required(),
    },
    params: {
      userId: Joi.string().hex().required(),
    },
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  },
};
