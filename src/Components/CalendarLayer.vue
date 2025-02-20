<template>
    <div class="calendar-layer">
        <div class="month-name">
            <div class="month-year" @click="setupSelectData">
                <span class="month" v-text="monthName"/> <span class="year" v-text="year"/>
            </div>
        </div>
        <div class="layer-selector" v-if="showSelector">
            <div v-for="dataKey in ['month', 'year']" :class="dataKey" class="column" :key="dataKey">
                <div v-for="item in selectorData[dataKey]"
                        :key="item.value"
                        :class="{'current': item.current, 'disabled': item.disabled}"
                        v-text="item.text"
                        class="layer-selector-item"
                        @click="selectLayer(dataKey, item.value, item.disabled)"
                />
            </div>
        </div>
        <div class="week week-names">
            <div class="day-container" v-for="day in [1,2,3,4,5,6,7]" :key="day">
                <span>{{ getWeekDayName(day) }}</span>
            </div>
        </div>
        <div class="week" v-for="(week, index) in getCalendarLayer()" :key="index">
            <div class="day-container" v-for="(day, index) in week" :key="index">
                <template v-if="day && day.enabled">
                    <div @mouseover="() => $emit('dayHover', day.value)"
                         @mouseleave="() => $emit('dayHover')"
                         @click="chooseDate(day.value)"
                    >
                        <slot name="day" :day="day">
                            <div class="day" :class="day.class">{{ day.label }}</div>
                        </slot>
                    </div>
                </template>
                <template v-else>
                    <div v-if="day">
                        <slot name="day" :day="day">
                            <div class="day" :class="day.class">{{ day.label }}</div>
                        </slot>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from '../setup.dayjs.js';

export default {
    name: "calendar-layer",
    props: ['year', 'month', 'markedRange', 'selected', 'min', 'max', 'current', 'disabledDays'],
    data() {
        return {
            showSelector: false,
            selectorData: false,
        };
    },
    computed: {
        monthName() {
            return dayjs().month(this.month).format('MMMM')
        }
    },
    methods: {
        getCalendarLayer() {

            let currentHour = this.current.hour() || 0;
            let currentMinute = this.current.minute() || 0;
            let currentSeconds = this.current.second() || 0;

            let momentDate = dayjs()
                .year(this.year)
                .month(this.month)
                .date(1)
                .hour(currentHour)
                .minute(currentMinute)
                .second(currentSeconds)
                .millisecond(0)
            ;

            let justCompareFormat = 'DD~MM~YYYY';

            let nowTime = dayjs().format(justCompareFormat);

            let week = {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null,};
            let weeks = [];

            let minDate = this.min
                .hour(currentHour)
                .minute(currentMinute)
                .second(currentSeconds);

            let maxDate = this.max
                .hour(currentHour)
                .minute(currentMinute)
                .second(currentSeconds);

            let lastWeek = +momentDate.isoWeek();
            let currentWeek = Object.assign({}, week);
            while (+momentDate.month() === +this.month) {
                if (lastWeek !== +momentDate.isoWeek()) {
                    weeks.push(currentWeek);
                    currentWeek = Object.assign({}, week);
                }
                let disabled = false;
                let dayClasses = [];
                dayClasses.push('day-' + momentDate.isoWeekday());

                if (nowTime === momentDate.format(justCompareFormat)) {
                    dayClasses.push('today')
                }
                if (this.current.format(justCompareFormat) === momentDate.format(justCompareFormat)) {
                    dayClasses.push('selected');
                }

                if (this.disabledDays && this.disabledDays(momentDate)) {
                    dayClasses.push('locked');
                    disabled = true;
                } else if ((minDate?.diff(momentDate, 'days') > 0) || (maxDate?.diff(momentDate, 'days') < 0)) {
                    dayClasses.push('locked');
                    disabled = true;
                }


                if (this.markedRange.length) {
                    for (let range of this.markedRange) {
                        if (range.start.diff(momentDate, 'days', true) <= 0 && range.end.diff(momentDate, 'days', true) >= 0) {
                            dayClasses.push(range.class)
                        }
                    }
                }

                currentWeek[momentDate.isoWeekday()] = {
                    label: momentDate.format('D'),
                    value: momentDate,
                    class: dayClasses.join(' '),
                    enabled: !disabled,
                };
                lastWeek = +momentDate.isoWeek();
                momentDate = momentDate.add(1, 'day');
            }
            weeks.push(currentWeek);
            return weeks;
        },
        getWeekDayName(day) {
            return dayjs().isoWeekday(day).format('dd');
        },
        chooseDate(item) {
            this.$emit('input', item);
            this.$emit('select');
        },
        selectYear() {
            this.setupSelectData('year', this.year);
        },
        selectMonth() {
            this.setupSelectData('month', this.month);
        },
        setupSelectData() {
            this.showSelector = true;
            this.selectorData = {year: [], month: []};
            for (let i = 0; i < 12; i++) {

                let disabled = false;

                let month = dayjs().year(this.year).month(i).endOf('month');
                let text = month.format('MMMM');

                if (this.min && this.min > month) {
                    disabled = true;
                }
                if (this.max && this.max < month.startOf('month')) {
                    disabled = true;
                }

                this.selectorData.month.push({
                    value: i,
                    text: text,
                    current: i === this.month,
                    disabled: disabled
                });
            }
            let start = this.year - 4;
            let end = this.year + 5;
            for (let i = start; i < end; i++) {
                let disabled = false;
                if (this.min && this.min.format('YYYY') > i) {
                    disabled = true;
                }
                if (this.max && this.max.format('YYYY') < i) {
                    disabled = true;
                }

                this.selectorData.year.push({
                    value: i,
                    text: i,
                    current: i === this.year,
                    disabled: disabled,
                })
            }

        },
        selectLayer(key, value, disabled) {
            if (!disabled) {
                this.$emit('layer', {key, value})
                this.showSelector = false;
            }
        }

    }

}
</script>
