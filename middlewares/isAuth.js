 import jwt from "jsonwebtoken";
 import { User } from "../models/User.js";
// import { User } from "../models/user.js";
export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token)
      return res.status(403).json({
        message: "please Login",
      });

    const decodedData = jwt.verify(token, process.env.Jwt_Sec);
    req.user = await User.findById(decodedData._id);
    next();
  } catch (error) {
    res.status(500).json({
      message: "Login First",
    });
  }
};


// export const isAuth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(403).json({
//         message: "Please login",
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     const decodedData = jwt.verify(token, process.env.Jwt_Sec);
//     req.user = await User.findById(decodedData._id);
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Login first",
//     });
//   }
// };

export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({
        message: "you are not admin",
      });
      next()
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
