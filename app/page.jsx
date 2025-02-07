"use client";

// import titles from "@/mocks/titles";
import {
	Button,
	Card,
	Em,
	EmptyState,
	Grid,
	Group,
	Heading,
	Input,
	InputAddon,
	VStack,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { searchTitle } from "./api";

export default function Home() {
	const [searchValue, setSearchValue] = useState();
	const [searchedTitle, setSearchedTitle] = useState();
	const [loading, setLoading] = useState(false);
	const [titles, setTitles] = useState([]);

	const handleSearch = async () => {
		if (searchValue && searchValue !== searchedTitle && !loading) {
			try {
				setLoading(true);
				const data = await searchTitle(searchValue);
				setSearchedTitle(searchValue);
				setLoading(false);
				// const data = titles;

				const orderedTitles = data.title_results.sort((a, b) => {
					if (!a.year) return 1;
					if (!b.year) return -1;
					return a.year - b.year;
				});

				setTitles(orderedTitles);
			} catch (error) {
				setLoading(false);
				console.error(error.message);
			}
		}
	};

	return (
		<div className="flex flex-col justify-items-center px-96 py-24 gap-8 font-[family-name:var(--font-geist-sans)]">
			<Group attached className="w-[100%]">
				<InputAddon size="lg">Onde assistir</InputAddon>
				<Input
					placeholder="Nome do filme ou série"
					onChange={({ target }) => setSearchValue(target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") handleSearch();
					}}
					size="lg"
				/>
				<Button
					variant="surface"
					size="lg"
					onClick={handleSearch}
					loading={loading}
				>
					?
				</Button>
			</Group>

			{Boolean(titles.length) && (
				<Fragment>
					<div>
						<Heading>
							Exibindo {titles.length} resultados para "{searchedTitle}"
						</Heading>
						<Em color="gray.400">
							(Clique para exibir as opções de streaming)
						</Em>
					</div>

					<Grid
						templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }}
						gap={6}
					>
						{titles.map((title) => (
							<Card.Root
								cursor="pointer"
								key={title.id}
								aspectRatio={2 / 3}
								overflow="hidden"
								className="transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-neutral-100 bg-neutral-50"
							>
								<Card.Body gap="2" className="justify-center text-center">
									<Card.Title mt="2">{title.name}</Card.Title>
									<Card.Description>{title.year}</Card.Description>
								</Card.Body>
							</Card.Root>
						))}
					</Grid>
				</Fragment>
			)}

			{searchedTitle && !titles.length && (
				<EmptyState.Root>
					<EmptyState.Content>
						<VStack textAlign="center">
							<EmptyState.Title>
								Nenhum resultado encontrado para "{searchedTitle}"
							</EmptyState.Title>
							<EmptyState.Description>
								Você digitou corretamente?
							</EmptyState.Description>
						</VStack>
					</EmptyState.Content>
				</EmptyState.Root>
			)}
		</div>
	);
}
