<template>
    <div class="calendar-container" v-click-outside="close">
        <div class="calendar-input">
            <input
                title=""
                :placeholder="placeholder"
                :class="inputClass"
                class="calendar-input"
                v-model="inputValue"
                readonly="readonly"
                @focus="open"
                @blur="close"
                @mousedown.prevent="focus"
                ref="input"
            />
        </div>
        <div class="calendar-dropdown simple-dropdown" v-if="isShowCalendar" @mousedown.prevent="">
            <div class="action-buttons" v-if="isShowActionButtons">
                <div class="month-changer prev-month" :class="{'disabled': !checkAllowPrev()}" @click="prevMonthView">
                    <i class="fa fa-chevron-left"></i>
                </div>
                <div class="month-changer next-month" :class="{'disabled': !checkAllowNext()}" @click="nextMonthView">
                    <i class="fa fa-chevron-right"></i>
                </div>
            </div>
            <slot name="title" v-if="title">
                <div class="title">{{title}}</div>
            </slot>
            <div class="layer-container">
                <template v-for="layer in activeLayers">
                    <calendar-layer
                        :min="limitMin"
                        :current="dateModel"
                        :max="limitMax"
                        :month="layer.month"
                        :year="layer.year"
                        :marked-range="markedDateRange"
                        :disabled-days="disabledDays"
                        @select="emitSelection"
                        @dayHover="payload => $emit('dayHover', payload)"
                    >
                        <template v-slot:day-sub="params">
                            <slot name="day-sub" :date="params.date" :is-enabled="params.isEnabled"></slot>
                        </template>
                    </calendar-layer>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import ClickOutsideDirective from '@ttbooking/vue-click-outside-directive';
import CalendarLayer from "./CalendarLayer";
import moment from 'moment';
export default {
    components: {CalendarLayer},
    name: "vue-calendar",
    props: {
        value: String,
        placeholder: String,
        format: {
            type: String,
            default: 'DD.MM.YYYY'
        },
        calendarsCount: {
            type: Number,
            default: 1,
        },
        inputClass: {
            type: String|Object,
            default() {
                return 'form-control'
            }
        },
        min :{
            type: String,
            default: null
        },
        max :{
            type: String,
            default: null
        },
        markedRange: {
            type: Array,
            default() {
                return []
            }
        },
        title: {
            type: String,
            default: null,
        },
        disabledDays: {
            type: Function,
            default: null,
        },
    },
    created() {
        this.initCalendar();
    },
    data() {
        return {
            inputValue: this.value,
            dateModel: this.getDateModelFromValue(),
            activeLayers: [],
            isShowCalendar: false,
        };
    },
    computed: {
        markedDateRange() {
            let range = [];
            if (this.markedRange && this.markedRange.length){
                for (let i in this.markedRange) {
                    if (this.markedRange.hasOwnProperty(i)) {
                        range.push({
                            start: moment(this.markedRange[i].period.start, this.format),
                            end: moment(this.markedRange[i].period.end, this.format),
                            class: this.markedRange[i].class,
                        })
                    }
                }
            }
            return range;
        },
        limitMin(){
            return moment(this.min, this.format);
        },
        limitMax(){
            return moment(this.max, this.format);
        },
        isShowActionButtons() {
            return this.checkAllowPrev() || this.checkAllowNext();
        }
    },
    methods: {
        initCalendarLayers(date) {
            if (date && date.isValid()) {
                let dateClone = date.clone();

                dateClone = moment(dateClone.endOf('month').format(this.format), this.format);

                if (this.limitMin.diff(dateClone, 'month') > 0) {
                    dateClone.month(this.limitMin.month());
                }

                this.activeLayers = [];
                for (let i = 0; i < this.calendarsCount; i++) {
                    this.activeLayers.push({
                        month: dateClone.month(),
                        year: dateClone.year(),
                        moment: moment(dateClone.format(this.format), this.format),
                    });
                    dateClone.add(1, 'month');
                }
            }
        },
        initCalendar(){
            let date = moment(moment().format(this.format), this.format);
            if (this.dateModel && this.dateModel.isValid()) {
                if (this.min && this.min.length && this.dateModel < this.limitMin) {
                    this.inputValue = this.min;
                    this.$emit('input', this.inputValue);
                    this.dateModel = this.getDateModelFromValue();
                }
                date = this.dateModel;
            }
            this.initCalendarLayers(date);
        },
        getDateModelFromValue() {
            return moment(this.inputValue, this.format);
        },
        focus() {
            this.$refs.input.focus();
            this.$emit('focus', this.activeLayers);
        },
        blur() {
            this.$refs.input.blur();
        },
        open(){
            this.isShowCalendar = true;
        },
        close(){
            this.isShowCalendar = false;
        },
        toggle(){
            this.isShowCalendar ? this.close() : this.open();
        },
        checkAllowPrev() {
            if (this.limitMin.isValid()) {
                let firstMonth = this.activeLayers[0].moment.clone();
                firstMonth.subtract(1, 'month').endOf('month');
                return firstMonth >= this.limitMin;
            }
            return true;
        },
        checkAllowNext() {
            if (this.limitMax.isValid()) {
                let lastMonth = this.activeLayers[this.activeLayers.length - 1].moment.clone();
                lastMonth.add(1, 'month').startOf('month');
                return this.limitMax >= lastMonth;
            }
            return true;
        },
        prevMonthView() {
            if (this.checkAllowPrev()) {
                let firstMonth = this.activeLayers[0].moment.clone();
                firstMonth.subtract(1, 'month');
                this.initCalendarLayers(firstMonth);
                this.$emit('layerChange', this.activeLayers)
            }
        },
        nextMonthView() {
            if (this.checkAllowNext()) {
                let lastMonth = this.activeLayers[0].moment.clone();
                lastMonth.add(1, 'month'); //перескакиваем, плавно по одному месяцу
                this.initCalendarLayers(lastMonth);
                this.$emit('layerChange', this.activeLayers)
            }
        },
        emitSelection(payload) {
            this.dateModel = payload;
            this.inputValue = this.dateModel.format(this.format);
            this.$emit('input', this.inputValue);
            this.$emit('selected', this.activeLayers);
            this.blur();
        },
        getActiveLayers() {
            return this.activeLayers;
        },
        setActiveLayers(layers) {
            this.$nextTick(() => this.activeLayers = layers);
        },
    },
    watch: {
        min(){
            this.initCalendar();
        },
        max(){
            this.initCalendar();
        },
        value:{
            handler(){
                this.inputValue = this.value;
                this.dateModel = this.getDateModelFromValue();
            },
            immediate: true,
        },
        inputValue() {
            this.$emit('input', this.inputValue)
        },
    },
    directives: {
        'click-outside' : ClickOutsideDirective,
    }
}
</script>
