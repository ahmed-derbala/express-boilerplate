const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Sessions = mongoose.model('Sessions');


exports.auth = (params) => {
    return function (req, res, next) {
        //check params
        if (params == null) params = {}
        if (params.isTokenRequired == null) params.isTokenRequired = true
        //search for token
        if (req.headers.token == null) {
            if (req.cookies.token != null) req.headers.token = req.cookies.token;
            else if (req.headers['x-access-token'] != null) req.headers.token = req.headers['x-access-token'];
            else if (req.headers['authorization'] != null) req.headers.token = req.headers['authorization'];
            else if (req.query.token != null) req.headers.token = req.query.token;
        }

        if (req.headers.token == null && params.isTokenRequired == true) {
            return res.status(403).json({ msg: 'No token found on headers, cookies or query' });
        }
        req.headers.token = req.headers.token.replace('Bearer ', '');
        //check if token is in session
        return Sessions.findOne({ token: req.headers.token })
            .then(session => {
                if (session == null) {
                    return res.status(403).json({ msg: 'No session created with provided token' });
                }
                //verify token
                return jwt.verify(req.headers.token, prefs.jwt.private_key, (err, decoded) => {
                    if (err) {
                        //if token is not required move on
                        if (params.isTokenRequired == false) {
                            return next()
                        }
                        // return res.status(401).json({ msg: `token verification error`, err });
                        return errorHandler({ err, res })
                    }
                    //console.log(decoded, 'decoded');
                    //check if we have valid user object
                    if (decoded.user == null) {
                        return res.status(401).json({ msg: `token has no valid user object` });
                    }
                    if (req.headers['user-agent'] != decoded.userAgent) {
                        return res.status(401).json({ msg: `token must be used in one device` });
                    }
                    req.user = decoded.user
                    return next()
                })
            })
            .catch(err => errorHandler({ err, res }))
    }
}

