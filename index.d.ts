import type { DefineComponent, Component } from 'vue';

export type WizardStep = {
  name: string;
  title: string;
  component: Component;
  props?: Record<string, unknown>;
};

export type WizardExpose = {
  moveTo: (stepName: string) => void;
  hideStep: (stepName: string) => void;
  showStep: (stepName: string) => void;
};

export const Wizard: DefineComponent<{
  steps: WizardStep[];
  modelValue?: number;
  sidebarTitle?: string;
  allowStepClick?: boolean;
  hiddenSteps?: string[];
}, {}, any, any, any, any, {
  'step-changed': (stepName: string) => void;
  'custom-event': (payload?: unknown) => void;
}> & {
  new (): WizardExpose;
};
