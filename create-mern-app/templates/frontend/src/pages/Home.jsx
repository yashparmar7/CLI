import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const userName = "Yash"; // later from auth or env

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              M
            </div>
            <span className="font-semibold tracking-tight">MERN Project</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <button className="hover:text-slate-900">
              <a
                href="https://github.com/yashparmar7/CLI"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Status */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-2">Project setup completed!</h1>
          <p className="text-slate-600 text-sm">
            Your MERN project is ready. All dependencies are installed and
            configured.
          </p>
        </div>
      </section>

      {/* Next Actions */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Backend */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold mb-2">Backend</h3>
          <p className="text-sm text-slate-600 mb-4">
            Start the backend server
          </p>
          <div className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm">
            <code>$ cd backend && npm run start</code>
          </div>
        </div>

        {/* Frontend */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold mb-2">Frontend</h3>
          <p className="text-sm text-slate-600 mb-4">Start the frontend app</p>
          <div className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm">
            <code>$ cd frontend && npm run dev</code>
          </div>
        </div>

        {/* Full App */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold mb-2">Full Stack</h3>
          <p className="text-sm text-slate-600 mb-4">
            Run backend + frontend together
          </p>
          <div className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm">
            <code>$ npm run dev</code>
          </div>
        </div>
      </section>

      {/* Project Tips */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">
              Next Developmental Steps
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Quick guide to your new project structure.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              {
                step: "Environment",
                desc: "Update .env file with your credentials",
                path: "/.env",
              },
              {
                step: "API Routes",
                desc: "Define your endpoints for data handling",
                path: "/backend/routes",
              },
              {
                step: "Data Models",
                desc: "Design your MongoDB schemas",
                path: "/backend/models",
              },
              {
                step: "UI Design",
                desc: "Craft your interface using Tailwind CSS",
                path: "/frontend/src",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center p-6 hover:bg-slate-50 transition-colors gap-4"
              >
                <div className="sm:w-32 flex items-center gap-3">
                  <span className="text-xs font-black text-indigo-200 tracking-tighter">
                    0{i + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {item.step}
                  </span>
                </div>
                <div className="flex-1 text-sm text-slate-500">{item.desc}</div>
                <div className="text-[11px] font-mono font-bold bg-slate-100 px-3 py-1 rounded-md text-slate-400 border border-slate-200">
                  {item.path}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-slate-500 flex justify-between">
          <span>© {new Date().getFullYear()} MERN Project CLI</span>
          <span className="flex items-center gap-2 ">
            Created by{" "}
            <a
              href="https://www.linkedin.com/in/yashparmar07/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Yash Parmar
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
