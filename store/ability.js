// store/ability.ts
import { defineStore } from 'pinia'
import { defineAbility, AbilityBuilder } from '@casl/ability'

export const useAbilityStore = defineStore('ability', {
    state: () => ({
        ability: defineAbility((can) => {}),
        rules: [],
    }),
    actions: {
        updatePermission(permissions) {
            this.rules = []
            for (const permission of permissions) {
              const [subject, action] = permission.split('.')
              this.rules.push({ action: action || 'manage', subject })
            }
            this.ability.update(this.rules)
        },

        removePermission(permission) {
            const [action, subject] = permission.split('.')
            // remove specific rule from the state
            this.rules = this.rules.filter((rule) => !(rule.action === action && rule.subject === subject))

        },
    },
})
