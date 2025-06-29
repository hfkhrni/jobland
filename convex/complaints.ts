// convex/complaints.ts
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const submitComplaint = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    employerDetails: v.string(),
    companyName: v.string(),
    companyAddress: v.string(),
    companyContact: v.optional(v.string()),
    complaintDescription: v.string(),
    evidenceDescription: v.string(),
    attachments: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          type: v.string(),
          storageId: v.id("_storage"),
          size: v.optional(v.number()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    // Get current user if authenticated (optional)
    // const identity = await ctx.auth.getUserIdentity();
    // const userId = identity
    //   ? await ctx.db
    //       .query("users")
    //       .withIndex("email", (q) => q.eq("email", identity.email!))
    //       .unique()
    //       ?.then((user) => user?._id)
    //   : undefined;
    const userId = await getAuthUserId(ctx);

    const complaintId = await ctx.db.insert("complaints", {
      ...args,
      status: "pending",
      reportedBy: userId ? userId : undefined,
      submittedAt: Date.now(),
    });

    return complaintId;
  },
});
