export async function GET(request) {
	const url = new URL(request.url);
	const searchedTitle = url.searchParams.get("searchedTitle");

	const response = await fetch(
		`${process.env.BASE_URL}/search/?apiKey=${process.env.WATCHMODE_API_KEY}&search_value=${searchedTitle}&search_field=name&type=tv,movie`,
	);

	if (!response.ok) {
		return new Response(
			JSON.stringify({ error: "Erro ao consultar a API Watchmode" }),
			{ status: 500 },
		);
	}

	const data = await response.json();

	const limit = response.headers.get("X-RateLimit-Limit");
	const remaining = response.headers.get("X-RateLimit-Remaining");
	const reset = response.headers.get("X-RateLimit-Reset");

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			...(limit && { "X-RateLimit-Limit": limit }),
			...(remaining && { "X-RateLimit-Remaining": remaining }),
			...(reset && { "X-RateLimit-Reset": reset }),
		},
	});
}
