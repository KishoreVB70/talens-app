export const uploadAudio = async (
  audioBlob: Blob,
  questionId: number,
  interviewId: string
) => {
  const maxRetries = 3;
  const baseDelay = 1000; // Start with 1 second delay

  const attemptUpload = async (attempt: number): Promise<string> => {
    try {
      console.log(`Upload attempt ${attempt + 1}/${maxRetries}`, {
        questionId,
        interviewId,
        blobSize: audioBlob.size,
      });

      const formData = new FormData();
      formData.append("file", audioBlob, "audio.mp3");
      formData.append("questionId", questionId.toString());
      formData.append("interviewId", interviewId!);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (!response.ok) {
        throw new Error(`Upload failed: ${data.error || "Unknown error"}`);
      }

      return data.url;
    } catch (error) {
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        console.log(`Upload failed, retrying in ${delay}ms...`, error);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return attemptUpload(attempt + 1);
      }
      console.error("All upload attempts failed:", error);
      throw error;
    }
  };

  return attemptUpload(0);
};
