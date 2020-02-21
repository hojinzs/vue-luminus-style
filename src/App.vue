<template>
    <div id="app">
        <div>
            <h1>Luminus UI Sample</h1>
            <hr>
        </div>
        <div id="Caroucel" style="background-color: grey">

            <h2>Caroucel Sample</h2>

            <lumiCaroucel
                :speedStiky="600"
                :positionStiky="'center'"
                :async="true"
                @loaded="setCaroucel">

                <lumiCaroucelSlide
                    v-for="(item, index) in items"
                    :key="index"
                    :ref="'item_num_'+index">

                    <template v-slot:loading>
                        <div>
                            Loading
                        </div>
                    </template>

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

            <div>
                <h3>data change test</h3>
                <input v-model="test"/> <button @click="setDataAsync()">PUSH DATA {{test}}</button>
            </div>

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
        return {
            slide: Object,
            items: [],
            test: 10,
        }
    },
    methods:{
        setItems(_num){
            let arr = new Array
            for (let index = 0; index < _num; index++) {
                arr.push({
                    'index' : index,
                    'name' : '테스트_'+(index+1),
                    'clicked' : true,
                })
            }
            return arr
        },
        setDataAsync(){
            setTimeout(() => {
                this.items = this.setItems(this.test)
                console.log("Ajax Fisish => ",this.slide)
                this.slide.setAsyncFinish()
            },2000)
        },
        childClick(item){
            item.clicked = !item.clicked
            console.log("item Clicked!!")           
        },
        setCaroucel($slide){
            console.log("Slide Mounted => ", $slide)
            this.slide = $slide
        }
    },
    mounted(){
        // this.items = this.setItems(20)
        /** 비동기 인풋에 대한 대응 */
        this.setDataAsync()
    }
}
</script>

<style lang="stylus" scoped>
@import '../luminus/luminus'

#Caroucel
    height 60vh
    .caroucel-item
        width 400px
    .box
        background-color white
</style>