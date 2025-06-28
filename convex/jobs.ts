import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { query } from "./_generated/server";

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

// const client = new ConvexHttpClient("https://vibrant-iguana-889.convex.cloud");

// export async function fetchFirstJobsPage(): Promise<void> {
//   let nextCursor = null;
//   let result;
//   try {
//     //   let nextCursor = null;
//     ({ result, nextCursor } = await client.query(api.jobs.getJobs, {
//       paginationOpts: { numItems: 100, cursor: nextCursor },
//     }));

//     console.log("Jobs (first page):", result);
//     console.log("Next cursor:", nextCursor);
//   } catch (err) {
//     console.error("Failed to fetch jobs:", err);
//   }
// }
