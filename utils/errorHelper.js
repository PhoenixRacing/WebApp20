
function sendError(req, res, error, code) {
	res.status(code).send({ 'error': error });
}

module.exports = {
	sendError = sendError
};
