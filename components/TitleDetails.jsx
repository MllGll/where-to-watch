import {
	DialogCloseTrigger,
	DialogContent,
	DialogRoot,
} from "@/components/ui/dialog";
import { Image, Text } from "@chakra-ui/react";

const TitleDetails = ({ open, setOpen, title }) => {
	return (
		<DialogRoot open={open} size="full" motionPreset="slide-in-bottom">
			<DialogContent>
				<div className="relative h-[50vh] w-full overflow-hidden">
					<div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-50px_100px_0_rgba(0,_0,_0,_1)]" />
					<Image src={title?.backdrop} className="w-full h-full" />
					<div className="absolute bottom-4 inset-x-0 flex-col text-center">
						<Text textStyle="7xl" color="white">
							{title?.title}
						</Text>
						<Text textStyle="2xl" color="white">
							{title?.year}
						</Text>
					</div>
				</div>
				<div className="flex-col text-center">
					<Text textStyle="2xl">Disponível em:</Text>
					<span>{JSON.stringify(title?.sources)}</span>
				</div>
				<DialogCloseTrigger onClick={() => setOpen(false)} />
			</DialogContent>
		</DialogRoot>
	);
};

export default TitleDetails;
