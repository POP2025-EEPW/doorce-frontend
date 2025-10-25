import type { Meta, StoryObj } from "@storybook/react-vite";
import { CatalogListView } from "./CatalogList.view";
import catalogs from "@/mocks/mock_data/catalogs.json";

const meta: Meta<typeof CatalogListView> = {
  title: "Views/Catalogs/CatalogListView",
  component: CatalogListView,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof CatalogListView>;

export const Default: Story = {
  args: {
    catalogs: catalogs as any,
    onOpen: () => {},
  },
};
