function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next(); // next() 호출 시 오류가 발생하지 않도록 수정
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
