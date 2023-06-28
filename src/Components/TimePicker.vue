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
                <simple-count-picker v-model="hours" :min="getMinHours()" :max="getMaxHours()">
                    <div class="value" v-text="model.format('HH')"></div>
                </simple-count-picker>
            </div>

            <div class="separator" v-if="needHours && needMinutes">:</div>

            <div class="selector minutes" v-if="needMinutes">
                <simple-count-picker v-model="minutes" :min="getMinMinutes()" :max="getMaxMinutes()">
                    <div class="value" v-text="model.format('mm')"></div>
                </simple-count-picker>
            </div>

            <div class="separator" v-if="(needMinutes||needHours) && needSeconds">:</div>

            <div class="selector seconds" v-if="needSeconds">
                <simple-count-picker v-model="seconds" :min="getMinSeconds()" :max="getMaxSeconds()">
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
            hours: parseInt(this.value?.format('HH')) || 0,
            minutes: parseInt(this.value?.format('mm')) || 0,
            seconds: parseInt(this.value?.format('ss')) || 0
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
    },
    methods: {
        currentDateIsMin(compareFormat) {
            return this.min && this.model.format(compareFormat) === this.min.format(compareFormat);
        },
        currentDateIsMax(compareFormat) {
            return this.max && this.model.format(compareFormat) === this.max.format(compareFormat);
        },
        getMinHours() {
            return this.currentDateIsMin('DD.MM.YYYY') ? parseInt(this.min.format('HH')) : 0;
        },
        getMinMinutes() {
            return this.currentDateIsMin('DD.MM.YYYY HH') ? parseInt(this.min.format('mm')) : 0;
        },
        getMinSeconds() {
            return this.currentDateIsMin('DD.MM.YYYY HH:mm') ? parseInt(this.min.format('ss')) : 0;
        },
        getMaxHours() {
            return this.currentDateIsMax('DD.MM.YYYY') ? parseInt(this.max.format('HH')) : 23;
        },
        getMaxMinutes() {
            return this.currentDateIsMax('DD.MM.YYYY HH') ? parseInt(this.max.format('mm')) : 59;
        },
        getMaxSeconds() {
            return this.currentDateIsMax('DD.MM.YYYY HH:mm') ? parseInt(this.max.format('ss')) : 59;
        },
        emitChange() {
            this.$emit('input', this.model.clone())
        },
    },
    watch: {
        hours() {
            this.model.hours(this.hours);
            this.emitChange();
        },
        minutes() {
            this.model.minutes(this.minutes);
            this.emitChange();
        },
        seconds() {
            this.model.seconds(this.seconds);
            this.emitChange();
        },
        value() {
            this.model = this.value.clone();
            this.hours = parseInt(this.model?.format('HH')) || 0;
            this.minutes = parseInt(this.model?.format('mm')) || 0;
            this.seconds = parseInt(this.model?.format('ss')) || 0;
        }
    }
}
</script>
