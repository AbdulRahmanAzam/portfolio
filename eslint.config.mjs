import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    rules: {
      // Client-only values (matchMedia, mount flags) must be read after hydration.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "claude-seo/**", "tools/**"],
  },
];

export default eslintConfig;
