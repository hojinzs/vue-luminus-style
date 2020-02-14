<template>
    <div class="lumi-flex-slider-wrapper"
        @mousedown="sliderFocusOn($event)"
        @mouseup="sliderFocusOut($event)"
        @mousemove="sliderMovin($event)"
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
            scrollX : 0,
            mouseEvent : {
                isMoving : false,
                movedX : 0
            }
        }
    },
    methods:{
        sliderFocusOn(event){
            this.mouseEvent.isMoving = true

            console.log("Mouse Down => ", event)
        },
        sliderMovin(event){
            if(this.mouseEvent.isMoving){
                let moved = this.mouseEvent.movedX - event.clientX

                console.log("Mouse Movin => ", moved)

                this.$el.scrollLeft = this.$el.scrollLeft + moved
                this.mouseEvent.movedX = event.clientX
            }
        },
        sliderFocusOut(event){
            this.mouseEvent.isMoving = false

            this.mouseEvent.movedX = 0

            console.log("Mouse Up => ", event)
        },
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