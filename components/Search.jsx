import { Button } from "@/components/ui/button";
import { Group, Input, InputAddon } from "@chakra-ui/react";

const Search = ({ setSearchValue, handleSearch, loading }) => (
	<Group attached className="px-96">
		<InputAddon
			size="xl"
			fontWeight="bold"
			className="bg-gray-300 text-gray-900 rounded-lg border-0"
		>
			Onde assistir
		</InputAddon>
		<Input
			placeholder="digite o nome da produção"
			onChange={({ target }) => setSearchValue(target.value)}
			onKeyDown={(event) => {
				if (event.key === "Enter") handleSearch();
			}}
			size="xl"
			role="search"
			className="bg-white border-0"
		/>
		<Button
			size="xl"
			fontWeight="bold"
			onClick={handleSearch}
			loading={loading}
			className="bg-gray-300 text-gray-900 border-0 rounded-lg"
		>
			?
		</Button>
	</Group>
);

export default Search;
