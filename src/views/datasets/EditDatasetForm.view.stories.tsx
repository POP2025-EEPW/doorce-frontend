import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditDatasetFormView } from "./EditDatasetForm.view.tsx";
import type { Dataset, DatasetStatus } from "@/domain/types/dataset.ts";
import datasetsJson from "@/mocks/mock_data/datasets.json";

const meta: Meta<typeof EditDatasetFormView> = {
  component: EditDatasetFormView,
  title: "Views/Datasets/DatasetEditForm",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EditDatasetFormView>;

const mockDataset: Dataset = {
  ...datasetsJson[0],
  status: datasetsJson[0].status as DatasetStatus,
};

export const Default: Story = {
  args: {
    dataset: mockDataset,
    onSubmit: (input) => {
      console.log("Submit:", input);
    },
    onCancel: () => {
      console.log("Cancel");
    },
  },
};
