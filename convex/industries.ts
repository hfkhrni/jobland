import { query } from "./_generated/server";

export const getIndustries = query({
  args: {},
  handler: async (ctx, args) => {
    const industries = await ctx.db.query("industries").collect();
    return industries;
  },
});
