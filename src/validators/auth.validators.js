const { body } = require('express-validator');

const signupValidator = [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['student', 'instructor', 'admin'])
];

const loginValidator = [
  body('email').isEmail(),
  body('password').notEmpty()
];

module.exports = { signupValidator, loginValidator };
