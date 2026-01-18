<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';

export type WizardStep = {
  name: string;
  title: string;
  component: Component;
  props?: Record<string, unknown>;
};

const props = withDefaults(
  defineProps<{
    steps: WizardStep[];
    modelValue?: number;
    sidebarTitle?: string;
    allowStepClick?: boolean;
    hiddenSteps?: string[];
  }>(),
  {
    modelValue: 0,
    sidebarTitle: 'Setup steps',
    allowStepClick: true,
    hiddenSteps: () => []
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void;
  (event: 'change', value: number): void;
  (event: 'custom-event', payload?: unknown): void;
  (event: 'step-changed', stepName: string): void;
}>();

const clampStep = (value: number) => {
  if (!props.steps.length) {
    return 0;
  }
  return Math.max(0, Math.min(value, props.steps.length - 1));
};

const currentStep = ref(clampStep(props.modelValue ?? 0));

watch(
  () => props.modelValue,
  (value) => {
    const nextValue = clampStep(value ?? 0);
    if (nextValue !== currentStep.value) {
      currentStep.value = nextValue;
    }
  }
);

const activeStep = computed(() => props.steps[currentStep.value]);
const hiddenStepSet = ref(new Set(props.hiddenSteps));

watch(
  () => props.hiddenSteps,
  (value) => {
    hiddenStepSet.value = new Set(value ?? []);
    ensureCurrentVisible();
  }
);

const isStepHidden = (name: string) => hiddenStepSet.value.has(name);

const visibleSteps = computed(() =>
  props.steps
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => !isStepHidden(step.name))
);

const setStep = (value: number) => {
  const nextValue = clampStep(value);
  if (nextValue === currentStep.value) {
    return;
  }
  currentStep.value = nextValue;
  emit('update:modelValue', nextValue);
  emit('change', nextValue);
  const stepName = props.steps[nextValue]?.name;
  if (stepName) {
    emit('step-changed', stepName);
  }
};

const goNext = () => {
  if (currentStep.value >= props.steps.length - 1) {
    return;
  }
  setStep(currentStep.value + 1);
};

const goBack = () => {
  if (currentStep.value <= 0) {
    return;
  }
  setStep(currentStep.value - 1);
};

const forwardCustomEvent = (payload?: unknown) => {
  emit('custom-event', payload);
};

const handleStepClick = (index: number) => {
  if (!props.allowStepClick) {
    return;
  }
  const step = props.steps[index];
  setStep(index);
};

const ensureCurrentVisible = () => {
  const current = props.steps[currentStep.value];
  if (current && !isStepHidden(current.name)) {
    return;
  }
  const fallback = props.steps.findIndex((step) => !isStepHidden(step.name));
  if (fallback >= 0) {
    setStep(fallback);
  }
};

const moveTo = (stepName: string) => {
  const index = props.steps.findIndex((step) => step.name === stepName);
  if (index === -1) {
    return;
  }
  if (isStepHidden(stepName)) {
    return;
  }
  setStep(index);
};

const hideStep = (stepName: string) => {
  hiddenStepSet.value = new Set(hiddenStepSet.value).add(stepName);
  ensureCurrentVisible();
};

const showStep = (stepName: string) => {
  if (!hiddenStepSet.value.has(stepName)) {
    return;
  }
  const nextSet = new Set(hiddenStepSet.value);
  nextSet.delete(stepName);
  hiddenStepSet.value = nextSet;
};

defineExpose({
  moveTo,
  hideStep,
  showStep
});
</script>

<template>
  <main class="__wizard-page">
    <section class="__wizard">
      <aside v-if="steps.length" class="__wizard-sidebar">
        <p class="__eyebrow">{{ sidebarTitle }}</p>
        <div class="__step-list">
          <div
            v-for="({ step, index }, visibleIndex) in visibleSteps"
            :key="step.name"
            class="__step-item"
            :class="{
              __active: step.name === activeStep?.name,
              __clickable: allowStepClick
            }"
            @click="handleStepClick(index)"
          >
            <span class="__step-index">{{ visibleIndex + 1 }}</span>
            <span class="__step-title">{{ step.title }}</span>
          </div>
        </div>
      </aside>
      <div class="__wizard-panel">
        <component
          v-if="activeStep"
          :is="activeStep.component"
          v-bind="activeStep.props"
          @next="goNext"
          @back="goBack"
          @custom-event="forwardCustomEvent"
        />
      </div>
    </section>
  </main>
</template>
