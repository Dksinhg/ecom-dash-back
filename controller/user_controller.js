const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// user login

exports.login = async (req, resp) => {
  try {
    // get data from req.body
    const { phone, email, password } = req.body;

    // validation data
    // if (!phone || !password || !email || !password) {
    //   return resp.status(403).json({
    //     success: false,
    //     messages: `all field are required , please try again`,
    //   });
    // }

    // check the user is exit or not

    const user = await User.findOne({ email });

    if (!user) {
      return resp.status(401).json({
        success: false,
        messages: `please register before the login`,
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
    };

    // password match and generate jwt
    if (await bcrypt.compare(password, user.password)) {
      //   creating token
      const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
        expiresIn: "3d",
      });

      //
      user.token = token;
      user.password = undefined;

      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // create cookie and send response
      resp.cookie("token", token, option).status(200).json({
        success: true,
        token,
        user,
        message: `login successfully`,
      });
    } else {
      return resp.status(401).json({
        success: false,
        message: `password inccorrect`,
      });
    }
  } catch (error) {
    console.log(`login of error`, error);
    return resp.status().json({
        success: false,
        message:`failed login, please try again`
    })
  }
};

// user signup

exports.signup = async (req, resp) => {
  try {
    const { name, phone, email, password, confrompassword } = req.body;

    // if (!name || !phone || !email || !password || !confrompassword) {
    //   return resp.status(403).json({
    //     success: false,
    //     messages: "all fields are required",
    //   });
    // }

    const exitUser = await User.findOne({ email });

    if (exitUser) {
      return resp.status(400).json({
        success: false,
        messages: "User is already registerd",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const userdetails = await User.create({
      name,
      phone,
      email,
      password: hashPassword,
      confrompassword: hashPassword,
    });

    return resp.status(200).json({
      success: true,
      messages: "User is register successfully",
      userdetails,
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({
      success: false,
      messages: "successfully signup",
    });
  }
};
