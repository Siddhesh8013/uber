const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true, 
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        },
    },
    email: {
        type: String,
        required: true, 
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'], 
    },
    password: {
        type: String,
        required: true, 
        select: false,
    },
    SocketId: {
        type: String,
    },
});

// Method to generate an authentication token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {expiresIn: '24'});
    return token;
};

// Method to compare a given password with the hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Static method to hash a password
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('User', userSchema); // Capitalized model name for convention

module.exports = userModel;