<template>
    <div class="lumi-flex-slider-wrapper" ref="main"
        @click.stop.prevent
        @mousedown="sliderFocusOn($event)"
        @mousemove="sliderMoveHandler($event)"
        @mouseup="sliderMoveFinishHandler($event)"
        @mouseleave="sliderMoveFinishHandler($event)"
        @scroll.prevent="sliderScrollHandler($event)">
        <ul class="lumi-flex-slider">
            <slot name="loading"></slot>
            <slot></slot>
            <slot name="finish"></slot>
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
            default: 300,
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
        paddingSize : {
            type: Number,
            default: 50
        }
    },
    data(){
        let setStickySpeed = function(_val){
            let min = 100,              //최소 0.1초  
                max = 1000,             //최대 1초
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
            scrollX : 0,
            paddingLeft : 0,
            mouseEvent : {
                isMoving : false,
                movedX : 0,
                startPosition : 0,
            },
            SliderMoving: false,
            StickySpeed : setStickySpeed(this.speedStiky),
            slideFocused : 0,
            childrenSlide : []
        }
    },
    methods:{
        // clickCapture(event){
        //     console.log(event)
        // },
        sliderFocusOn($event){
            if(this.SliderMoving == false) {
                this.mouseEvent.isMoving = true
                this.mouseEvent.startPosition = $event.clientX
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

                // console.log("Finish Handler Captured!")
                this.mouseEvent.isMoving = false
                this.mouseEvent.movedX = 0
                
                if(this.itemStiky) this.doItemStiky()
            }
        },
        sliderScrollHandler(){

            // console.log("Scroll Captured!!")

            // $event.preventDefault();
            // $event.stopPropagation();            
            // if(!this.mouseEvent.isMoving && !this.SliderMoving){
            //     let time = 400
            //     clearTimeout(this.SlierTimeout)
            //     this.SlierTimeout = setTimeout(() => {
            //         this.doItemStiky()
            //     },time)
            // }
        },
        doItemStiky(_item){
            let movin

            switch (this.positionStiky) {
                case 'left':
                    if(!_item) _item = this.getStickyItem('left')
                    movin = _item.offsetLeft - this.$el.scrollLeft - this.paddingLeft
                    break;

                case 'center':
                    if(!_item) _item = this.getStickyItem('center')
                    movin = (_item.offsetLeft + ( _item.offsetWidth / 2) ) - ( this.$el.scrollLeft + ( this.$el.offsetWidth / 2 ) )
                    break

                case 'right':
                    if(!_item) _item = this.getStickyItem('right')
                    movin = (_item.offsetLeft + _item.offsetWidth) - ( this.$el.scrollLeft + this.$el.offsetWidth ) // 대상 엘리먼트에서 보이지 않는 부분을 계산함 (-20)
                    break;
                    
                default: //기본값 : left와 동일
                    if(!_item) _item = this.getStickyItem('left')
                    movin = _item.offsetLeft - this.$el.scrollLeft - this.paddingLeft
                    break;
            }

            /**
             * Velocity Animaion
             * https://github.com/julianshapiro/velocity/wiki/Basic---Arguments
             */
            Velocity(this.$refs.main, {
                scrollLeft: this.$el.scrollLeft+movin+'px'
            },{
                duration: this.StickySpeed,
                easing: "easeInOut",
                begin:() => { this.SliderMoving = true },
                complete: () => { this.SliderMoving = false },
            })

        },
        getStickyItem(_position = this.positionStiky){
            let arr = this.$el.getElementsByClassName('lumi-caroucel-item'),
                get_element,
                get_near
            
            switch (_position) {
                case 'left':
                    arr.forEach(element => {
                        let near = Math.abs(this.$el.scrollLeft - element.offsetLeft)

                        if(get_near == null || get_near > near){
                            get_near = near
                            get_element = element 
                        }
                    });
                    break;

                case 'center':

                    arr.forEach(element => {
                        let near = Math.abs( (this.$el.scrollLeft + ( this.$el.clientWidth / 2) ) - ( element.offsetLeft + ( element.offsetWidth / 2) ) )

                        if(get_near == null || get_near > near){
                            get_near = near
                            get_element = element 
                        }
                    });

                    break;

                case 'right':
                    arr.forEach(element => {
                        let near = Math.abs( (this.$el.scrollLeft + this.$el.clientWidth) - ( element.offsetLeft + element.offsetWidth ) )

                        if(get_near == null || get_near > near){
                            get_near = near
                            get_element = element 
                        }
                    });
                    break;

                default: //left와 동일
                    arr.forEach(element => {
                        let near = Math.abs(this.$el.scrollLeft - element.offsetLeft)

                        if(get_near == null || get_near > near){
                            get_near = near
                            get_element = element 
                        }
                    });
                    break;
            }

            // console.log("Get Item from '"+_position+"' => ",get_element)

            return get_element
        },
        setOffsetLeft(){
            this.paddingLeft = this.paddingSize
        },
        doItemFocus(_itemNumber){
            let arr = this.$el.getElementsByClassName('lumi-caroucel-item'),
                current = this.$el.getElementsByClassName('lumi-caroucel-item activate')[0]

            if(current) {
                // console.log(current)
                current.classList.remove('activate')
            }
            if(arr.length > 0) {
                let focusItem = arr[_itemNumber]
                focusItem.classList.add('activate')
                this.doItemStiky(focusItem)
            }
        },
        setChildren(){
            this.childrenSlide = this.$el.getElementsByClassName('lumi-caroucel-item')
        },
        setMoveFocus(_direction = null){

            switch (_direction) {
                case 'left':
                case 'center':
                    if( this.slideFocused >= this.childrenSlide.length){
                        this.slideFocused = 0
                    } else {
                        ++ this.slideFocused
                    }
                    break;

                case 'right':
                    if( this.slideFocused >= this.childrenSlide.length){
                        this.slideFocused = 0
                    } else {
                        ++ this.slideFocused
                    }
                    break;

                default:
                    break;
            }
        }
    },
    mounted(){
        this.setChildren()
        this.setOffsetLeft()
        this.doItemFocus(this.slideFocused)
    },
    watch: {
        slideFocused(_focusingNumber){
            this.doItemFocus(_focusingNumber)
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '../luminus'

.activate
    border 1px solid red
</style>