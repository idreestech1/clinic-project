import mongoose from "mongoose";

// Apply buffering settings before any schema is defined
mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 60000);


// Disable automatic index creation in production (makes cold start faster)
mongoose.set("autoIndex", false);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

// Explicit index for email (used by findOne)
userSchema.index({ email: 1 });
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["patient", "admin", "doctor"], default: "patient" },
    phone: { type: String, default: "", trim: true },
    status: { type: String, enum: ["Active", "Pending", "Inactive"], default: "Active" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.createdAt = ret.createdAt?.toISOString?.() || ret.createdAt;
    ret.updatedAt = ret.updatedAt?.toISOString?.() || ret.updatedAt;
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
