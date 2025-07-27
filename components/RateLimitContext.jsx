"use client";

import React, { createContext, useContext, useState } from "react";

const RateLimitContext = createContext();

export function RateLimitProvider({ children }) {
	const [rateLimit, setRateLimit] = useState({
		limit: null,
		remaining: null,
		reset: null,
	});

	return (
		<RateLimitContext.Provider value={{ rateLimit, setRateLimit }}>
			{children}
		</RateLimitContext.Provider>
	);
}

export function useRateLimit() {
	return useContext(RateLimitContext);
}
