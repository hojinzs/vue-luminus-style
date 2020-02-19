// import Vue from 'vue'

import lumiCaroucel from './components/lumi-carousel.vue'
import lumiCaroucelSlide from './components/lumi-carousel-slide.vue'

const install = Vue => {
    Vue.component('lumiCaroucel', lumiCaroucel);
    Vue.component('lumiCaroucelSlide', lumiCaroucelSlide);
}

export default install

export {
    lumiCaroucel,
    lumiCaroucelSlide
}