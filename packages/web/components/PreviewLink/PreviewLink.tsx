import { css } from "../../helpers/css";
import AspectRatio from "../DSL/AspectRatio/AspectRatio";
import Link from "../DSL/Link/Link";

interface PreviewLinkProps {
  link: string;
  ratio: string;
  backgroundImage?: string;
  background?: string;
  name?: string | null;
  description?: string | null;
}

const PreviewLink: React.FC<PreviewLinkProps> = ({
  link,
  ratio,
  name,
  description,
  backgroundImage,
  background,
}) => {
  return (
    <div className={css()}>
      <Link href={link} className={css("w-full")}>
        <div
          className={css(
            "max-w-full",
            "h-full",
            "hover:border-red-700",
            "border-[1px]",
            "h-[115px]",
            "overflow-y-hidden"
          )}
        >
          <AspectRatio
            className={css(
              "max-w-[300px]",
              "bg-cover",
              "bg-center",
              "bg-no-repeat",
              "h-full"
            )}
            ratio={ratio}
            style={{
              backgroundImage,
              background,
            }}
          />
        </div>
      </Link>
      <div className={css("text-xs")}>
        {name && (
          <div
            className={css(
              "font-bold",
              "whitespace-nowrap",
              "overflow-hidden",
              "overflow-ellipsis"
            )}
          >
            {name}
          </div>
        )}
        {description && (
          <div
            className={css(
              "text-slate-700",
              "whitespace-nowrap",
              "overflow-hidden",
              "overflow-ellipsis"
            )}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewLink;
