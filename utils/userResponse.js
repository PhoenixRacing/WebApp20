function userMap(value, index, array) {
    return {
        "email":value.email,
        "_id":value._id,
        "firstName":value.firstName,
        "lastName":value.lastName,
        "username":value.username,
        "major":value.major,
        "admin":value.admin,
        "purchaseManager": value.purchaseManager,
        "image":value.image
    };
}

module.exports = {
    userMap: userMap
};
