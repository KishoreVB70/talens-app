import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    console.log("Received upload request");
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const questionId = formData.get("questionId") as string;
    const interviewId = formData.get("interviewId") as string;

    console.log("Upload request details:", {
      questionId,
      interviewId,
      fileSize: file?.size,
      fileName: file?.name,
    });

    if (!file || !interviewId) {
      console.error("Missing required fields:", { file: !!file, interviewId });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const fileName = `answer_${interviewId}_${questionId}_${Date.now()}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("interview-answers")
      .upload(fileName, buffer, {
        contentType: "audio/mp3",
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("interview-answers").getPublicUrl(fileName);

    console.log("File uploaded to storage:", {
      fileName,
      publicUrl,
    });

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error in upload handler:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
