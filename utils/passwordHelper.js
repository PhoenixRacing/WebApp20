
function isPasswordValid(password) {
	if (password.length < 8) {
		return false;
	}
	return true;
}

function passwordError(password) {
	if (password.length < 8) {
		return "Password should be at least 8 characters.";
	}
	return "No error.";
}

module.exports = {
	isPasswordValid: isPasswordValid,
	passwordError: passwordError
};
