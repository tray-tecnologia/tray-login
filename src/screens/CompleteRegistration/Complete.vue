<template>
    <form method='POST' @submit.prevent="submit">
        <strong class="tray-title">
            {{ $lang['registration-complete-title'] }}
        </strong>
        <button
            id="tray-registration-complete"
            class="tray-btn-primary"
            type="submit">
            {{ $lang['registration-complete-button'] }}
        </button>
    </form>
</template>

<script>
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';

export default{
    name: 'CompleteScreen',
    mixins: [screenHandler, utils],
    methods: {
        submit() {
            this.$parent.setScreen('Identification');
        }
    }
}
</script>
