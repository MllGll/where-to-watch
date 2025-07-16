export async function GET(request) {
	const url = new URL(request.url);
	const titleId = url.searchParams.get("titleId");

	const response = await fetch(
		`${process.env.BASE_URL}/title/${titleId}/details/?apiKey=${process.env.WATCHMODE_API_KEY}&append_to_response=sources&regions=BR`,
	);

	if (!response.ok) {
		return new Response(
			JSON.stringify({ error: "Erro ao consultar a API Watchmode" }),
			{ status: 500 },
		);
	}

	const data = await response.json();
	return new Response(JSON.stringify(data), { status: 200 });
}
