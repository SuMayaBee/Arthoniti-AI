import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, projectName, files } = body;

    if (!(projectId && projectName && files && Array.isArray(files))) {
      return NextResponse.json(
        {
          success: false,
          message: 'Project ID, project name, and files are required',
        },
        { status: 400 }
      );
    }

    // Call the Python backend for S3 deployment
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Step 1: Upload files to S3
    const uploadResponse = await fetch(
      `${backendUrl}/website-builder/deploy-s3`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          project_name: projectName,
          files,
        }),
      }
    );

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok) {
      return NextResponse.json(
        { success: false, message: uploadResult.detail || 'S3 upload failed' },
        { status: uploadResponse.status }
      );
    }

    // Step 2: Deploy from S3 to CloudFront
    const s3FolderUri = `s3://${uploadResult.bucket}/${uploadResult.s3_folder}/`;

    const deployResponse = await fetch(
      `${backendUrl}/website-builder/deploy-sync`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          s3_folder_uri: s3FolderUri,
          project_name: projectName,
          build_command: 'npm run build',
          install_command: 'npm install',
        }),
      }
    );

    const deployResult = await deployResponse.json();

    if (!deployResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `S3 upload successful, but deployment failed: ${deployResult.detail || 'Unknown error'}`,
          s3Info: {
            deploymentId: uploadResult.deployment_id,
            s3Folder: uploadResult.s3_folder,
            bucket: uploadResult.bucket,
            filesUploaded: uploadResult.uploaded_files?.length || 0,
          },
        },
        { status: deployResponse.status }
      );
    }

    // Success - return both S3 and deployment info
    return NextResponse.json({
      success: true,
      message: '🎉 Project deployed successfully!',
      deployedUrl: deployResult.deployed_url,
      deploymentId: deployResult.deployment_id,
      projectName: deployResult.project_name,
      s3Info: {
        s3Folder: uploadResult.s3_folder,
        bucket: uploadResult.bucket,
        filesUploaded: uploadResult.uploaded_files?.length || 0,
      },
    });
  } catch (error) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during deployment' },
      { status: 500 }
    );
  }
}
