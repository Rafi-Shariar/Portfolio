import rateLimit from "express-rate-limit";
import httpStatus from "http-status";

const rateLimitResponse = {
	success: false,
	statusCode: httpStatus.TOO_MANY_REQUESTS,
	message: "Too many requests. Please try again later.",
	data: null,
};

export const authRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: rateLimitResponse,
});

export const contactRateLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: rateLimitResponse,
});
