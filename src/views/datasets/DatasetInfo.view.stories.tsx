import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatasetInfoView } from "./DatasetInfo.view";
import datasets from "@/mocks/mock_data/datasets.json";

const meta: Meta<typeof DatasetInfoView> = {
  title: "Views/Datasets/DatasetInfoView",
  component: DatasetInfoView,
};
export default meta;

type Story = StoryObj<typeof DatasetInfoView>;

const ds = (datasets as any)[0];

export const Default: Story = {
  args: {
    dataset: ds,
  },
};
