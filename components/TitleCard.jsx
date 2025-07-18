import { getTitleDetails } from "@/app/api";
import mockedTitle from "@/mocks/title";
import { Card, Text } from "@chakra-ui/react";
import { Fragment, useState } from "react";
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
	const [openDetails, setOpenDetails] = useState(false);

	const useMock = false;

	const handleDetail = async () => {
		try {
			const data = useMock ? mockedTitle : await getTitleDetails(title.id);
			setDetails(data);
			setOpenDetails(true);
		} catch (error) {
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
				className="bg-gray-200 border-0 transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-gray-50 rounded-2xl"
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
