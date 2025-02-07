export async function searchTitle(searchedTitle) {
	const response = await fetch(`/api/search?searchedTitle=${searchedTitle}`);

	if (!response.ok) {
		throw new Error("Erro ao buscar produções");
	}

	const data = await response.json();

	return data;
}
