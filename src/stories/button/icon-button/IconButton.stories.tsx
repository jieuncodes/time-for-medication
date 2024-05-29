import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import Person from "../../../../components/atoms/icons/Person";
import { IconButton, IconButtonProps } from "./IconButton";

export default {
  title: "Atoms/IconButton",
  component: IconButton,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["medium"],
      },
    },
  },
} as Meta;

const Template: StoryFn<IconButtonProps> = (args: IconButtonProps) => (
  <IconButton {...args} />
);

export const Medium = Template.bind({});
Medium.args = {
  url: "https://github.com",
  iconComponent: Person,
  size: "medium",
};
