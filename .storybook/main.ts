import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins = [
      ...(config.plugins || []),
      tsconfigPaths(),
      tailwindcss(),
    ];
    config.define = {
      ...(config.define || {}),
      "import.meta.env.VITE_USE_MOCK": JSON.stringify("true"),
    } as any;
    return config;
  },
};
export default config;
