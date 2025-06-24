import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";

// name: v.string(),
// image: v.optional(v.string()),
// email: v.string(),
// phone: v.string(),
// birthday: v.string(),
// type: v.string(),
// country: v.optional(v.string()),

export default Password<DataModel>({
  profile(params) {
    return {
      name: params.name as string,
      email: params.email as string,
      phone: params.phone as string,
      birthday: params.birthday as string,
      type: params.type as string,
      image: params.image as string | undefined,
      country: params.country as string | undefined,
    };
  },
});
