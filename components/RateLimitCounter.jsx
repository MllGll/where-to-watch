import { Badge, Box, HStack, IconButton, Separator } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuCircleHelp } from "react-icons/lu";
import ApiKeyDialog from "./ApiKeyDialog";
import { useRateLimit } from "./RateLimitContext";
import { Tooltip } from "./ui/tooltip";
export default function RateLimitCounter() {
	const { rateLimit } = useRateLimit();
	const { limit, remaining } = rateLimit || {};
	const used = limit != null && remaining != null ? limit - remaining : null;

	const [isDialogOpen, setDialogOpen] = useState(false);
	const [keyType, setKeyType] = useState("public");

	useEffect(() => {
		const customKey = localStorage.getItem("watchmode_api_key");
		if (customKey) setKeyType("custom");
	}, []);

	const handleKeyChange = (type) => {
		setKeyType(type);
	};

	return (
		<>
			<HStack spacing={2}>
				<Box
					border="1px solid white"
					color="white"
					px={4}
					py={1.5}
					borderRadius="md"
					fontWeight="bold"
					fontSize="md"
					textAlign="center"
					display="flex"
					gap={4}
				>
					<span className="hidden lg:inline">Uso:</span>
					{used != null && limit != null ? `${used}/${limit}` : "-/-"}
					{keyType === "custom" && (
						<Badge
							variant="solid"
							colorPalette="purple"
							fontSize="0.8em"
							className="hidden lg:flex"
						>
							Chave customizada
						</Badge>
					)}
					<Separator orientation="vertical" />
					<Tooltip
						content="Clique para mais informações"
						showArrow
						openDelay={0}
						closeDelay={0}
					>
						<IconButton
							variant="ghost"
							rounded="full"
							className="min-w-0 h-auto bg-transparent"
							onClick={() => setDialogOpen(true)}
						>
							<LuCircleHelp color="white" />
						</IconButton>
					</Tooltip>
				</Box>
			</HStack>
			<ApiKeyDialog
				isOpen={isDialogOpen}
				onClose={() => setDialogOpen(false)}
				currentKeyType={keyType}
				onKeyChange={handleKeyChange}
			/>
		</>
	);
}
