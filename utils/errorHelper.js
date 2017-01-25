
function sendError(res, errorMessage, code) {
    console.log(errorMessage);
    res.status(code).send({ 'errorMessage': errorMessage });
}

module.exports = {
    sendError: sendError
};
