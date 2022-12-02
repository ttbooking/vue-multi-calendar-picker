<template>
    <div class="calendar-layer">
        <div class="month-name">
            {{monthName}} <span class="year">{{year}}</span>
        </div>
        <div class="week week-names">
            <div class="day-container" v-for="day in [1,2,3,4,5,6,7]" :key="day">
                <span>{{getWeekDayName(day)}}</span>
            </div>
        </div>
        <template v-for="(week, index) in getCalendarLayer()">
            <div class="week" :key="index">
                <div class="day-container" v-for="(day, index) in week" :key="index">
                    <template v-if="day && day.enabled">
                        <div class="day"
                             :class="day.class"
                             v-if="day"
                             @mouseover="() => $emit('dayHover', day.value)"
                             @mouseleave="() => $emit('dayHover')"
                             @click="chooseDate(day.value)"
                        >
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
import 'moment/dist/locale/ru';

export default {
    name: "calendar-layer",
    props: ['year', 'month', 'markedRange', 'selected', 'min', 'max', 'current', 'disabledDays'],
    data() {
        return {};
    },
    computed: {
        monthName() {
            return moment().month(this.month).format('MMMM')
        }
    },
    methods:{
        getCalendarLayer(){
            let momentDate = moment([this.year, this.month, 1])
                .hours(this.current.hours())
                .minutes(this.current.minutes())
                .seconds(this.current.seconds())
            ;

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

                if (this.disabledDays && this.disabledDays(momentDate)) {
                    dayClasses.push('locked');
                    disabled = true;
                } else if ((this.min && this.min.diff(momentDate, 'days') > 0) || (this.max && this.max.diff(momentDate, 'days') < 0)) {
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
            this.$emit('input', item);
            this.$emit('select');
        }

    }

}
</script>
