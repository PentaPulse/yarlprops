const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    uid: { type: String},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    address: { type: String },
    role: { type: String, required: true },
    password: { type: String ,required:true},
    myProducts:{type:Array},
    myRents:{type:Array},
    myServices:{type:Array}
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
