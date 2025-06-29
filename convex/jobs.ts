import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Return the last 100 tasks in a given task list.
export const getJobs = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .order("desc")
      .paginate(args.paginationOpts);
    const idMap = new Map<string, Doc<"companies">["_id"]>();
    for (const job of jobs.page) {
      idMap.set(job.companyId.toString(), job.companyId);
    }
    // const companies = Promise.all(
    //   (event?.attendeeIds ?? []).map((userId) => ctx.db.get(userId))
    // );
    const uniqueCompanyIds = Array.from(idMap.values());
    const companies = await Promise.all(
      uniqueCompanyIds.map((companyId) => ctx.db.get(companyId))
    );

    const companyById = new Map<string, (typeof companies)[0]>();
    uniqueCompanyIds.forEach((cid, i) => {
      companyById.set(cid.toString(), companies[i]!);
    });
    // for job
    // return jobs;
    const result = await Promise.all(
      jobs.page.map(async (job) => {
        const comp = companyById.get(job.companyId.toString()) || null;

        return {
          id: job._id,
          title: job.title,
          description: job.description,
          location: job.location,
          type: job.type,
          salary: job.salary ?? null,
          requirements: job.requirements,
          benefits: job.benefits ?? null,
          postedBy: job.postedBy.toString(),
          isActive: job.isActive,
          createdAt: job.createdAt,
          applicationDeadline: job.applicationDeadline ?? null,
          company: comp
            ? {
                id: job.companyId.toString(),
                name: comp.name,
                description: comp.description ?? null,
                logo: comp.logo ? await ctx.storage.getUrl(comp.logo) : null, // Use the fetched URL here
                website: comp.website ?? null,
                industryId: comp.industryId?.toString() ?? null,
                size: comp.size ?? null,
                location: comp.location ?? null,
                foundedYear: comp.foundedYear ?? null,
              }
            : null,
        };
      })
    );

    return {
      page: result,
      continueCursor: jobs.continueCursor,
      isDone: jobs.isDone,
    };
  },
});

export const getJobById = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db
      .query("jobs")
      .filter((q) => q.eq(q.field("_id"), args.jobId))
      .first();

    if (!job) {
      return null;
    }

    // Fetch the company information if the job has a companyId
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
    };
  },
});

export const hasApplied = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const application = await ctx.db
      .query("jobApplications")
      .withIndex("applicantJob", (q) =>
        q.eq("applicantId", userId).eq("jobId", args.jobId)
      )
      .first();

    return !!application;
  },
});

// Check if user has saved a job
export const hasSaved = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const savedJob = await ctx.db
      .query("savedJobs")
      .withIndex("userJob", (q) =>
        q.eq("userId", userId).eq("jobId", args.jobId)
      )
      .first();

    return !!savedJob;
  },
});

export const applyToJob = mutation({
  args: {
    jobId: v.id("jobs"),
    coverLetter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("You must be logged in to apply for jobs");
    }

    // Check if user already applied
    const existingApplication = await ctx.db
      .query("jobApplications")
      .withIndex("applicantJob", (q) =>
        q.eq("applicantId", userId).eq("jobId", args.jobId)
      )
      .first();

    if (existingApplication) {
      throw new ConvexError("You have already applied to this job");
    }

    // Check if job exists and is active
    const job = await ctx.db.get(args.jobId);
    if (!job || !job.isActive) {
      throw new ConvexError("Job not found or no longer active");
    }

    // Create application
    const applicationId = await ctx.db.insert("jobApplications", {
      jobId: args.jobId,
      applicantId: userId,
      status: "applied",
      appliedAt: Date.now(),
      coverLetter: args.coverLetter,
    });

    return applicationId;
  },
});

export const toggleSaveJob = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("You must be logged in to save jobs");
    }

    // Check if job is already saved
    const existingSave = await ctx.db
      .query("savedJobs")
      .withIndex("userJob", (q) =>
        q.eq("userId", userId).eq("jobId", args.jobId)
      )
      .first();

    if (existingSave) {
      // Remove from saved jobs
      await ctx.db.delete(existingSave._id);
      return { saved: false };
    } else {
      // Add to saved jobs
      await ctx.db.insert("savedJobs", {
        userId,
        jobId: args.jobId,
        savedAt: Date.now(),
      });
      return { saved: true };
    }
  },
});
