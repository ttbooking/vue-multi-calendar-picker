<template>
    <div class="calendar-container" v-click-outside="close">
        <div class="">
            <input
                title=""
                :placeholder="placeholder"
                :class="inputClass"
                class="calendar-input"
                v-model="inputValue"
                readonly="readonly"
                :disabled="disabled"
                @focus="open"
                @blur="close"
                @mousedown.prevent="focus"
                ref="input"
            />
        </div>
        <div class="calendar-dropdown simple-dropdown" v-if="isShowCalendar" @mousedown.prevent="">
            <div class="date-picker-container" v-if="!isDateSelected">
                <div class="action-buttons" v-if="isShowActionButtons">
                    <div class="month-changer prev-month"
                         :class="{'disabled': !checkAllowPrev()}"
                         @click="prevMonthView"
                    >
                        <slot name="previousSign">
                            <i class="fa fa-chevron-left"></i>
                        </slot>
                    </div>
                    <div class="month-changer next-month"
                         :class="{'disabled': !checkAllowNext()}"
                         @click="nextMonthView"
                    >
                        <slot name="nextSign">
                            <i class="fa fa-chevron-right"></i>
                        </slot>
                    </div>
                </div>
                <slot name="title" v-if="title">
                    <div class="title">{{ title }}</div>
                </slot>
                <div class="layer-container">
                    <calendar-layer v-for="(layer, index) in activeLayers"
                        :key="index"
                        :min="limitMin"
                        :current="dateModel"
                        :max="limitMax"
                        :month="layer.month"
                        :year="layer.year"
                        :marked-range="markedDateRange"
                        :disabled-days="disabledDays"
                        v-model="dateModel"
                        @select="selectHandler"
                        @dayHover="payload => $emit('dayHover', payload)"
                        @layer="payload => selectLayer(payload, index)"
                    >
                        <template v-slot:day="params">
                            <slot name="day" :day="params.day" />
                        </template>
                    </calendar-layer>
                </div>
            </div>
            <div class="time-picker-container" v-else-if="!isTimeSelected">
                <time-picker v-model="dateModel"
                             :format="format"
                             :min="limitMin"
                             :max="limitMax"
                             @close="selectHandler(true)"
                >
                    <template #title>
                        <slot name="time-title" v-if="timeTitle">
                            <span class="title" v-text="timeTitle"></span>
                        </slot>
                    </template>
                </time-picker>
            </div>
        </div>
    </div>
</template>

<script>
import ClickOutsideDirective from '@ttbooking/vue-click-outside-directive';
import CalendarLayer from "./CalendarLayer.vue";
import TimePicker from "./TimePicker.vue";
import dayjs from '../setup.dayjs.js';

export default {
    components: {TimePicker, CalendarLayer},
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
            type: [Object, String],
            default() {
                return 'form-control'
            }
        },
        min: {
            type: String,
            default: null
        },
        max: {
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
        timeTitle: {
            type: String,
            default: null,
        },
        disabledDays: {
            type: Function,
            default: null,
        },
        disabled: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['input', 'dayHover', 'selected', 'layerChange', 'focus', 'close'],
    created() {
        this.initCalendar();
    },
    data() {
        return {
            inputValue: this.value,
            dateModel: this.getDateModelFromValue(),
            activeLayers: [],
            isDateSelected: true,
            isTimeSelected: true,
        };
    },
    computed: {
        isWithTime() {
            return this.format.match(/[Hhkms]/)
        },
        isShowCalendar() {
            return !(this.isTimeSelected && this.isDateSelected);
        },
        markedDateRange() {
            let range = [];
            if (this.markedRange && this.markedRange.length) {
                for (let i in this.markedRange) {

                    range.push({
                        start: dayjs(this.markedRange[i].period.start, this.format).startOf('day'),
                        end: dayjs(this.markedRange[i].period.end, this.format).endOf('day'),
                        class: this.markedRange[i].class,
                    })

                }
            }
            return range;
        },
        limitMin() {
            return dayjs(this.min, this.format);
        },
        limitMax() {
            return dayjs(this.max, this.format);
        },
        isShowActionButtons() {
            return this.checkAllowPrev() || this.checkAllowNext();
        }
    },
    methods: {
        initCalendarLayers(date) {
            if (date && date.isValid()) {
                let dateClone = date.endOf('month');

                if (this.limitMin.diff(dateClone, 'month') > 0) {
                    dateClone = dateClone.month(this.limitMin.month())
                        .year(this.limitMin.year())
                    ;
                }

                this.activeLayers = [];
                for (let i = 0; i < this.calendarsCount; i++) {
                    this.activeLayers.push({
                        month: dateClone.month(),
                        year: dateClone.year(),
                        moment: dateClone,
                    });
                    dateClone = dateClone.add(1, 'month');
                }
            }
        },
        initCalendar() {
            let date = this.dateModel?.isValid() ? this.dateModel : dayjs();

            if (this.min && this.min.length && date < this.limitMin) {
                this.inputValue = this.min;
                date = this.limitMin;
            }
            if (this.max && this.max.length && date > this.limitMax) {
                if (this.limitMax > this.limitMin) {
                    this.inputValue = this.max;
                    date = this.limitMax;
                }
            }

            this.initCalendarLayers(date);
        },
        getDateModelFromValue() {
            return dayjs(this.inputValue, this.format);
        },
        focus() {
            setTimeout(() => {
                this.$refs.input.focus();
                this.$emit('focus', this.activeLayers);
            })
        },
        blur() {
            //временный костыль, т.к. в месте использования не работает
            setTimeout(() => {
                this.$refs.input.blur();
            });
        },
        open() {
            this.isDateSelected = false;
            this.isTimeSelected = !this.isWithTime;
        },
        close() {
            if (this.isShowCalendar) {
                // Если дату установили, при этом время не установлено, тогда бросим событие
                // Иначе если дату не установили, то и события быть не должно
                let selected = this.isDateSelected && !this.isTimeSelected && this.isWithTime;

                this.isDateSelected = true;
                this.isTimeSelected = true;
                this.$emit('close', this.activeLayers);

                if (selected) {
                    this.$emit('selected', this.activeLayers);
                }

            }
        },
        toggle() {
            this.isShowCalendar ? this.close() : this.open();
        },
        checkAllowPrev() {
            if (this.limitMin.isValid()) {
                let firstMonth = this.activeLayers[0].moment;
                firstMonth = firstMonth.subtract(1, 'month').endOf('month');
                return firstMonth >= this.limitMin;
            }
            return true;
        },
        checkAllowNext() {
            if (this.limitMax.isValid()) {
                let lastMonth = this.activeLayers[this.activeLayers.length - 1].moment;
                lastMonth = lastMonth.add(1, 'month').startOf('month');
                return this.limitMax >= lastMonth;
            }
            return true;
        },
        prevMonthView() {
            if (this.checkAllowPrev()) {
                let firstMonth = this.activeLayers[0].moment;
                firstMonth = firstMonth.subtract(1, 'month');
                this.initCalendarLayers(firstMonth);
                this.$emit('layerChange', this.activeLayers)
            }
        },
        nextMonthView() {
            if (this.checkAllowNext()) {
                let lastMonth = this.activeLayers[0].moment;
                lastMonth = lastMonth.add(1, 'month'); //перескакиваем, плавно по одному месяцу
                this.initCalendarLayers(lastMonth);
                this.$emit('layerChange', this.activeLayers)
            }
        },
        selectHandler(isTime = false) {
            if (isTime) {
                this.blur();
            } else {
                this.isDateSelected = true;
                if (!this.isWithTime) {
                    this.$emit('selected', this.activeLayers);
                    this.blur();
                }
            }
        },
        getActiveLayers() {
            return this.activeLayers;
        },
        setActiveLayers(layers) {
            this.$nextTick(() => this.activeLayers = layers);
        },
        selectLayer(payload, index) {
            let date = this.activeLayers[index].moment.set(payload.key, payload.value).subtract(index, "month");
            this.initCalendarLayers(date);
            this.$emit('layerChange', this.activeLayers)
        }
    },
    watch: {
        min() {
            this.initCalendar();
        },
        max() {
            this.initCalendar();
        },
        value: {
            handler() {
                this.inputValue = this.value;
                this.dateModel = this.getDateModelFromValue();
            },
            immediate: true,
        },
        inputValue() {
            this.$emit('input', this.inputValue)
        },
        dateModel() {
            if (this.dateModel.isValid()) {

                if (this.limitMin && this.limitMin.isValid() && this.dateModel < this.limitMin) {
                    this.dateModel = this.limitMin;
                }
                if (this.limitMax && this.limitMax.isValid() && this.dateModel > this.limitMax) {
                    this.dateModel = this.limitMax;
                }

                let formattedDate = this.dateModel.format(this.format);
                if (formattedDate !== this.inputValue) {
                    this.inputValue = formattedDate;
                }
            } else if (this.inputValue) {
                this.inputValue = '';
            }

        }
    },
    directives: {
        'click-outside': ClickOutsideDirective,
    }
}
</script>
