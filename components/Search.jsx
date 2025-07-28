import { Button } from "@/components/ui/button";
import { Group, Input, InputAddon } from "@chakra-ui/react";

const Search = ({ setSearchValue, handleSearch, loading }) => (
	<Group attached className="px-4 xl:px-96">
		<InputAddon
			fontWeight="bold"
			className="bg-gray-300 text-gray-900 rounded-lg border-0 text-sm lg:text-lg"
		>
			Onde assistir
		</InputAddon>
		<Input
			placeholder="digite o nome da produção"
			onChange={({ target }) => setSearchValue(target.value)}
			onKeyDown={(event) => {
				if (event.key === "Enter") handleSearch();
			}}
			role="search"
			className="bg-white border-0 rounded-lg text-sm lg:text-lg"
		/>
		<Button
			fontWeight="bold"
			onClick={handleSearch}
			loading={loading}
			className="bg-gray-300 text-gray-900 border-0 rounded-lg text-sm lg:text-lg"
		>
			?
		</Button>
	</Group>
);

export default Search;
