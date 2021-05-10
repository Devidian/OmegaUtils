type VerificationEntity = {
	field: string;
	verifiedOn: Date | null;
	token?: string; // remove on validation
	tokenValidUntil?: Date; // remove on validation
};
