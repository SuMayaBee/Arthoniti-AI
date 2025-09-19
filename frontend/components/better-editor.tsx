"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  LiTextBold as Bold,
  LiTextItalic as Italic,
  LiTextUnderline as Underline,
  LiList as List,
  LiListArrowDown as ListOrdered,
  LiText as Heading1,
  LiText as Heading2,
  LiText as Heading3,
} from "solar-icon-react/li";
import Image from "next/image";

interface BetterEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  isSaving: boolean;
  logoUrl?: string;
}

export default function BetterEditor({
  content,
  onChange,
  onSave,
  isSaving,
  logoUrl,
}: BetterEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFormatActive, setIsFormatActive] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const contentRef = useRef<string>(content);

  // Convert markdown to HTML for display
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-4 mt-8">$1</h2>')
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-lg font-semibold mb-3 mt-6">$1</h3>'
      )
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      // Handle bullet points properly - wrap in ul tags to avoid double bullets
      .replace(/^((?:- .*\n?)+)/gm, (match) => {
        const items = match.split('\n').filter(line => line.trim().startsWith('- '));
        const listItems = items.map(item => 
          `<li class="mb-2">${item.replace(/^- /, '')}</li>`
        ).join('');
        return `<ul class="list-disc ml-6 mb-4">${listItems}</ul>`;
      })
      // Handle numbered lists properly - wrap in ol tags
      .replace(/^((?:\d+\. .*\n?)+)/gm, (match) => {
        const items = match.split('\n').filter(line => /^\d+\. /.test(line.trim()));
        const listItems = items.map(item => 
          `<li class="mb-2">${item.replace(/^\d+\. /, '')}</li>`
        ).join('');
        return `<ol class="list-decimal ml-6 mb-4">${listItems}</ol>`;
      })
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, "<br/>")
      .replace(/^/, '<p class="mb-4">')
      .replace(/$/, "</p>");
  };

  // Convert HTML back to markdown
  const htmlToMarkdown = (html: string) => {
    return html
      .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
      .replace(/<em>(.*?)<\/em>/g, "*$1*")
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      .replace(/<h1[^>]*>(.*?)<\/h1>/g, "# $1")
      .replace(/<h2[^>]*>(.*?)<\/h2>/g, "## $1")
      .replace(/<h3[^>]*>(.*?)<\/h3>/g, "### $1")
      // Handle unordered lists
      .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, content) => {
        const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
        return items.map((item: string) => 
          item.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, "- $1")
        ).join('\n');
      })
      // Handle ordered lists
      .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (match, content) => {
        const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
        return items.map((item: string, index: number) => 
          item.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, `${index + 1}. $1`)
        ).join('\n');
      })
      .replace(/<\/p><p[^>]*>/g, "\n\n")
      .replace(/<br\/?>/g, "\n")
      .replace(/<p[^>]*>/g, "")
      .replace(/<\/p>/g, "")
      .trim();
  };

  // Save and restore selection
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0).cloneRange();
    }
    return null;
  }, []);

  const restoreSelection = useCallback((range: Range | null) => {
    if (range) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);

  // Update active formatting states
  const updateActiveStates = useCallback(() => {
    if (!editorRef.current) return;

    setIsFormatActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  }, []);

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return;

    const htmlContent = editorRef.current.innerHTML;
    const markdownContent = htmlToMarkdown(htmlContent);

    // Only trigger onChange if content actually changed
    if (markdownContent !== contentRef.current) {
      contentRef.current = markdownContent;
      onChange(markdownContent);
    }
  }, [onChange, htmlToMarkdown]);

  // Handle formatting commands with better UX
  const handleFormat = useCallback(
    (command: string, event?: React.MouseEvent) => {
      if (!editorRef.current) return;

      // Prevent default button behavior
      event?.preventDefault();

      // Save current selection
      const savedRange = saveSelection();

      // Ensure editor is focused
      editorRef.current.focus();

      // Restore selection if it was lost
      if (savedRange) {
        restoreSelection(savedRange);
      }

      // Apply formatting
      try {
        switch (command) {
          case "bold":
            document.execCommand("bold", false);
            break;
          case "italic":
            document.execCommand("italic", false);
            break;
          case "underline":
            document.execCommand("underline", false);
            break;
          case "h1":
            document.execCommand("formatBlock", false, "h1");
            break;
          case "h2":
            document.execCommand("formatBlock", false, "h2");
            break;
          case "h3":
            document.execCommand("formatBlock", false, "h3");
            break;
          case "ul":
            document.execCommand("insertUnorderedList", false);
            break;
          case "ol":
            document.execCommand("insertOrderedList", false);
            break;
        }
      } catch (error) {
        console.warn("Format command failed:", error);
      }

      // Update active states and trigger content change
      setTimeout(() => {
        updateActiveStates();
        handleContentChange();
      }, 10);
    },
    [saveSelection, restoreSelection, updateActiveStates, handleContentChange]
  );

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            handleFormat("bold");
            break;
          case "i":
            e.preventDefault();
            handleFormat("italic");
            break;
          case "u":
            e.preventDefault();
            handleFormat("underline");
            break;
          case "s":
            e.preventDefault();
            onSave();
            break;
        }
      }
    },
    [handleFormat, onSave]
  );

  // Handle selection change to update active states
  const handleSelectionChange = useCallback(() => {
    setTimeout(() => updateActiveStates(), 10);
  }, [updateActiveStates]);

  // Initialize editor content only once
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = markdownToHtml(content);
      contentRef.current = content;
      setIsInitialized(true);
    }
  }, [content, isInitialized, markdownToHtml]);

  // Update content only when prop changes and differs from current content
  useEffect(() => {
    if (editorRef.current && isInitialized && content !== contentRef.current) {
      const savedRange = saveSelection();
      editorRef.current.innerHTML = markdownToHtml(content);
      contentRef.current = content;
      // Restore selection after content update
      setTimeout(() => {
        if (savedRange) {
          restoreSelection(savedRange);
        }
      }, 10);
    }
  }, [content, isInitialized, saveSelection, restoreSelection, markdownToHtml]);

  // Set up event listeners
  useEffect(() => {
    const handleDocumentSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        handleSelectionChange();
      }
    };

    document.addEventListener("selectionchange", handleDocumentSelectionChange);
    return () => {
      document.removeEventListener(
        "selectionchange",
        handleDocumentSelectionChange
      );
    };
  }, [handleSelectionChange]);

  return (
    <div className="h-full flex flex-col">
      {/* Professional Toolbar */}
      <div className="flex justify-between items-center p-3 border-b bg-gray-50">
        <div
          className="flex gap-1 border rounded-lg p-1 bg-white"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Button
            variant={isFormatActive.bold ? "default" : "ghost"}
            size="sm"
            onClick={(e) => handleFormat("bold", e)}
            className="h-8 w-8 p-0"
            title="Bold (Ctrl+B)"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={isFormatActive.italic ? "default" : "ghost"}
            size="sm"
            onClick={(e) => handleFormat("italic", e)}
            className="h-8 w-8 p-0"
            title="Italic (Ctrl+I)"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={isFormatActive.underline ? "default" : "ghost"}
            size="sm"
            onClick={(e) => handleFormat("underline", e)}
            className="h-8 w-8 p-0"
            title="Underline (Ctrl+U)"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleFormat("h1", e)}
            className="h-8 w-8 p-0"
            title="Heading 1"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleFormat("h2", e)}
            className="h-8 w-8 p-0"
            title="Heading 2"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleFormat("h3", e)}
            className="h-8 w-8 p-0"
            title="Heading 3"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleFormat("ul", e)}
            className="h-8 w-8 p-0"
            title="Bullet List"
            onMouseDown={(e) => e.preventDefault()}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleFormat("ol", e)}
            className="h-8 w-8 p-0"
            title="Numbered List"
            onMouseDown={(e) => e.preventDefault()}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
        {/* Hide save button - save is triggered by tick button */}
        {/* <Button onClick={onSave} disabled={isSaving} size="sm">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button> */}
      </div>

      {/* Document Editor */}
      <div className="flex-1 overflow-hidden scrollbar-hide edit-mode-scrollbar-hide">
        <div className="h-full overflow-y-auto bg-gray-100 py-2 scrollbar-hide edit-mode-scrollbar-hide">
          <div className="flex justify-center">
            <div className="space-y-4 w-full flex flex-col items-center">
              {(() => {
                // Split content into pages (approximate based on content length)
                const wordsPerPage = 500;
                const words = content.split(" ");
                const totalPages = Math.ceil(words.length / wordsPerPage);

                const pages = [];
                for (let i = 0; i < totalPages; i++) {
                  const startWord = i * wordsPerPage;
                  const endWord = Math.min((i + 1) * wordsPerPage, words.length);
                  const pageWords = words.slice(startWord, endWord);
                  const pageContent = markdownToHtml(pageWords.join(" "));
                  pages.push(pageContent);
                }

                return pages.map((pageContent, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg relative w-full max-w-[794px] md:min-h-[1123px]"
                    style={{
                      fontFamily: "Times, serif",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    {/* Logo on every page */}
                    {logoUrl && (
                      <div className="p-4 sm:p-6 md:p-10 lg:p-12 pb-0">
                        <Image
                          src={logoUrl}
                          alt="Company logo"
                          width={256}
                          height={64}
                          unoptimized
                          loader={({ src }) => src}
                          className="h-12 sm:h-16 w-auto object-contain mb-6 sm:mb-8"
                        />
                      </div>
                    )}

                    {/* Editable Content - only on first page */}
                    {index === 0 ? (
                      <div
                        ref={editorRef}
                        className="p-4 sm:p-6 md:p-10 lg:p-12 pt-0 prose prose-sm max-w-none edit-mode-no-border"
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          minHeight: "800px",
                          cursor: "text",
                        }}
                        contentEditable
                        suppressContentEditableWarning={true}
                        onInput={handleContentChange}
                        onMouseUp={handleSelectionChange}
                        onKeyUp={handleSelectionChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleSelectionChange}
                      />
                    ) : (
                      <div
                        className="p-4 sm:p-6 md:p-10 lg:p-12 pt-0 prose prose-sm max-w-none"
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          lineHeight: "1.6",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: pageContent,
                        }}
                      />
                    )}

                    {/* Page number */}
                    <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-[10px] sm:text-xs text-gray-500">
                      Page {index + 1} of {pages.length}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Named export for better compatibility with dynamic imports
export { BetterEditor };
