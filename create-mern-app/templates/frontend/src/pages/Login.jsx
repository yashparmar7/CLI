import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
      {/* LEFT – Context / Status */}
      <div className="hidden lg:flex flex-col justify-between px-16 py-12 bg-slate-900 text-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
              M
            </div>
            <span className="text-xl font-semibold tracking-tight">
              MERN Project CLI
            </span>
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-4">
            Access your project workspace
          </h1>

          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            Sign in to manage your MERN projects, environment variables, and
            CLI-generated structure in one place.
          </p>
        </div>

        <p className="text-xs text-slate-500">
          CLI-generated auth · {new Date().getFullYear()}
        </p>
      </div>

      {/* RIGHT – Login */}
      <div className="flex items-center justify-center px-6 sm:px-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              M
            </div>
            <span className="font-semibold">MERN Project CLI</span>
          </div>

          <h2 className="text-2xl font-bold mb-1">Sign in</h2>
          <p className="text-sm text-slate-600 mb-8">
            Continue to your project dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300
                           focus:outline-none focus:ring-2 focus:ring-indigo-500
                           transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300
                           focus:outline-none focus:ring-2 focus:ring-indigo-500
                           transition"
              />
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              <span className="text-sm text-slate-600">
                Remember this device
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold
                         hover:bg-indigo-700 transition"
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-500">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2.5 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50 transition">
              Google
            </button>
            <button className="py-2.5 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50 transition">
              GitHub
            </button>
          </div>

          {/* Register */}
          <p className="mt-7 text-sm text-center text-slate-600">
            No account yet?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
