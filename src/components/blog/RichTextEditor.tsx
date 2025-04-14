'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { Box, IconButton, Divider, Tooltip, TextField } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Title,
  Link as LinkIcon,
  Image as ImageIcon,
  FormatQuote,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor, onToggleMarkup }: { editor: any, onToggleMarkup: () => void }) => {
  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 0.5, 
      p: 1, 
      borderBottom: '1px solid #ccc',
      flexWrap: 'wrap',
      '& .MuiDivider-root': {
        mx: 1,
        height: 24,
        alignSelf: 'center'
      }
    }}>
      <Tooltip title="Bold">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive('bold') ? 'primary' : 'default'}
        >
          <FormatBold />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive('italic') ? 'primary' : 'default'}
        >
          <FormatItalic />
        </IconButton>
      </Tooltip>
      <Tooltip title="Underline">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          color={editor.isActive('underline') ? 'primary' : 'default'}
        >
          <FormatUnderlined />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      <Tooltip title="Heading 1">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          color={editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'}
        >
          <Title />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      <Tooltip title="Bullet List">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive('bulletList') ? 'primary' : 'default'}
        >
          <FormatListBulleted />
        </IconButton>
      </Tooltip>
      <Tooltip title="Numbered List">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive('orderedList') ? 'primary' : 'default'}
        >
          <FormatListNumbered />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      <Tooltip title="Blockquote">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          color={editor.isActive('blockquote') ? 'primary' : 'default'}
        >
          <FormatQuote />
        </IconButton>
      </Tooltip>

      <Tooltip title="Insert Link">
        <IconButton
          size="small"
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          color={editor.isActive('link') ? 'primary' : 'default'}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Insert Image">
        <IconButton
          size="small"
          onClick={() => {
            const url = window.prompt('Enter image URL');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        >
          <ImageIcon />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      <Tooltip title="Toggle HTML Markup">
        <IconButton
          size="small"
          onClick={onToggleMarkup}
        >
          <CodeIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default function RichTextEditor({ value, onChange, placeholder = 'Content' }: RichTextEditorProps) {
  const [showMarkup, setShowMarkup] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    parseOptions: {
      preserveWhitespace: true,
    }
  });

  const handleMarkupChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    editor?.commands.setContent(newValue);
  };

  return (
    <Box sx={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      overflow: 'hidden',
      '& .ProseMirror': {
        minHeight: '200px',
        padding: '1rem',
        '&:focus': {
          outline: 'none',
        },
        '&.ProseMirror-focused': {
          borderColor: '#1976d2',
        },
        '& p.is-editor-empty:first-child::before': {
          content: `"${placeholder}"`,
          color: '#adb5bd',
          float: 'left',
          pointerEvents: 'none',
          height: 0,
        },
        '& p': {
          margin: '0.5em 0',
        },
        '& ul, & ol': {
          padding: '0 1rem',
        },
        '& h1': {
          fontSize: '1.5rem',
          fontWeight: 'bold',
        },
        '& h2': {
          fontSize: '1.25rem',
          fontWeight: 'bold',
        },
        '& blockquote': {
          borderLeft: '3px solid #ccc',
          marginLeft: 0,
          paddingLeft: '1rem',
          color: '#666',
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
        },
        '& a': {
          color: '#1976d2',
          textDecoration: 'underline',
        },
      }
    }}>
      <MenuBar editor={editor} onToggleMarkup={() => setShowMarkup(!showMarkup)} />
      {showMarkup ? (
        <TextField
          multiline
          fullWidth
          value={editor?.getHTML() || ''}
          onChange={handleMarkupChange}
          placeholder={placeholder}
          sx={{
            '& .MuiInputBase-root': {
              fontFamily: 'monospace',
              minHeight: '200px',
            },
            '& .MuiInputBase-input': {
              padding: '1rem',
            },
          }}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </Box>
  );
}