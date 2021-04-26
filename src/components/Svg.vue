<script>
export default {
  name: 'AppSvg',

  data() {
    return {
      icon: null,
    };
  },

  props: {
    /**
     * Nome do ícone.
     * @var {string} name
     */
    name: {
      type: String,
    },
  },

  mounted() {
    this.loadIcon();
  },

  methods: {
    /**
     * Carrega o ícone com o nome fornecido.
     *
     * @return {void}
     * */
    loadIcon() {
      if (!this.name) {
        this.icon = null;
        return;
      }
      const promise = import(`@/assets/icons/svg/${this.name}.svg`);
      console.log(promise);
      promise.then((icon) => {
        this.icon = icon;
      });
    },
  },

  watch: {
    name() {
      this.loadIcon();
    },
  },
};
</script>

<template>
    <i v-if="icon" v-html="icon">
    </i>
</template>
