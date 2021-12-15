export const makeErrorResponse = (status: number, code: string, message: string) => ({
	status: status,
	body: JSON.stringify({
		code,
		status,
		message
	})
});
