<template>
    <div>
        <div class="text-center time-title">
            <slot name="title"></slot>
            <button type="button" class="close-button" @click="$emit('close')">
                <i class="fa fa-times"></i>
            </button>
        </div>
        <div class="time-picker layer-container">

            <div class="selector hours" v-if="needHours">
                <simple-count-picker v-model="hours" :min="getMinHours()" :max="getMaxHours()">
                    <div class="time-value" v-text="model.format('HH')" @click="showTimePicker('hours')"/>
                </simple-count-picker>
            </div>

            <div class="separator" v-if="needHours && needMinutes">:</div>

            <div class="selector minutes" v-if="needMinutes">
                <simple-count-picker v-model="minutes" :min="getMinMinutes()" :max="getMaxMinutes()">
                    <div class="time-value" v-text="model.format('mm')" @click="showTimePicker('minutes')"/>
                </simple-count-picker>
            </div>

            <div class="separator" v-if="(needMinutes||needHours) && needSeconds">:</div>

            <div class="selector seconds" v-if="needSeconds">
                <simple-count-picker v-model="seconds" :min="getMinSeconds()" :max="getMaxSeconds()">
                    <div class="time-value" v-text="model.format('ss')" @click="showTimePicker('seconds')"/>
                </simple-count-picker>
            </div>
            <div class="time-select-container" v-if="timePicker">
                <div class="time-item" v-for="item in timePickerData"
                     :key="item.value"
                     :class="{'current': item.current, disabled: item.disabled}"
                     v-text="item.text"
                     @click="setTimeItem(item)"
                />
            </div>
        </div>

    </div>
</template>

<script>
import SimpleCountPicker from "./SimpleCountPicker.vue";
import dayjs from '../setup.dayjs.js';

export default {
    name: "TimePicker",
    components: {SimpleCountPicker},
    props: [
        'value', 'format', 'min', 'max'
    ],
    data() {
        return {
            model: this.value && this.value.isValid() ? this.value : dayjs(),
            hours: parseInt(this.value?.format('HH')) || 0,
            minutes: parseInt(this.value?.format('mm')) || 0,
            seconds: parseInt(this.value?.format('ss')) || 0,
            timePicker: false,
            timePickerData: [],
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
            this.$emit('input', this.model)
        },
        showTimePicker(type) {
            this.timePicker = type;
            this.timePickerData = [];

            let limit = 60;
            let inc = 5;

            if (type === 'hours') {
                limit = 24;
                inc = 1;
            }

            for (let i = 0; i < limit; i += inc) {

                let methodType = type.charAt(0).toUpperCase() + type.slice(1);
                let disabled = (this[`getMin${ methodType }`]() > i) || (this[`getMax${ methodType }`]() < i);

                this.timePickerData.push({
                    value: i,
                    text: (i < 10 ? '0' : '') + i,
                    current: i === this[type],
                    disabled: disabled,
                })
            }

        },
        setTimeItem(item) {
            if (!item.disabled) {
                this[this.timePicker] = item.value;
                this.timePicker = false;
            }
        },
    },
    watch: {
        hours() {
            this.model = this.model.hour(this.hours);
            this.emitChange();
        },
        minutes() {
            this.model = this.model.minute(this.minutes);
            this.emitChange();
        },
        seconds() {
            this.model = this.model.second(this.seconds);
            this.emitChange();
        },
        value() {
            this.hours = parseInt(this.model?.format('HH')) || 0;
            this.minutes = parseInt(this.model?.format('mm')) || 0;
            this.seconds = parseInt(this.model?.format('ss')) || 0;
        }
    }
}
</script>
