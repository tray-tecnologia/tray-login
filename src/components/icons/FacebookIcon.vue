<template>
  <svg height="18" width="10" viewBox="0 0 10 18">
    <path
      d="M9.18812 10.1249L9.68819 6.86749H6.56238V4.75361C6.56238 3.86261 6.99887
          2.99355 8.39894 2.99355H9.81981V0.220426C9.81981 0.220426 8.53056 0.000488281
          7.29756 0.000488281C4.72356 0.000488281 3.04112 1.56086 3.04112
          4.38518V6.86805H0.179688V10.1255H3.04112V18.0005H6.56238V10.1255L9.18812 10.1249Z"
      :fill="$props.removeColors ? '#FFFFFF' : '#1877F2'"
    />
  </svg>
</template>

<script>
export default {
  name: 'FacebookIcon',

  props: {
    removeColors: {
      default: false,
      require: false,
      type: Boolean,
    },
  },
};
</script>
