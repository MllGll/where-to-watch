"use client";

import Header from "@/components/Header";
import { useRateLimit } from "@/components/RateLimitContext";
import Search from "@/components/Search";
import TitleCard from "@/components/TitleCard";
import mockedTitles from "@/mocks/titles";
import { EmptyState, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import "@/app/i18n";
import { searchTitle } from "./api";

export default function Home() {
	const { t, i18n } = useTranslation();
	const [searchValue, setSearchValue] = useState();
	const [searchedTitle, setSearchedTitle] = useState();
	const [loading, setLoading] = useState(false);
	const [titles, setTitles] = useState([]);

	const useMock = false;
	const { setRateLimit } = useRateLimit();

	// Update document title and meta description dynamically for i18n
	useEffect(() => {
		document.title = t("title");
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute("content", t("description"));
		}
	}, [t]);

	// Detect browser language after hydration to avoid mismatch
	useEffect(() => {
		const detectLanguage = () => {
			if (typeof navigator === "undefined") return;
			
			const browserLang = navigator.language?.split("-")[0];
			if (browserLang && browserLang !== i18n.language && i18n.options.supportedLngs?.includes(browserLang)) {
				i18n.changeLanguage(browserLang);
			}
		};
		detectLanguage();
	}, [i18n]);

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
			<Header t={t} />
			<div
				className="flex flex-col text-center mt-16 pt-6 pb-6 gap-2 bg-gray-800"
				style={{
					boxShadow:
						"inset 0 -10px 15px -3px #0000001a, inset 0 -4px 6px -4px #0000001a",
				}}
			>
				<Text className="text-gray-300 px-4 text-sm lg:text-2xl font-semibold hidden lg:inline">
					{t("home.headline")}
				</Text>
				<Search
					setSearchValue={setSearchValue}
					handleSearch={handleSearch}
					loading={loading}
					t={t}
				/>
			</div>
			<div className="px-4 lg:px-32 pb-24">
				{(Boolean(titles.length) || loading) && (
					<Fragment>
						<div className="my-6">
							<Skeleton loading={loading}>
								<Text fontSize="lg" className="text-gray-900">
									<Trans
										i18nKey="home.showingResults"
										values={{ count: titles.length }}
										components={{ bold: <strong /> }}
									/>
									{" "}
									<span className="italic text-primary">"{searchedTitle}"</span>
								</Text>
							</Skeleton>
							<Skeleton loading={loading}>
								<Text className="text-gray-400 text-sm lg:text-base">
									{t("home.clickItems")}
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
										<TitleCard title={title} key={title.id} t={t} />
									))}
						</Grid>
					</Fragment>
				)}

				{searchedTitle && !titles.length && (
					<EmptyState.Root>
						<EmptyState.Content>
							<VStack textAlign="center">
								<EmptyState.Title>
									{t("home.noResultsTitle", { query: searchedTitle })}
								</EmptyState.Title>
								<EmptyState.Description>
									{t("home.noResultsDescription")}
								</EmptyState.Description>
							</VStack>
						</EmptyState.Content>
					</EmptyState.Root>
				)}
			</div>
			<footer className="text-gray-400 absolute bottom-2 w-full text-center text-xs lg:text-sm px-4">
				{t("home.footerPrefix")}{" "}
				<a href="https://github.com/MllGll" target="_blank" rel="noopener noreferrer" className="font-bold">Marcello Gallante</a>.{" "}
				{t("home.footerSuffix")}{" "}
				<a href="https://watchmode.com" target="_blank" rel="noopener noreferrer" className="font-bold">Watchmode.com</a>
			</footer>
		</div>
	);
}
