<template>
    <li class="lumi-flex-slider-item lumi-caroucel-item">
        <a class="wrapper" oncontextmenu="return false" ondragstart="return false" onselectstart="return false"
            @click.capture.prevent="onClick()">
            <slot>
            </slot>
        </a>
    </li>
</template>

<script>
export default {
    name: 'lumi-carousel-slide',
    methods:{
        onClick(){
            if(this.$parent.isClick()){
                this.$emit('onClick',this)
            }
        }
    },
    mounted(){
        this.$emit('mounted',this)
    }
}
</script>

<style lang="stylus" scoped>

</style>