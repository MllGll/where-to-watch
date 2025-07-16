export async function searchTitle(searchedTitle) {
	const response = await fetch(`/api/search?searchedTitle=${searchedTitle}`);

	if (!response.ok) {
		throw new Error("Erro ao buscar produções");
	}

	const data = await response.json();

	return data;
}

export async function getTitleDetails(titleId) {
	const response = await fetch(`/api/details?titleId=${titleId}`);

	if (!response.ok) {
		throw new Error("Erro ao buscar detalhes");
	}

	const data = await response.json();

	return data;
}
