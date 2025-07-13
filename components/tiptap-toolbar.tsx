// components\tiptap-toolbar.tsx
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, Link, Image, Code, Quote, Heading1, Heading2, Heading3, Undo, Redo,
} from "lucide-react";

interface TiptapToolbarProps {
  editor: Editor | null;
}

export function TiptapToolbar({ editor }: TiptapToolbarProps) {
  if (!editor) return null;

  const setLink = () => {
    const url = prompt("Enter the URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-300 bg-gray-50">
      <Button
        variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("bold") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("italic") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("underline") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("strike") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("blockquote") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("codeBlock") ? "default" : "outline"}
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={setLink}>
        <Link className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={addImage}>
        <Image className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}