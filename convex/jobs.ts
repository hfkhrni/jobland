import { Doc } from "./_generated/dataModel";
import { query } from "./_generated/server";

// Return the last 100 tasks in a given task list.
export const getJobs = query({
  args: {},
  handler: async (ctx, args) => {
    const jobs = await ctx.db.query("jobs").order("desc").take(100);
    const idMap = new Map<string, Doc<"companies">["_id"]>();
    for (const job of jobs) {
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
    return jobs.map((job) => {
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
              logo: comp.logo ?? null,
              website: comp.website ?? null,
              industryId: comp.industryId?.toString() ?? null,
              size: comp.size ?? null,
              location: comp.location ?? null,
              foundedYear: comp.foundedYear ?? null,
            }
          : null,
      };
    });
  },
});
