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
import Placeholder from "@tiptap/extension-placeholder";
import TiptapText from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
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
import AppStore from "../../store/App.store";
import Button, { Submit } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import MediaInput from "../DSL/Form/MediaInput";
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
      Placeholder.configure({
        placeholder: "Describe your competition",
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
              className={css("flex", "items-center", {
                "justify-between": !store.showMediaInput,
                "justify-end": store.showMediaInput,
              })}
            >
              {!store.showMediaInput && (
                <Button onClick={() => (store.showMediaInput = true)}>
                  <BiImage />
                </Button>
              )}
              {editor && <Toolbar editor={editor} />}
            </div>

            {AppStore.settings.mimeTypeToExtension && store.showMediaInput && (
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
            )}
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

const Toolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div
      className={css("flex", "justify-end", "items-center", "mt-1", "gap-1")}
    >
      <input
        type="color"
        className={css("w-[20px]", "h-[20px]", "bg-transparent")}
        value={editor.getAttributes("textStyle").color}
        onChange={(e) => {
          console.log("color", e.target.value);
          editor.chain().focus().setColor(e.target.value).run();
        }}
      />
      <ToolbarItem onClick={() => editor.commands.toggleUnderline()}>
        <AiOutlineUnderline />
      </ToolbarItem>

      <ToolbarItem
        editor={editor}
        onClick={() => editor.commands.setTextAlign("left")}
      >
        <AiOutlineAlignLeft />
      </ToolbarItem>
      <ToolbarItem
        editor={editor}
        onClick={() => editor.commands.setTextAlign("center")}
      >
        <AiOutlineAlignCenter />
      </ToolbarItem>
      <ToolbarItem
        editor={editor}
        onClick={() => editor.commands.setTextAlign("right")}
      >
        <AiOutlineAlignRight />
      </ToolbarItem>

      <ToolbarItem
        editor={editor}
        onClick={() => editor.commands.toggleHeading({ level: 1 })}
      >
        <Text size={TextSize.xs}>H1</Text>
      </ToolbarItem>
      <ToolbarItem
        editor={editor}
        onClick={() => editor.commands.toggleHeading({ level: 2 })}
      >
        <Text size={TextSize.xs}>H2</Text>
      </ToolbarItem>
      <ToolbarItem editor={editor} onClick={() => editor.commands.undo()}>
        <AiOutlineUndo />
      </ToolbarItem>
      <ToolbarItem
        editor={editor}
        isActiveName={"bold"}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        <TbBold />
      </ToolbarItem>
      <ToolbarItem
        editor={editor}
        isActiveName={"italic"}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <TbItalic />
      </ToolbarItem>
      <ToolbarItem
        editor={editor}
        isActiveName={"link"}
        onClick={() => editor?.chain().focus().toggleLink().run()}
      >
        <AiOutlineLink />
      </ToolbarItem>
      <ToolbarItem
        editor={editor}
        isActiveName={"bulletList"}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      >
        <AiOutlineUnorderedList />
      </ToolbarItem>
    </div>
  );
};

const ToolbarItem = ({
  editor,
  onClick,
  children,
  isActiveName,
}: {
  editor: Editor;
  onClick: () => void;
  children: ReactNode;
  isActiveName?: string;
}) => {
  return (
    <span
      className={css(
        "cursor-pointer",
        "p-0.5",
        "rounded-xs",
        "flex",
        "items-center",
        {
          "bg-neutral-400 dark:bg-neutral-700":
            isActiveName && editor?.isActive(isActiveName),
        }
      )}
      onClick={() => onClick()}
    >
      <Text>{children}</Text>
    </span>
  );
};

export default DescriptionView;
