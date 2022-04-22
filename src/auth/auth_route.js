const express = require('express');
const router = express.Router();
const auth_ctrl=require(`${appRootPath}/src/auth/auth_ctrl`)
const { check, query, param } = require('express-validator');
const validatorCheck = require(`${appRootPath}/utils/error`).validatorCheck;
const auth = require(`${appRootPath}/utils/auth`).auth




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/signup',
[
    check('email').isEmail(),
    check('password').isString().notEmpty()
],
validatorCheck,
auth_ctrl.signup)

router.post('/signin',
[
    check('email').isEmail(),
    check('password').isString().notEmpty()
],
validatorCheck,
auth_ctrl.signin)

router.post('/signout',
auth(),
auth_ctrl.signout)

module.exports = router;
