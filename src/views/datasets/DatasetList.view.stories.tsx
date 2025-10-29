import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatasetListView } from "./DatasetList.view";
import datasets from "@/mocks/mock_data/datasets.json";
import type { DatasetSummary } from "@/domain/types/dataset";

const meta: Meta<typeof DatasetListView> = {
  title: "Views/Datasets/DatasetListView",
  component: DatasetListView,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DatasetListView>;

export const Default: Story = {
  args: {
    datasets: datasets as DatasetSummary[],
    onOpen: () => {
      console.log("open");
      return;
    },
  },
};
