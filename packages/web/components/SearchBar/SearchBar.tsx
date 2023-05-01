import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useRef } from "react";
import { css } from "../../helpers/css";
import SearchBarStore from "../../store/SearchBar.store";
import ActivePill from "../ActivePill/ActivePill";
import Input from "../DSL/Input/Input";
import Link from "../DSL/Link/Link";
import Text, { TextType } from "../DSL/Text/Text";

const SearchBar = observer(() => {
  const store = useMemo(() => new SearchBarStore(), []);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        if (store.showDropdown) {
          store.showDropdown = false;
        }
      }
    };
    const clickOutsideIfEscape = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        store.showDropdown = false;
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("keydown", clickOutsideIfEscape, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("keydown", clickOutsideIfEscape, true);
    };
    // eslint-disable-next-line
  }, [ref]);
  return (
    <div className={css("font-normal", "py-1", "relative")}>
      <Input
        block
        value={store.search}
        onChange={(value) => {
          console.log(value);
          store.setSearch(value);
        }}
        placeholder={"enjoy memes"}
      />
      <div
        ref={ref}
        className={css(
          "absolute",
          "bg-white",
          "border-[1px]",
          "border-black",
          "dark:border-neutral-700",
          "dark:bg-neutral-900",
          "w-full",
          "z-10",
          "mt-1",
          "p-2",
          { hidden: !store.showDropdown }
        )}
      >
        {store.hasMemes && <Text bold>Memes</Text>}
        {store.data.memes.map((meme) => (
          <div key={`meme-${meme.id}`}>
            <Link href={`/meme/${meme.id}`}>{meme.name}</Link>
          </div>
        ))}
        {store.hasCompetitions && <Text bold>Competitions</Text>}
        {store.data.competitions.map((comp) => (
          <div
            key={`comp-${comp.id}`}
            className={css("flex", "justify-between", "w-full")}
          >
            <Link href={`/competition/${comp.id}`}>{comp.name}</Link>
            {comp.isActive && <ActivePill />}
          </div>
        ))}
        {store.hasUsers && <Text bold>Users</Text>}
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
    </div>
  );
});

export default SearchBar;
