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
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { css } from "../../helpers/css";
import { textFieldBaseStyles, textFieldBorderStyles } from "../DSL/Input/Input";
import { LinkType, linkTypeStyles } from "../DSL/Link/Link";

interface TipTapEditorProps {
  content: JSONContent;
  readonly?: boolean;
  border?: boolean;
}

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
      class: "max-w-[150px] w-full mx-auto inline-block",
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
  content: JSONContent | string,
  border?: boolean
) => {
  return useEditor({
    extensions: getTipTapEditorExtensions(),
    editorProps: {
      attributes: {
        class: css(textFieldBaseStyles, {
          [textFieldBorderStyles]: border,
          "resize-y": border,
        }),
      },
    },
    content: content,
  });
};

const TipTapEditor = ({
  content,
  readonly = false,
  border = true,
}: TipTapEditorProps) => {
  const editor = useTipTapEditor(content, border);
  useEffect(() => {
    if (readonly) {
      editor?.setEditable(false);
    }
  }, [editor, readonly]);
  return <EditorContent editor={editor} />;
};

export default TipTapEditor;
