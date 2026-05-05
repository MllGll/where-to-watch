"use client";

import Header from "@/components/Header";
import { useRateLimit } from "@/components/RateLimitContext";
import Search from "@/components/Search";
import TitleCard from "@/components/TitleCard";
import mockedTitles from "@/mocks/titles";
import { EmptyState, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { searchTitle } from "./api";

export default function Home() {
	const [searchValue, setSearchValue] = useState();
	const [searchedTitle, setSearchedTitle] = useState();
	const [loading, setLoading] = useState(false);
	const [titles, setTitles] = useState([]);

	const useMock = false;
	const { setRateLimit } = useRateLimit();

	const handleSearch = async () => {
		if (searchValue && searchValue !== searchedTitle && !loading) {
			try {
				setLoading(true);
				const data = useMock
					? mockedTitles
					: await searchTitle(searchValue, setRateLimit);
				setSearchedTitle(searchValue);
				setLoading(false);

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
		<div className="flex flex-col justify-items-center bg-gray-100 min-h-screen">
			<Header />
			<div
				className="flex flex-col text-center mt-16 pt-6 pb-6 gap-2 bg-gray-800"
				style={{
					boxShadow:
						"inset 0 -10px 15px -3px #0000001a, inset 0 -4px 6px -4px #0000001a",
				}}
			>
				<Text className="text-gray-300 px-4 text-sm lg:text-2xl font-semibold hidden lg:inline">
					Encontre as opções de streaming para filmes e séries
				</Text>
				<Search
					setSearchValue={setSearchValue}
					handleSearch={handleSearch}
					loading={loading}
				/>
			</div>
			<div className="px-4 lg:px-32 pb-24">
				{(Boolean(titles.length) || loading) && (
					<Fragment>
						<div className="my-6">
							<Skeleton loading={loading}>
								<Text fontSize="lg" className="text-gray-900">
									Exibindo{" "}
									<span className="font-bold text-primary">
										{titles.length} resultados
									</span>{" "}
									para{" "}
									<span className="italic text-primary">"{searchedTitle}"</span>
								</Text>
							</Skeleton>
							<Skeleton loading={loading}>
								<Text className="text-gray-400 text-sm lg:text-base">
									Clique nos itens para exibir as opções de streaming
								</Text>
							</Skeleton>
						</div>

						<Grid
							templateColumns={{
								base: "repeat(2, 1fr)",
								md: "repeat(6, 1fr)",
							}}
							className="gap-4 lg:gap-8"
						>
							{loading
								? Array.from({ length: 6 }).map((_, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<Skeleton key={index} aspectRatio={2 / 3} />
									))
								: titles.map((title) => (
										<TitleCard title={title} key={title.id} />
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
			<footer className="text-gray-400 absolute bottom-2 w-full text-center text-xs lg:text-sm px-4">
				Desenvolvido por <a href="https://github.com/MllGll" target="_blank" rel="noopener noreferrer" className="font-bold">Marcello Gallante</a>. Dados de streaming fornecidos pela{" "}
				<a href="https://watchmode.com" target="_blank" rel="noopener noreferrer" className="font-bold">Watchmode.com</a>
			</footer>
		</div>
	);
}
