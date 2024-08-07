<template>
    <div class="layout-breadcrumb">
        <div class="breadcrumb">
            <div class="route-bar-breadcrumb">
                <li>
                    <NuxtLink :to="home.to" class="p-link" v-if="home.to">
                        <span :class="home.icon" />
                    </NuxtLink>
                </li>
                <li>
                    <i
                        :class="[
                            'pi',
                            {
                                'pi-angle-right': true,
                                'pi-angle-left': false,
                            },
                        ]"
                    ></i>
                </li>
                <template v-for="(item, index) of items" :key="item">
                    <li>
                        <NuxtLink :to="item.to" class="p-link" v-if="item.to">
                            <span v-if="!item.icon" class="" :class="item.icon" />
                            {{ item.label }}
                        </NuxtLink>
                        <template v-if="!item.to">{{ item.label }}</template>
                    </li>
                    <li v-if="index !== items.length - 1">
                        <i
                            :class="[
                                'pi',
                                {
                                    'pi-angle-right': true,
                                    'pi-angle-left': false,
                                },
                            ]"
                        ></i>
                    </li>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            home: { icon: 'pi pi-home', to: '/' },
            items: [],
        };
    },
    watch: {
        // $route() {
        // 	this.watchRouter();
        // },
    },
    created() {
        // this.watchRouter();
    },
    methods: {
        // watchRouter() {
        // if (this.$router.currentRoute.value.meta.breadcrumb) {
        // 	this.items = this.$router.currentRoute.value.meta.breadcrumb;
        // }
        // },
    },
};
</script>
