<template>
    <div id="lumi-card" class="lumi-card">
        <div v-if="( !headless || header_title )" class="lumi-card-header">
            <slot name="header">
                <h3> {{ header_title }} </h3>
            </slot>
        </div>
        <div v-if="img_url" 
            :class="['lumi-card-thumbnail', {'lumi-card-thumbnail-headless': ( !header_title || headless )}]">
            <div class="lumi-card-thumbnail" v-bind:style="[backgroundImage(img_url),thumbnailHeight(img_height) ]">
                <!-- <div class="lumi-thumbnail" v-bind:style="backgroundImage(img_url)" /> -->
            </div>
        </div>
        <div class="lumi-card-contents">
            <slot>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'lumi-card',
    props: {
        header_title: String,
        headless: {
            type: Boolean,
            default: false
        },
        img_height: {
            type: Number,
            default: 150
        },
        img_url: {
            type: String,
            default: null
        }
    },
    methods:{
        backgroundImage(_URL){
            return {
                backgroundImage: 'url('+_URL+')',
                backgroundSize: 'cover',
                backgroundPosition: 'center center'
            }
        },
        thumbnailHeight(_height){
            return {
                height: _height+'px'
            }
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>