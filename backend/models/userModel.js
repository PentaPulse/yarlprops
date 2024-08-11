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

// Admin Schema
const adminSchema = userSchema.clone();
adminSchema.add({
    adminSpecificField: { type: String }
});
adminSchema.statics.role = 'admin';

// Merchant Schema
const merchantSchema = userSchema.clone();
merchantSchema.add({
    myProducts:{type:Array},
    myRents:{type:Array},
    myServices:{type:Array}
});
merchantSchema.statics.role = 'merchant';

// Customer Schema
const customerSchema = userSchema.clone();
customerSchema.add({
    customerSpecificField: { type: String }
});
customerSchema.statics.role = 'customer';

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Merchant = mongoose.model('Merchant', merchantSchema);
const Customer = mongoose.model('Customer', customerSchema);

module.exports = {User,Admin,Merchant,Customer};
