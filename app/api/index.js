import { updateRateLimitFromResponse } from "./rateLimitUtil";

export async function searchTitle(searchedTitle, setRateLimit) {
	const apiKey = typeof window !== 'undefined' ? localStorage.getItem("watchmode_api_key") : null;
	const url = apiKey
		? `/api/search?searchedTitle=${searchedTitle}&apiKey=${apiKey}`
		: `/api/search?searchedTitle=${searchedTitle}`;
	const response = await fetch(url);

	if (setRateLimit) {
		updateRateLimitFromResponse(response, setRateLimit);
	}

	if (!response.ok) {
		throw new Error("Erro ao buscar produções");
	}

	const data = await response.json();

	return data;
}

export async function getTitleDetails(titleId, setRateLimit) {
	const apiKey = typeof window !== 'undefined' ? localStorage.getItem("watchmode_api_key") : null;
	const url = apiKey
		? `/api/details?titleId=${titleId}&apiKey=${apiKey}`
		: `/api/details?titleId=${titleId}`;
	const response = await fetch(url);

	if (setRateLimit) {
		updateRateLimitFromResponse(response, setRateLimit);
	}

	if (!response.ok) {
		throw new Error("Erro ao buscar detalhes");
	}

	const data = await response.json();

	return data;
}
