import Activity from "../models/activityModel.js";

// Records an activity entry; never lets logging break the request it belongs to.
export const recordActivity = async (req, user, type, detail) => {
  try {
    await Activity.create({
      type,
      user: user?._id,
      email: user?.email,
      name: user?.fullName,
      detail,
      ip: req.ip,
      user_agent: req.get("user-agent")?.slice(0, 300),
    });
  } catch (error) {
    console.error("Failed to record activity:", error.message);
  }
};
