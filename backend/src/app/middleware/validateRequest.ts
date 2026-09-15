import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { ZodType } from "zod";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

type RequestSchemas = {
	body?: ZodType;
	query?: ZodType;
	params?: ZodType;
};

export const validateRequest = (schemas: ZodType | RequestSchemas) => {
	return catchAsync((req: Request, _res: Response, next: NextFunction) => {
		const normalized: RequestSchemas =
			"safeParse" in schemas ? { body: schemas } : schemas;

		if (normalized.body) {
			const result = normalized.body.safeParse(req.body ?? {});
			if (!result.success) {
				throw new AppError(
					httpStatus.BAD_REQUEST,
					result.error.issues[0].message,
				);
			}
			req.body = result.data;
		}

		if (normalized.query) {
			const result = normalized.query.safeParse(req.query ?? {});
			if (!result.success) {
				throw new AppError(
					httpStatus.BAD_REQUEST,
					result.error.issues[0].message,
				);
			}
		}

		if (normalized.params) {
			const result = normalized.params.safeParse(req.params ?? {});
			if (!result.success) {
				throw new AppError(
					httpStatus.BAD_REQUEST,
					result.error.issues[0].message,
				);
			}
		}

		next();
	});
};
