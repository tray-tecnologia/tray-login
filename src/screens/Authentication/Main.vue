<template>
    <section>
        <div>
            <strong class="tray-title">
                {{ $lang['authentication-title'] }}
            </strong>
        </div>

        <div>         
            <p class="tray-action">{{ $lang['authentication-action-1'] }} <strong>{{ storeName }}</strong>.</p>
            <p class="tray-action">{{ $lang['authentication-action-2'] }}</p>
            <label class="tray-well">{{ $lang['authentication-question'] }}</label>
        </div>

        <div>
            <button
                class="tray-btn-default"
                v-for="n in names"
                :key="n"
                @click="submit(n)"
            >
                {{ n }}
            </button>
        </div>
        
        <button
            class="tray-btn-link"
            @click="reset"
        >
            {{ $lang['authentication-go-back'] }}
        </button>
    </section>
</template>

<script>
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';

export default {
    name: 'AppAuthentication',
    mixins: [screenHandler, utils],
    props: ['reset'],
    data() {
        return {
            storeName: "Marketplace XYZ",
            names: ['******* Rulfini', '******* Beltrão', '******* Madeira']
        };
    },
    methods: {
        submit(name) {
            if(name === '******* Rulfini') {
                this.$parent.setScreen('Registration');
            } else {
                alert('Opção invalida!');
            }
        }
    }
}
</script>
