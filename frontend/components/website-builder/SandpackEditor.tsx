"use client";

import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";
import { TabsContent } from "@/components/ui/tabs";

type SandpackEditorProps = {
  files: Record<string, string>;
  activeFile: string;
  version: number;
  onFilesChange?: (files: Record<string, string>) => void;
  children?: React.ReactNode;
  isGenerating?: boolean;
};

export function SandpackEditor({
  files,
  activeFile,
  version,
  children,
  isGenerating = false,
}: SandpackEditorProps) {
  if (Object.keys(files).length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          {isGenerating ? (
            <>
              <div className="mb-4 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              </div>
              <div className="mb-2 text-gray-500 text-lg">
                Generating your website code...
              </div>
              <div className="text-gray-400 text-sm">
                Please wait while we create your website
              </div>
            </>
          ) : (
            <>
              <div className="mb-2 text-gray-500 text-lg">
                No code generated yet
              </div>
              <div className="text-gray-400 text-sm">
                Start a conversation to generate your website code
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <SandpackProvider
      customSetup={{
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
        },
      }}
      files={files}
      key={version}
      options={{
        activeFile,
        autorun: false,
        autoReload: true,
        externalResources: ["https://cdn.tailwindcss.com"],
      }}
      template="react"
      theme={nightOwl}
    >
      {children}
      {/* <div className="h-full"> */}
      <TabsContent className="m-0 flex" value="code">
        <div className="hidden w-60 overflow-auto border-gray-200 border-r md:block">
          <SandpackFileExplorer
            autoHiddenFiles
            className="text-sm"
            style={{ height: "75vh" }}
          />
        </div>
        <div className="flex-1 overflow-auto">
          <SandpackCodeEditor
            className="text-xs md:text-sm"
            showInlineErrors
            showLineNumbers
            style={{ height: "75vh" }}
            wrapContent
          />
        </div>
      </TabsContent>
      <TabsContent className="m-0 h-full" value="preview">
        <SandpackPreview
          showNavigator
          showOpenInCodeSandbox={false}
          showRefreshButton={true}
          style={{ height: "75vh" }}
        />
      </TabsContent>
      {/* </div> */}
    </SandpackProvider>
  );
}
