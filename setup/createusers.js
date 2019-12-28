"use strict";

module.exports = async userConfig => {
    const User = require("../models/user");
    const admin = await User.findOne({ role: "admin" }).exec();

    if (admin) {
        return "Admin not created: at least one admin user already found in database.";
    }

    // FIXME: Fails when a non-admin user with same email already exists in the database

    const user = new User(userConfig);
    user.role = "admin";
    await user.save();
    return "Admin user successfully created";
};
