
function sendError(req, res, error, code) {
    console.log(error);
    res.status(code).send({ 'error': error });
}

module.exports = {
    sendError: sendError
};
