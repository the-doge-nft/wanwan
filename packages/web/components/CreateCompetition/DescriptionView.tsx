import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";

import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapText from "@tiptap/extension-text";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { TbBold, TbItalic } from "react-icons/tb";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import Button, { Submit } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import MediaInput from "../DSL/Form/MediaInput";
import { textFieldBaseStyles } from "../DSL/Input/Input";
import { CompetitionStoreProp } from "./CreateCompetition";

const DescriptionView = observer(({ store }: CompetitionStoreProp) => {
  const editor = useEditor({
    // element: document.getElementsByName("test")[0],
    extensions: [
      Document,
      Paragraph,
      TiptapText,
      Dropcursor,
      Image,
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
    ],
    // content: "<p>Enter a description for your competition</p>",
    editorProps: {
      attributes: {
        class: css(textFieldBaseStyles),
      },
    },
  });
  return (
    <Form onSubmit={async (values: any) => store.onDescriptionSubmit(values)}>
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
                  Add Image
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
    <div className={css("flex", "justify-end", "mt-1", "gap-1")}>
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
  isActiveName: string;
}) => {
  return (
    <span
      className={css("cursor-pointer", "p-0.5", "rounded-xs", {
        "bg-neutral-400": editor?.isActive(isActiveName),
      })}
      onClick={() => onClick()}
    >
      {children}
    </span>
  );
};

export default DescriptionView;
