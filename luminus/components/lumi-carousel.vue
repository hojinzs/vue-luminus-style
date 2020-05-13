<template>
    <div
        ref="main"
        class="lumi-flex-slider-wrapper"
        @swipe="touchSwipeHandler"
        @touchstart="touchStartHandler"
        @mousedown="mouseDownHandler"
    >
        <ul
            class="lumi-flex-slider" ref="slide"
            v-bind:class="{ 'lumi-flex-slider-align-bottom': (verticalAlign === 'bottom') }"
            v-bind:style="{ transform: 'translateX('+transformX+'px)' }"
        >
            <slot
                name="loading"
                v-if="!asyncStatus.loadFinish"
            >
                Loading
            </slot>

            <slot
                v-if="asyncStatus.loadFinish"
            >
            </slot>

            <slot
                name="finish"
            >

            </slot>
        </ul>
    </div>
</template>
<script>
import Velocity from 'velocity-animate'
import elementTouchControl from "../plugins/element-touch-control";
import screenResizeDetector from "../mixins/screen-resize-detector";

export default {
    name: 'lumi-carousel',
    mixins: [
        screenResizeDetector
    ],
    props: {
        itemStiky: {
            type: Boolean,
            default: true
        },
        verticalAlign: {
            type: String,
            default: "bottom"
        },
        speedStiky: {
            default: 1000,
            validator: function(_val){
                if(typeof(_val) == 'number') return true
                if(typeof(_val) == 'string'){
                    let modeList = ['slow','nomal','fast']
                    return modeList.filter(mode => mode === _val ).length > 0
                }
                return false
            }
        },
        positionStiky: {
            type: String,
            default: 'left',
            validator: function(_val){
                let modeList = ['left','center','right']
                return modeList.filter(mode => mode === _val ).length > 0
            }
        },
        autoFocusItem: {
            type: Boolean,
            default: true,
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
                swipeTolerance : 400,
            },
            mouseEvent : {
                isMoving : false,
                movedX : 0,
                startPosition : 0,
                totalMovded : 0,
            },
            asyncStatus: {
                loadFinish: !this.async
            },
            SliderMoving: false,
            stickyAnimation: {
                speed : setStickySpeed(this.speedStiky),
                easing : "spring"
            },
            slideFocused : 0,
            childrenSlide : this.$children,
        }
    },
    methods:{
        touchStartHandler($touchStartEvent){

            if(this.SliderMoving === false){
                this.mouseEvent.isMoving = true
                this.mouseEvent.movedX = $touchStartEvent.touches[0].clientX
                this.mouseEvent.totalMovded = 0

                /**
                 * 일정 시간 동안 스와이프 판정
                 */
                this.touchEvent.isSwipe = true,
                setTimeout(() => {
                    this.touchEvent.isSwipe = false
                },this.touchEvent.swipeTolerance)

                let touchMove = ($touchMoveEvent) => {
                    let moved = this.mouseEvent.movedX - $touchMoveEvent.touches[0].clientX
                    this.mouseEvent.totalMovded = this.mouseEvent.totalMovded + Math.abs(moved)

                    this.transformX = this.transformX - moved

                    // clear
                    this.mouseEvent.movedX = $touchMoveEvent.touches[0].clientX
                    this.mouseEvent.startPosition = 0
                }

                let touchEnd = () => {
                    document.body.removeEventListener("touchmove", touchMove,false)
                    this.mouseEvent.isMoving = false
                    this.mouseEvent.movedX = 0

                    if(this.itemStiky && this.touchEvent.isSwipe === false) this.doItemFocus(this.getStickyItem(true))
                }

                document.body.addEventListener('touchmove',touchMove,false)
                document.body.addEventListener('touchend',touchEnd,{once: true})
            }
        },
        touchSwipeHandler(e){
            let _direction = e.detail.swipe
            console.log("Swipe => ",_direction)
            if(this.SliderMoving === false && this.touchEvent.isSwipe === true) {

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
        mouseDownHandler($event){
            if(this.SliderMoving === false) {
                this.mouseEvent.isMoving = true
                this.mouseEvent.movedX = $event.clientX
                this.mouseEvent.totalMovded = 0

                /**
                 * 일정 시간 동안 스와이프 판정
                 */
                this.touchEvent.isSwipe = true,
                setTimeout(() => {
                    this.touchEvent.isSwipe = false
                },this.touchEvent.swipeTolerance)

                /**
                 * 마우스가 움직일때 핸들러
                 */
                let mouseMove = ($mouseMoveEvent) => {
                    let moved = this.mouseEvent.movedX - $mouseMoveEvent.clientX
                    this.mouseEvent.totalMovded = this.mouseEvent.totalMovded + Math.abs(moved)

                    this.transformX = this.transformX - moved

                    // clear
                    this.mouseEvent.movedX = $mouseMoveEvent.clientX
                    this.mouseEvent.startPosition = 0
                }

                let mouseUp = () => {
                    document.body.removeEventListener("mousemove", mouseMove,false)
                    this.mouseEvent.isMoving = false
                    this.mouseEvent.movedX = 0

                    if(this.mouseEvent.totalMovded !== 0) event.stopPropagation()
                    if(this.itemStiky && this.touchEvent.isSwipe === false) this.doItemFocus(this.getStickyItem(true))
                }

                document.body.addEventListener('mousemove',mouseMove,false)
                document.body.addEventListener('mouseup',mouseUp,{once: true})

            }
        },
        /**
         * 아이템을 화면의 지정된 포지션(left,center,right)으로 정렬한다.
         * @param _item {Element} 정렬할 아이템 엘리먼트
         * @returns {default.methods}
         */
        doItemStiky(_item = null){

            // 슬라이더가 움직이는 중이라면 캔슬
            if(this.SliderMoving) return this

            let movin // 움직일 거리를 계산한다.
            switch (this.positionStiky) {
                case 'left':
                    if(!_item) _item = this.getStickyItem(false,'left')
                    movin = _item.offsetLeft
                    break;

                case 'center':
                    if(!_item) _item = this.getStickyItem(false,'center')
                    movin = -( this.$el.clientWidth / 2 ) + _item.offsetLeft + ( _item.offsetWidth / 2)
                    break

                case 'right':
                    if(!_item) _item = this.getStickyItem(false,'right')
                    movin = (_item.offsetLeft + _item.offsetWidth)
                    break;

                default: //기본값 : left와 동일
                    if(!_item) _item = this.getStickyItem(false,'left')
                    movin = _item.offsetLeft
                    break;
            }

            /**
             * Velocity Animaion
             * https://github.com/julianshapiro/velocity/wiki/Basic---Arguments
             */
            let transformX = -movin
            Velocity(this.$refs.slide, {
                translateX: [transformX, this.transformX]
            },{
                duration: this.stickyAnimation.speed,
                easing: this.stickyAnimation.easing,
                begin:() => {
                    this.SliderMoving = true
                },
                complete: () => {
                    this.transformX = transformX
                    this.SliderMoving = false
                },
            })
            return this
        },
        /**
         * 화면의 지정된 포지션에 가까운 아이템을 가져옴
         * @param _returnIndex {Boolean} 반환 타입 (indexNumber || Element)
         * @param _position {string} 아이템을 가져올 화면 포지션 ['left', 'center', 'right']
         * @return Number|Element
         */
        getStickyItem(_returnIndex = true, _position = this.positionStiky){
            let arr = this.$el.getElementsByClassName('lumi-caroucel-item'),
                get_element,
                get_index,
                get_near

            arr.forEach((element,index) => {

                let near = Math.abs(this.$el.scrollLeft - element.offsetLeft)

                switch (_position) {
                    case 'left':
                        near = Math.abs(this.transformX + element.offsetLeft)
                        break;

                    case 'center':
                        near = Math.abs( ( this.transformX - ( this.$el.clientWidth / 2 ) ) + ( element.offsetLeft + ( element.offsetWidth / 2) ) )
                        break;

                    case 'right':
                        near = Math.abs(this.$el.scrollLeft - element.offsetLeft)
                        break;
                }

                if(get_near == null || get_near > near){
                    get_near = near
                    get_index = index
                    get_element = element
                }
            });

            if(_returnIndex === true){
                return get_index
            }

            return get_element
        },
        doItemFocus(itemNumber = 0){
            if(this.slideFocused !== itemNumber) {
                this.slideFocused = itemNumber
                return this
            }

            let arr = this.$el.getElementsByClassName('lumi-caroucel-item'),
                current = this.$el.getElementsByClassName('lumi-caroucel-item activate')[0]

            if(current) current.classList.remove('activate')

            if(arr.length > 0) {
                let focusItem = arr[itemNumber]
                focusItem.classList.add('activate')
                this.doItemStiky(focusItem)
            }

            return this
        },
        /**
         * 포커스 될 방향에 따라 포커스할 아이템 번호(sliderFocused)를 제어
         * @param _direction {String} ('left','center','right') 이동할 방향
         */
        setMoveFocus(_direction = null){

            if(this.childrenSlide.length === 1){
                this.doItemFocus(0)
                return this;
            }

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
        /**
         * 상위 객체에서, async가 끝났을 때 포커스를 위해 제어
         * @param focusItem {Number} async 종료 후 포커스할 아이템 넘버. -1이 주어진다면, 포커스하지 않는다.
         */
        setAsyncFinish(focusItem = 0){
            this.asyncStatus.loadFinish = true
            if(focusItem > -1){
                this.doItemFocus(focusItem)
            }
            return this
        },
        /**
         * 하위 객체 데이터 전파를 위한 메소드 (클릭인지 슬라이드인지 감지를 위해)
         */
        isClick(){
            return this.mouseEvent.totalMovded === 0
        },
        testing(text = 'test'){
            console.log("TESTING => ", text)
        },
        resizeAction() {
            return setTimeout(() => {
                this.doItemFocus(this.slideFocused)
            },700)
        }
    },
    mounted(){
        new elementTouchControl(this.$el, {
            detectAxis: 'X',
            swipeToleranceInterval: this.touchEvent.swipeTolerance,
        })

        this.doItemFocus(this.slideFocused)
        this.$emit('loaded',this)
    },
    watch: {
        /**
         * 내부 slideFocused 데이터 변화를 감지해 자동 포커스
         */
        slideFocused(_focusingNumber){
            this.doItemFocus(_focusingNumber)
            this.$emit('focused',_focusingNumber)
        },
        /**
         * 하위 슬라이드 아이템 수랑을 감지해, async 종료를 감지하고, 자동으로 아이템을 포커스한다.
         */
        childrenSlide(){
            // async 종료로 변경
            if(this.async === true && this.asyncStatus.loadFinish === false) {
                this.asyncStatus.loadFinish = true
            }
            // 아이템 자동 포커스
            if(this.autoFocusItem){
                this.doItemFocus(this.slideFocused)
            }
        },
        windowWidth(){
            clearTimeout(this.resizeAction())
            this.resizeAction()
        },
    }
}
</script>

<style lang="stylus" scoped>

</style>