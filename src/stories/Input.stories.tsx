import { fn } from '@storybook/test';

import LabelInput from '../components/LabelInput';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Component/Input',
  component: LabelInput,
  args: { onChange: fn() },
  argTypes: {
    type: {
      options: ['text', 'tel', 'email'],
      control: { type: 'radio' },
    },
  },
} satisfies Meta<typeof LabelInput>;

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
