import { CandidateCard } from "@/components/candidate-card"
import type { Candidate, CandidateTEST } from "@/types/recruitment"

interface CandidateListProps {
  candidates: CandidateTEST[]
  isLoading?: boolean
  className?: string
}

export function CandidateList({
  candidates,
  isLoading = false,
  className,
}: CandidateListProps) {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">Potential Candidates</h2>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : candidates.length > 0 ? (
        <div className="space-y-4 overflow-y-auto pr-2 max-h-[600px]">
          {candidates.map((candidate, index) => (
            <CandidateCard key={index} candidate={candidate} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <p>Submit a job description to see matching candidates.</p>
        </div>
      )}
    </div>
  )
}
