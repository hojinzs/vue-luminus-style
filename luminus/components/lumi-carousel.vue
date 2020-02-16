<template>
    <div class="lumi-flex-slider-wrapper" ref="main"
        @click.stop.prevent
        @mousedown="sliderFocusOn($event)"
        @mousemove="sliderMoveHandler($event)"
        @mouseup="sliderMoveFinishHandler($event)"
        @mouseleave="sliderMoveFinishHandler($event)"
        @scroll="sliderScrollHandler">
        <ul class="lumi-flex-slider" ref="slider">
            <slot></slot>
        </ul>
    </div>
</template>

<script>
import Velocity from 'velocity-animate'

export default {
    name: 'lumi-carousel',
    props: {
        itemStiky: {
            type: Boolean,
            default: true
        },
        speedStiky: {
            default: 200,
            validator: function(value){
                let check
                switch (value) {
                    case typeof(value) == Number :
                        check = true
                        break;

                    case 'slow' :
                        check = true
                        break;

                    case 'nomal' :
                        check = true
                        break;

                    case 'fase' :
                        check = true
                        break;

                    default:
                        check = false
                        break;
                }
                return check
            }
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
            StickySpeed : this.speedStiky
        }
    },
    methods:{
        clickCapture(event){
            console.log(event)
        },
        sliderFocusOn(event){
            if(this.SliderMoving == false) {
                this.mouseEvent.isMoving = true
                this.mouseEvent.startPosition = event.clientX
            }
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
            if(!this.mouseEvent.isMoving && !this.SliderMoving){

                let time = 100

                clearTimeout(this.SlierTimeout)
                this.SlierTimeout = setTimeout(() => {
                    this.doItemStiky()
                },time)
            }
        },
        doItemStiky(_item){
            if(!_item) _item = this.getLeftItem()

            let movin           = _item.offsetLeft - this.$el.scrollLeft - this.paddingLeft

            /**
             * Velocity Animaion
             * https://github.com/julianshapiro/velocity/wiki/Basic---Arguments
             */
            Velocity(this.$refs.main, {
                scrollLeft: this.$el.scrollLeft + movin+'px'
            },{
                duration: this.StickySpeed,
                easing: "easeInOut"
            })

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
    },
    mounted(){
        this.paddingLeft = this.getLeftItem().offsetLeft
    }
}
</script>

<style lang="stylus" scoped>
@import '../luminus'


</style>