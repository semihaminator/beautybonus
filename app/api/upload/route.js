import { handleUpload } from "@vercel/blob/client";

// Issues short-lived upload tokens so the applicant's browser can send the
// photo straight to Vercel Blob (avoids the 4.5 MB serverless body limit).
export async function POST(request) {
  const body = await request.json();
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("applications/")) throw new Error("Invalid upload path.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return Response.json(json);
  } catch (err) {
    return Response.json({ error: err.message || "Upload failed." }, { status: 400 });
  }
}
