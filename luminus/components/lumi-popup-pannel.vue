<template>
    <div class="lumi-popup-backdrop"
    v-show="displayModal"
    v-bind:style="[ styleBackdropFilter ]"
    @click.self="close()">

        <div class="lumi-popop-wrapper"
        v-bind:style="{height: maxHeight+'%'}"
        @click.self="close()">

            <div class="lumi-popup" ref="popup"
                :style="{
                    transform: 'translateY('+position.translateY+'px)',
                    maxWidth: this.maxWidth+'px'}">

                <div class="lumi-popup-pannel-handler"
                    @touchstart="touchStart">
                    <div class="hanlder" ref="handler"></div>
                </div>

                <div class="lumi-popup-pannel-header"
                    v-if="showHeader">
                    <slot name="header">
                        <div class="header-default">
                            <h3>{{headerTitle}}</h3>
                        </div>
                    </slot>
                </div>

                <div class="popup_contents"
                @scroll.passive="handleScroll"
                :style="'box-shadow: inset 1px 6px 9px -6px rgba(0,0,0,'+contents.scrollShadow+')'">
                    <div class="popup_contents_wrapper">
                        <slot></slot>
                    </div>
                </div>

            </div>

        </div>

    </div>
</template>

<script>
import Velocity from 'velocity-animate'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

export default {
    name: 'lumi-popup',
    props: {
        display: {
            type: Boolean,
            default: false
        },
        backdropBlur: {
            type: Number,
            default: 2
        },
        backdropBright: {
            type: Number,
            default: 40
        },
        transitionDuring: {
            type: Number,
            default: 700
        },
        maxWidth: {
            type: Number,
            default: 990
        },
        maxHeight: {
            type: Number,
            default: 92
        },
        returnTo: {
            type: Object,
            default: null
        },
        headerTitle: {
            type: String,
        },
        useHeader: {
            type: Boolean,
            default: false
        }
    },
    data() {
        let _headerTitleUse = () => {
            return !(typeof this.headerTitle == 'undefined') || this.useHeader
        }
        return {
            displayModal: false,
            position: {
                translateY: 0,
                PannelMoving: false
            },
            backdrop: {
                Blur: 0,
                Bright: 100,
            },
            touchEvent: {
                isMoving: false,
                isSwipe: false,
                movedY: 0,
                startPosition: 0,
                swipeTolerance: 300,
                totalMovded: 0,
            },
            contents: {
                scrollShadow: 0
            },
            showHeader: _headerTitleUse()
        }
    },
    computed: {
        styleBackdropFilter(){
            return {
                backdropFilter: "blur("+this.backdrop.Blur+"px) brightness("+this.backdrop.Bright+"%)"
            }
        },
    },
    methods:{
        touchStart($touchEvent){
            $touchEvent.preventDefault()
            this.touchEvent.isMoving = true
            this.touchEvent.movedY = $touchEvent.touches[0].clientY
            this.touchEvent.totalMovded = 0

            /**
             * 터치 시작시 피드백
             */
            Velocity(this.$refs.handler,{
                scaleX: [1, 1.2, 0.8],
                scaleY: [1, 1.5, 0.8],
                backgroundColor: '#4d4d4d',
            },{
                duration: 500,
                easing: 'spring'
            })

            /**
             * 일정 시간 동안 스와이프 판정
             */
            this.touchEvent.isSwipe = true,
            setTimeout(() => {
                this.touchEvent.isSwipe = false
            },this.touchEvent.swipeTolerance)

            let touchMove = ($touchMoveEvent) => {
                let moved = this.touchEvent.movedY - $touchMoveEvent.touches[0].clientY
                this.position.translateY = this.position.translateY - moved
                this.touchEvent.totalMovded = this.touchEvent.totalMovded + moved

                // console.log("moved => ", moved)

                // clear
                this.touchEvent.movedY = $touchMoveEvent.touches[0].clientY
                this.touchEvent.startPosition = 0
            }

            let touchEnd = () => {
                document.body.removeEventListener("touchmove", touchMove)

                /**
                 * 터치 시작시 피드백
                 */
                Velocity(this.$refs.handler,{
                    backgroundColor: '#a6a6a6',
                },{
                    duration: 500,
                })

                /**
                 * 스와이프 감지 시간동안, 음의 방향으로 움직였다면 닫기로 감지
                 */
                if(this.touchEvent.isSwipe){
                    if(this.touchEvent.totalMovded < 0){
                        this.touchEvent.isMoving = false
                        this.$emit('update:display',false)
                        return
                    }
                }

                /**
                 * body Height의 70% 이하로 내려가면 창을 닫는다.
                 */
                let scrollDowned = this.$el.clientTop + this.position.translateY,
                    limit = ( window.outerHeight * ( 1 - 0.70) )
                if(scrollDowned > limit){
                    this.touchEvent.isMoving = false
                    this.close()
                    return
                } else {
                    // 70% 이하가 아닐 경우 바운스
                    Velocity(this.$refs['popup'], {
                        translateY: [ 0, this.position.translateY ]
                    },{
                        duration: this.transitionDuring,
                        easing: 'spring',
                        complete: () => {
                            this.position.translateY = 0
                            this.touchEvent.isMoving = false
                            this.touchEvent.movedY = 0
                        },
                    })
                    return
                }
            }

            document.body.addEventListener('touchmove',touchMove,false)
            document.body.addEventListener('touchend',touchEnd,{once: true})

        },
        open(){
            if(!this.touchEvent.isMoving && this.displayModal == false){
                this.displayModal = true

                let during = this.transitionDuring,
                    interval = during / 50,
                    conunt = during / interval

                let mounted = setInterval(() => {
                    this.backdrop.Blur = this.backdrop.Blur + ( this.backdropBlur / conunt )
                    this.backdrop.Bright = this.backdrop.Bright - ( (100 - this.backdropBright) / conunt )
                }, interval);


                Velocity(this.$refs['popup'], {
                    translateY: [ this.position.translateY, 1000 ]
                },{
                    duration: during,
                    easing: 'ease',
                    before: () => {
                        this.touchEvent.isMoving = true
                    },
                    complete: () => {
                        this.touchEvent.isMoving = false
                    }
                })

                setTimeout(() => {
                    clearInterval(mounted)
                    this.backdrop.Blur = this.backdropBlur
                    this.backdrop.Bright = this.backdropBright

                    disableBodyScroll(this.$refs['popup'])

                    this.$emit('update:display',true)
                }, during);
            }
        },
        close(){
            if(!this.touchEvent.isMoving && this.displayModal == true){
                let during = this.transitionDuring,
                    interval = during / 50,
                    conunt = during / interval

                let mounted = setInterval(() => {
                    this.backdrop.Blur = this.backdrop.Blur - ( this.backdropBlur / conunt )
                    this.backdrop.Bright = this.backdrop.Bright + ( (100 - this.backdropBright) / conunt )
                }, interval);

                Velocity(this.$refs['popup'], {
                    translateY: [ 1000, this.position.translateY ]
                },{
                    duration: during,
                    easing: 'ease-in-out',
                    before: () => {
                        this.touchEvent.isMoving = true
                    },
                    complete: () => {
                        this.displayModal = false
                        this.position.translateY = 0
                        this.touchEvent.isMoving = false
                    }
                })

                setTimeout(() => {
                    clearInterval(mounted)
                    this.backdrop.Blur = 0
                    this.backdrop.Bright = 100

                    this.$emit('update:display',false)
                    enableBodyScroll(this.$refs['popup'])

                    if(this.returnTo) this.$router.push(this.returnTo)
                }, during);
            }
        },
        handleScroll($event){
            if($event.target.scrollTop >= 120) {
                this.contents.scrollShadow = 0.60
            } else {
                this.contents.scrollShadow = $event.target.scrollTop*0.005
            }
            return
        }
    },
    watch: {
        display(_newDisplay,_oldDisplay){
            if(_newDisplay == true && _oldDisplay == false) this.open()
            if(_newDisplay == false && _oldDisplay == true) this.close()
        },
    },
    mounted(){
        if(this.display) this.open()
        this.$emit('mounted',this)
    },
    destroyed(){
        clearAllBodyScrollLocks()
    }
}
</script>

<style lang="stylus" scoped>
.lumi-popup-backdrop
    position fixed
    overflow hidden
    z-index 500
    top 0
    height 100%
    width 100%
    text-align center
    // backdrop-filter blur(2px) brightness(30%)
    .lumi-popop-wrapper
        position absolute
        bottom 0
        width 100%
        height 95%
        .lumi-popup
            overflow hidden
            display flex
            flex-direction column
            margin 0 auto
            z-index 510
            bottom 0
            height 100%
            width 100%
            padding-bottom 50%
            background-color white
            border-radius 0.6em 0.6em 0 0
            box-shadow 0px -2px 12px 4px rgba(0,0,0,0.4)
            .lumi-popup-pannel-handler
                flex 1 1 auto
                .hanlder
                    background-color #a6a6a6
                    height 8px
                    width 30%
                    max-width 300px
                    margin 0 auto
                    margin-bottom 7px
                    margin-top 5px
                    border-radius 4px
            .lumi-popup-pannel-header
                flex 1 1 auto
                .header-default
                    margin 3px 0px 3px 0px
            .popup_contents
                flex 1 1 auto
                overflow-y scroll

</style>