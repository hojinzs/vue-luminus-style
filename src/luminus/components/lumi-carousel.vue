<template>
    <div class="lumi-flex-slider-wrapper"
        v-touch:swipe="swipeHandler">
        <ul class="lumi-flex-slider" ref="slider">
            <slot></slot>
        </ul>
    </div>
</template>

<script>
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'
 
Vue.use(Vue2TouchEvents)

export default {
    name: 'lumi-carousel',
    data(){
        return {
            scrollX : 0
        }
    },
    methods:{
        swipeHandler(){
            console.log("Scroll Left => ", this.$el.scrollLeft)
        }
    },
    mounted(){
        console.log("Width => ", this.$refs.slider.scrollWidth)
    }
}
</script>

<style lang="stylus" scoped>
@import '../luminus'


</style>