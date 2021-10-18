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
                <simple-count-picker v-model="hours" :min="0" :max="23">
                    <div class="value" v-text="model.format('HH')"></div>
                </simple-count-picker>
            </div>

            <div class="separator">
                <template v-if="needHours && needMinutes">:</template>
            </div>

            <div class="selector minutes" v-if="needMinutes">
                <simple-count-picker v-model="minutes" :min="0" :max="59">
                    <div class="value" v-text="model.format('mm')"></div>
                </simple-count-picker>
            </div>

            <div class="separator">
                <template v-if="(needMinutes||needHours) && needSeconds">:</template>
            </div>

            <div class="selector seconds" v-if="needSeconds">
                <simple-count-picker v-model="seconds" :min="0" :max="59">
                    <div class="value" v-text="model.format('ss')"></div>
                </simple-count-picker>
            </div>
        </div>
    </div>
</template>

<script>
import SimpleCountPicker from "./SimpleCountPicker";
import moment from 'moment';
export default {
    name: "TimePicker",
    components: {SimpleCountPicker},
    props: [
        'value', 'format'
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