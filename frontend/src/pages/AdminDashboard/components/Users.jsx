import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Users as UsersIcon,
  UserPlus,
  Activity as ActivityIcon,
  LogIn,
  CalendarCheck,
  Search,
  RefreshCw,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getErrorMessage } from "../utils";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })
    : "Never";

// "5 min ago", "3 h ago", "2 d ago", then a date
const timeAgo = (value) => {
  if (!value) return "Never";
  const minutes = Math.round((Date.now() - new Date(value)) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 24 * 60) return `${Math.round(minutes / 60)} h ago`;
  if (minutes < 7 * 24 * 60) return `${Math.round(minutes / 1440)} d ago`;
  return new Date(value).toLocaleDateString("en-IN", { dateStyle: "medium" });
};

const ACTIVITY_STYLES = {
  signup: { icon: UserPlus, label: "Sign-up", className: "bg-green-100 text-green-700" },
  login: { icon: LogIn, label: "Login", className: "bg-blue-100 text-blue-700" },
  booking: { icon: CalendarCheck, label: "Booking", className: "bg-purple-100 text-purple-700" },
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center gap-4">
    <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
      <Icon className="w-5 h-5 text-[#3252DF]" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
      <p className="text-sm text-gray-500 truncate">{label}</p>
    </div>
  </div>
);

const RoleBadge = ({ role }) => (
  <span
    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
      role === "Admin" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"
    }`}
  >
    {role || "User"}
  </span>
);

const Users = () => {
  const [data, setData] = useState({ stats: null, users: [] });
  const [activity, setActivity] = useState([]);
  const [activityType, setActivityType] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [usersRes, activityRes] = await Promise.all([
          axios.get(`${BASE_URL}/users/admin/list`, { withCredentials: true }),
          axios.get(`${BASE_URL}/users/admin/activity`, {
            params: { limit: 50, type: activityType || undefined },
            withCredentials: true,
          }),
        ]);
        setData({ stats: usersRes.data?.stats ?? null, users: usersRes.data?.users ?? [] });
        setActivity(Array.isArray(activityRes.data) ? activityRes.data : []);
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to load users"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activityType, reloadKey]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.users;
    return data.users.filter((u) =>
      [u.fullName, u.email, u.nationality, u.role].some((field) => field?.toLowerCase().includes(q))
    );
  }, [data.users, query]);

  const { stats } = data;

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Admin"
        title="Users & activity"
        subtitle="Who has signed up, when they last logged in, and what they've booked."
        actions={
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard icon={UsersIcon} label="Total users" value={stats?.totalUsers} />
        <StatCard icon={UserPlus} label="New this week" value={stats?.newThisWeek} />
        <StatCard icon={ActivityIcon} label="Active this week" value={stats?.activeThisWeek} />
        <StatCard icon={LogIn} label="Logins today" value={stats?.loginsToday} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Users */}
        <section className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Users <span className="text-gray-400 font-normal">({filteredUsers.length})</span>
            </h2>
            <label className="relative w-full sm:w-72">
              <span className="sr-only">Search users</span>
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, country"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3252DF]/30 focus:border-[#3252DF]"
              />
            </label>
          </div>

          {loading && data.users.length === 0 ? (
            <div className="p-5 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              {query ? "No users match your search." : "No users yet."}
            </p>
          ) : (
            <>
              {/* Table on larger screens */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">User</th>
                      <th className="px-5 py-3 font-medium">Role</th>
                      <th className="px-5 py-3 font-medium">Joined</th>
                      <th className="px-5 py-3 font-medium">Last login</th>
                      <th className="px-5 py-3 font-medium text-right">Logins</th>
                      <th className="px-5 py-3 font-medium text-right">Bookings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900">{u.fullName || "—"}</p>
                          <p className="text-gray-500">{u.email}</p>
                        </td>
                        <td className="px-5 py-3"><RoleBadge role={u.role} /></td>
                        <td className="px-5 py-3 text-gray-600 whitespace-nowrap" title={formatDate(u.created_at)}>
                          {timeAgo(u.created_at)}
                        </td>
                        <td className="px-5 py-3 text-gray-600 whitespace-nowrap" title={formatDate(u.last_login_at)}>
                          {timeAgo(u.last_login_at)}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-900">{u.login_count ?? 0}</td>
                        <td className="px-5 py-3 text-right text-gray-900">{u.bookings ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards on phones */}
              <ul className="md:hidden divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <li key={u._id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{u.fullName || "—"}</p>
                        <p className="text-sm text-gray-500 truncate">{u.email}</p>
                      </div>
                      <RoleBadge role={u.role} />
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <dt className="text-gray-500">Joined</dt>
                        <dd className="text-gray-900">{timeAgo(u.created_at)}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Last login</dt>
                        <dd className="text-gray-900">{timeAgo(u.last_login_at)}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Logins</dt>
                        <dd className="text-gray-900">{u.login_count ?? 0}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Bookings</dt>
                        <dd className="text-gray-900">{u.bookings ?? 0}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* Activity feed */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-4 sm:p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent activity</h2>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter activity">
              {[["", "All"], ["signup", "Sign-ups"], ["login", "Logins"], ["booking", "Bookings"]].map(([value, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActivityType(value)}
                  aria-pressed={activityType === value}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 ${
                    activityType === value ? "bg-[#3252DF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activity.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              {loading ? "Loading activity…" : "No activity recorded yet."}
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-[640px] overflow-y-auto">
              {activity.map((item) => {
                const style = ACTIVITY_STYLES[item.type] ?? ACTIVITY_STYLES.login;
                const Icon = style.icon;
                return (
                  <li key={item._id} className="flex items-start gap-3 p-4">
                    <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${style.className}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{item.name || item.email || "Someone"}</span>{" "}
                        <span className="text-gray-600">{item.detail?.charAt(0).toLowerCase() + item.detail?.slice(1)}</span>
                      </p>
                      <p className="text-xs text-gray-500 truncate" title={formatDate(item.created_at)}>
                        {timeAgo(item.created_at)}
                        {item.email && item.name ? ` · ${item.email}` : ""}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Users;
