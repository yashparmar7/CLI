#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

/* -------------------- ESM __dirname FIX -------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* ----------------------------------------------------------- */

console.log(chalk.green("🔥 MY CLI IS RUNNING"));

const cwd = process.cwd();

console.log(chalk.cyan.bold("\n Create MERN Stack App\n"));

/* -------------------- PROMPTS -------------------- */
const answers = await inquirer.prompt([
  { name: "projectName", message: "Project name?", default: "mern-stack-app" },

  {
    type: "confirm",
    name: "backend",
    message: "Include backend (Node + Express)?",
    default: true,
  },
  {
    type: "confirm",
    name: "frontend",
    message: "Include frontend (React + Vite)?",
    default: true,
  },

  {
    type: "confirm",
    name: "mongo",
    message: "Use MongoDB (Mongoose)?",
    default: true,
  },
  {
    type: "confirm",
    name: "dotenv",
    message: "Add .env support?",
    default: true,
  },
  {
    type: "confirm",
    name: "cors",
    message: "Add CORS support?",
    default: true,
  },
  {
    type: "confirm",
    name: "jwt",
    message: "Add JWT authentication boilerplate?",
    default: true,
  },
  {
    type: "confirm",
    name: "bcrypt",
    message: "Add password hashing (bcrypt)?",
    default: true,
  },
  {
    type: "confirm",
    name: "morgan",
    message: "Add request logging (morgan)?",
    default: true,
  },
  {
    type: "confirm",
    name: "helmet",
    message: "Add security headers (helmet)?",
    default: true,
  },

  {
    type: "confirm",
    name: "axios",
    message: "Add Axios in frontend?",
    default: true,
  },
  {
    type: "confirm",
    name: "router",
    message: "Add React Router DOM?",
    default: true,
  },
  {
    type: "confirm",
    name: "tailwind",
    message: "Add Tailwind CSS?",
    default: true,
  },
  {
    type: "confirm",
    name: "lint",
    message: "Add ESLint + Prettier?",
    default: false,
  },
]);

/* -------------------- PROJECT ROOT -------------------- */
const root = path.join(cwd, answers.projectName);
fs.mkdirSync(root, { recursive: true });

const spinner = ora("Scaffolding project...").start();

/* -------------------- TEMPLATE PATHS -------------------- */
const backendTemplatePath = path.join(__dirname, "../templates/backend");
const frontendTemplatePath = path.join(__dirname, "../templates/frontend");

/* -------------------- BACKEND SETUP -------------------- */
if (answers.backend) {
  fs.copySync(backendTemplatePath, path.join(root, "backend"));

  const appJsPath = path.join(root, "backend", "src", "app.js");
  let appJsContent = fs.readFileSync(appJsPath, "utf-8");

  if (!answers.cors) {
    appJsContent = appJsContent.replace(/import cors.*\n/, "");
    appJsContent = appJsContent.replace(/app\.use\(cors\(\)\);\n/, "");
  }

  if (!answers.helmet) {
    appJsContent = appJsContent.replace(/import helmet.*\n/, "");
    appJsContent = appJsContent.replace(/app\.use\(helmet\(\)\);\n/, "");
  }

  if (!answers.morgan) {
    appJsContent = appJsContent.replace(/import morgan.*\n/, "");
    appJsContent = appJsContent.replace(/app\.use\(morgan.*\);\n/, "");
  }

  if (!answers.jwt) {
    appJsContent = appJsContent.replace(/import authRoutes.*\n/, "");
    appJsContent = appJsContent.replace(/app\.use\("\/api\/auth".*\);\n/, "");
  }

  if (!answers.mongo) {
    appJsContent = appJsContent.replace(/import connectDB.*\n/, "");
    appJsContent = appJsContent.replace(/connectDB\(\);\n/, "");
  }

  fs.writeFileSync(appJsPath, appJsContent);

  if (answers.dotenv) {
    fs.writeFileSync(
      path.join(root, "backend", ".env"),
      `PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/${answers.projectName}
JWT_SECRET=supersecretkey
`,
    );
  }
}

/* -------------------- FRONTEND SETUP -------------------- */
if (answers.frontend) {
  fs.copySync(frontendTemplatePath, path.join(root, "frontend"));
}

/* -------------------- TAILWIND SETUP -------------------- */
if (answers.frontend && answers.tailwind) {
  const frontendDir = path.join(root, "frontend");

  // 1. tailwind.config.js
  fs.writeFileSync(
    path.join(frontendDir, "tailwind.config.js"),
    `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`,
  );

  // 2. postcss.config.js (Tailwind v4 FIX)
  fs.writeFileSync(
    path.join(frontendDir, "postcss.config.js"),
    `export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
`,
  );

  // 3. index.css
  fs.writeFileSync(
    path.join(frontendDir, "src", "index.css"),
    `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
  );

  // 4. Ensure CSS is imported in main.jsx
  const mainPath = path.join(frontendDir, "src", "main.jsx");
  let mainContent = fs.readFileSync(mainPath, "utf-8");

  if (!mainContent.includes("index.css")) {
    mainContent = `import "./index.css";\n` + mainContent;
    fs.writeFileSync(mainPath, mainContent);
  }
}

spinner.succeed("Project structure created");

/* -------------------- DEP INSTALLER -------------------- */
const installDeps = (dir, deps, dev = false) => {
  if (!deps.length) return;
  execSync(`npm install ${dev ? "--save-dev" : ""} ${deps.join(" ")}`, {
    cwd: dir,
    stdio: "inherit",
  });
};

/* -------------------- BACKEND DEPS -------------------- */
if (answers.backend) {
  const deps = ["express", "express-async-handler", "express-validator"];
  const devDeps = ["nodemon"];

  answers.mongo && deps.push("mongoose");
  answers.cors && deps.push("cors");
  answers.dotenv && deps.push("dotenv");
  answers.jwt && deps.push("jsonwebtoken");
  answers.bcrypt && deps.push("bcryptjs");
  answers.morgan && deps.push("morgan");
  answers.helmet && deps.push("helmet");

  installDeps(path.join(root, "backend"), deps);
  installDeps(path.join(root, "backend"), devDeps, true);
}

/* -------------------- FRONTEND DEPS -------------------- */
if (answers.frontend) {
  const deps = ["react", "react-dom"];
  const devDeps = [];

  answers.router && deps.push("react-router-dom");
  answers.axios && deps.push("axios");

  if (answers.tailwind) {
    devDeps.push(
      "tailwindcss",
      "@tailwindcss/postcss",
      "postcss",
      "autoprefixer",
    );
  }

  if (answers.lint) {
    devDeps.push(
      "eslint",
      "prettier",
      "eslint-plugin-react",
      "eslint-plugin-react-hooks",
    );
  }

  installDeps(path.join(root, "frontend"), deps);
  installDeps(path.join(root, "frontend"), devDeps, true);
}

/* -------------------- DONE -------------------- */
console.log(chalk.green.bold("\n✅ Project Setup Complete!\n"));
console.log(chalk.yellow("Next steps:"));
console.log(`  cd ${answers.projectName}`);
answers.backend && console.log("  cd backend && npm run dev");
answers.frontend && console.log("  cd frontend && npm run dev");
