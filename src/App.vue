<template>
    <div id="app">
        <div>
            <h1>Luminus UI Sample</h1>
            <hr>
        </div>
        <section id="Caroucel" class="section">

            <h2>Caroucel Sample</h2>

            <div class="caroucel">

                <lumiCaroucel
                    :speedStiky="600"
                    :positionStiky="'center'"
                    :async="true"
                    @loaded="setCaroucel"
                    @focused="getFocus">

                    <lumiCaroucelSlide
                        v-for="(item, index) in items"
                        :key="index"
                        :ref="'item_num_'+index"
                        @onClick="setFocus(index)">

                        <template v-slot:loading>
                            <div>
                                Loading
                            </div>
                        </template>

                        <lumiCard id="lumi-card"
                            :img_url="'https://picsum.photos/320/200'">
                            <template v-slot:header>
                                <h3> {{ item.name }} </h3>
                            </template>
                                Toggled ::
                                <button
                                    @click.capture="childClick(item)">
                                    {{ item.clicked }}
                                </button>
                        </lumiCard>

                    </lumiCaroucelSlide>

                </lumiCaroucel>

            </div>

            <div>
                <br>
                <h3>Param Test</h3>
                <div>
                    <label for="carouel_focused">Items : </label>
                    <input class="lumi-input-liner" name="" v-model="test"/>
                    <button class="lumi-button-liner" @click="setDataAsync()">PUSH DATA</button>
                </div>
                <div>
                    <label for="carouel_focused">Focused : </label>
                    <input class="lumi-input-liner" name="carouel_focused" v-model="focus"/>
                    <button class="lumi-button-liner" @click="setFocus()">Go Focus</button>
                </div>
            </div>

        </section>

        <section id="Card" class="section">
            <h2>Card UI Sample </h2>
            <lumiCard id="lumi-card"
                :header_title="'title'"
                :headless="true"
                :img_url="'https://picsum.photos/500/200'">
                <template v-slot:header>
                    헤더헤더
                </template>
                asdf<br>
                asdf<br>
            </lumiCard>
        </section>

        <section id="Backdrop" class="section">
            <h2>Popup UI Sample </h2>
            <button class="lumi-button"
                @click="showPopupPannel = !showPopupPannel">
                show Popup Pannel
            </button>
        </section>
<!-- :headerTitle="'Popup Pannel Sample'" -->
        <lumiPopupPannel
            :useHeader="true"
            :display.sync="showPopupPannel"
            :maxWidth="640"
            @mounted="mountPopupPannel">
            <template v-slot:header>
                Header Sample
            </template>
            <span>START</span>
            <div v-for="(text,index) in texts" 
                v-bind:key="index">
                asdf
            </div>
            <span>END</span>
        </lumiPopupPannel>

    </div>
</template>

<script>
import { 
    lumiCaroucel,
    lumiCaroucelSlide,
    lumiCard,
    lumiPopupPannel } from '../luminus/components'

export default {
    name: 'App',
    components: {
        lumiCard,
        lumiCaroucel,
        lumiCaroucelSlide,
        lumiPopupPannel
    },
    data(){
        return {
            slide: Object,
            PopupPannel: Object,
            showPopupPannel: false,
            items: [],
            test: 10,
            focus: 0,
            texts: 100
        }
    },
    methods:{
        getFocus(_num){
            this.focus = _num
        },
        setFocus(_num = this.focus){
            console.log("App :: Clicked => ",_num)
            this.slide.doItemFocus(_num)
        },
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
                // console.log("Ajax Fisish => ",this.slide)
                this.slide.setAsyncFinish()
            },2000)
        },
        childClick(item){
            event.stopPropagation()
            item.clicked = !item.clicked
            console.log("item Clicked!!")           
        },
        setCaroucel($vue){
            console.log("Slide Mounted => ", $vue)
            this.slide = $vue
        },
        mountPopupPannel($vue){
            console.log("PopupPannel Mounted! => ", $vue)
            this.PopupPannel = $vue
        },
        showPopup(){
            console.log(this.PopupPannel)
            this.PopupPannel.show(true)
        },
    },
    mounted(){
        // this.items = this.setItems(20)
        /** 비동기 인풋에 대한 대응 */
        this.setDataAsync()
    }
}
</script>

<style lang="stylus" scoped>
.section
    height 60vh
    overflow hidden
    background-color grey
    margin-top 1em
    padding 1em

#Caroucel
    .caroucel
        margin-left -1em
        margin-right -1em
    // .activate
    //     border 1px solid red

#Card
    #lumi-card
        width 320px
</style>