interface QuestionDisplayProps {
  questionNumber: number
  questionTitle: string
  questionText: string
  instructions: string[]
}

export function QuestionDisplay({ questionTitle, questionText, instructions }: QuestionDisplayProps) {
  return (
    <div className="w-full mb-10  mt-5">
      <div className=" px-6 ">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl tracking-tight font-semibold leading-tight md:leading-tight]">
            {questionTitle}
          </h2>
          <p className="text-xl md:text-2xl tracking-tight opacity-50 leading-tight md:leading-tight">
            {questionText}
          </p>
        </div>

        {instructions && (
          <div className="space-y-4 border-t pt-5 border-foreground/15">
            <h3 className="text-xs font-semibold uppercase tracking-wide -mb-2">Interview Instructions</h3>
            <div className="space-y-1">
              {Array.isArray(instructions) ? (
                instructions.map((instruction, index) => (
                  <p key={index}>{instruction}</p>
                ))
              ) : (
                <p>{instructions}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}