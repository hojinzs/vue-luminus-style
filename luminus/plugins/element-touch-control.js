/******************************
 * Element Touch Control
 * version: 0.0.1
 * @type {elementTouchControl}
 *****************************/
const elementTouchControl = class {

    /**
     * set Touch Control Handling Element
     * @param {Element} element
     * @param options
     */
    constructor(element, options = {
        detectAxis: null,
        swipeToleranceInterval: null,
        swipeToleranceMoved: null 
    }) {
        this._Target = element

        // options 
        this._detectAxis = options.detectAxis || 'ALL'
        this._swipeToleranceInterval = options.swipeToleranceInterval || 300
        this._swipeToleranceMoved = options.swipeToleranceMoved || 10

        // moving state
        this._type = ''
        this._isSwipe = false
        this._pointerMoving = false
        this._pointerMovedX = 0
        this._pointerMovedY = 0
        this._startPointX = 0
        this._startPointY = 0

        // callback functions
        this._callbackFn = {
            start: () => {},
            moved: () => {},
            end: () => {},
            swipe: () => {},
        }
    
        /**
         * bind Touch Start Event
         * @param {Event} startEvent 
         */
        let pointingStartHandler = startEvent => {
            if(this._pointerMoving === true){
                return;
            }

            let point = this._getPoint(startEvent)

            // 포인터 초기화
            this._initialPointer(
                point.x,
                point.y
            )
    
            // 일정 시간동안 스와이프 판정
            this._swipeStart()

            // 시작 콜백 실행
            this._callbackFn.start(startEvent);
    
            /**
             * 포인터 무빙 이벤트
             * @param {Event} touchMoveEvent 
             */
            let pointMoveHandler = touchMoveEvent => {
                let point = this._getPoint(touchMoveEvent)
                let movedX = point.x - this._pointerMovedX
                let movedY = point.y - this._pointerMovedY
    
                this._callbackFn.moved({
                    'e': touchMoveEvent,
                    'x': movedX,
                    'y': movedY,
                })
    
                this._pointerMovedX = point.x
                this._pointerMovedY = point.y
            }
            document.body.addEventListener('touchmove', pointMoveHandler, false)
            document.body.addEventListener('mousemove', pointMoveHandler, false)

            /**
             * 포인터 이동 종료 이벤트
             * @param {Event} endEvent 
             */
            let pointingEndHandler = endEvent => {
                document.body.removeEventListener("touchmove", pointMoveHandler, false)
                document.body.removeEventListener("mousemove", pointMoveHandler, false)

                let point       = this._getPoint(endEvent),
                    totalMovedX = point.x - this._startPointX,
                    totalMovedY = point.y - this._startPointY,
                    direction   = this._getDirection(totalMovedX,totalMovedY)
    
                // 스와이프 일 경우
                if(
                    this._isSwipe === true &&
                    ( Math.abs(totalMovedX) > this._swipeToleranceMoved || Math.abs(totalMovedY) > this._swipeToleranceMoved )
                ){

                    this._callbackFn.swipe({
                        'e': endEvent,
                        'direction': direction,
                        'swipe': direction.swipe
                    })
                    let swipeEvent = new CustomEvent('swipe',{ 
                        detail: {
                            'origin': endEvent,
                            'direction': direction,
                            'swipe': direction.swipe
                        },
                    })
                    this._Target.dispatchEvent(swipeEvent)
                }

                this._callbackFn.end({
                    'e': endEvent,
                    'direction': direction

                })

                this._pointerMoving = false
            }
            if(startEvent.type === 'mousedown'){
                document.body.addEventListener('mouseup',pointingEndHandler,{ once: true })
            } else if (startEvent.type === 'touchstart'){
                document.body.addEventListener('touchend',pointingEndHandler,{ once: true })
            }

        }
        this._Target.addEventListener('touchstart', pointingStartHandler)
        this._Target.addEventListener('mousedown', pointingStartHandler)

        return this
    }

    /**
     * bind touchstart event callback function
     * @param {Function} callback
     * @returns {elementTouchControl}
     */
    bindPointingStart(callback){
        this._callbackFn.start = callback
        return this
    }

    bindPointerMoved(callback){
        this._callbackFn.moved = callback
        return this
    }

    bindPointingEnd(callback){
        this._callbackFn.end = callback
        return this
    }

    bindSwipe(callback){
        this._callbackFn.swipe = callback
        return this
    }

    _initialPointer(x,y){
        this._pointerMoving = true
        this._startPointX = x
        this._startPointY = y
        this._pointerMovedX = this._startPointX
        this._pointerMovedY = this._startPointY
    }

    _swipeStart(){
        this._isSwipe = true
        setTimeout(() => {
            this._isSwipe = false
        },this._swipeToleranceInterval)
    }

    _getPoint(e){
        let x = 0
        let y = 0

        switch (e.type){
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
                x = e.clientX
                y = e.clientY
            break;

            case 'touchstart':
            case 'touchmove':
                x = e.touches[0].clientX
                y = e.touches[0].clientY
            break;
            
            case 'touchend':
                x = e.changedTouches[0].clientX
                y = e.changedTouches[0].clientY
            break;

            default:
                x = e.clientX
                y = e.clientY
            break;

        }
        return { x,y }
    }

    _getDirection(totalMovedX, totalMovedY){

        let movedDirection
        if(Math.abs(totalMovedX) > Math.abs(totalMovedY)){
            movedDirection = "X"
        } else {
            movedDirection = "Y"
        }

        let movedXDirection
        if(totalMovedX > 0){
            movedXDirection = "right"
        } else {
            movedXDirection = "left"
        }

        let movedYDirection
        if(totalMovedY < 0){
            movedYDirection = "top"
        } else {
            movedYDirection = "bottom"
        }

        let swipeDirection  = ''
        if(this._detectAxis === "X"){
            swipeDirection = movedXDirection
        } else if(this._detectAxis === "Y"){
            swipeDirection = movedYDirection
        } else {
            if(movedDirection === "X"){
                swipeDirection = movedXDirection
            } else {
                swipeDirection = movedYDirection
            }
        }

        return {
            'direction' : movedDirection,
            'x' : movedXDirection,
            'y' : movedYDirection,
            'swipe' : swipeDirection,
        }
    }

}

export default elementTouchControl