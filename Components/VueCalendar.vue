<template>
    <div class="calendar-container" v-click-outside="close">
        <div class="calendar-input" @click="toggle">
            <input :placeholder="placeholder" :class="inputClass" class="calendar-input" v-model="inputValue" readonly />
        </div>
        <div class="calendar-dropdown" v-if="isShowCalendar">
            <div class="action-buttons">
                <div class="month-changer prev-month" :class="{'disabled': !checkAllowPrev()}" @click="prevMonthView">
                    <i class="fa fa-chevron-left"></i>
                </div>
                <div class="month-changer next-month" :class="{'disabled': !checkAllowNext()}" @click="nextMonthView">
                    <i class="fa fa-chevron-right"></i>
                </div>
            </div>
            <div class="title" v-if="title">{{title}}</div>
            <div class="layer-container">
                <template v-for="layer in activeLayers">
                    <calendar-layer
                            :min="limitMin"
                            :current="dateModel"
                            :max="limitMax"
                            :month="layer.month"
                            :year="layer.year"
                            :marked-range="markedDateRange"
                            @select="emitSelection"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import ClickOutsideDirective from '../ClickOutsideDirective';
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
            title: String,

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
				if (this.markedRange.length){
					for (let i in this.markedRange) {
						range.push({
                            start: moment(this.markedRange[i].period.start, this.format),
                            end: moment(this.markedRange[i].period.end, this.format),
                            class: this.markedRange[i].class,
                        })
                    }
                }
                return range;
            },
            limitMin(){
				return moment(this.min, this.format);
            },
            limitMax(){
				return moment(this.max, this.format);
            }
        },
        methods: {
			initCalendarLayers(date) {
				if (date && date.isValid()) {
					let dateClone = date.clone();

					dateClone = moment(dateClone.endOf('month').format(this.format), this.format);
					while (this.limitMin.diff(dateClone, 'month') > 0) {
						dateClone.add(1, 'month');
					}

					while (this.limitMax.diff(dateClone, 'month') < 0) {
						let doNothing = true;
						if (doNothing) {
							break;
						}
					}

					this.activeLayers = [];
					for (let i = 0; i < this.calendarsCount; i++) {
						this.activeLayers.push({
							month: dateClone.month(),
							year: dateClone.year(),
							moment: dateClone.clone(),
						});
						dateClone.add(1, 'month');
					}
				}
            },
            initCalendar(){
				let date = moment(moment().format(this.format), this.format);
				if (this.dateModel && this.dateModel.isValid()) {
					if (this.min.length && this.dateModel < this.limitMin) {
						this.inputValue = this.min;
						this.dateModel = this.getDateModelFromValue();
                    }
					date = this.dateModel;
				}
				this.initCalendarLayers(date);
            },
			getDateModelFromValue() {
				return moment(this.inputValue, this.format);
            },
            open(){
				this.isShowCalendar = true;
            },
            close(){
				this.isShowCalendar = false;
            },
            toggle(){
				this.isShowCalendar = !this.isShowCalendar;
            },
            checkAllowPrev() {
				let firstMonth = this.activeLayers[0].moment.clone();
				firstMonth.subtract(1, 'month').endOf('month');
				return firstMonth >= this.limitMin;
            },
			checkAllowNext() {
				let lastMonth = this.activeLayers[this.activeLayers.length-1].moment.clone();
				lastMonth.add(1, 'month').startOf('month');
				return this.limitMax >= lastMonth;
			},
			prevMonthView() {
				if (this.checkAllowPrev()) {
					let firstMonth = this.activeLayers[0].moment.clone();
					firstMonth.subtract(1, 'month');
					this.initCalendarLayers(firstMonth);
				}
            },
			nextMonthView() {
				if (this.checkAllowNext()) {
					let lastMonth = this.activeLayers[0].moment.clone();
					console.log(lastMonth.add(1, 'month')); //перескакиваем, плавно по одному месяцу
					this.initCalendarLayers(lastMonth);
				}
            },
            emitSelection(payload) {
				this.dateModel = payload;
				this.inputValue = this.dateModel.format(this.format);
				console.log(this.inputValue);
				this.$emit('input', this.inputValue);
				this.$emit('selected');
				this.isShowCalendar = false;
            }
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
			}
        },
        directives: {
			'click-outside' : ClickOutsideDirective,
        }
	}
</script>

<style scoped>
    .title {
        text-align: center;
    }
    .calendar-input {
        width: 100%;
    }
    .calendar-dropdown {
        position: absolute;
        z-index: 99;
        background: white;
        padding: 20px;
        box-shadow: 1px 1px 5px 0 #ccc;
        user-select: none;
        border-radius: 5px;
    }
    .month-changer {
        position: absolute;
        cursor: pointer;
    }
    .month-changer:hover {
        position: absolute;
        cursor: pointer;
    }

    .prev-month {
        left: 20px;
        font-size: 1.5em;
    }

    .disabled {
        color: #eee;
        cursor: initial;
    }

    .layer-container {
        padding: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .next-month {
        right: 20px;
        font-size: 1.5em;
    }

    .title {
        font-size: 18px;
    }
</style>