import User from "../models/userModel.js";
import Application from "../models/application.js";
import Activity from "../models/activityModel.js";

const DAY = 24 * 60 * 60 * 1000;

// All users with sign-up/login info and booking counts, plus headline stats
export const listUsers = async (req, res) => {
  try {
    const [users, bookingCounts, loginsToday] = await Promise.all([
      User.find().select("-password").sort({ created_at: -1 }).lean(),
      // Applications store the user's _id as a string
      Application.aggregate([{ $group: { _id: "$user_id", count: { $sum: 1 } } }]),
      Activity.countDocuments({
        type: "login",
        created_at: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
    ]);

    const bookingsByUser = Object.fromEntries(bookingCounts.map((b) => [String(b._id), b.count]));
    const now = Date.now();

    res.status(200).json({
      stats: {
        totalUsers: users.length,
        newThisWeek: users.filter((u) => u.created_at && now - new Date(u.created_at) < 7 * DAY).length,
        activeThisWeek: users.filter((u) => u.last_login_at && now - new Date(u.last_login_at) < 7 * DAY).length,
        loginsToday,
      },
      users: users.map((u) => ({ ...u, bookings: bookingsByUser[String(u._id)] ?? 0 })),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load users", error: error.message });
  }
};

// Most recent sign-ups, logins and bookings
export const listActivity = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const filter = ["signup", "login", "booking"].includes(req.query.type) ? { type: req.query.type } : {};
    const activity = await Activity.find(filter).sort({ created_at: -1 }).limit(limit).lean();
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Failed to load activity", error: error.message });
  }
};
