<template>
    <div>
        <div class="text-center">
            <slot name="title"></slot>
            <button type="button" class="btn text-muted btn-sm pull-right" @click="$emit('close')">
                <i class="fa fa-times"></i>
            </button>
        </div>
        <div class="time-picker layer-container">

            <div class="selector hours" v-if="needHours">
                <simple-count-picker v-model="hours" :min="minHours" :max="maxHours">
                    <div class="value" v-text="model.format('HH')"></div>
                </simple-count-picker>
            </div>

            <div class="separator" v-if="needHours && needMinutes">:</div>

            <div class="selector minutes" v-if="needMinutes">
                <simple-count-picker v-model="minutes" :min="minMinutes" :max="maxMinutes">
                    <div class="value" v-text="model.format('mm')"></div>
                </simple-count-picker>
            </div>

            <div class="separator" v-if="(needMinutes||needHours) && needSeconds">:</div>

            <div class="selector seconds" v-if="needSeconds">
                <simple-count-picker v-model="seconds" :min="minSeconds" :max="maxSeconds">
                    <div class="value" v-text="model.format('ss')"></div>
                </simple-count-picker>
            </div>
        </div>
    </div>
</template>

<script>
import SimpleCountPicker from "./SimpleCountPicker.vue";
import moment from 'moment';
export default {
    name: "TimePicker",
    components: {SimpleCountPicker},
    props: [
        'value', 'format', 'min', 'max'
    ],
    data() {
        return {
            model: this.value && this.value.isValid() ? this.value.clone() : moment(),
        };
    },
    computed: {
        needHours() {
            return this.format.match(/[Hhk]/);
        },
        needMinutes() {
            return this.format.match(/[m]/);
        },
        needSeconds() {
            return this.format.match(/[s]/);
        },
        hours: {
            get() {
                return parseInt(this.model.format('HH'));
            },
            set(value) {
                this.model.hours(value);
                this.emitChange();
            },
        },
        minutes: {
            get() {
                return parseInt(this.model.format('mm'));
            },
            set(value) {
                this.model.minutes(value);
                this.emitChange();
            },
        },
        seconds: {
            get() {
                return parseInt(this.model.format('ss'));
            },
            set(value) {
                this.model.seconds(value);
                this.emitChange();
            },
        },
        minHours() {
            if (this.min && this.model.format('DD.MM.YYYY') === this.min.format('DD.MM.YYYY')) {
                // Если день текущий есть минимальный день
                return parseInt(this.min.format('H'));
            }
            return 0;
        },
        minMinutes() {
            if (this.min && this.model.format('DD.MM.YYYY HH') === this.min.format('DD.MM.YYYY HH')) {
                // Если день текущий есть минимальный день
                return parseInt(this.min.format('m'));
            }
            return 0;
        },
        minSeconds() {
            if (this.min && this.model.format('DD.MM.YYYY HH:mm') === this.min.format('DD.MM.YYYY HH:mm')) {
                // Если день текущий есть минимальный день
                return parseInt(this.min.format('s'));
            }
            return 0;
        },
        maxHours() {
            if (this.max && this.model.format('DD.MM.YYYY') === this.max.format('DD.MM.YYYY')) {
                // Если день текущий есть минимальный день
                return parseInt(this.max.format('H'));
            }
            return 23;
        },
        maxMinutes() {
            if (this.max && this.model.format('DD.MM.YYYY HH') === this.max.format('DD.MM.YYYY HH')) {
                // Если день текущий есть минимальный день
                return parseInt(this.max.format('m'));
            }
            return 59;
        },
        maxSeconds() {
            if (this.max && this.model.format('DD.MM.YYYY HH:mm') === this.max.format('DD.MM.YYYY HH:mm')) {
                // Если день текущий есть минимальный день
                return parseInt(this.max.format('s'));
            }
            return 59;
        },
    },
    methods: {
        emitChange() {
            this.$emit('input', this.model.clone())
        },
    },
    watch: {
        model() {
            this.emitChange();
        },
    }
}
</script>
