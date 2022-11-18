<template>
    <div class="simple-picker" @wheel.prevent.stop="wheelHandler">
        <div class="action mega-plus" @click="megaIncrease" :class="{disabled: !canMegaIncrease}">
            <i class="fa fa-angle-double-up"></i>
        </div>
        <div class="action plus" @click="increase" :class="{disabled: !canIncrease}">
            <i class="fa fa-angle-up"></i>
        </div>
        <slot>
            <div class="value" v-text="model"></div>
        </slot>
        <div class="action minus" @click="decrease" :class="{disabled: !canDecrease}">
            <i class="fa fa-angle-down"></i>
        </div>
        <div class="action mega-minus" @click="megaDecrease" :class="{disabled: !canMegaDecrease}">
            <i class="fa fa-angle-double-down"></i>
        </div>
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
    computed: {
        canMegaIncrease() {
            return this.model + 10 <= this.max;
        },
        canIncrease() {
            return this.model + 1 <= this.max;
        },
        canMegaDecrease() {
            return this.model - 10 >= this.min;
        },
        canDecrease() {
            return this.model - 1 >= this.min;
        },
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
            if (this.canMegaIncrease) {
                this.model += 10;
            }
        },
        increase() {
            if (this.canIncrease) {
                this.model++;
            }
        },
        decrease() {
            if (this.canDecrease) {
                this.model--;
            }
        },
        megaDecrease() {
            if (this.canMegaDecrease) {
                this.model -= 10;
            }
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