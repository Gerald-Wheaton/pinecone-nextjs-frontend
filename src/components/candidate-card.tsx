import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, MapPin, Star, Mail, Phone, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Candidate, CandidateTEST } from "@/types/recruitment"

interface CandidateCardProps {
  candidate: CandidateTEST
  className?: string
}

export function CandidateCard({ candidate, className }: CandidateCardProps) {
  // Calculate average performance rating
  // const avgRating =
  //   candidate.performance_reviews.length > 0
  //     ? candidate.performance_reviews.reduce(
  //         (sum, review) => sum + review.rating,
  //         0
  //       ) / candidate.performance_reviews.length
  //     : 0

  return (
    <Card className={cn("w-full mb-4", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-base flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              {candidate.first_name} {candidate.last_name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Briefcase className="h-3.5 w-3.5 mr-1.5" />
              {candidate.title}
              {/* • {candidate.experience} years */}
            </p>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              {candidate.work_location}
            </p>
          </div>
          <div className="bg-primary/10 text-primary font-medium rounded-full px-2.5 py-1 text-xs">
            {candidate.match_percentage}% Match
          </div>
        </div>

        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {candidate.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-muted text-xs px-2 py-0.5 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-2 mt-2">
          <div className="flex items-center justify-between">
            {/* <div className="flex items-center text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 mr-1 text-amber-500" />
              <span>{avgRating.toFixed(1)} avg rating</span>
            </div> */}
            <div className="flex gap-2">
              <a
                href={`mailto:${candidate.contact_details.email}`}
                className="text-primary hover:text-primary/80"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href={`tel:${candidate.contact_details.phone}`}
                className="text-primary hover:text-primary/80"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
