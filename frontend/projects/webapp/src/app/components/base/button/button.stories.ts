import type {Meta, StoryObj} from "@storybook/angular";
import {ButtonComponent} from './button.component'

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: {
      ...args,
    },
    template: `<app-button>My button</app-button>`
  }),
  argTypes: {
    type: {control: 'text'},
    disabled: {control: 'boolean'},
    dark: {control: 'boolean'},
    icon: {control: 'string'},
  }
}

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {}
}

export const WithIcon: Story = {
  args: {}
}
