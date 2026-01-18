import type { DefineComponent, Component } from 'vue';

export type WizardStep = {
  name: string;
  title: string;
  component: Component;
  props?: Record<string, unknown>;
};

export const Wizard: DefineComponent<{
  steps: WizardStep[];
  modelValue?: number;
  sidebarTitle?: string;
}>;
