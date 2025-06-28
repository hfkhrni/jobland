import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    name: v.string(),
    image: v.optional(v.string()),
    email: v.string(),
    phone: v.string(),
    birthday: v.string(),
    type: v.string(),
    country: v.optional(v.string()),
    headline: v.optional(v.string()),
    summary: v.optional(v.string()),
    location: v.optional(v.string()),
    currentCompanyId: v.optional(v.id("companies")),
    currentPosition: v.optional(v.string()),
  }).index("email", ["email"]),

  industries: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }).index("name", ["name"]),

  skills: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }).index("name", ["name"]),

  companies: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    logo: v.optional(v.id("_storage")),
    website: v.optional(v.string()),
    industryId: v.optional(v.id("industries")),
    size: v.optional(v.string()), // "1-10", "11-50", "51-200", etc.
    location: v.optional(v.string()),
    foundedYear: v.optional(v.number()),
  })
    .index("name", ["name"])
    .index("industry", ["industryId"]),

  jobs: defineTable({
    title: v.string(),
    description: v.string(),
    companyId: v.id("companies"),
    location: v.string(),
    type: v.string(), // "full-time", "part-time", "contract", "internship"
    // level: v.string(), // "entry", "mid", "senior", "executive"
    salary: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        currency: v.string(),
      })
    ),
    requirements: v.array(v.string()),
    benefits: v.optional(v.array(v.string())),
    postedBy: v.id("users"),
    isActive: v.boolean(),
    createdAt: v.number(),
    applicationDeadline: v.optional(v.number()),
  })
    .index("company", ["companyId"])
    .index("postedBy", ["postedBy"])
    .index("isActive", ["isActive"])
    .index("createdAt", ["createdAt"]),

  complaints: defineTable({
    title: v.string(),
    description: v.string(),
    reportedBy: v.id("users"),
    targetType: v.string(), // "user", "company", "job", "post"
    targetId: v.string(), // ID of the reported entity
    status: v.string(), // "pending", "investigating", "resolved", "dismissed"
    // priority: v.string(), // "low", "medium", "high", "critical"
    assignedTo: v.optional(v.id("users")), // Admin/moderator
    // createdAt: v.number(),
    // updatedAt: v.number(),
    resolution: v.optional(v.string()),
  })
    .index("reportedBy", ["reportedBy"])
    .index("status", ["status"])
    .index("assignedTo", ["assignedTo"]),
  // .index("createdAt", ["createdAt"]),

  // Junction tables for many-to-many relationships
  userSkills: defineTable({
    userId: v.id("users"),
    skillId: v.id("skills"),
    // endorsements: v.optional(v.number()),
    // yearsOfExperience: v.optional(v.number()),
  })
    .index("user", ["userId"])
    .index("skill", ["skillId"])
    .index("userSkill", ["userId", "skillId"]),

  jobSkills: defineTable({
    jobId: v.id("jobs"),
    skillId: v.id("skills"),
    // required: v.boolean(), // true for required, false for preferred
  })
    .index("job", ["jobId"])
    .index("skill", ["skillId"]),

  jobApplications: defineTable({
    jobId: v.id("jobs"),
    applicantId: v.id("users"),
    status: v.string(), // "applied", "reviewing", "interviewed", "rejected", "hired"
    // appliedAt: v.number(),
    coverLetter: v.optional(v.string()),
    resume: v.optional(v.string()), // URL or file ID
    notes: v.optional(v.string()),
  })
    .index("job", ["jobId"])
    .index("applicant", ["applicantId"])
    .index("status", ["status"]),

  experiences: defineTable({
    userId: v.id("users"),
    companyId: v.optional(v.id("companies")),
    title: v.string(),
    companyName: v.string(), // In case company not in our DB
    description: v.optional(v.string()),
    startDate: v.string(), // "YYYY-MM" format
    endDate: v.optional(v.string()), // null for current position
    location: v.optional(v.string()),
    isCurrent: v.boolean(),
  })
    .index("user", ["userId"])
    .index("company", ["companyId"]),
});

export default schema;
