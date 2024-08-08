const User = require("../models/userModel");
const admin = require("../config/firebase");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send("Server Error");
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
      code: "add-user-ok",
      message: "User created successfully",
      user: userNew,
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

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
      .json({ code: "user-signed", message: "Login successful", user });
  } catch (e) {}
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
      .json({ code: "update-user-ok", message: "updated", response });
  } catch (error) {
    res
      .status(500)
      .json({
        code: "update-user-error",
        message: "Error occured updating user",
        error,
      });
  }
};

exports.deleteUser = async (req, res) => {
  const { email } = req.body;
  try {
    //after implement when user have or not advertised services or products
    const user = await User.find({email});
    await admin.auth().deleteUser({uid:user.uid})
    const response = await User.deleteOne({ email });
    res
      .status(200)
      .json({
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
