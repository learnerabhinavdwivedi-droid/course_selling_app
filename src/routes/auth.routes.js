const { Router } = require('express');
const { signup, login } = require('../controllers/auth.controller');
const { signupValidator, loginValidator } = require('../validators/auth.validators');
const validate = require('../middleware/validate');

const router = Router();

router.post('/signup', signupValidator, validate, signup);
router.post('/login', loginValidator, validate, login);

module.exports = router;
