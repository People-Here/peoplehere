import { fn } from '@storybook/test';

import P from '../components/PasswordInput';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Inputs/Password Input',
  component: P,
  args: { onChange: fn() },
} satisfies Meta<typeof P>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PasswordInput: Story = {
  args: {
    value: '',
  },
};
