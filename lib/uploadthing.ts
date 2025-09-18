import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  portfolioImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Simple middleware without trying to extract itemId
      return { userId: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server after upload completes
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Return data to send to client
      return {
        uploadedBy: metadata.userId,
        url: file.url
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;