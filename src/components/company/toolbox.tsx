"use client";
import React from "react";
import { type Editor } from "@tiptap/react";

import { PiCaretDown, PiTextItalicLight } from "react-icons/pi";
import { GoCode, GoListOrdered } from "react-icons/go";
import { RiListUnordered } from "react-icons/ri";
import { TbBold } from "react-icons/tb";
import { FiAlignLeft, FiAlignRight } from "react-icons/fi";
import { AiOutlineUnderline } from "react-icons/ai";

type Props = {
  editor: Editor | null;
};

const ToolBox = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    action: () => void
  ) => {
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation(); // Stop event from bubbling up
    action(); // Execute the action
  };

  return (
    <div className="bg-[#F4F4FA] opacity-[200%] rounded-t-[15px] flex items-center gap-[0.83vw] py-[0.625vw] px-[0.625vw]">
      {[
        {
          action: () =>
            editor.chain().focus().toggleHeading({ level: 4 }).run(),
          icon: "Normal",
          check: editor.isActive("heading"),
          type: "heading",
        },
        {
          action: () => editor.chain().focus().toggleItalic().run(),
          icon: <PiCaretDown />,
          check: editor.isActive("italic"),
          type: "italic",
        },
        {
          action: () => editor.chain().focus().toggleBold().run(),
          icon: <TbBold />,
          check: editor.isActive("bold"),
          type: "bold",
        },
        {
          action: () => editor.chain().focus().toggleItalic().run(),
          icon: <PiTextItalicLight />,
          check: editor.isActive("italic"),
          type: "italic",
        },
        {
          action: () => editor.chain().focus().toggleUnderline().run(),
          icon: <AiOutlineUnderline />,
          check: editor.isActive("underline"),
          type: "underline",
        },
        {
          action: () => editor.chain().focus().toggleCode().run(),
          icon: <GoCode />,
          check: editor.isActive("orderedlist"),
          type: "orderedlist",
        },
        {
          action: () => editor.chain().focus().toggleOrderedList().run(),
          icon: <GoListOrdered />,
          check: editor.isActive("orderedlist"),
          type: "orderedlist",
        },
        {
          action: () => editor.chain().focus().toggleBulletList().run(),
          icon: <RiListUnordered />,  
          check: editor.isActive("bulletList"),
          type: "bulletList",
        },
        {
          action: () => editor.chain().focus().setTextAlign("right").run(),
          icon: <FiAlignRight />,
          check: editor.isActive({ textAlign: "center" }),
          type: "align",
        },
        {
          action: () => editor.chain().focus().setTextAlign("left").run(),
          icon: <FiAlignLeft />,
          check: editor.isActive({ textAlign: "center" }),
          type: "align",
        },
      ].map((button, index) => (
        <button
          key={index}
          type="button"
          onClick={(event) => handleButtonClick(event, button.action)}
          className={`text-[0.925vw] p-1 rounded-lg active:scale-75 transform-cpu ease-in-out duration-100 ${
            button.check
              ? "border bg-white "
              : "border-transparent hover:bg-white"
          }`}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};

export default ToolBox;
