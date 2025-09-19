"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeploymentData = {
  deployedUrl?: string;
  deploymentId?: string;
  projectName?: string;
  message?: string;
  s3Info?: {
    s3Folder: string;
    bucket: string;
    filesUploaded: number;
  };
};

type DeploymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  error: string | null;
  deployData: DeploymentData | null;
};

export function DeploymentDialog({
  open,
  onOpenChange,
  loading,
  error,
  deployData,
}: DeploymentDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {loading && "Deploying your project…"}
            {error && !loading && "Deployment failed"}
            {!(error || loading) && "Deployment successful"}
          </DialogTitle>
          <DialogDescription>
            {loading && "Please wait while we upload and deploy your project."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {deployData && !loading && !error && (
            <div className="space-y-2 text-sm">
              {deployData.deployedUrl && (
                <div>
                  <span className="font-medium">Deployed URL:</span>{" "}
                  <a
                    className="text-primary-600 underline"
                    href={deployData.deployedUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {deployData.deployedUrl}
                  </a>
                </div>
              )}

              {deployData.deploymentId && (
                <div>
                  <span className="font-medium">Deployment ID:</span>{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5">
                    {deployData.deploymentId}
                  </code>
                </div>
              )}

              {deployData.projectName && (
                <div>
                  <span className="font-medium">Project:</span>{" "}
                  {deployData.projectName}
                </div>
              )}

              {deployData.s3Info && (
                <div className="mt-2 rounded-md border p-2">
                  <div className="font-medium">S3 Details</div>
                  <div className="text-gray-600 text-xs">
                    Folder: {deployData.s3Info.s3Folder}
                  </div>
                  <div className="text-gray-600 text-xs">
                    Bucket: {deployData.s3Info.bucket}
                  </div>
                  <div className="text-gray-600 text-xs">
                    Files uploaded: {deployData.s3Info.filesUploaded}
                  </div>
                </div>
              )}

              {deployData.message && (
                <div className="text-gray-600">{deployData.message}</div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          {!loading && (
            <Button onClick={() => onOpenChange(false)} variant="secondary">
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
