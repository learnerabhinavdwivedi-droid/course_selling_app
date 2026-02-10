const { body } = require('express-validator');

const createCourseValidator = [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('category').trim().notEmpty(),
  body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
  body('tags').optional().isArray()
];

module.exports = { createCourseValidator };
