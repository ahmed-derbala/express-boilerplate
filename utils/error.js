const { validationResult } = require('express-validator');
const res = require('express/lib/response');

exports.errorHandler = (params) => {
    let statusCode = 500
    let response = {}
    if (params.err) {
        response.err = params.err
        if (params.err.message) {
            response.msg = params.err.message
        }
        if (params.err.name) {
            if (params.err.name == 'ValidationError') {
                statusCode = 409
            }
            if (params.err.name == 'TokenExpiredError') {
                statusCode = 401
            }
        }
    }
    console.error(`${JSON.stringify(params.err)}`.black.bgRed)
    if (params.res) {
        return params.res.status(statusCode).json(response)
    }
    return { statusCode, msg: 'error', err: params.err }
};

/**
 * checking errors returned by validator, it should be called directly after validator on routes
 */
exports.validatorCheck = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error({
            label: 'VALIDATION_ERROR',
            message: JSON.stringify(errors.errors),
            body: req.body,
        });
        return res.status(422).json({ msg: `validation error`, err: errors.errors });
    }
    return next();
};
