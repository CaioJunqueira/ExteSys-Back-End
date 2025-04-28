import jsonwebtoken from "jsonwebtoken";
import { comparePassword } from "../helpers/encryption.js";
import User from "../src/models/userModel.js";

class AuthService {
  static login = async (user, type) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado no ambiente.");
    }
    const JWT_secret = process.env.JWT_SECRET;

    const userDb = await User.findOne({ email: user.email });

    if (!userDb) {
      throw new Error("User not registered");
    }

    const isPasswordValid = await comparePassword(
      user.password,
      userDb.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid user or password");
    }

    const accessToken = jsonwebtoken.sign(
      {
        user_id: userDb.user_id,
        email: userDb.email,
      },
      JWT_secret,
      {
        expiresIn: 86400, // 24h
      }
    );

    return {
      accessToken,
      userDb,
    };
  };
}

export default AuthService;
