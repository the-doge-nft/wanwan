import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";

import BulletList from "@tiptap/extension-bullet-list";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import TiptapText from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
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
import { textFieldBaseStyles } from "../DSL/Input/Input";
import { LinkType, linkTypeStyles } from "../DSL/Link/Link";
import Text, { TextSize } from "../DSL/Text/Text";
import { CompetitionStoreProp } from "./CreateCompetition";

const DescriptionView = observer(({ store }: CompetitionStoreProp) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      TiptapText,
      Dropcursor,
      ListItem,
      TextStyle,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Color.configure({
        types: ["textStyle"],
      }),
      Heading.configure({
        levels: [1, 2],
      }),
      History.configure({
        depth: 10,
      }),
      Underline.configure({
        HTMLAttributes: {
          class: "underline",
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "max-w-[200px] w-full mx-auto",
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: "italic",
        },
      }),
      Bold.configure({
        HTMLAttributes: {
          class: "font-bold",
        },
      }),
      Link.configure({
        autolink: true,
        openOnClick: true,
        HTMLAttributes: {
          class: css(linkTypeStyles[LinkType.Primary], "cursor-pointer"),
        },
      }),
      BulletList.configure({
        itemTypeName: "listItem",
        HTMLAttributes: {
          class: "list-disc list-inside",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: css(textFieldBaseStyles),
      },
    },
    content: store.description ? store.description : "",
  });
  return (
    <Form
      onSubmit={async (values: any) =>
        store.onDescriptionSubmit(editor!.getJSON())
      }
    >
      <FormDisplay
        label={"Description"}
        description={"What do you want creators and voters to know?"}
      />
      <div className={css("flex", "flex-col", "gap-2")}>
        <div>
          <EditorContent editor={editor} />
          <div className={css("mt-1")}>
            <div
            // className={css("flex", "items-center", {
            //   "justify-between": !store.showMediaInput,
            //   "justify-end": store.showMediaInput,
            // })}
            >
              {/* {!store.showMediaInput && (
                <Button onClick={() => (store.showMediaInput = true)}>
                  <BiImage />
                </Button>
              )} */}
              {editor && <Toolbar store={store} editor={editor} />}
            </div>

            {/* {AppStore.settings.mimeTypeToExtension && store.showMediaInput && (
              <div className={css("mt-1")}>
                <MediaInput
                  name={"file"}
                  onDropAccepted={(file) => (store.file = file)}
                  onClear={() => (store.file = null)}
                  maxSizeBytes={AppStore.settings.maxSizeBytes}
                  acceptedMimeToExtension={
                    AppStore.settings.mimeTypeToExtension
                  }
                  // disabled={store.isSubmitLoading}
                />
                <div className={css("flex", "justify-center", "mt-2")}>
                  {!store.file && (
                    <Button onClick={() => (store.showMediaInput = false)}>
                      Nevermind
                    </Button>
                  )}
                  {store.file && (
                    <Button
                      isLoading={store.isLoading}
                      onClick={() =>
                        store.postNewImage(store.file!).then(({ data }) => {
                          editor
                            ?.chain()
                            .focus()
                            .setImage({ src: data.url })
                            .run();
                          store.file = null;
                          store.showMediaInput = false;
                        })
                      }
                    >
                      Upload Image
                    </Button>
                  )}
                </div>
              </div>
            )} */}
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

const Toolbar = ({
  editor,
  store,
}: {
  editor: Editor;
  store: CreateCompetitionStore;
}) => {
  const inputRef = useRef<Nullable<HTMLInputElement>>(null);
  return (
    <div className={css("flex", "justify-end")}>
      <ToolbarItem onClick={() => editor.commands.undo()}>
        <Text>
          <AiOutlineUndo />
        </Text>
      </ToolbarItem>
      <div className={css("grid", "grid-rows-2", "grid-cols-6", "gap-[1px]")}>
        <ToolbarItem onClick={() => inputRef?.current?.click()}>
          <Text>
            <BiImage />
          </Text>
          <input
            accept={AppStore.settings.acceptedMimeTypes.join(", ")}
            ref={inputRef}
            className={css("hidden")}
            name="file"
            type="file"
            multiple
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              store.onFileChange(e.target.files, (responses) => {
                responses.forEach(({ data }) =>
                  editor?.chain().focus().setImage({ src: data.url }).run()
                );
              })
            }
          />
        </ToolbarItem>
        <input
          type="color"
          className={css("w-[20px]", "h-[20px]", "bg-transparent")}
          value={editor.getAttributes("textStyle").color}
          onChange={(e) => {
            console.log("color", e.target.value);
            editor.chain().focus().setColor(e.target.value).run();
          }}
        />

        <ToolbarItem
          isActive={editor?.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <Text>
            <AiOutlineAlignLeft />
          </Text>
        </ToolbarItem>
        <ToolbarItem
          isActive={editor?.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <Text>
            <AiOutlineAlignCenter />
          </Text>
        </ToolbarItem>
        <ToolbarItem
          isActive={editor?.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
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
          onClick={() => editor.commands.toggleHeading({ level: 1 })}
        >
          <Text size={TextSize.xs}>H1</Text>
        </ToolbarItem>
        <ToolbarItem
          isActive={editor?.isActive("heading", { level: 2 })}
          onClick={() => editor.commands.toggleHeading({ level: 2 })}
        >
          <Text size={TextSize.xs}>H2</Text>
        </ToolbarItem>
        <ToolbarItem
          isActive={editor?.isActive("underline")}
          onClick={() => editor.commands.toggleUnderline()}
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
};

const ToolbarItem = ({
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
};

export default DescriptionView;
