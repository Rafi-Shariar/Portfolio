import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

const createToken = (
	payload: JwtPayload,
	secret: string,
	expiresIn: SignOptions["expiresIn"],
) => {
	return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

const verifyToken = (token: string, secret: string) => {
	try {
		const verifiedToken = jwt.verify(token, secret) as JwtPayload;
		return {
			success: true as const,
			data: verifiedToken,
		};
	} catch (error) {
		return {
			success: false as const,
			error: error instanceof Error ? error.message : "Invalid token",
		};
	}
};

export const jwtUtils = {
	createToken,
	verifyToken,
};
