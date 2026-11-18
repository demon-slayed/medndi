import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Layout from "@/components/Layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <section className="min-h-[70vh] bg-gradient-to-b from-white to-blue-50 flex flex-col items-center justify-center px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
          <Compass className="w-8 h-8 text-[#3252DF]" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-[#3252DF]">
          Error 404
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-3 text-gray-600 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
          >
            Go home
          </Link>
          <Link
            to="/treatments"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border-2 border-[#3252DF] bg-white text-[#3252DF] font-medium hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3252DF]/40 focus-visible:ring-offset-2"
          >
            Browse treatments
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
