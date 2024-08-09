const User = require("../models/userModel");
const admin = require("../config/firebase");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
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
    const userf = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    const userNew = new User({
      uid: userf.uid,
      firstName,
      lastName,
      displayName,
      role,
      email,
    });
    await userNew.save();

    res.status(201).json({
      code: "user/add-ok",
      message: "User created successfully",
      user: userNew,
    });
  } catch (e) {
    res
      .status(500)
      .send({ code: "user/add-error", message: "Signup failed", e });
  }
};

// HAVE A PROBLEM IN SIGNIN 
exports.signin = async (req, res) => {
  const { token } = req.body;
  try {
    const tokenDecode = await admin.auth().verifyIdToken(token);
    const userf = await admin.auth().getUser(tokenDecode.uid);

    /*const token = jwt.sign(
      {uid:userf.uid},
      process.env.JWT_SECRET,
      {expiresIn:'1h'}
    );
*/
    const user = await User.find({ email: tokenDecode.email });
    res
      .status(200)
      .json({ code: "user/signed", message: "Login successful", user });
  } catch (e) {
    res
      .status(500)
      .json({ code: "user/signin-error", message: "Signin failed", e });
  }
};

exports.updateUser = async (req, res) => {
  const { firstName, lastName, displayName, role, email } = req.body;
  try {
    const response = await User.updateOne(
      { email: email },
      { $set: { firstName, lastName, displayName, role } }
    );
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        code: "user/not-found",
        message: "User not found in the database",
      });
    }

    await admin.auth().deleteUser(user.uid);
    const response = await User.deleteOne({ email });
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
    const response = await admin
      .auth()
      .updateUser(user.uid, { password: newPassword });
    res
      .status(200)
      .json({
        code: "user/passChange-ok",
        message: "Password successfully changed",
        response,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        code: "user/change-password-error",
        message: "Password change failed",
        error,
      });
  }
};

exports.changeEmail = async (req, res) => {
  const { oldEmail, newEmail } = req.body;
  try {
    const user = await User.findOne({ email: oldEmail });
    if (!user) {
      return res.status(404).json({
        code: "user/not-found",
        message: "User not found in the database",
      });
    }
    const response = await admin
      .auth()
      .updateUser(user.uid, { email: newEmail });
    const upEmail = await User.updateOne(
      { email: oldEmail },
      { $set: { email: newEmail } }
    );
    res
      .status(200)
      .json({
        code: "user/change-email-ok",
        message: "successfully changed email",
        response,
        upEmail,
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
  const { email, oldRole, newRole } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        code: "user/not-found",
        message: "User not found in the database",
      });
    }
    const response = await User.updateOne(
      { email: email },
      { $set: { role: newRole } }
    );
    res
      .status(200)
      .json({
        code: "user/role-ok",
        message: `Role changed ${oldRole} to ${newRole}`,
        response,
      });
  } catch (error) {
    res
      .status(500)
      .json({ code: "user/role-error", message: "Role not changed", error });
  }
};

exports.dummy=async(req,res)=>{
  const dummies = [{
    firstName:"sample",
    lastName:"buyer",
    displayName:"buyer",
    role:"buyer",
    email:"buyer@p5p.lk",
    password:"123456321"
  },{
    firstName:"sample",
    lastName:"seller",
    displayName:"seller",
    role:"seller",
    email:"seller@p5p.lk",
    password:"123456321"
  },{
    firstName:"sample",
    lastName:"renter",
    displayName:"renter",
    role:"renter",
    email:"renter@p5p.lk",
    password:"123456321"
  }]
  try {
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
}