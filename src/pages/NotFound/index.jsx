import { Link } from "react-router-dom";
import Layout from "@/components/Layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <section className="min-h-[60vh] mt-28 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold text-[#3252DF]">404</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-3 text-gray-600 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-medium"
          >
            Go home
          </Link>
          <Link
            to="/treatments"
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
          >
            Browse treatments
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
