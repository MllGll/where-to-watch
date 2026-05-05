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
import { Trans } from "react-i18next";

const WATCHMODE_SIGNUP_URL = "https://api.watchmode.com/requestApiKey";

export default function ApiKeyDialog({
	isOpen,
	onClose,
	currentKeyType,
	onKeyChange,
	t,
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
					title: t("apiKeyDialog.successTitle"),
					description: t("apiKeyDialog.successDescription"),
					type: "success",
				});
				onClose();
			} else {
				toaster.create({
					title: t("apiKeyDialog.invalidTitle"),
					description: t("apiKeyDialog.invalidDescription"),
					type: "error",
				});
			}
		} catch {
			toaster.create({
				title: t("apiKeyDialog.errorTitle"),
				description: t("apiKeyDialog.errorDescription"),
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
					{t("apiKeyDialog.title")}
				</DialogTitle>
				<DialogDescription mt={2}>
					<Trans i18nKey="apiKeyDialog.description" components={{ bold: <strong /> }} />
				</DialogDescription>
				<HStack my={4}>
					<Link
						href={WATCHMODE_SIGNUP_URL}
						target="_blank"
						variant="underline"
						color="gray.800"
						fontWeight="bold"
					>
						{t("apiKeyDialog.getKey")}
						<LuExternalLink />
					</Link>
				</HStack>
				<Grid templateColumns="repeat(10, 1fr)" gap="2">
					<GridItem colSpan={typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 8}>
						<Input
							placeholder={t("apiKeyDialog.placeholder")}
							value={inputKey}
							onChange={(e) => setInputKey(e.target.value)}
							type="text"
							autoFocus
							autoComplete="off"
						/>
					</GridItem>
					<GridItem colSpan={typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 2}>
						<Button
							onClick={handleValidateAndSave}
							loading={loading}
							disabled={!inputKey}
							className="w-full"
						>
							{t("apiKeyDialog.update")}
						</Button>
					</GridItem>
				</Grid>
				<Status.Root colorPalette="blue" mt={2} className="items-baseline">
					<Status.Indicator className="animate-status-pulse" />
					{currentKeyType === "custom"
						? t("apiKeyDialog.usingPrivate")
						: t("apiKeyDialog.usingPublic")}
				</Status.Root>
				{showInfo && (
					<Alert.Root mt={2}>
						<Alert.Indicator />
						<Alert.Content>
							<Alert.Description>
								{t("apiKeyDialog.infoNotice")}
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
								<b>{t("apiKeyDialog.warningNotice")}</b>
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
