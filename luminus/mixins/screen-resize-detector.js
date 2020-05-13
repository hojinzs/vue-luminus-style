const screenResizeDetector = {
    data() {
        return {
            windowWidth: 0,
            windowHeight: 0,
        }
    },
    methods:{
        onResize() {
            this.windowHeight = window.innerHeight
            this.windowWidth = window.innerWidth
        }
    },
    mounted() {
        window.addEventListener('resize', this.onResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
}

export default screenResizeDetector

/**
 * Ref : https://stackoverflow.com/questions/47219272/how-can-i-use-window-size-in-vue-how-do-i-detect-the-soft-keyboard
 */