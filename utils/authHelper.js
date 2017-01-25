
var errorHelper = require('./errorHelper');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    if (!req.user) {
        return errorHelper.sendError(res, "You are not logged in", 401);
    }

    return next();
}

function isAdmin(req, res, next) {
	if (!req.user) {
        return errorHelper.sendError(res, "You are not logged in", 401);
	}

	if (!req.user.admin) {
        return errorHelper.sendError(res, "You are not an administrator", 401);
	}

	return next();
}

function isPurchaseManaging(req, res, next) {
	if (!req.user) {
        return errorHelper.sendError(res, "You are not logged in", 401);
	}

	if (!req.user.admin && !req.user.purchaseManager) {
        return errorHelper.sendError(res, "You are not a purchase manager", 401);
	}

	return next();
}

module.exports = {
	'isLoggedIn' : isLoggedIn,
	'isAdmin' : isAdmin,
	'isPurchaseManaging': isPurchaseManaging
}