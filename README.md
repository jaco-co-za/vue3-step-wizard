# vue3-step-wizard

A Vue 3 + TypeScript wizard component.

## Install

```bash
npm install vue3-step-wizard
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Wizard, type WizardStep, type WizardExpose } from 'vue3-step-wizard';
import 'vue3-step-wizard/wizard-style.css';

import StepDomain from './steps/StepDomain.vue';
import StepBusiness from './steps/StepBusiness.vue';
import StepFinish from './steps/StepFinish.vue';

const steps: WizardStep[] = [
  { name: 'domain', title: 'Domain', component: StepDomain },
  { name: 'business', title: 'Business info', component: StepBusiness },
  { name: 'finish', title: 'Finish', component: StepFinish }
];

const current = ref(0);

const handleCustomEvent = (payload?: unknown) => {
  console.log('Custom event payload', payload);
};

const handleStepChanged = (payload: { from: string | null; to: string }) => {
  console.log('Step changed', payload);
};

const wizardRef = ref<WizardExpose | null>(null);

const goToFinish = () => {
  wizardRef.value?.moveTo('finish');
};

const hideBusiness = () => {
  wizardRef.value?.hideStep('business');
};

const showBusiness = () => {
  wizardRef.value?.showStep('business');
};
</script>

<template>
  <Wizard
    ref="wizardRef"
    v-model="current"
    :steps="steps"
    :allow-step-click="true"
    :show-controls="true"
    @custom-event="handleCustomEvent"
    @step-changed="handleStepChanged"
  />
</template>
```

Each step component should emit `next` and `back` to move through the wizard.
If you use `custom-event`, include the step name in the payload so the parent can identify the source.

Wizard instance methods (via `ref`) let you move or toggle steps at runtime:
- `moveTo(stepName)`
- `hideStep(stepName)`
- `showStep(stepName)`

You can also pass `hidden-steps` to control visibility by step name.

Wizard emits:
- `step-changed` with `{ from, to }` step names.
- `custom-event` forwarded from the active step component.

Example step component:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (event: 'next'): void;
  (event: 'back'): void;
  (event: 'custom-event', payload?: unknown): void;
}>();
</script>

<template>
  <div>
    <button type="button" @click="emit('back')">Back</button>
    <button type="button" @click="emit('next')">Next</button>
    <button type="button" @click="emit('custom-event', { step: 'domain', source: 'step-domain' })">
      Fire custom event
    </button>
  </div>
</template>
```

## Theming

All colors are driven by CSS variables defined in `wizard-style.css`. Override them in your app to theme the wizard.

```css
:root {
  --accent: #f5b24a;
  --accent-2: #5be4ff;
  --text: #f5f7fb;
  --muted: #9aa3b2;
  --wizard-ink: #13161c;
  --wizard-white: #ffffff;
  --wizard-surface-750: rgba(18, 23, 36, 0.75);
  --wizard-surface-900: rgba(18, 23, 36, 0.9);
  --wizard-border-weak: rgba(255, 255, 255, 0.08);
  --wizard-border: rgba(255, 255, 255, 0.1);
  --wizard-shadow-strong: rgba(0, 0, 0, 0.35);
}
```

To override fonts, set them on the relevant classes in your app stylesheet:

```css
.__wizard-panel h1 {
  font-family: 'Your Display Font', sans-serif;
}

.__wizard-page {
  font-family: 'Your UI Font', sans-serif;
}
```
