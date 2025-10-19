import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { LoginView } from "./Login.view";

const meta: Meta<typeof LoginView> = {
  title: "Views/Auth/LoginView",
  component: LoginView,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof LoginView>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [u, setU] = useState("");
      const [p, setP] = useState("");
      return (
        <LoginView
          username={u}
          password={p}
          onChangeUsername={setU}
          onChangePassword={setP}
          onSubmit={() => {}}
        />
      );
    };
    return <Demo />;
  },
};
