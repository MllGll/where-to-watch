export function updateRateLimitFromResponse(response, setRateLimit) {
	const limit = response.headers.get("X-RateLimit-Limit");
	const remaining = response.headers.get("X-RateLimit-Remaining");
	const reset = response.headers.get("X-RateLimit-Reset");
	if (limit && remaining) {
		setRateLimit({
			limit: Number(limit),
			remaining: Number(remaining),
			reset: reset ? Number(reset) : null,
		});
	}
}
