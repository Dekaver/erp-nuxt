<template>
    <DatePicker :showButtonBar="showButtonBar" :showIcon="showIcon" :iconDisplay="iconDisplay" :dateFormat="dateFormat" />
</template>
<script>
import DatePicker from 'primevue/datepicker';

export default {
    components: {
        DatePicker,
    },
    name: 'Calendar',
    props: {
        showButtonBar: {
            type: Boolean,
            default: true,
        },
        showIcon: {
            type: Boolean,
            default: true,
        },
        iconDisplay: {
            type: String,
            default: 'input',
        },
        dateFormat: {
            type: String,
            default: 'dd-mm-yy',
        },
    },
};
</script>
