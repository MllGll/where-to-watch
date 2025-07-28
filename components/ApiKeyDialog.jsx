import {
	Alert,
	Button,
	CloseButton,
	Grid,
	GridItem,
	HStack,
	Input,
	Link,
	Status,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { LuExternalLink } from "react-icons/lu";
import {
	DialogCloseTrigger,
	DialogContent,
	DialogDescription,
	DialogRoot,
	DialogTitle,
} from "./ui/dialog";
import { Toaster, toaster } from "./ui/toaster";

const WATCHMODE_SIGNUP_URL = "https://api.watchmode.com/requestApiKey";

export default function ApiKeyDialog({
	isOpen,
	onClose,
	currentKeyType,
	onKeyChange,
}) {
	const [inputKey, setInputKey] = useState("");
	const [loading, setLoading] = useState(false);
	const [showInfo, setShowInfo] = useState(true);
	const [showWarning, setShowWarning] = useState(true);

	useEffect(() => {
		if (isOpen) {
			setInputKey("");
			setLoading(false);
			setShowInfo(true);
			setShowWarning(true);
		}
	}, [isOpen]);

	const handleValidateAndSave = async () => {
		setLoading(true);
		// Faz uma requisição de teste para validar a chave
		try {
			const res = await fetch(`/api/validate-key?apiKey=${inputKey}`);
			const data = await res.json();
			if (res.ok && data.valid) {
				localStorage.setItem("watchmode_api_key", inputKey);
				onKeyChange("custom");
				toaster.create({
					title: "Chave salva com sucesso!",
					description: "Sua chave foi validada e armazenada.",
					type: "success",
				});
				onClose();
			} else {
				toaster.create({
					title: "Chave inválida",
					description:
						"Não foi possível validar sua chave. Verifique e tente novamente.",
					type: "error",
				});
			}
		} catch {
			toaster.create({
				title: "Erro na validação",
				description:
					"Ocorreu um erro ao validar sua chave. Tente novamente mais tarde.",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<DialogRoot open={isOpen} onOpenChange={onClose} size="lg">
			<DialogContent p={6} className="mx-4">
				<DialogTitle fontWeight="bold" fontSize="xl">
					Chave de API
				</DialogTitle>
				<DialogDescription mt={2}>
					Este site utiliza uma <b>chave pública</b> compartilhada entre todos
					os usuários para acessar a API do Watchmode. Como o uso é coletivo, o
					limite de requisições pode ser atingido rapidamente. Se preferir, você
					pode usar sua própria chave. Caso ainda não tenha uma, acesse o link
					abaixo.
				</DialogDescription>
				<HStack my={4}>
					<Link
						href={WATCHMODE_SIGNUP_URL}
						target="_blank"
						variant="underline"
						color="gray.800"
						fontWeight="bold"
					>
						Obter chave no Watchmode
						<LuExternalLink />
					</Link>
				</HStack>
				<Grid templateColumns="repeat(10, 1fr)" gap="2">
					<GridItem colSpan={window.innerWidth < 768 ? 10 : 8}>
						<Input
							placeholder="Insira sua chave Watchmode aqui"
							value={inputKey}
							onChange={(e) => setInputKey(e.target.value)}
							type="text"
							autoFocus
							autoComplete="off"
						/>
					</GridItem>
					<GridItem colSpan={window.innerWidth < 768 ? 10 : 2}>
						<Button
							onClick={handleValidateAndSave}
							loading={loading}
							disabled={!inputKey}
							className="w-full"
						>
							ATUALIZAR
						</Button>
					</GridItem>
				</Grid>
				<Status.Root colorPalette="blue" mt={2} className="items-baseline">
					<Status.Indicator className="animate-status-pulse" />
					{currentKeyType === "custom"
						? "No momento você está usando uma chave privada"
						: "No momento você está usando uma chave pública"}
				</Status.Root>
				{showInfo && (
					<Alert.Root mt={2}>
						<Alert.Indicator />
						<Alert.Content>
							<Alert.Description>
								Não se preocupe, sua chave nunca será enviada para terceiros e
								será armazenada apenas no seu navegador.
							</Alert.Description>
						</Alert.Content>
						<CloseButton
							pos="relative"
							top="-2"
							insetEnd="-2"
							onClick={() => setShowInfo(false)}
						/>
					</Alert.Root>
				)}
				{showWarning && (
					<Alert.Root status="warning" mt={2}>
						<Alert.Indicator />
						<Alert.Content>
							<Alert.Description>
								<b>
									Ao clicar em "Atualizar", será feito um teste para validar a
									chave através de uma requisição e consumido 1 crédito.
								</b>
							</Alert.Description>
						</Alert.Content>
						<CloseButton
							pos="relative"
							top="-2"
							insetEnd="-2"
							onClick={() => setShowWarning(false)}
						/>
					</Alert.Root>
				)}
				<DialogCloseTrigger className="bg-inherit hover:bg-gray-100" />
			</DialogContent>
			<Toaster />
		</DialogRoot>
	);
}
