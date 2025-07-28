import { getTitleDetails } from "@/app/api";
import mockedTitle from "@/mocks/title";
import { Box, Card, Center, Spinner, Text } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { useRateLimit } from "./RateLimitContext";
import TitleDetails from "./TitleDetails";

const titleTypes = {
	tv_series: "SÉRIE",
	tv_miniseries: "MINISSÉRIE",
	movie: "LONGA",
	tv_movie: "LONGA",
	short_film: "CURTA",
};

const typeBgColor = {
	tv_series: "bg-amber-500",
	tv_miniseries: "bg-indigo-600",
	movie: "bg-red-600",
	tv_movie: "bg-red-600",
	short_film: "bg-fuchsia-600",
};

const TitleCard = ({ title }) => {
	const [details, setDetails] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openDetails, setOpenDetails] = useState(false);
	const [clickedTitleId, setClickedTitleId] = useState();

	const useMock = false;
	const { setRateLimit } = useRateLimit();

	const handleDetail = async () => {
		setClickedTitleId(title.id);
		try {
			setLoading(true);
			const data = useMock
				? mockedTitle
				: await getTitleDetails(title.id, setRateLimit);
			setDetails(data);
			setOpenDetails(true);
			setLoading(false);
			setClickedTitleId(null);
		} catch (error) {
			setLoading(false);
			setClickedTitleId(null);
			console.error(error.message);
		}
	};

	return (
		<Fragment>
			<Card.Root
				cursor="pointer"
				onClick={handleDetail}
				aspectRatio={2 / 3}
				overflow="hidden"
				className={`bg-gray-200 border-0 transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-gray-50 rounded-2xl ${loading && clickedTitleId === title.id ? "pointer-events-none" : ""}`}
			>
				<div
					className={`w-full absolute text-center ${typeBgColor[title.type]}`}
				>
					<Text color="white" fontWeight="semibold">
						{titleTypes[title.type]}
					</Text>
				</div>
				<Card.Body gap="1" className="justify-center text-center">
					<Card.Title className="text-gray-900">{title.name}</Card.Title>
					<Card.Description fontWeight="semibold" className="text-gray-500">
						{title.year}
					</Card.Description>
				</Card.Body>
				{loading && clickedTitleId === title.id && (
					<Box pos="absolute" inset="0" bg="bg/80">
						<Center h="full">
							<Spinner
								size="xl"
								color="gray.800"
								css={{ "--spinner-track-color": "colors.gray.200" }}
								borderWidth="4px"
								animationDuration="0.8s"
							/>
						</Center>
					</Box>
				)}
			</Card.Root>
			<TitleDetails
				open={openDetails}
				setOpen={setOpenDetails}
				title={details}
			/>
		</Fragment>
	);
};

export default TitleCard;
