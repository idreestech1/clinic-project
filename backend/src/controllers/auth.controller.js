import { User } from "../models/User.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin@123";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      const error = new Error("Name, email and password are required.");
      error.statusCode = 400;
      throw error;
    }

    // 15 s timeout wrapper for the DB call – fail fast on Vercel cold starts
    const dbTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), 15000)
    );
    const existingPromise = User.findOne({ email: email.trim().toLowerCase() })
      .select('_id') // only need existence check
      .lean();
    const existing = await Promise.race([existingPromise, dbTimeout]);
    if (existing) {
      const error = new Error("An account with this email already exists.");
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: await hashPassword(password),
      role: "patient",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=1a6fd4&color=fff`,
    });

    res.status(201).json({ user: user.toJSON() });
  } catch (err) {
    if (err.code === 11000) {
      err.message = "An account with this email already exists.";
      err.statusCode = 409;
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      res.json({
        user: {
          name: "Dr. Hammad",
          email: ADMIN_EMAIL,
          role: "admin",
          status: "Active",
        },
      });
      return;
    }

    // 15 s timeout wrapper for the DB call – fail fast on Vercel cold starts
    const dbTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), 15000)
    );
    const fetchUser = User.findOne({ email: normalizedEmail })
      .select('_id name email role avatar status') // only needed fields
      .lean();
    const user = await Promise.race([fetchUser, dbTimeout]);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // Convert lean object to the shape expected by the client (remove passwordHash, add id)
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
    };
    res.json({ user: userResponse });
  } catch (err) {
    next(err);
  }
};
