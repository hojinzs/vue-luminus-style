<template>
    <div id="app">
        <div>
            <h1>Luminus UI Sample</h1>
            <hr>
        </div>
        <div id="Caroucel" style="background-color: grey">

            <h2>Caroucel Sample</h2>

            <lumiCaroucel
                :speedStiky="'fast'"
                :positionStiky="'center'">

                <lumiCaroucelSlide
                    v-for="(item, index) in items"
                    :key="index"
                    :ref="'item_num_'+index">

                    <div class="caroucel-item lumi-box">
                        <div>
                            <h3> {{ item.name }} </h3>
                        </div>
                        <div>
                            <img src="https://picsum.photos/350/200">
                        </div>
                        <div>
                            Toggled ::
                            <button
                                @click="childClick(item)">
                                {{ item.clicked }}
                            </button>
                        </div>
                    </div>

                </lumiCaroucelSlide>

            </lumiCaroucel>

        </div>
    </div>
</template>

<script>
import { lumiCaroucel, lumiCaroucelSlide } from '../luminus/components'

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
                    'name' : '테스트_'+(index+1),
                    'clicked' : true,
                })
            }
            return arr
        }
        return {
            items: items(30)
        }
    },
    methods:{
        childClick(item){
            event.stopPropagation()

            item.clicked = !item.clicked
            console.log("item Clicked!!")

            
        },
    }
}
</script>

<style lang="stylus" scoped>
@import '../luminus/luminus'

#Caroucel
    height 60vh
    .caroucel-item
        width 400px
</style>