<template>
    <div class="lumi-flex-slider-wrapper" ref="main"
        v-touch:swipe="touchSwipeHandler"
        @touchstart="touchStartHandler"
        @mousedown="sliderFocusOn($event)"
        @mousemove="sliderMoveHandler($event)"
        @mouseup="sliderMoveFinishHandler($event)"
        @mouseleave="sliderMoveFinishHandler($event)">
        <ul class="lumi-flex-slider" ref="slide"
            v-bind:style="{ transform: 'translateX('+transformX+'px)' }">
            <slot name="loading" v-if="!asyncStatus.loadFinish">
                Loading
            </slot>
            <slot v-if="asyncStatus.loadFinish"></slot>
            <slot name="finish"></slot>
        </ul>
    </div>
</template>
<script>
// // transform: translateX(100px)
import Vue from 'vue'
import Velocity from 'velocity-animate'
import Vue2TouchEvents from 'vue2-touch-events'
 
Vue.use(Vue2TouchEvents)

export default {
    name: 'lumi-carousel',
    props: {
        itemStiky: {
            type: Boolean,
            default: true
        },
        speedStiky: {
            default: 1000,
            validator: function(_val){
                if(typeof(_val) == 'number') return true
                if(typeof(_val) == 'string'){
                    let modeList = ['slow','nomal','fast']
                    return modeList.filter(mode => mode == _val ).length > 0
                }
                return false
            }
        },
        positionStiky: {
            type: String,
            default: 'left',
            validator: function(_val){
                let modeList = ['left','center','right']
                return modeList.filter(mode => mode == _val ).length > 0
            }
        },
        async:{
            type: Boolean,
            default: false
        }
    },
    data(){
        let setStickySpeed = function(_val){
            let min = 100,              //최소 0.1초  
                max = 800,              //최대 0.8초
                default_speed = 300,    // 기본 스피드 0.3
                speed = default_speed

            if(typeof(_val) == 'number'){
                if(_val < min) speed = min
                if(_val > max) speed = max
                speed = _val
            }

            if(typeof(_val) == 'string'){
                switch (_val) {
                    case 'slow':
                        speed = max
                        break;

                    case 'nomal':
                        speed = default_speed
                        break
                    
                    case 'fast':
                        speed = min
                        break
                
                    default:
                        speed = default_speed
                        break;
                }
            }
            return speed
        }

        return {
            transformX: 0,
            scrollX : 0,
            paddingLeft : 0,
            touchEvent : {
                isSwipe : false,
                swipeTolerance : 400
            },
            mouseEvent : {
                isMoving : false,
                movedX : 0,
                startPosition : 0,
            },
            asyncStatus: {
                loadFinish: !this.async
            },
            SliderMoving: false,
            StickySpeed : setStickySpeed(this.speedStiky),
            slideFocused : 0,
            childrenSlide : this.$children
        }
    },
    methods:{
        clickCapture(_message){
            console.log(_message)
        },
        touchStartHandler(){
            this.touchEvent.isSwipe = true,
            setTimeout(() => {
                this.touchEvent.isSwipe = false
            },this.touchEvent.swipeTolerance)
        },
        touchSwipeHandler(_direction){
            console.log("Swipe => ",_direction)
            if(this.SliderMoving == false && this.touchEvent.isSwipe == true) {

                switch (_direction) {
                    case 'left':
                        this.setMoveFocus('left')
                        break;

                    case 'right':
                        this.setMoveFocus('right')
                        break;

                    default:
                        break;
                }
            }
        },
        sliderFocusOn($event){
            if(this.SliderMoving == false) {
                this.mouseEvent.isMoving = true
                // this.mouseEvent.startPosition = $event.clientX
                this.mouseEvent.movedX = $event.clientX

                this.touchEvent.isSwipe = true,
                setTimeout(() => {
                    this.touchEvent.isSwipe = false
                },this.touchEvent.swipeTolerance)
            }
        },
        sliderMoveHandler($event){
            if(this.mouseEvent.isMoving == true){
                // let moved = this.mouseEvent.movedX - $event.clientX
                let moved = this.mouseEvent.movedX - $event.clientX
                
                console.log("moved => ",moved)

                // this.$el.scrollLeft = this.$el.scrollLeft + this.mouseEvent.startPosition + moved 
                this.transformX = this.transformX - moved

                // let transformX = (this.transformX - moved)+"px"
                // Velocity(this.$refs.slide, { translateX: transformX },1)


                // clear
                this.mouseEvent.movedX = $event.clientX
                this.mouseEvent.startPosition = 0
            }
        },
        sliderMoveFinishHandler(){
            if(this.mouseEvent.isMoving == true){

                // console.log("Finish Handler Captured!")
                this.mouseEvent.isMoving = false
                this.mouseEvent.movedX = 0
                
                if(this.itemStiky && this.touchEvent.isSwipe == false) {
                    this.doItemFocus(this.getStickyItem(true))
                }
            }
        },
        doItemStiky(_item){
            let movin

            switch (this.positionStiky) {
                case 'left':
                    if(!_item) _item = this.getStickyItem(false,'left')
                    // movin = _item.offsetLeft - this.$el.scrollLeft - this.paddingLeft
                    movin = _item.offsetLeft
                    break;

                case 'center':
                    if(!_item) _item = this.getStickyItem(false,'center')
                    // movin = (_item.offsetLeft + ( _item.offsetWidth / 2) ) - ( this.$el.scrollLeft + ( this.$el.offsetWidth / 2 ) )
                    movin = -( this.$el.clientWidth / 2 ) + _item.offsetLeft + ( _item.offsetWidth / 2)
                    console.log(this.$el.clientWidth, _item.offsetLeft,( _item.offsetWidth / 2))
                    break

                case 'right':
                    if(!_item) _item = this.getStickyItem(false,'right')
                    // movin = (_item.offsetLeft + _item.offsetWidth) - ( this.$el.scrollLeft + this.$el.offsetWidth ) // 대상 엘리먼트에서 보이지 않는 부분을 계산함 (-20)
                    movin = (_item.offsetLeft + _item.offsetWidth)
                    break;
                    
                default: //기본값 : left와 동일
                    if(!_item) _item = this.getStickyItem(false,'left')
                    // movin = _item.offsetLeft - this.$el.scrollLeft - this.paddingLeft
                    movin = _item.offsetLeft
                    break;
            }

            /**
             * Velocity Animaion
             * https://github.com/julianshapiro/velocity/wiki/Basic---Arguments
             */
            let transformX = -movin
            // console.log(transformX) 
            Velocity(this.$refs.slide, {
                translateX: [transformX, this.transformX]
            },{
                duration: this.StickySpeed,
                easing: "spring",
                begin:() => {
                    console.log("movin start")
                    this.SliderMoving = true 
                },
                complete: () => {
                    console.log("movin end")
                    this.transformX = transformX
                    this.SliderMoving = false
                },
            })

            // this.transformX = transformX

            return this

        },
        getStickyItem(_returnIndex = true,_position = this.positionStiky){
            let arr = this.$el.getElementsByClassName('lumi-caroucel-item'),
                get_element,
                get_index,
                get_near

            arr.forEach((element,index) => {

                let near = Math.abs(this.$el.scrollLeft - element.offsetLeft)

                switch (_position) {
                    case 'left':
                        // near = Math.abs(this.$el.scrollLeft - element.offsetLeft)
                        near = Math.abs(this.transformX + element.offsetLeft)
                        break;

                    case 'center':
                        // near = Math.abs( (this.$el.scrollLeft + ( this.$el.clientWidth / 2) ) - ( element.offsetLeft + ( element.offsetWidth / 2) ) )
                        near = Math.abs( ( this.transformX - ( this.$el.clientWidth / 2 ) ) + ( element.offsetLeft + ( element.offsetWidth / 2) ) )
                        break;

                    case 'right':
                        // near = Math.abs(this.$el.scrollLeft - element.offsetLeft)
                        near = Math.abs(this.$el.scrollLeft - element.offsetLeft)
                        break;
                }

                if(get_near == null || get_near > near){
                    get_near = near
                    get_index = index 
                    get_element = element 
                }
            });


            if(_returnIndex == true){
                return get_index
            }

            return get_element
        },
        doItemFocus(_itemNumber = 0){
            let arr = this.$el.getElementsByClassName('lumi-caroucel-item'),
                current = this.$el.getElementsByClassName('lumi-caroucel-item activate')[0]

            if(current) current.classList.remove('activate')

            if(arr.length > 0) {
                let focusItem = arr[_itemNumber]
                focusItem.classList.add('activate')
                console.log(">> doItemFocus",focusItem)
                this.doItemStiky(focusItem)
            }

            return this
        },
        setMoveFocus(_direction = null){

            switch (_direction) {
                case 'left':
                case 'center':
                    if( this.slideFocused >= ( this.childrenSlide.length - 1) ){
                        this.slideFocused = 0
                    } else {
                        ++ this.slideFocused
                    }
                    break;

                case 'right':
                    if( this.slideFocused <= 0){
                        this.slideFocused = ( this.childrenSlide.length - 1)
                    } else {
                        --this.slideFocused
                    }
                    break;

                default:
                    break;
            }

            return this
        },
        setAsyncFinish(){
            this.asyncStatus.loadFinish = true
            // this.setChildren()
            this.doItemFocus(0)

            console.log("AsyncFinished")
            return this
        },
    },
    mounted(){
        // this.setChildren()
        this.doItemFocus(this.slideFocused)

        this.$emit('loaded',this)
    },
    watch: {
        slideFocused(_focusingNumber){
            this.doItemFocus(_focusingNumber)
        },
        childrenSlide(_newSlide){
            console.log("Slide Changed => ",_newSlide)
            
            if(this.asyncStatus.loadFinish == false) this.asyncStatus.loadFinish = true
            this.doItemFocus(this.focusItem)
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '../luminus'

.activate
    border 1px solid red
</style>