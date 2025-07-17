import {
	DialogCloseTrigger,
	DialogContent,
	DialogRoot,
} from "@/components/ui/dialog";
import { Badge, Box, Flex, HStack, Image, Link, Text } from "@chakra-ui/react";
import { FaGlobe } from "react-icons/fa";
import { SiAppletv, SiHbo, SiNetflix, SiPrime } from "react-icons/si";

const TitleDetails = ({ open, setOpen, title }) => {
	// Função para agrupar opções de streaming por source_id
	const groupStreamingOptions = (sources) => {
		if (!Array.isArray(sources)) return [];

		const grouped = sources.reduce((acc, source) => {
			const key = source.source_id || source.name;
			if (!acc[key]) {
				acc[key] = {
					name: source.name,
					source_id: source.source_id,
					options: [],
				};
			}
			acc[key].options.push(source);
			return acc;
		}, {});

		return Object.values(grouped);
	};

	const groupedSources = groupStreamingOptions(title?.sources);

	return (
		<DialogRoot
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			size="cover"
			motionPreset="slide-in-bottom"
		>
			<DialogContent overflow="auto">
				<Box
					position="relative"
					h={{ base: "280px", lg: "50%" }}
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
						filter="blur(5px)"
						transform="scale(1.1)"
					/>
					{/* Overlay gradiente escuro */}
					<Box
						position="absolute"
						inset={0}
						backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)"
						zIndex={2}
					/>
					{/* Conteúdo centralizado */}
					<Flex
						direction="column"
						align="center"
						justify="flex-end"
						position="absolute"
						inset={0}
						zIndex={3}
						p={{ base: 4, lg: 6 }}
					>
						<Text
							fontWeight="semibold"
							fontSize={{ base: "2xl", md: "4xl", lg: "7xl" }}
							color="white"
							mb={8}
						>
							{title?.title}
						</Text>
						<HStack
							mb={2}
							separator={<span className="text-gray-200 px-2">•</span>}
						>
							{title?.year && (
								<Text color="gray.200" fontSize={{ base: "md", md: "lg" }}>
									{title.year}
								</Text>
							)}
							{title?.runtime_minutes && (
								<Text color="gray.200" fontSize={{ base: "md", md: "lg" }}>
									{Math.floor(title.runtime_minutes / 60)}h{" "}
									{title.runtime_minutes % 60}m
								</Text>
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
				</Box>
				<div className="flex-col text-center bg-gray-100 h-[50%] px-6 pb-6">
					<Text textStyle="2xl" fontWeight="bold" py={8} w="full">
						{groupedSources.length
							? "Disponível nas plataformas de Streaming"
							: "Não disponível nas plataformas de Streaming"}
					</Text>
					<Flex wrap="wrap" gap={6} justify="center" borderRadius="xl" w="full">
						{groupedSources.length &&
							groupedSources.map((group) => {
								// Mapeamento de ícone por nome
								let Icon = FaGlobe;
								if (/prime/i.test(group.name)) Icon = SiPrime;
								if (/apple/i.test(group.name)) Icon = SiAppletv;
								if (/max/i.test(group.name)) Icon = SiHbo;
								if (/netflix/i.test(group.name)) Icon = SiNetflix;

								// Pegar a primeira opção para o link principal
								const primaryOption = group.options[0];

								return (
									<Box
										key={group.source_id || group.name}
										bg="white"
										borderRadius="xl"
										boxShadow="md"
										p={6}
										minW="270px"
										maxW="320px"
										flex="1 1 270px"
										display="flex"
										flexDirection="column"
										alignItems="flex-start"
										justifyContent="space-between"
									>
										{/* Cabeçalho do card */}
										<Flex align="center" w="full" mb={3}>
											<Box as={Icon} boxSize="36px" color="#222" mr={3} />
											<Box flex="1">
												<Text fontWeight="bold" fontSize="lg" color="gray.900">
													{group.name}
												</Text>
											</Box>
										</Flex>

										{/* Opções de streaming */}
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
														align="center"
														justify="space-between"
														w="full"
														py={2}
														borderBottom={
															index < group.options.length - 1
																? "1px solid"
																: "none"
														}
														borderColor="gray.100"
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
																? `R$ ${Number(option.price).toFixed(2)}`
																: "Incluído"}
														</Text>
													</Flex>
												);
											})}
										</Box>

										{/* Botão de ação */}
										<Link
											href={primaryOption.web_url}
											isExternal
											w="full"
											_hover={{ textDecoration: "none" }}
										>
											<Box
												as="button"
												w="full"
												py={3}
												borderRadius="md"
												bg={
													/prime/i.test(group.name)
														? "#232f3e"
														: /netflix/i.test(group.name)
															? "#e50914"
															: /apple/i.test(group.name)
																? "#111"
																: /max/i.test(group.name)
																	? "#6e47cf"
																	: "blue.600"
												}
												color="white"
												fontWeight="bold"
												fontSize="md"
												textAlign="center"
												transition="background 0.2s"
												_hover={{ opacity: 0.9 }}
											>
												Assistir agora
											</Box>
										</Link>
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
