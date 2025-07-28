"use client";

import { Heading } from "@chakra-ui/react";
import { LuMonitorSmartphone } from "react-icons/lu";
import RateLimitCounter from "./RateLimitCounter";

const Header = () => (
	<div className="fixed top-0 left-0 w-full h-16 px-4 xl:px-96 bg-gray-900 shadow-lg z-50">
		<div className="h-full flex items-center justify-between">
			<div className="flex items-center gap-2">
				<LuMonitorSmartphone color="white" size="24" />
				<Heading fontWeight="bold" color="white" className="font-sans">
					Onde Assistir...
				</Heading>
			</div>
			<RateLimitCounter />
		</div>
	</div>
);

export default Header;
