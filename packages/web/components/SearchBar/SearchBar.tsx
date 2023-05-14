import { observer } from "mobx-react-lite";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { css } from "../../helpers/css";
import { abbreviate } from "../../helpers/strings";
import { Nullable } from "../../interfaces";
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
        onChange={(value) => store.setSearch(value)}
        placeholder={"enjoy"}
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
          "flex",
          "flex-col",
          "gap-1",
          { hidden: !store.showDropdown }
        )}
      >
        {store.isLoading && (
          <div className={css("flex", "justify-center")}>
            <Text type={TextType.Grey}>...</Text>
          </div>
        )}
        {!store.isLoading && (
          <>
            {store.hasMemes && (
              <div>
                <Text bold>Memes</Text>
                <div className={css("flex", "flex-col", "gap-0.5")}>
                  {store.data.memes.map((meme) => (
                    <SearchItem
                      href={`/meme/${meme.id}`}
                      image={meme.media.url}
                      key={`meme-search-item-${meme.id}`}
                    >
                      <Text type={TextType.NoColor}>{meme.name}</Text>
                    </SearchItem>
                  ))}
                </div>
              </div>
            )}
            {store.hasCompetitions && (
              <div>
                <Text bold>Competitions</Text>
                <div className={css("flex", "flex-col", "gap-0.5")}>
                  {store.data.competitions.map((comp) => (
                    <SearchItem
                      href={`/competition/${comp.id}`}
                      key={`comp-${comp.id}`}
                      image={comp.coverMedia?.url}
                    >
                      <div
                        className={css(
                          "w-full",
                          "flex",
                          "justify-between",
                          "items-center"
                        )}
                      >
                        <Text type={TextType.NoColor}>{comp.name}</Text>
                        {comp.isActive && <ActivePill />}
                      </div>
                    </SearchItem>
                  ))}
                </div>
              </div>
            )}

            {store.hasUsers && (
              <div>
                <Text bold>Users</Text>
                <div className={css("flex", "flex-col", "gap-0.5")}>
                  {store.data.users.map((user) => (
                    <SearchItem
                      key={`search-item-user-${user.address}`}
                      href={`/profile/${user.address}/meme`}
                      image={user.avatar}
                    >
                      <Text type={TextType.NoColor}>
                        {user.ens ? user.ens : abbreviate(user.address)}
                      </Text>
                    </SearchItem>
                  ))}
                </div>
              </div>
            )}

            {!store.hasResults && (
              <div className={css("text-center", "flex", "flex-col", "gap-1")}>
                <Text type={TextType.Grey}>No results</Text>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

interface SearchItemsProps {
  href: string;
  image?: Nullable<string>;
  children?: ReactNode;
}

const SearchItem = ({ href, children, image }: SearchItemsProps) => {
  return (
    <Link
      href={href}
      className={css(
        "flex",
        "items-center",
        "gap-2",
        "hover:dark:bg-neutral-800",
        "hover:bg-neutral-200",
        "p-1"
      )}
    >
      <div
        className={css(
          "relative",
          "w-[25px]",
          "h-[25px]",
          "bg-neutral-100",
          "dark:bg-neutral-700",
          "bg-cover",
          "bg-center",
          "bg-norepeat"
        )}
        style={image ? { backgroundImage: `url(${image})` } : {}}
      />
      {children}
    </Link>
  );
};

export default SearchBar;
