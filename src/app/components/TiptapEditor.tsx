"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export interface TiptapEditorProps {
  content: string;
  onChange?: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    paragraph: false,
    heading: false,
    bulletList: false,
  });

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: "prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none",
        },
      },
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
        updateActiveStates(editor);
      },
      onSelectionUpdate: ({ editor }) => {
        updateActiveStates(editor);
      },
      editable: true,
      autofocus: false,
      injectCSS: true,
      parseOptions: {
        preserveWhitespace: true,
      },
    },
    []
  );

  const updateActiveStates = (editor: Editor) => {
    setActiveStates({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      paragraph: !editor.isActive("heading") && !editor.isActive("bulletList"),
      heading: editor.isActive("heading", { level: 2 }),
      bulletList: editor.isActive("bulletList"),
    });
  };

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      updateActiveStates(editor);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md border-gray-300 overflow-hidden">
      <div className="border-b border-gray-200 p-2 space-x-2 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setActiveStates(prev => ({ ...prev, bold: !prev.bold }));
            editor.chain().focus().toggleBold().run();
          }}
          onMouseDown={(e) => e.preventDefault()}
          className={`p-2 rounded font-bold transition-colors ${
            activeStates.bold
              ? "bg-[#dc143c] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          type="button"
          title="Toggle bold"
        >
          B
        </button>
        <button
          onClick={() => {
            setActiveStates(prev => ({ ...prev, italic: !prev.italic }));
            editor.chain().focus().toggleItalic().run();
          }}
          onMouseDown={(e) => e.preventDefault()}
          className={`p-2 rounded italic transition-colors ${
            activeStates.italic
              ? "bg-[#dc143c] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          type="button"
          title="Toggle italic"
        >
          I
        </button>
        <button
          onClick={() => {
            setActiveStates(prev => ({ ...prev, heading: !prev.heading }));
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          onMouseDown={(e) => e.preventDefault()}
          className={`p-2 rounded font-semibold transition-colors ${
            activeStates.heading
              ? "bg-[#dc143c] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          type="button"
          title="Toggle heading"
        >
          H2
        </button>
        <button
          onClick={() => {
            setActiveStates(prev => ({ ...prev, bulletList: !prev.bulletList }));
            editor.chain().focus().toggleBulletList().run();
          }}
          onMouseDown={(e) => e.preventDefault()}
          className={`p-2 rounded transition-colors ${
            activeStates.bulletList
              ? "bg-[#dc143c] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          type="button"
          title="Toggle bullet list"
        >
          ◦◦◦
        </button>
        <button
          onClick={() => {
            setActiveStates(prev => ({ ...prev, paragraph: true, heading: false, bulletList: false }));
            editor.chain().focus().clearNodes().run();
          }}
          onMouseDown={(e) => e.preventDefault()}
          className={`p-2 rounded transition-colors ${
            activeStates.paragraph
              ? "bg-[#dc143c] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          type="button"
          title="Clear formatting"
        >
          ¶
        </button>
      </div>
      <div suppressHydrationWarning>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}