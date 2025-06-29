// convex/users.ts
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get current user profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db.get(userId);
  },
});

// Get user's saved jobs
export const getUserSavedJobs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const savedJobs = await ctx.db
      .query("savedJobs")
      .withIndex("user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const jobsWithDetails = await Promise.all(
      savedJobs.map(async (savedJob) => {
        const job = await ctx.db.get(savedJob.jobId);
        if (!job) return null;

        let company = null;
        if (job.companyId) {
          company = await ctx.db.get(job.companyId);
          company = {
            ...company,
            logo: company?.logo ? await ctx.storage.getUrl(company.logo) : null,
          };
        }
        return {
          ...job,
          company,
          savedAt: savedJob.savedAt,
        };
      })
    );

    return jobsWithDetails.filter(Boolean);
  },
});

// Get user's complaints
export const getUserComplaints = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("complaints")
      .withIndex("reportedBy", (q) => q.eq("reportedBy", userId))
      .order("desc")
      .collect();
  },
});

// Get user's skills
export const getUserSkills = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const userSkills = await ctx.db
      .query("userSkills")
      .withIndex("user", (q) => q.eq("userId", userId))
      .collect();

    const skillsWithDetails = await Promise.all(
      userSkills.map(async (userSkill) => {
        const skill = await ctx.db.get(userSkill.skillId);
        return skill;
      })
    );

    return skillsWithDetails.filter(Boolean);
  },
});

// Get user's industries
export const getUserIndustries = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const userIndustries = await ctx.db
      .query("userIndustries")
      .withIndex("user", (q) => q.eq("userId", userId))
      .collect();

    const industriesWithDetails = await Promise.all(
      userIndustries.map(async (userIndustry) => {
        const industry = await ctx.db.get(userIndustry.industryId);
        return industry;
      })
    );

    return industriesWithDetails.filter(Boolean);
  },
});

// Add skill to user
export const addUserSkill = mutation({
  args: { skillId: v.id("skills") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("You must be logged in to add skills");
    }

    // Check if skill already exists for user
    const existing = await ctx.db
      .query("userSkills")
      .withIndex("userSkill", (q) =>
        q.eq("userId", userId).eq("skillId", args.skillId)
      )
      .first();

    if (existing) {
      throw new ConvexError("You already have this skill");
    }

    return await ctx.db.insert("userSkills", {
      userId,
      skillId: args.skillId,
      //   addedAt: Date.now(),
    });
  },
});

// Remove skill from user
export const removeUserSkill = mutation({
  args: { skillId: v.id("skills") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("You must be logged in to remove skills");
    }

    const userSkill = await ctx.db
      .query("userSkills")
      .withIndex("userSkill", (q) =>
        q.eq("userId", userId).eq("skillId", args.skillId)
      )
      .first();

    if (!userSkill) {
      throw new ConvexError("Skill not found");
    }

    await ctx.db.delete(userSkill._id);
  },
});

// Add industry to user
export const addUserIndustry = mutation({
  args: { industryId: v.id("industries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("You must be logged in to add industries");
    }

    // Check if industry already exists for user
    const existing = await ctx.db
      .query("userIndustries")
      .withIndex("userIndustry", (q) =>
        q.eq("userId", userId).eq("industryId", args.industryId)
      )
      .first();

    if (existing) {
      throw new ConvexError("You already have this industry");
    }

    return await ctx.db.insert("userIndustries", {
      userId,
      industryId: args.industryId,
      //   addedAt: Date.now(),
    });
  },
});

// Remove industry from user
export const removeUserIndustry = mutation({
  args: { industryId: v.id("industries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("You must be logged in to remove industries");
    }

    const userIndustry = await ctx.db
      .query("userIndustries")
      .withIndex("userIndustry", (q) =>
        q.eq("userId", userId).eq("industryId", args.industryId)
      )
      .first();

    if (!userIndustry) {
      throw new ConvexError("Industry not found");
    }

    await ctx.db.delete(userIndustry._id);
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    headline: v.optional(v.string()),
    summary: v.optional(v.string()),
    location: v.optional(v.string()),
    phone: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("You must be logged in to update your profile");
    }

    await ctx.db.patch(userId, args);
    return userId;
  },
});
