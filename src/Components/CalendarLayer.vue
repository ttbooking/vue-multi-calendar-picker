<template>
    <div class="calendar-layer">
        <div class="month-name">
            {{monthName}} <span class="year">{{year}}</span>
        </div>
        <div class="week week-names">
            <div class="day-container" v-for="day in [1,2,3,4,5,6,7]">
                {{getWeekDayName(day)}}
            </div>
        </div>
        <template v-for="(week, index) in getCalendarLayer()">
            <div class="week">
                <div class="day-container" v-for="(day, index) in week">
                    <template v-if="day && day.enabled">
                        <div class="day" :class="day.class" v-if="day" @click="chooseDate(day.value)">
                            {{day.label}}
                            <slot name="day-sub" :date="day.value" :is-enabled="day.enabled"></slot>
                        </div>
                    </template>
                    <template v-else>
                        <div class="day" :class="day.class" v-if="day">
                            {{day.label}}
                            <slot name="day-sub" :date="day.value" :is-enabled="day.enabled"></slot>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import moment from 'moment';
import 'moment/locale/ru';
export default {
    name: "calendar-layer",
    props: ['year', 'month', 'markedRange', 'selected', 'min', 'max', 'current'],
    data() {
        return {};
    },
    computed: {
        monthCalendar() {
            return this.getCalendarLayer();
        },
        monthName() {
            return moment().month(this.month).format('MMMM')
        }
    },
    methods:{
        emitSelect(date) {
            this.$emit('select', date);
        },
        getCalendarLayer(){
            let momentDate = moment([this.year, this.month, 1]);

            let justCompareFormat = 'DD~MM~YYYY';

            let nowTime = moment().format(justCompareFormat);

            let week = {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null,};
            let weeks = [];

            let lastWeek = +momentDate.isoWeek();
            let currentWeek = Object.assign({}, week);
            while (+momentDate.month() === +this.month) {
                if (lastWeek !== +momentDate.isoWeek()) {
                    weeks.push(currentWeek);
                    currentWeek = Object.assign({}, week);
                }
                let disabled = false;
                let dayClasses = [];
                dayClasses.push('day-'+momentDate.isoWeekday());

                if (nowTime === momentDate.format(justCompareFormat)) {
                    dayClasses.push('today')
                }
                if (this.current.format(justCompareFormat) === momentDate.format(justCompareFormat)){
                    dayClasses.push('selected');
                }

                if ((this.min && this.min.diff(momentDate, 'days') > 0) || (this.max && this.max.diff(momentDate, 'days') < 0)) {
                    dayClasses.push('locked');
                    disabled = true;
                }


                if (this.markedRange.length) {
                    for (let range of this.markedRange) {
                        if (range.start.diff(momentDate, 'days') <= 0 && range.end.diff(momentDate, 'days') >= 0) {
                            dayClasses.push(range.class)
                        }
                    }
                }

                currentWeek[momentDate.isoWeekday()] = {
                    label: momentDate.format('D'),
                    value: momentDate.clone(),
                    class: dayClasses.join(' '),
                    enabled: !disabled,
                };
                lastWeek = +momentDate.isoWeek();
                momentDate.add(1, 'days');
            }
            weeks.push(currentWeek);
            return weeks;
        },
        getWeekDayName(day) {
            return moment().isoWeekday(day).format('dd')
        },
        chooseDate(item) {
            this.$emit('select', item)
        }

    }

}
</script>

<style scoped>

.calendar-layer:not(:last-of-type) {
    margin-right: 30px;
}
.calendar-layer {
    padding: 5px;
    border: 1px solid lightgray;
    margin-top: 20px;
}
.simple-dropdown .calendar-layer {
    margin-top: 0;
    border: none;
}

.day-container {
    display: table-cell;
    text-align: center;
}
.week-names > div {
    border-bottom: 1px solid #ccc;
}
.week {
    display: table-row;
}
.week-names {
    color: #777;
    font-size: 1em;
}
.day {
    font-size: 1.1em;
    font-family: monospace;
    min-width: 31px;
    min-height: 31px;
    padding: 5px 5px;
    text-align: center;
}

.day-6,.day-7 {
    color: lightcoral;
}
.day.selected{
    background-color: #3185ff;
    font-weight: bold;
    color: white;
}
.today{
    background-color: #a8ffb6;
}
span.year {
    color: #ccc;
}
.month-name {
    text-align: center;
    font-size: 18px;
    text-transform: capitalize;
    padding: 10px;
}

.day.locked{
    color: #eee;
    cursor: initial;
    background: white;
}
.day:not(.locked):hover {
    background-color: lightblue;
    cursor: pointer;
}
</style>
