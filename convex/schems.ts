import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  // Your other tables...
  users: defineTable({
    name: v.string(),
    image: v.optional(v.string()),
    email: v.string(),
    phone: v.string(),
    birthday: v.string(),
    type: v.string(),
    country: v.optional(v.string()),

    // other "users" fields...
  }).index("email", ["email"]),
});

export default schema;
