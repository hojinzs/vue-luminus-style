<template>
    <div id="app">
        <div>
            <h1>Luminus UI Sample</h1>
            <hr>
        </div>
        <div>

            <h2>Caroucel Sample</h2>

            <lumiCaroucel>

                <lumiCaroucelSlide
                    v-for="(item, index) in items"
                    :key="index"
                    :ref="'item_num_'+index">
                    <!-- v-on:mounted="callback"> -->

                    <button>
                        <!-- @click="getOffsetWidth($event)"> -->
                        {{ item.name }}
                    </button>

                </lumiCaroucelSlide>

            </lumiCaroucel>

        </div>
    </div>
</template>

<script>
import { lumiCaroucel, lumiCaroucelSlide } from './luminus/components'

export default {
    name: 'App',
    components: {
        lumiCaroucel,
        lumiCaroucelSlide
    },
    data(){
        let items = function(_num = 2){
            let arr = new Array
            for (let index = 0; index < _num; index++) {
                arr.push({
                    'index' : index,
                    'name' : '테스트_'+(index+1)
                })
            }
            return arr
        }
        return {
            items: items(200)
        }
    },
    methods:{
        // getOffsetWidth(event){
        //     console.log("OffsetLeft =>", event.target.offsetLeft)
        // },
        // callback(slide){
        //     console.log("offsetLeft => ", slide)
        // }
    }
}
</script>

<style lang="stylus" scoped>
@import 'luminus/luminus'

</style>