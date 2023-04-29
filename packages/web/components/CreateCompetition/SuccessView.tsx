import { observer } from "mobx-react-lite";
import Image from "next/image";
import { css } from "../../helpers/css";
import Link from "../DSL/Link/Link";
import Text, { TextSize } from "../DSL/Text/Text";
import { CompetitionStoreProp } from "./CreateCompetition";
const SuccessView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <div>
      <div
        className={css(
          "text-center",
          "flex",
          "flex-col",
          "gap-4",
          "justify-center",
          "items-center"
        )}
      >
        <div>
          <Text>~~~</Text>
          <Text size={TextSize.lg}>Competition Created</Text>
          <Text>~~~</Text>
        </div>
        {store.competitionReceipt && store.competitionReceipt.coverMedia && (
          <Image
            alt={store.competitionReceipt.coverMedia.url}
            src={store.competitionReceipt.coverMedia.url}
            width={store.competitionReceipt.coverMedia.width}
            height={store.competitionReceipt.coverMedia.height}
          />
        )}
        <Link href={`/competition/${store.competitionReceipt?.id}`}>
          {store.competitionReceipt?.name}
        </Link>
      </div>
    </div>
  );
});
export default SuccessView;
