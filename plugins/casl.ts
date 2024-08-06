import { Can, abilitiesPlugin } from '@casl/vue';
import { useAbilityStore } from '~/stores/ability';

export default defineNuxtPlugin(({ vueApp }) => {
    const abilityStore = useAbilityStore();
    vueApp.use(abilitiesPlugin as any, abilityStore.ability);
    vueApp.component(Can.name as any, Can);
});
