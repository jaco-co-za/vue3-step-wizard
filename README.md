# vue-wizard

A Vue 3 + TypeScript wizard component.

## Install

```bash
npm install vue-wizard
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Wizard, type WizardStep } from 'vue-wizard';
import 'vue-wizard/wizard-style.css';

import StepDomain from './steps/StepDomain.vue';
import StepBusiness from './steps/StepBusiness.vue';
import StepFinish from './steps/StepFinish.vue';

const steps: WizardStep[] = [
  { name: 'domain', title: 'Domain', component: StepDomain },
  { name: 'business', title: 'Business info', component: StepBusiness },
  { name: 'finish', title: 'Finish', component: StepFinish }
];

const current = ref(0);
</script>

<template>
  <Wizard v-model="current" :steps="steps" />
</template>
```

Each step component should emit `next` and `back` to move through the wizard.
