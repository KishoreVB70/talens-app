import { useAnswers } from "@/contexts/AnswersContext";
import { uploadAudio } from "@/lib/api-utils";
import { MutableRefObject } from "react";

export default function useUploadRecordedAudio(
  chunksRef: MutableRefObject<Blob[]>,
  questionId: number
) {
  const { interviewId } = useAnswers();

  const uploadRecordedAudio = async () => {
    console.log("Recording stopped, processing audio...");
    const audioBlob = new Blob(chunksRef.current, { type: "audio/mp3" });

    // Todo: assess requirement for this url
    // const audioUrl = URL.createObjectURL(audioBlob);
    try {
      const uploadedUrl = await uploadAudio(
        audioBlob,
        questionId,
        interviewId!
      );
      console.log("Audio uploaded successfully:", uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      throw error;
    }
  };

  return { uploadRecordedAudio };
}
