import {
	DialogCloseTrigger,
	DialogContent,
	DialogRoot,
} from "@/components/ui/dialog";
import {
	Badge,
	Box,
	Button,
	Flex,
	HStack,
	Image,
	Text,
} from "@chakra-ui/react";
import {
	SiAppletv,
	SiHbo,
	SiMubi,
	SiNetflix,
	SiParamountplus,
	SiPrimevideo,
} from "react-icons/si";

const STREAMING_SERVICES = {
	PRIME: {
		icon: SiPrimevideo,
		color: "#0678ff",
		pattern: /prime/i,
	},
	NETFLIX: {
		icon: SiNetflix,
		color: "#e50914",
		pattern: /netflix/i,
	},
	APPLE: {
		icon: SiAppletv,
		color: "#000",
		pattern: /apple/i,
	},
	MAX: {
		icon: SiHbo,
		color: "#0033ff",
		pattern: /max/i,
	},
	GLOBOPLAY: {
		color: "#fb0234",
		pattern: /globoplay/i,
	},
	PARAMOUNT: {
		icon: SiParamountplus,
		color: "#0064ff",
		pattern: /paramount/i,
	},
	CLAROVIDEO: {
		color: "#e1251b",
		pattern: /clarovideo/i,
	},
	DISNEYPLUS: {
		color: "#02d6e8",
		pattern: /disney+/i,
	},
	MUBI: {
		icon: SiMubi,
		color: "#000",
		pattern: /mubi/i,
	},
	DEFAULT: {
		color: "#000",
		pattern: null,
	},
};

const TitleInfo = ({ title, textAlign = "left", align = "flex-start" }) => (
	<Flex direction="column" align={align} textAlign={textAlign}>
		<Text
			fontWeight="semibold"
			fontSize={{ base: "2xl", md: "4xl", lg: "7xl" }}
			color="white"
			className="mb-2 lg:mb-10"
		>
			{title?.title}
		</Text>
		<HStack mb={2} separator={<span className="text-gray-200 px-2">•</span>}>
			{title?.year && (
				<Text color="gray.200" fontSize={{ base: "md", md: "lg" }}>
					{title.year}
				</Text>
			)}
			{title?.runtime_minutes && (
				<Text color="gray.200" fontSize={{ base: "md", md: "lg" }}>
					{Math.floor(title.runtime_minutes / 60)}h {title.runtime_minutes % 60}
					m
				</Text>
			)}
			{title?.us_rating && (
				<Badge
					colorScheme="red"
					variant="solid"
					fontSize="sm"
					px={2}
					py={1}
					borderRadius="md"
				>
					{title.us_rating}
				</Badge>
			)}
		</HStack>
		{/* Avaliações */}
		<HStack spacing={4} mb={3}>
			{title?.user_rating && (
				<HStack spacing={1}>
					<Text color="yellow.400" fontSize="lg">
						★
					</Text>
					<Text color="white" fontWeight="semibold" fontSize="md">
						{title.user_rating}/10
					</Text>
					<Text color="gray.300" fontSize="sm">
						IMDb
					</Text>
				</HStack>
			)}
			{title?.critic_score && (
				<HStack spacing={1}>
					<Text color="green.400" fontSize="lg">
						🍅
					</Text>
					<Text color="white" fontWeight="semibold" fontSize="md">
						{title.critic_score}%
					</Text>
					<Text color="gray.300" fontSize="sm">
						Crítica
					</Text>
				</HStack>
			)}
		</HStack>
		<HStack spacing={2} flexWrap="wrap">
			{title?.genre_names?.map((g) => (
				<Badge
					key={g}
					colorScheme="gray"
					variant="solid"
					fontSize="0.95em"
					px={2}
					py={0.5}
					bg="rgba(255,255,255,0.13)"
					color="white"
					borderRadius="md"
				>
					{g}
				</Badge>
			))}
		</HStack>
	</Flex>
);

const TitleDetails = ({ open, setOpen, title }) => {
	const getServiceConfig = (serviceName) => {
		for (const service of Object.values(STREAMING_SERVICES)) {
			if (service.pattern?.test(serviceName)) {
				return service;
			}
		}
		return STREAMING_SERVICES.DEFAULT;
	};

	const groupStreamingOptions = (sources) => {
		if (!Array.isArray(sources)) return [];

		const uniqueSources = sources.filter((source, index, self) => {
			return (
				index ===
				self.findIndex((s) => JSON.stringify(s) === JSON.stringify(source))
			);
		});

		const grouped = uniqueSources.reduce((acc, source) => {
			let key = source.source_id || source.name;
			let displayName = source.name;

			if (/amazon|prime/i.test(source.name)) {
				key = "prime_video";
				displayName = "Prime Video";
			}

			if (/globalplay/i.test(source.name)) {
				displayName = "Globoplay";
			}

			if (!acc[key]) {
				acc[key] = {
					name: displayName,
					source_id: key,
					options: [],
				};
			}
			acc[key].options.push(source);
			return acc;
		}, {});

		const processedGroups = Object.values(grouped).map((group) => {
			const typeGroups = group.options.reduce((acc, option) => {
				const typeKey = `${option.type}_${option.price || "free"}`;
				if (!acc[typeKey]) {
					acc[typeKey] = [];
				}
				acc[typeKey].push(option);
				return acc;
			}, {});

			const optimizedOptions = [];
			for (const typeGroup of Object.values(typeGroups)) {
				if (typeGroup.length === 1) {
					optimizedOptions.push(typeGroup[0]);
				} else {
					const prices = [...new Set(typeGroup.map((opt) => opt.price))];

					if (prices.length === 1) {
						const formatPriority = { "4K": 3, HD: 2, SD: 1 };
						const bestFormat = typeGroup.reduce((best, current) => {
							const bestPriority = formatPriority[best.format] || 0;
							const currentPriority = formatPriority[current.format] || 0;
							return currentPriority > bestPriority ? current : best;
						});
						optimizedOptions.push(bestFormat);
					} else {
						for (const option of typeGroup) {
							optimizedOptions.push({
								...option,
								showFormat: true,
							});
						}
					}
				}
			}

			return {
				...group,
				options: optimizedOptions,
			};
		});

		return processedGroups;
	};

	const groupedSources = groupStreamingOptions(title?.sources);

	const posterUrl = title?.posterLarge || title?.posterMedium || title?.poster;
	const hasPoster = Boolean(posterUrl);

	return (
		<DialogRoot
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			size={window && window.innerWidth < 768 ? "lg" : "cover"}
			motionPreset="slide-in-bottom"
		>
			<DialogContent overflow="auto" className="m-4">
				<Box
					position="relative"
					h={{ base: "50vh", lg: "50%" }}
					w="full"
					overflow="hidden"
				>
					<Image
						src={title?.backdrop}
						className="w-full h-full object-cover"
						w="full"
						h="full"
						position="absolute"
						top={0}
						left={0}
						zIndex={1}
						filter="blur(3px)"
						transform="scale(1.1)"
					/>
					<Box
						position="absolute"
						inset={0}
						backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)"
						zIndex={2}
					/>
					{hasPoster ? (
						<Flex
							direction={{ base: "column", md: "row" }}
							align={{ base: "center", md: "flex-end" }}
							justify="center"
							position="absolute"
							inset={0}
							zIndex={3}
							p={{ base: 4, lg: 6 }}
							gap={6}
						>
							<Box flexShrink={0}>
								<Image
									src={posterUrl}
									alt={title?.title}
									w={{ base: "200px", md: "250px" }}
									h="auto"
									boxShadow="2xl"
									borderRadius="2xl"
									border="5px solid white"
								/>
							</Box>
							<TitleInfo
								title={title}
								textAlign={{ base: "center", md: "left" }}
								align={{ base: "center", md: "flex-start" }}
							/>
						</Flex>
					) : (
						<Flex
							direction="column"
							align="center"
							justify="flex-end"
							position="absolute"
							inset={0}
							zIndex={3}
							p={{ base: 4, lg: 6 }}
						>
							<TitleInfo title={title} textAlign="center" align="center" />
						</Flex>
					)}
				</Box>
				<div className="flex-col text-center bg-gray-100 h-[50%] px-6 pb-6">
					<Text
						fontWeight="bold"
						py={8}
						w="full"
						className="text-lg lg:text-2xl"
					>
						{groupedSources.length
							? "Disponível nas plataformas de Streaming"
							: "Não disponível em nenhuma plataforma de Streaming"}
					</Text>
					<Flex wrap="wrap" gap={6} justify="center" borderRadius="xl" w="full">
						{Boolean(groupedSources.length) &&
							groupedSources.map((group) => {
								const serviceConfig = getServiceConfig(group.name);
								const Icon = serviceConfig.icon;

								const primaryOption = group.options[0];

								return (
									<Box
										key={group.source_id || group.name}
										bg="white"
										borderRadius="2xl"
										boxShadow="md"
										p={4}
										minW="270px"
										maxW="320px"
										flex="1 1 270px"
										display="flex"
										flexDirection="column"
										alignItems="flex-start"
										justifyContent="space-between"
									>
										<Flex direction="column" w="full">
											<Flex justifyContent="center" w="full">
												{Icon ? (
													<Box as={Icon} boxSize="60px" color="#000" />
												) : (
													<Text
														lineHeight="60px"
														fontSize="2xl"
														fontWeight="bold"
													>
														{group.name}
													</Text>
												)}
											</Flex>
											<Box w="full" mb={4}>
												{group.options.map((option, index) => {
													const typeLabel =
														option.type === "sub"
															? "Assinatura"
															: option.type === "rent"
																? "Aluguel"
																: option.type === "buy"
																	? "Compra"
																	: option.type;

													return (
														<Flex
															key={`${option.type}-${index}`}
															justify="space-between"
															w="full"
															py={2}
															borderBottom="1px solid"
															borderColor="gray.200"
														>
															<Badge
																colorScheme={
																	option.type === "sub"
																		? "green"
																		: option.type === "rent"
																			? "yellow"
																			: "blue"
																}
																fontSize="0.85em"
																borderRadius="md"
																px={2}
															>
																{typeLabel}
															</Badge>
															<Text
																fontWeight="bold"
																color="gray.800"
																fontSize="md"
															>
																{option.price
																	? `R$ ${Number(option.price).toFixed(2).replace(".", ",")}${option.showFormat ? ` (${option.format})` : ""}`
																	: "Incluído"}
															</Text>
														</Flex>
													);
												})}
											</Box>
										</Flex>
										<Button
											asChild
											w="full"
											py={3}
											borderRadius="md"
											bg={serviceConfig.color}
											color="white"
											fontWeight="semibold"
											fontSize="md"
											_hover={{ opacity: 0.9 }}
										>
											<a
												href={primaryOption.web_url}
												target="_blank"
												rel="noreferrer"
											>
												Acessar
											</a>
										</Button>
									</Box>
								);
							})}
					</Flex>
				</div>
				<DialogCloseTrigger onClick={() => setOpen(false)} zIndex={3} />
			</DialogContent>
		</DialogRoot>
	);
};

export default TitleDetails;
