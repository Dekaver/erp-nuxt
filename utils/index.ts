import { useAbilityStore } from '../stores/ability';
import { useUserStore } from '../stores/user';

export function $user() {
    return useUserStore();
}

export function $ability(){
    return useAbilityStore();
}

export function $can(action: string, subject: string) {
    const ability = useAbilityStore().ability;
    return ability.can(action, subject);
}