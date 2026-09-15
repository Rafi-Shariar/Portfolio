import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import type { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";
import type { ILoginUserPayload } from "./auth.interface";

const loginAdmin = async (payload: ILoginUserPayload) => {
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

	const jwtPayload = {
		userId: admin.id,
		name: admin.name,
		email: admin.email,
		role: admin.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions["expiresIn"],
	);

	return {
		accessToken,
	};
};

export const AuthServices = {
	loginAdmin,
};
