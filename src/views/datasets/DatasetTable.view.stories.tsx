import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatasetTableView } from "./DatasetTable.view";
import datasets from "@/mocks/mock_data/datasets.json";
import type { DatasetSummary } from "@/domain/types/dataset";

const meta: Meta<typeof DatasetTableView> = {
  title: "Views/Datasets/DatasetTableView",
  component: DatasetTableView,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof DatasetTableView>;

export const Default: Story = {
  args: {
    datasets: datasets as DatasetSummary[],
    onOpen: () => {
      console.log("open");
    },
  },
};
