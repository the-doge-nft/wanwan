import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import TiptapText from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import {
  EditorContent,
  EditorOptions,
  JSONContent,
  useEditor,
} from "@tiptap/react";
import { observer } from "mobx-react-lite";
import { ChangeEvent, ReactNode, useEffect, useMemo, useRef } from "react";
import {
  AiOutlineAlignCenter,
  AiOutlineAlignLeft,
  AiOutlineAlignRight,
  AiOutlineUnderline,
  AiOutlineUndo,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { BiImage } from "react-icons/bi";
import { TbBold, TbItalic } from "react-icons/tb";
import { css } from "../../helpers/css";
import { Nullable } from "../../interfaces";
import AppStore from "../../store/App.store";
import TipTapEditorToolbarStore from "../../store/TipTapEditorToolbar.store";
import { textFieldBaseStyles, textFieldBorderStyles } from "../DSL/Input/Input";
import { LinkType, linkTypeStyles } from "../DSL/Link/Link";
import Spinner, { SpinnerSize } from "../DSL/Spinner/Spinner";
import Text, { TextSize } from "../DSL/Text/Text";

export const getTipTapEditorExtensions = () => [
  Document,
  Paragraph,
  TiptapText,
  Dropcursor.configure({ class: "text-black dark:text-white" }),
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
      class: "max-w-[150px] w-full mx-auto inline-block p-1",
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
];

export const useTipTapEditor = (
  content?: JSONContent | string,
  border?: boolean,
  readonly?: boolean,
  options?: Partial<EditorOptions>
) => {
  return useEditor({
    extensions: getTipTapEditorExtensions(),
    editorProps: {
      attributes: {
        class: css(textFieldBaseStyles, {
          [textFieldBorderStyles]: border,
          "resize-y": border,
          "!px-0 !py-0": readonly,
        }),
      },
    },
    content: content,
    ...options,
  });
};

interface TipTapEditorProps {
  content?: JSONContent | string;
  readonly?: boolean;
  border?: boolean;
  onUpdate?: (content: JSONContent) => void;
}

const TipTapEditor = ({
  content,
  readonly = false,
  border = true,
  onUpdate,
}: TipTapEditorProps) => {
  const editor = useTipTapEditor(
    content,
    border,
    readonly,
    onUpdate ? { onUpdate: ({ editor }) => onUpdate(editor.getJSON()) } : {}
  );
  const store = useMemo(() => new TipTapEditorToolbarStore(), []);
  const colorInputRef = useRef<Nullable<HTMLInputElement>>(null);

  useEffect(() => {
    if (readonly) {
      editor?.setEditable(false);
    }
  }, [editor, readonly]);

  if (!editor) {
    return null;
  }

  return (
    <div>
      <EditorContent editor={editor} className={css("break-all")} />
      <div className={css("mt-1")}>
        {!readonly && (
          <div className={css("flex", "justify-end")}>
            <ToolbarItem onClick={() => editor.chain().focus().undo().run()}>
              <Text>
                <AiOutlineUndo />
              </Text>
            </ToolbarItem>
            <div
              className={css("grid", "grid-rows-2", "grid-cols-6", "gap-[1px]")}
            >
              <ToolbarItem onClick={() => colorInputRef?.current?.click()}>
                {store.isLoading && <Spinner size={SpinnerSize.xxs} />}
                {!store.isLoading && (
                  <Text>
                    <BiImage />
                  </Text>
                )}
                <input
                  accept={AppStore.settings.acceptedMimeTypes.join(", ")}
                  ref={colorInputRef}
                  className={css("hidden")}
                  name="file"
                  type="file"
                  multiple
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                      store.onFileChange(e.target.files, (responses) => {
                        responses.forEach(({ data }) =>
                          editor
                            ?.chain()
                            .focus()
                            .setImage({ src: data.url })
                            .run()
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
                  editor?.chain().focus().setColor(e.target.value).run();
                }}
              />

              <ToolbarItem
                active={editor?.isActive({ textAlign: "left" })}
                onClick={() =>
                  editor?.chain().focus().setTextAlign("left").run()
                }
              >
                <Text>
                  <AiOutlineAlignLeft />
                </Text>
              </ToolbarItem>
              <ToolbarItem
                active={editor?.isActive({ textAlign: "center" })}
                onClick={() =>
                  editor?.chain().focus().setTextAlign("center").run()
                }
              >
                <Text>
                  <AiOutlineAlignCenter />
                </Text>
              </ToolbarItem>
              <ToolbarItem
                active={editor?.isActive({ textAlign: "right" })}
                onClick={() =>
                  editor?.chain().focus().setTextAlign("right").run()
                }
              >
                <Text>
                  <AiOutlineAlignRight />
                </Text>
              </ToolbarItem>
              <ToolbarItem
                active={editor?.isActive("bulletList")}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                <Text>
                  <AiOutlineUnorderedList />
                </Text>
              </ToolbarItem>
              {/* <ToolbarItem
                active={editor?.isActive("link")}
                // TODO: Add link support
                // onClick={() => editor?.chain().focus().toggleLink().run()}
                onClick={() => {}}
              >
                <Text>
                  <AiOutlineLink />
                </Text>
              </ToolbarItem> */}
              <ToolbarItem
                active={editor?.isActive("heading", { level: 1 })}
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }
              >
                <Text size={TextSize.xs}>H1</Text>
              </ToolbarItem>
              <ToolbarItem
                active={editor?.isActive("heading", { level: 2 })}
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                <Text size={TextSize.xs}>H2</Text>
              </ToolbarItem>
              <ToolbarItem
                active={editor?.isActive("underline")}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
              >
                <Text>
                  <AiOutlineUnderline />
                </Text>
              </ToolbarItem>
              <ToolbarItem
                active={editor.isActive("bold")}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <Text>
                  <TbBold />
                </Text>
              </ToolbarItem>
              <ToolbarItem
                active={editor?.isActive("italic")}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <Text>
                  <TbItalic />
                </Text>
              </ToolbarItem>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ToolbarItemProps {
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
}

const ToolbarItem = observer(
  ({ onClick, children, active, disabled }: ToolbarItemProps) => {
    return (
      <button
        type={"button"}
        disabled={disabled}
        className={css(
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
              active,
            "border-transparent": !active,
            "cursor-pointer": !disabled,
          }
        )}
        onClick={() => onClick()}
      >
        {children}
      </button>
    );
  }
);

export default TipTapEditor;
