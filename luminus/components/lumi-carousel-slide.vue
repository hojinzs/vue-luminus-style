<template>
    <li class="lumi-flex-slider-item lumi-caroucel-item">
        <a>
            <slot>
            </slot>
        </a>
    </li>
</template>

<script>
export default {
    name: 'lumi-carousel-slide',
    data(){
        return {
            offsetLeft:{
                type: Number,
                default : 0
            }
        }
    },
    methods:{
        getOffsetLeft(){
            return this.offsetLeft
        }
    },
    mounted(){
        // console.log(this.$el)
        this.offsetLeft = this.$el.offsetLeft

        this.$emit('mounted',this)
    }
}
</script>

<style lang="stylus" scoped>
@import '../luminus'


</style>