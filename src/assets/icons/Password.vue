<template>
  <figure class="tray-input-icon" :class="inputClass">
    <svg :width="12 * hasSize" :height="14 * hasSize" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- eslint-disable-next-line -->
      <path d="M9.82143 6.125V6.375H10.0714H10.7143C11.2812 6.375 11.75 6.84608 11.75 7.4375V12.6875C11.75 13.2789 11.2812 13.75 10.7143 13.75H1.28571C0.718799 13.75 0.25 13.2789 0.25 12.6875V7.4375C0.25 6.84608 0.718799 6.375 1.28571 6.375H1.92857H2.17857V6.125V4.15625C2.17857 1.99803 3.89826 0.25 6 0.25C8.10174 0.25 9.82143 1.99803 9.82143 4.15625V6.125ZM7.92857 6.375H8.17857V6.125V4.15625C8.17857 2.93752 7.2063 1.9375 6 1.9375C4.7937 1.9375 3.82143 2.93752 3.82143 4.15625V6.125V6.375H4.07143H7.92857Z" stroke="#757575" stroke-width="0.5"/>
    </svg>
  </figure>
</template>

<script>
export default {
  props: ['size', 'inputClass'],
  computed: {
    hasSize() {
      return this.size ? this.size : 1;
    },
  },
};
</script>
