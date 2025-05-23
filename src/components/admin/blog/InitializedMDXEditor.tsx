// InitializedMDXEditor.tsx
"use client";
import "@/styles/editor-styles.css";

import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  InsertTable,
  DiffSourceToggleWrapper,
  BlockTypeSelect,
  CreateLink,
  Separator,
  ListsToggle,
  InsertThematicBreak,
  tablePlugin,
  diffSourcePlugin,
  directivesPlugin,
  DirectiveDescriptor,
  NestedLexicalEditor,
  linkDialogPlugin,
  linkPlugin,
} from "@mdxeditor/editor";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
// import { toast } from "./ui/use-toast";

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  const { resolvedTheme, systemTheme } = useTheme();
  const CalloutCustomDirectiveDescriptor: DirectiveDescriptor = {
    name: "callout",
    testNode(node) {
      return node.name === "callout";
    },
    attributes: [],
    hasChildren: true,
    Editor: (props) => {
      return (
        <div style={{ border: "1px solid red", padding: 8, margin: 8 }}>
          <NestedLexicalEditor
            block
            getContent={(node: any) => node.children}
            getUpdatedMdastNode={(mdastNode, children: any) => {
              return { ...mdastNode, children };
            }}
          />
        </div>
      );
    },
  };

  return (
    <MDXEditor
      plugins={[
        diffSourcePlugin({}),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        tablePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        directivesPlugin({
          directiveDescriptors: [CalloutCustomDirectiveDescriptor],
        }),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <CreateLink />
                <Separator />
                <ListsToggle />
                <Separator />
                <BlockTypeSelect />
                <InsertThematicBreak />
                <InsertTable />
              </DiffSourceToggleWrapper>
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
      className="dark-editor dark-theme prose prose-blue  w-full max-w-7xl break-words rounded-md border-2 text-lg dark:!text-white caret-prime outline-none dark:prose-invert prose-headings:my-4 prose-p:my-3 prose-p:leading-relaxed prose-blockquote:my-4 prose-code:px-1 prose-code:text-red-500 prose-code:before:content-[''] prose-code:after:content-[''] prose-ul:my-2 prose-li:my-0"
      contentEditableClassName="min-h-[400px]"
      // contentEditableClassName="outline-none  min-h-[300px] max-w-none text-lg prose prose-p:my-3 break-words prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-500 prose-code:before:content-[''] prose-code:after:content-['']"
    />
  );
}
