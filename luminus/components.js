// import Vue from 'vue'

import lumiCaroucel from './components/lumi-carousel.vue'
import lumiCaroucelSlide from './components/lumi-carousel-slide.vue'

import lumiCard from './components/lumi-card.vue'

import Vue2TouchEvents from 'vue2-touch-events'

const install = Vue => {
    Vue.use(Vue2TouchEvents)

    Vue.component('lumiCard', lumiCard);
    Vue.component('lumiCaroucel', lumiCaroucel);
    Vue.component('lumiCaroucelSlide', lumiCaroucelSlide);
}

export default install

export {
    lumiCard,
    lumiCaroucel,
    lumiCaroucelSlide
}