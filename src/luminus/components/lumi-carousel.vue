<template>
    <div class="lumi-flex-slider-wrapper"
        @click.stop.prevent
        @mousedown="sliderFocusOn($event)"
        @mousemove="sliderMoveHandler($event)"
        @mouseup="sliderMoveFinishHandler($event)"
        @mouseleave="sliderMoveFinishHandler($event)"
        @scroll="sliderScrollHandler">
        <ul class="lumi-flex-slider" ref="slider">
            <slot></slot>
        </ul>
        <div>
            {{ testText }}
        </div>
    </div>
</template>

<script>
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

            let movin           = _item.offsetLeft - this.$el.scrollLeft - this.paddingLeft,                // 움직여야 하는 목표 
                movin_abs       = Math.abs(movin),
                time            = 120,                                                                      // 세팅 시간
                movin_delay     = (time > movin_abs)? Math.round( time / movin_abs) : time,                 // 인터벌 대기시간
                movin_pixcel    = (time < movin_abs)? Math.sign(movin)*(Math.round(movin_abs / time)) : Math.sign(movin)*1, // 회당 움직일 거리
                movin_count     = Math.round( time / movin_delay ),                                         // 인터벌 횟수
                movin_time      = movin_delay * movin_count,                                                // 총 대기 시간
                movin_adjust    = movin - ( movin_pixcel * movin_count )                                // 보정 픽셀

                console.log("time set => ", time,
                            "\nmovin_total_pixel => ", movin,
                            "\nmovin_pixel_per_interval => ", movin_pixcel,
                            "\ninterval delay => ", movin_delay,
                            "\ninterval count => ", movin_count,
                            "\nmovin time => ",movin_time,
                            "\nmovin adust => ", movin_adjust)

            this.SliderMoving = true
            this.slideAnimation = setInterval(() => {
                console.log("movin => ", movin_pixcel+"px")
                this.$el.scrollLeft = this.$el.scrollLeft + movin_pixcel
            },movin_delay)

            setTimeout(()=>{
                clearInterval(this.slideAnimation)
                this.$el.scrollLeft = this.$el.scrollLeft + movin_adjust

                setTimeout(() => {
                    this.SliderMoving = false
                },100)
            },movin_time + 1)

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