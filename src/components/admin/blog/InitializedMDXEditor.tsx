"use client";
// InitializedMDXEditor.tsx
import "@mdxeditor/editor/style.css";
// import { mdxJsxFromMarkdown, mdxJsxToMarkdown } from "mdast-util-mdx-jsx";
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
} from "@mdxeditor/editor";
// import { toast } from "./ui/use-toast";

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
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
      className="break-words focus-within:bg-black/40"
      contentEditableClassName="bg-white outline-none  min-h-[300px] max-w-none text-lg caret-white prose prose-p:my-3 break-words prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-500 prose-code:before:content-[''] prose-code:after:content-['']"
    />
  );
}
