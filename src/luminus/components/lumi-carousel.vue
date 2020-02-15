<template>
    <div class="lumi-flex-slider-wrapper"
        @mousedown="sliderFocusOn($event)"
        @mousemove="sliderMoveHandler($event)"
        @mouseup="sliderMoveFinishHandler($event)"
        @mouseleave="sliderMoveFinishHandler($event)"
        @scroll="sliderScrollHandler">
        <!-- v-touch:swipe="swipeHandler"> -->
        <ul class="lumi-flex-slider" ref="slider">
            <slot></slot>
        </ul>
        <div>
            {{ testText }}
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'
 
Vue.use(Vue2TouchEvents)

export default {
    name: 'lumi-carousel',
    props: {
        itemStiky: {
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            scrollX : 0,
            paddingLeft : 0,
            mouseEvent : {
                isMoving : false,
                movedX : 0,
                startPosition : 0,
            },
            SliderMoving: false,
            testText: "",
        }
    },
    methods:{
        sliderFocusOn(event){
            this.mouseEvent.isMoving = true
            this.mouseEvent.startPosition = event.clientX
        },
        sliderMoveHandler($event){
            if(this.mouseEvent.isMoving == true){
                let moved = this.mouseEvent.movedX - $event.clientX

                this.$el.scrollLeft = this.$el.scrollLeft + this.mouseEvent.startPosition + moved

                // clear
                this.mouseEvent.movedX = $event.clientX
                this.mouseEvent.startPosition = 0
            }
        },
        sliderMoveFinishHandler(){
            if(this.mouseEvent.isMoving == true){                
                this.mouseEvent.isMoving = false
                this.mouseEvent.movedX = 0
                
                if(this.itemStiky) this.doItemStiky()
            }
        },
        sliderScrollHandler(){
            // console.log("slide Detect => ", $event)
            if(!this.mouseEvent.isMoving && !this.SliderMoving){

                let time = 100

                clearTimeout(this.SlierTimeout)
                this.SlierTimeout = setTimeout(() => {
                    this.doItemStiky()
                },time)
            }
        },
        doItemStiky(_item){
            console.log("Stiky Catched !!")

            if(!_item) _item = this.getLeftItem()

            let movin = _item.offsetLeft - this.$el.scrollLeft - this.paddingLeft

            // Slide Move Animation
            let time = 300,
                movin_interval = Math.round( time / Math.abs(movin)),
                movin_time = movin_interval * Math.round( time / movin_interval )

            this.SliderMoving = true
            this.slideAnimation = setInterval(() => {
                this.$el.scrollLeft = this.$el.scrollLeft + Math.sign(movin)
            },movin_interval)

            setTimeout(()=>{
                clearInterval(this.slideAnimation)
                setTimeout(() => {
                    this.SliderMoving = false
                },300)
            },movin_time)

        },
        getLeftItem(){
            let arr = this.$el.getElementsByClassName('lumi-caroucel-item'),
                get_element,
                get_near

            arr.forEach(element => {
                let near = Math.abs(this.$el.scrollLeft - element.offsetLeft)

                if(get_near == null || get_near > near){
                    get_near = near
                    get_element = element 
                }
            });

            return get_element
        },
        // swipeHandler(){
        //     if(this.mouseEvent.isMoving != true){
        //         console.log("Swipe Hander Active !! ")
        //         if(this.itemStiky) this.doItemStiky()
        //     }
        //     // if(this.itemStiky) this.doItemStiky()
        //     // console.log("Scroll Left => ", this.$el.scrollLeft)
        // },
    },
    mounted(){
        this.paddingLeft = this.getLeftItem().offsetLeft
    }
}
</script>

<style lang="stylus" scoped>
@import '../luminus'


</style>