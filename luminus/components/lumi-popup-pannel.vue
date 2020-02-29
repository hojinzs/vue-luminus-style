<template>
    <div class="lumi-popup-backdrop"
        v-show="(displayModal)"
        v-bind:style="[ styleBackdropFilter ]"
        @click.self.stop="close()">

        <div class="lumi-popup" ref="popup"
            v-bind:style="{
                transform: 'translateY('+position.translateY+'px)',
                maxWidth: this.maxWidth+'px'}">
            <div @touchstart="touchStart">
                =====================
            </div>
            <div class="popup_contents">
                <div class="popup_contents_wrapper">
                    <slot></slot>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Velocity from 'velocity-animate'

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
        returnTo: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            displayModal: this.display,
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
            }
        }
    },
    computed: {
        styleBackdropFilter(){
            return {
                backdropFilter: "blur("+this.backdrop.Blur+"px) brightness("+this.backdrop.Bright+"%)"
            }
        }
    },
    methods:{
        show(_show = true){
            this.display = _show
        },
        touchStart($touchEvent){
            event.preventDefault()
            this.touchEvent.isMoving = true
            this.touchEvent.movedY = $touchEvent.touches[0].clientY
            this.touchEvent.totalMovded = 0

            // 터치 스타트시 피드백 애니메이션 필요 (CSS 컨트롤)

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
                 * 스와이프 감지 시간동안, 음의 방향으로 움직였다면 닫기로 감지
                 */
                if(this.touchEvent.isSwipe){
                    if(this.touchEvent.totalMovded < 0){
                        this.close()
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
            if(!this.touchEvent.isMoving && this.displayModal == false && this.display == true){
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

                    this.$emit('update:display',true)
                }, during);
            }
        },
        close(){
            if(!this.touchEvent.isMoving && this.displayModal == true && this.display == true){
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

                    if(this.returnTo) this.$router.push(this.returnTo)
                }, during);
            }
        },
    },
    watch: {
        display(_newDisplay,_oldDisplay){
            console.log(_newDisplay,_oldDisplay)
            if(_newDisplay == true && _oldDisplay == false) this.open()
            if(_newDisplay == false && _oldDisplay == true) this.close()
        }
    },
    mounted(){
        this.$emit('mounted',this)
        if(this.display) this.open()

        // document.body.addEventListener('scroll',(e) => {
        //     if(this.display){
        //         e.preventDefault()
        //     }
        // },{passive: false})
        // document.body.addEventListener('touchmove',(e) => {
        //     if(this.display){
        //         e.preventDefault()
        //     }
        // },{passive: false})
        // document.body.addEventListener('mousewheel',(e) => {
        //     if(this.display){
        //         e.preventDefault()
        //     }
        // },{passive: false})

    },
}
</script>

<style lang="stylus">
.lumi-popup-backdrop
    position fixed
    overflow hidden
    z-index 500
    top 0
    // bottom
    height 100%
    width 100%
    text-align center
    // backdrop-filter blur(2px) brightness(30%)
    .lumi-popup
        // position absolute
        // top 4em
        overflow hidden
        margin 0 auto
        z-index 510
        margin-top 4em
        height 110%
        width 100%
        background-color white
        border-radius 1.3em 1.3em 0 0
        box-shadow 0px -2px 12px 4px rgba(0,0,0,0.4)
        .popup_header
            min-height 1em
        .popup_contents
            width 100%
            height 82%
            overflow-y scroll
</style>