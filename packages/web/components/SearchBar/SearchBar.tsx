import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { css } from "../../helpers/css";
import SearchBarStore from "../../store/SearchBar.store";
import Input from "../DSL/Input/Input";
import Link from "../DSL/Link/Link";
import Text, { TextType } from "../DSL/Text/Text";

const SearchBar = observer(() => {
  const store = useMemo(() => new SearchBarStore(), []);
  return (
    <div className={css("font-normal", "py-1", "relative")}>
      <Input
        block
        value={store.search}
        onChange={(value) => {
          console.log(value);
          store.setSearch(value);
        }}
        placeholder={"search..."}
      />
      {store.showDropdown && (
        <div
          className={css(
            "absolute",
            "bg-white",
            "border-[1px]",
            "border-black",
            "w-full",
            "z-10",
            "mt-1",
            "p-2"
          )}
        >
          {store.hasMemes && (
            <div>
              <Text>Memes</Text>
            </div>
          )}
          {store.data.memes.map((meme) => (
            <div key={`meme-${meme.id}`}>
              <Link href={`/meme/${meme.id}`}>{meme.name}</Link>
            </div>
          ))}
          {store.hasCompetitions && (
            <div>
              <Text>Competitions</Text>
            </div>
          )}
          {store.data.competitions.map((comp) => (
            <div key={`comp-${comp.id}`}>
              <Link href={`/competition/${comp.id}`}>{comp.name}</Link>
            </div>
          ))}
          {store.hasUsers && (
            <div>
              <Text>Users</Text>
            </div>
          )}
          {store.data.users.map((user) => (
            <div key={`user-${user.address}`}>
              <Link href={`/profile/${user.address}/meme`}>{user.address}</Link>
            </div>
          ))}
          {!store.hasResults && (
            <div className={css("text-center")}>
              <Text type={TextType.Grey}>None found</Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default SearchBar;
