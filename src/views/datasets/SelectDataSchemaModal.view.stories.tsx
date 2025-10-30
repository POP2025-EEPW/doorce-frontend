import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectDataSchemaModalView } from "./SelectDataSchemaModal.view";
import type { DataSchema } from "@/domain/types/dataset";
import schemasJson from "@/mocks/mock_data/schemas.json";

const mockSchemas = schemasJson as DataSchema[];

const meta: Meta<typeof SelectDataSchemaModalView> = {
  component: SelectDataSchemaModalView,
  title: "Views/Datasets/SelectDataSchemaModal",
  tags: ["autodocs"],
  args: {
    open: false,
    schemas: mockSchemas,
    selectedSchemaId: null,
    onSelectSchema: (id: string) => console.log("Schema selected:", id),
    onConfirm: () => console.log("Confirm clicked"),
    onCancel: () => console.log("Cancel clicked"),
    onOpenChange: (open: boolean) => console.log("Open changed:", open),
  },
};

export default meta;
type Story = StoryObj<typeof SelectDataSchemaModalView>;

export const Default: Story = {
  args: {
    open: true,
  },
  parameters: {
    docs: {
      story: { inline: false },
    },
  },
};

export const Empty: Story = {
  args: {
    open: true,
    schemas: [],
    isLoading: false,
  },
  parameters: {
    docs: {
      story: { inline: false },
    },
  },
};

export const ManySchemas: Story = {
  args: {
    open: true,
    schemas: Array.from({ length: 20 }, (_, i) => ({
      id: `schema-${String(i + 1).padStart(3, "0")}`,
      name: `Schema ${i + 1}`,
      description: `Description for schema ${i + 1}`,
      version: `1.${i}.0`,
    })),
  },
  parameters: {
    docs: {
      story: { inline: false },
    },
  },
};
