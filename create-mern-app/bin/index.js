#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const cwd = process.cwd();

console.log(chalk.cyan.bold("\n Create MERN Stack App\n"));

// PROMPTS
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

// PROJECT ROOT 
const root = path.join(cwd, answers.projectName);
fs.mkdirSync(root, { recursive: true });

const spinner = ora("Scaffolding project...").start();

// TEMPLATE PATHS  
const backendTemplatePath = path.join(__dirname, "../templates/backend");
const frontendTemplatePath = path.join(__dirname, "../templates/frontend");

// BACKEND SETUP  
if (answers.backend) {
  fs.copySync(backendTemplatePath, path.join(root, "backend"));

  const appJsPath = path.join(root, "backend", "src", "app.js");
  const appJsContent = fs.readFileSync(appJsPath, "utf-8");

  // Feature flags based on user answers
  const features = {
    cors: answers.cors,
    helmet: answers.helmet,
    morgan: answers.morgan,
    jwt: answers.jwt,
    mongo: answers.mongo,
  };

  /**
   * Process conditional markers in file content
   * @param {string} content
   * @param {Object} features
   */
  const processTemplate = (content, features) => {
    const lines = content.split("\n");
    const result = [];
    const stack = []; // Keep track of nested blocks if we ever support them (simple boolean for now)

    for (const line of lines) {
      const trimLine = line.trim();

      // Check for IF marker
      if (trimLine.startsWith("// #IF")) {
        const feature = trimLine.split(" ")[2];
        stack.push(features[feature]); // Push true/false
        continue; // Don't include the marker line
      }

      // Check for ENDIF marker
      if (trimLine.startsWith("// #ENDIF")) {
        stack.pop();
        continue; // Don't include the marker line
      }

      // If any value in stack is false, skip the line
      if (stack.every((val) => val)) {
        result.push(line);
      }
    }

    return result.join("\n");
  };

  const processedContent = processTemplate(appJsContent, features);
  fs.writeFileSync(appJsPath, processedContent);

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

//  FRONTEND SETUP  
if (answers.frontend) {
  fs.copySync(frontendTemplatePath, path.join(root, "frontend"));
}

//  TAILWIND SETUP  
if (answers.frontend && answers.tailwind) {
  const frontendDir = path.join(root, "frontend");

  // 1. tailwind.config.cjs
  fs.writeFileSync(
    path.join(frontendDir, "tailwind.config.cjs"),
    `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`,
  );

  // 2. postcss.config.cjs
  fs.writeFileSync(
    path.join(frontendDir, "postcss.config.cjs"),
    `module.exports = {
  plugins: {
    tailwindcss: {},
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

//  DEP MANAGEMENT 
const updatePackageJson = (dir, deps = {}, devDeps = {}, removeDeps = []) => {
  const pkgPath = path.join(dir, "package.json");
  const pkg = fs.readJsonSync(pkgPath);

  if (pkg.dependencies) {
    pkg.dependencies = { ...pkg.dependencies, ...deps };
    removeDeps.forEach((d) => delete pkg.dependencies[d]);
  } else {
    pkg.dependencies = deps;
  }

  if (pkg.devDependencies) {
    pkg.devDependencies = { ...pkg.devDependencies, ...devDeps };
    removeDeps.forEach((d) => delete pkg.devDependencies[d]);
  } else {
    pkg.devDependencies = devDeps;
  }

  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
};

const installDeps = (dir) => {
  console.log(chalk.cyan(`\n Installing dependencies in ${path.basename(dir)}...`));
  execSync("npm install", { cwd: dir, stdio: "inherit" });
};

//  BACKEND DEPS 
if (answers.backend) {
  const removeDeps = [];
  if (!answers.mongo) removeDeps.push("mongoose");
  if (!answers.cors) removeDeps.push("cors");
  if (!answers.dotenv) removeDeps.push("dotenv");
  if (!answers.jwt) removeDeps.push("jsonwebtoken");
  if (!answers.bcrypt) removeDeps.push("bcryptjs");
  if (!answers.morgan) removeDeps.push("morgan");
  if (!answers.helmet) removeDeps.push("helmet");

  updatePackageJson(path.join(root, "backend"), {}, {}, removeDeps);
  installDeps(path.join(root, "backend"));
}

// FRONTEND DEPS 
if (answers.frontend) {
  const deps = {};
  const devDeps = {};

  if (answers.router) deps["react-router-dom"] = "^6.20.0";
  if (answers.axios) deps["axios"] = "^1.6.0";

  if (answers.tailwind) {
    devDeps["tailwindcss"] = "^3.3.5";
    devDeps["postcss"] = "^8.4.31";
    devDeps["autoprefixer"] = "^10.4.16";
  }

  if (answers.lint) {
    devDeps["eslint"] = "^8.53.0";
    devDeps["eslint-plugin-react"] = "^7.33.2";
    devDeps["eslint-plugin-react-hooks"] = "^4.6.0";
    devDeps["eslint-plugin-react-refresh"] = "^0.4.4";
    devDeps["prettier"] = "^3.1.0";

    // Create eslint config
    fs.writeFileSync(
      path.join(root, "frontend", ".eslintrc.cjs"),
      `module.exports = { root: true, env: { browser: true, es2020: true }, extends: [ 'eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended', ], ignorePatterns: ['dist', '.eslintrc.cjs'], parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }, settings: { react: { version: '18.2' } }, plugins: ['react-refresh'], rules: { 'react-refresh/only-export-components': [ 'warn', { allowConstantExport: true }, ], }, };`
    );
  }

  updatePackageJson(path.join(root, "frontend"), deps, devDeps);
  installDeps(path.join(root, "frontend"));
}

// DONE 
console.log(chalk.green.bold("\n Project Setup Complete!\n"));
console.log(chalk.yellow("Next steps:"));
console.log(`  cd ${answers.projectName}`);
answers.backend && console.log("  cd backend && npm run dev");
answers.frontend && console.log("  cd frontend && npm run dev");
