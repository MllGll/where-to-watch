import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { RateLimitProvider } from "../components/RateLimitContext";
import { Provider } from "../components/ui/provider";
import { Analytics } from "@vercel/analytics/next"

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["400", "600", "700"],
});

export const metadata = {
	title:
		"Onde Assistir - Descubra onde seus filmes e séries favoritos estão disponíveis",
	description:
		"Busque rapidamente onde assistir longas, curtas e séries em streaming no Brasil.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`
          ${geistMono.variable} 
          ${poppins.variable} 
          antialiased font-sans
        `}
			>
				<RateLimitProvider>
					<Provider>{children}</Provider>
				</RateLimitProvider>
				<Analytics />
			</body>
		</html>
	);
}
