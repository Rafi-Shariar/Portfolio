import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUserPayload } from "./auth.interface";
import { jwt } from "zod";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { jwtUtils } from "../../utils/jwt";
import { name } from "ejs";
import config from "../../config";
import { SignOptions } from "jsonwebtoken";

export const loginAdmin = async (payload :ILoginUserPayload) => {

  const admin = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!admin) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    admin.password,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const jwtSecret = process.env.JWT_ACCESS_SECRET;

  if (!jwtSecret) {
    throw new AppError(httpStatus.UNAUTHORIZED, "JWT_ACCESS_SECRET is missing in environment variables");
  }

  const jwtPayload = {
    userId: admin.id,
    name : admin.name,
    email: admin.email,
    role: admin.role,
  };

  const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

  return {
    accessToken
  };
};

export const AuthServices = {
    loginAdmin
}