import { Editor, EditorContent } from "@tiptap/react";
import { observer } from "mobx-react-lite";
import { ChangeEvent, ReactNode, useRef } from "react";
import {
  AiOutlineAlignCenter,
  AiOutlineAlignLeft,
  AiOutlineAlignRight,
  AiOutlineLink,
  AiOutlineUnderline,
  AiOutlineUndo,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { BiImage } from "react-icons/bi";
import { TbBold, TbItalic } from "react-icons/tb";
import { css } from "../../helpers/css";
import { Nullable } from "../../interfaces";
import AppStore from "../../store/App.store";
import CreateCompetitionStore from "../../store/CreateCompetition/CreateCompetition.store";
import Button, { Submit } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import Spinner, { SpinnerSize } from "../DSL/Spinner/Spinner";
import Text, { TextSize } from "../DSL/Text/Text";
import { useTipTapEditor } from "../TipTapEditor/TipTapEditor";
import { CompetitionStoreProp } from "./CreateCompetition";

const DescriptionView = observer(({ store }: CompetitionStoreProp) => {
  const editor = useTipTapEditor(
    store.description ? store.description : "",
    true
  );
  return (
    <Form
      onSubmit={async (values: any) => {
        store.onDescriptionSubmit(editor?.isEmpty ? null : editor!.getJSON());
      }}
    >
      <FormDisplay
        label={"Description"}
        description={"What do you want creators and voters to know?"}
      />
      <div className={css("flex", "flex-col", "gap-2")}>
        <div>
          <EditorContent editor={editor} />
          <div className={css("mt-1")}>
            <div>
              <Toolbar store={store} editor={editor!} />
            </div>
          </div>
        </div>
        <div className={css("w-full", "flex", "gap-2", "mt-4")}>
          <Button block onClick={() => store.goBack()}>
            Back
          </Button>
          <Submit block>Next</Submit>
        </div>
      </div>
    </Form>
  );
});

const Toolbar = observer(
  ({ editor, store }: { editor: Editor; store: CreateCompetitionStore }) => {
    const inputRef = useRef<Nullable<HTMLInputElement>>(null);
    return (
      <div className={css("flex", "justify-end")}>
        <ToolbarItem onClick={() => editor.chain().focus().undo().run()}>
          <Text>
            <AiOutlineUndo />
          </Text>
        </ToolbarItem>
        <div className={css("grid", "grid-rows-2", "grid-cols-6", "gap-[1px]")}>
          <ToolbarItem onClick={() => inputRef?.current?.click()}>
            {store.isLoading && <Spinner size={SpinnerSize.xxs} />}
            {!store.isLoading && (
              <Text>
                <BiImage />
              </Text>
            )}
            <input
              accept={AppStore.settings.acceptedMimeTypes.join(", ")}
              ref={inputRef}
              className={css("hidden")}
              name="file"
              type="file"
              multiple
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  store.onFileChange(e.target.files, (responses) => {
                    responses.forEach(({ data }) =>
                      editor?.chain().focus().setImage({ src: data.url }).run()
                    );
                  });
                }
              }}
            />
          </ToolbarItem>
          <input
            type="color"
            className={css("w-[20px]", "h-[20px]", "bg-transparent")}
            value={editor?.getAttributes("textStyle").color}
            onChange={(e) => {
              console.log("color", e.target.value);
              editor?.chain().focus().setColor(e.target.value).run();
            }}
          />

          <ToolbarItem
            isActive={editor?.isActive({ textAlign: "left" })}
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          >
            <Text>
              <AiOutlineAlignLeft />
            </Text>
          </ToolbarItem>
          <ToolbarItem
            isActive={editor?.isActive({ textAlign: "center" })}
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          >
            <Text>
              <AiOutlineAlignCenter />
            </Text>
          </ToolbarItem>
          <ToolbarItem
            isActive={editor?.isActive({ textAlign: "right" })}
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          >
            <Text>
              <AiOutlineAlignRight />
            </Text>
          </ToolbarItem>
          <ToolbarItem
            isActive={editor?.isActive("bulletList")}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <Text>
              <AiOutlineUnorderedList />
            </Text>
          </ToolbarItem>
          <ToolbarItem
            isActive={editor?.isActive("link")}
            onClick={() => editor?.chain().focus().toggleLink().run()}
          >
            <Text>
              <AiOutlineLink />
            </Text>
          </ToolbarItem>
          <ToolbarItem
            isActive={editor?.isActive("heading", { level: 1 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Text size={TextSize.xs}>H1</Text>
          </ToolbarItem>
          <ToolbarItem
            isActive={editor?.isActive("heading", { level: 2 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Text size={TextSize.xs}>H2</Text>
          </ToolbarItem>
          <ToolbarItem
            isActive={editor?.isActive("underline")}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <Text>
              <AiOutlineUnderline />
            </Text>
          </ToolbarItem>
          <ToolbarItem
            isActive={editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Text>
              <TbBold />
            </Text>
          </ToolbarItem>
          <ToolbarItem
            isActive={editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Text>
              <TbItalic />
            </Text>
          </ToolbarItem>
        </div>
      </div>
    );
  }
);

const ToolbarItem = observer(
  ({
    onClick,
    children,
    isActive,
  }: {
    onClick: () => void;
    children: ReactNode;
    isActive?: boolean;
  }) => {
    return (
      <span
        className={css(
          "cursor-pointer",
          "p-0.5",
          "rounded-sm",
          "flex",
          "items-center",
          "justify-center",
          "hover:bg-gray-100",
          "border-[1px]",
          "hover:border-black",
          "dark:hover:border-neutral-700",
          "dark:hover:bg-neutral-900",
          {
            "bg-gray-100 dark:bg-neutral-900 border-black dark:border-neutral-700":
              isActive,
            "border-transparent": !isActive,
          }
        )}
        onClick={() => onClick()}
      >
        {children}
      </span>
    );
  }
);

export default DescriptionView;
