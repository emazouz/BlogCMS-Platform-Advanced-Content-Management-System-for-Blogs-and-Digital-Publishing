"use client";

import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import ExtensionBubbleMenu from "@tiptap/extension-bubble-menu";
import ExtensionFloatingMenu from "@tiptap/extension-floating-menu";
import {
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Quote,
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
      ExtensionBubbleMenu,
      ExtensionFloatingMenu,
    ],
    content: content,
    onUpdate: ({ editor }: { editor: any }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8",
      },
    },
  });

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (err) {
        console.error(err);
        alert("Image upload failed");
      }
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden relative">
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex items-center gap-1 bg-white shadow-lg border rounded-lg p-1"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bold")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("italic")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("strike")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Quote size={16} className="rotate-180" />{" "}
            {/* Placeholder for strike */}
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href;
              const url = window.prompt("URL", previousUrl);
              if (url === null) return;
              if (url === "") {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .unsetLink()
                  .run();
                return;
              }
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("link")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600"
            }`}
            type="button"
          >
            <LinkIcon size={16} />
          </button>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex items-center gap-1 bg-white shadow-lg border rounded-lg p-1 -ml-6"
        >
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("heading", { level: 1 })
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Heading1 size={16} />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("heading", { level: 2 })
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600"
            }`}
            type="button"
          >
            <Heading2 size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bulletList")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600"
            }`}
            type="button"
          >
            <List size={16} />
          </button>
          <label className="p-2 rounded hover:bg-gray-100 cursor-pointer text-gray-600 hover:text-blue-600">
            <ImageIcon size={16} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={uploadImage}
            />
          </label>
        </FloatingMenu>
      )}

      <div className="bg-gray-50 border-b p-2 flex gap-2 text-xs text-gray-500">
        <span>Editor Mode</span>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
