const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) res.json("No users")
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .send({ code: "user/loading-error", message: "Server Error", err });
  }
};

exports.signup = async (req, res) => {
  const { firstName, lastName, displayName, role, email, password } = req.body;
  try {
    const userNew = new User({
      uid: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      displayName,
      role,
      email,
      password
    });
    await userNew.save().then(
      token = jwt.sign({ uid: userNew.uid }, process.env.JWT_SECRET, { expiresIn: "1h" })
    )
    res.status(201).json({
      code: "user/add-ok",
      message: "User created successfully",
      user: userNew,
      token
    });
  } catch (e) {
    res
      .status(500)
      .send({ code: "user/add-error", message: "Signup failed", e });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ code: "user/signin-error", message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ code: "user/signin-error", message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      code: "user/signed",
      message: "Login successful",
      user,
      token, // Return the token
    });
  } catch (e) {
    res.status(500).json({ code: "user/signin-error", message: "Signin failed", e });
  }
};

exports.updateUser = async (req, res) => {
  const { firstName, lastName, displayName, role, email } = req.body;
  //const { user } = req.user
  try {
    const response = await User.findOneAndUpdate(
      { email: email },
      { $set: { firstName, lastName, displayName, role } }
    );
    if (!response) {
      return res.status(404).json({
        code: "user/not-found",
        message: "User not found or already deleted",
      });
    }
    res
      .status(200)
      .json({ code: "user/update-ok", message: "updated", response });
  } catch (error) {
    res.status(500).json({
      code: "user/update-error",
      message: "User update failed",
      error,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { email } = req.body;
  try {
    //after implement when user have or not advertised services or products
    const response = await User.findOneAndDelete({ email: email });
    if (!response) {
      return res.status(404).json({
        code: "user/not-found",
        message: "User not found or already deleted",
      });
    }
    res.status(200).json({
      code: "user/delete-ok",
      message: "User removed successfully!",
      response,
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: "user/delete-error", message: "User not deleted", error });
  }
};

exports.changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        code: "user/not-found",
        message: "User not found in the database",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      code: "user/passChange-ok",
      message: "Password successfully changed",
    });
  } catch (error) {
    res.status(500).json({
      code: "user/change-password-error",
      message: "Password change failed",
      error,
    });
  }
};

exports.changeEmail = async (req, res) => {
  const { oldEmail, newEmail } = req.body;
  try {
    const response = await User.findOneAndUpdate(
      { email: oldEmail },
      { $set: { email: newEmail } }
    );
    if (!response) {
      return res.status(404).json({
        code: "user/not-found",
        message: "User not found or already deleted",
      });
    }
    res
      .status(200)
      .json({
        code: "user/change-email-ok",
        message: "successfully changed email",
        response,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        code: "user/change-email-error",
        message: "Email not changed",
        error,
      });
  }
};

exports.changeRole = async (req, res) => {
  const { email, newRole } = req.body;
  try {
    const response = await User.findOne(
      { email: email }
    );
    if (!response) {
      return res.status(404).json({
        code: "user/not-found",
        message: "User not found or already deleted",
      });
    }

    if (!response.myProducts && !response.myRentals && !myServices) {
      res.status(500).json({ code: "user/role-error", message: "Remove your productss, rentals , services" })
    }

    const oldRole = response.role;
    let OldRoleModel;
    switch (response.role) {
      case 'merchant':
        OldRoleModel = User.Merchant;
        break;
      case 'admin':
        OldRoleModel = User.Admin;
        break;
      case 'customer':
        OldRoleModel = User.Customer;
        break;
      default:
        throw new Error('Invalid role')
    }

    const newUserData = {
      ...response.toObject(),
      role: newRole
    }

    let NewRoleModel;
    switch (newRole) {
      case 'merchant':
        NewRoleModel = User.Merchant;
        break;
      case 'admin':
        NewRoleModel = User.Admin;
        break;
      case 'customer':
        NewRoleModel = User.Customer;
        break;
      default:
        throw new Error('Invalid role')
    }

    const newUser = new NewRoleModel(newUserData);
    await newUser.save();

    await OldRoleModel.findOneAndDelete({"email":email})

    res
      .status(200)
      .json({
        code: "user/role-ok",
        message: `Role changed ${oldRole} to ${newRole}`,
        newUser,
      });
  } catch (error) {
    res
      .status(500)
      .json({ code: "user/role-error", message: "Role not changed", error });
  }
};

exports.dummy = async (req, res) => {
  const dummies = [
    {
      firstName: "sample",
      lastName: "buyer",
      displayName: "buyer",
      role: "buyer",
      email: "buyer@p5p.lk",
      password: "123456321"
    },
    {
      firstName: "sample",
      lastName: "seller",
      displayName: "seller",
      role: "seller",
      email: "seller@p5p.lk",
      password: "123456321"
    },
    {
      firstName: "sample",
      lastName: "renter",
      displayName: "renter",
      role: "renter",
      email: "renter@p5p.lk",
      password: "123456321"
    }
  ];

  try {
    // Hash passwords before inserting into the database
    for (const dummy of dummies) {
      dummy.password = await bcrypt.hash(dummy.password, 10);
    }

    // Insert all dummy users into the database
    const users = await User.insertMany(dummies);
    res.status(200).json({
      code: "user/dummy-ok",
      message: "Dummies added successfully",
      users
    });
  } catch (error) {
    res.status(500).json({
      code: "user/dummy-error",
      message: "Error creating dummy users or users already exist",
      error: error.message
    });
  }
};

exports.counts = async (req, res) => {

}