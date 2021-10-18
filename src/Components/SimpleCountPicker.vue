<template>
    <div class="simple-picker" @wheel="wheelHandler">
        <div class="action mega-plus" @click="megaIncrease"><i class="fa fa-angle-double-up"></i></div>
        <div class="action plus" @click="increase"><i class="fa fa-angle-up"></i></div>
        <slot>
            <div class="value" v-text="model"></div>
        </slot>
        <div class="action minus" @click="decrease"><i class="fa fa-angle-down"></i></div>
        <div class="action mega-minus" @click="megaDecrease"><i class="fa fa-angle-double-down"></i></div>
    </div>
</template>

<script>
export default {
    name: "SimpleCountPicker",
    props: {
        value: {
            type: Number,
        },
        min: {
            type: Number,
        },
        max: {
            type: Number
        },

    },
    data() {
        return {
            model: this.value || 0
        };
    },
    methods: {
        controlModel() {
            if (this.model < this.min) {
                this.model = this.max || 0;
            }
            if (this.model > this.max) {
                this.model = this.min || 0;
            }
        },
        megaIncrease() {
            this.model += 10;
        },
        increase() {
            this.model ++;
        },
        decrease() {
            this.model --;
        },
        megaDecrease() {
            this.model -= 10;
        },
        wheelHandler(event) {
            event.wheelDelta < 0 ? this.decrease() : this.increase();
        },
    },
    watch: {
        value() {
            this.model = this.value;
        },
        model() {
            this.controlModel();
            this.$emit('input', this.model);
        }
    }
}
</script>