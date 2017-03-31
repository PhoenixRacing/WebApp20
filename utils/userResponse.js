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
        "image":value.image,
        "teamCaptain":value.teamCaptain,
        "title":value.title,
        "systemLead":value.systemLead,
        "graduatingClass":value.graduatingClass,
        "shownInTeamPage":value.shownInTeamPage
    };
}

module.exports = {
    userMap: userMap
};
