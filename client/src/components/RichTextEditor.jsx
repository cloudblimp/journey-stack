import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-stone-200 p-2 mb-4 flex flex-wrap gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('bold')
            ? 'bg-emerald-800 text-white'
            : 'text-zinc-600 hover:bg-stone-100'
        }`}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('italic')
            ? 'bg-emerald-800 text-white'
            : 'text-zinc-600 hover:bg-stone-100'
        }`}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('strike')
            ? 'bg-emerald-800 text-white'
            : 'text-zinc-600 hover:bg-stone-100'
        }`}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-emerald-800 text-white'
            : 'text-zinc-600 hover:bg-stone-100'
        }`}
      >
        heading
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('bulletList')
            ? 'bg-emerald-800 text-white'
            : 'text-zinc-600 hover:bg-stone-100'
        }`}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('orderedList')
            ? 'bg-emerald-800 text-white'
            : 'text-zinc-600 hover:bg-stone-100'
        }`}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('blockquote')
            ? 'bg-emerald-800 text-white'
            : 'text-zinc-600 hover:bg-stone-100'
        }`}
      >
        quote
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="px-2 py-1 rounded text-zinc-600 hover:bg-stone-100"
      >
        hr
      </button>
    </div>
  );
};

export default function RichTextEditor({ 
  content = '', 
  onUpdate,
  placeholder = 'Write your story...' 
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onUpdate) {
        onUpdate(html);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-zinc max-w-none min-h-[200px] focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      // Only update if content changed to avoid cursor jumps
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  return (
    <div className="border border-stone-200 rounded-lg bg-white">
      <MenuBar editor={editor} />
      <div className="px-4 pb-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}