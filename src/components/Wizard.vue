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
  }>(),
  {
    modelValue: 0,
    sidebarTitle: 'Setup steps'
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void;
  (event: 'change', value: number): void;
  (event: 'custom-event', payload?: unknown): void;
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

const setStep = (value: number) => {
  const nextValue = clampStep(value);
  if (nextValue === currentStep.value) {
    return;
  }
  currentStep.value = nextValue;
  emit('update:modelValue', nextValue);
  emit('change', nextValue);
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
</script>

<template>
  <main class="wizard-page">
    <section class="wizard">
      <aside v-if="steps.length" class="wizard-sidebar">
        <p class="eyebrow">{{ sidebarTitle }}</p>
        <div class="step-list">
          <div
            v-for="(step, index) in steps"
            :key="step.name"
            class="step-item"
            :class="{ active: index === currentStep }"
          >
            <span class="step-index">{{ index + 1 }}</span>
            <span class="step-title">{{ step.title }}</span>
          </div>
        </div>
      </aside>
      <div class="wizard-panel">
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
