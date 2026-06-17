const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { hashPassword } = require("../utils/jwt");


async function getUserById(id) {
    const result = await UserModel.getUserById(id);
    return result;

}

module.exports = {
    getUserById
}