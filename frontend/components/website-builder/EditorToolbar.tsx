"use client";

import DownloadIcon from "@/components/icons/DownloadIcon";
import { EyeIcon } from "@/components/icons/EyeIcon";
import RocketIcon from "@/components/icons/RocketIcon";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type EditorToolbarProps = {
  projectTitle?: string;
  deployedUrl?: string;
  deployLoading?: boolean;
  onDeploy: () => void;
  onDownload: () => void;
  onOpenDeployed?: () => void;
};

export function EditorToolbar({
  projectTitle,
  deployedUrl,
  deployLoading = false,
  onDeploy,
  onDownload,
  onOpenDeployed,
}: EditorToolbarProps) {
  const handleOpenDeployed = () => {
    if (onOpenDeployed) {
      onOpenDeployed();
    } else if (deployedUrl) {
      window.open(deployedUrl, "_blank");
    }
  };

  return (
    <div className="flex items-center justify-between p-3">
      <TabsList>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <div className="flex items-center gap-2">
        {projectTitle && (
          <span className="mx-2 hidden truncate font-medium text-gray-700 text-sm xl:inline">
            {projectTitle}
          </span>
        )}

        {deployedUrl && (
          <Button
            aria-label="Open deployed site"
            className="flex items-center justify-center rounded-full border border-primary-500 bg-white px-3 py-2 text-gray-700"
            onClick={handleOpenDeployed}
          >
            <EyeIcon color="text-gray-700" size={18} />
          </Button>
        )}

        <Button
          className="flex items-center justify-center rounded-full border border-primary-500 bg-white px-3 py-2 text-gray-700"
          onClick={onDownload}
        >
          <DownloadIcon color="text-gray-700" size={18} />
        </Button>

        <Button
          className="flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
          disabled={deployLoading}
          onClick={onDeploy}
        >
          <RocketIcon color="text-white" size={18} />
          <span className="hidden md:inline-block">
            {deployLoading ? "Deploying…" : "Deploy"}
          </span>
        </Button>
      </div>
    </div>
  );
}
