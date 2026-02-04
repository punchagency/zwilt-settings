"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import starterkit, { StarterKit } from "@tiptap/starter-kit";
import ToolBox from "./toolbox";
import { Heading } from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

type Props = {
  description: string;
  onChange: (richText: string) => void;
};

function Tiptap({ description, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      starterkit.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Underline,
      OrderedList,
      Placeholder.configure({
        placeholder: "Enter your description here",
      }),
      BulletList.configure({
        itemTypeName: "listItem",
      }),
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold p-4 ",
          level: [2],
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-[0.73vw] sm:prose lg:prose-[0.94vw] xl:prose-[1.25vw] mx-auto focus:outline-none rounded-md min-h-[10.42vw] w-full bg-white flex flex-col px-4 py-3 justify-start",
      },
    },
    autofocus: false,
    content: description,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && description && editor.getHTML() !== description) {
      editor.commands.setContent(description, false); // Use false to avoid resetting the cursor
    }
  }, [editor, description]);

  return (
    <div className="flex flex-col justify-stretch min-h-[13.02vw] text-[0.93vw] w-full border rounded-[0.78vw]">
      <ToolBox editor={editor} />
      <EditorContent
        editor={editor}
        placeholder="Enter your description here..."
        style={{ whiteSpace: "pre-line", border: "none" }}
      />
    </div>
  );
}

export default Tiptap;
