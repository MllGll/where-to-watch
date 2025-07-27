export async function GET(request) {
	const url = new URL(request.url);
	const apiKey = url.searchParams.get("apiKey");
	if (!apiKey) {
		return new Response(
			JSON.stringify({ valid: false, error: "Chave não informada" }),
			{ status: 400 },
		);
	}
	const res = await fetch(`${process.env.BASE_URL}/sources/?apiKey=${apiKey}`);
	if (res.ok) {
		return new Response(JSON.stringify({ valid: true }), { status: 200 });
	}
	return new Response(JSON.stringify({ valid: false }), { status: 200 });
}
