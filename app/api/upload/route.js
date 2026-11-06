import { handleUploadPresigned } from "@vercel/blob/client";
import { issueSignedToken } from "@vercel/blob";

// Gives the applicant's browser a short-lived, single-file upload URL so the
// photo goes straight to Vercel Blob (avoids the 4.5 MB serverless body limit).
// Works with Blob stores connected via BLOB_STORE_ID (current Vercel default)
// or via BLOB_READ_WRITE_TOKEN (older stores).
const PATH = /^applications\/[A-Za-z0-9_-]{1,40}-[a-f0-9-]{36}\.[a-z0-9]{2,5}$/;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request) {
  const body = await request.json();
  try {
    const json = await handleUploadPresigned({
      body,
      request,
      // Only needed for upload-completed callbacks, which this site doesn't use.
      webhookPublicKey: process.env.BLOB_WEBHOOK_PUBLIC_KEY || "unused",
      getSignedToken: async (pathname) => {
        if (!PATH.test(pathname)) throw new Error("Invalid upload path.");
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes: TYPES,
          maximumSizeInBytes: MAX_BYTES,
          validUntil: Date.now() + 10 * 60 * 1000,
        });
        return { token, urlOptions: { allowedContentTypes: TYPES, maximumSizeInBytes: MAX_BYTES } };
      },
    });
    return Response.json(json);
  } catch (err) {
    console.error("Upload token error:", err);
    return Response.json({ error: err.message || "Upload failed." }, { status: 400 });
  }
}
