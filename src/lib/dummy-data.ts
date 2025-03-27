import type { Candidate } from "@/types/recruitment"

// Top 3 candidates with more detailed information
export const dummyCandidates: Candidate[] = [
  {
    id: "1",
    first_name: "Alex",
    last_name: "Johnson",
    contact_details: {
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
    },
    job_details: {
      title: "Senior Frontend Developer",
      experience: 6,
      skills: ["React", "TypeScript", "UI/UX", "Next.js"],
    },
    work_location: "San Francisco, CA (Remote)",
    performance_reviews: [
      { rating: 4.8, comment: "Excellent problem solver and team player" },
      { rating: 4.5, comment: "Consistently delivers high-quality code" },
    ],
    match_percentage: 95,
  },
  {
    id: "2",
    first_name: "Sam",
    last_name: "Rivera",
    contact_details: {
      email: "sam.rivera@example.com",
      phone: "+1 (555) 234-5678",
    },
    job_details: {
      title: "Full Stack Engineer",
      experience: 4,
      skills: ["Node.js", "React", "MongoDB", "AWS"],
    },
    work_location: "Austin, TX",
    performance_reviews: [
      { rating: 4.2, comment: "Great at implementing complex features" },
      { rating: 4.0, comment: "Good communication skills" },
    ],
    match_percentage: 88,
  },
  {
    id: "3",
    first_name: "Taylor",
    last_name: "Kim",
    contact_details: {
      email: "taylor.kim@example.com",
      phone: "+1 (555) 345-6789",
    },
    job_details: {
      title: "DevOps Engineer",
      experience: 5,
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    },
    work_location: "Seattle, WA (Hybrid)",
    performance_reviews: [
      { rating: 4.7, comment: "Excellent at automating deployment processes" },
      { rating: 4.3, comment: "Proactive in identifying and resolving issues" },
    ],
    match_percentage: 82,
  },
]
