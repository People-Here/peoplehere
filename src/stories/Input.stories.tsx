import { fn } from '@storybook/test';

import L from '../components/LabelInput';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Inputs/Labeled Input',
  component: L,
  args: { onChange: fn() },
  argTypes: {
    type: {
      options: ['text', 'tel', 'email'],
      control: { type: 'radio' },
    },
  },
} satisfies Meta<typeof L>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LabeledInput: Story = {
  args: {
    label: 'Label',
    value: '',
    type: 'text',
    readonly: false,
    errorText: '',
  },
};
