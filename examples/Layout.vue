<template>
    <div class="container">
        <div class="switch pull-right">
            <div class="btn-group">
                <button type="button" class="btn btn-light" :class="{active: theme === 'light'}" @click="theme='light'">light</button>
                <button type="button" class="btn btn-dark" :class="{active: theme === 'dark'}" @click="theme='dark'">dark</button>
            </div>
        </div>
        <div>
            <h2>Example 1</h2>
            <p>single</p>
            <label>
                <vue-calendar v-model="model1" :class="theme"/>
            </label>
        </div>
        <div>
            <h2>Example 2</h2>
            <p>3 calendars</p>
            <label>
                <vue-calendar :calendars-count="3"
                              :class="theme"
                              v-model="model2"
                />
            </label>
        </div>
        <div>
            <h2>Example 3</h2>
            <p>With timepicker</p>
            <label>
                <vue-calendar :calendars-count="1"
                              :class="theme"
                              v-model="model3"
                              title="SelectDate"
                              time-title="SelectTime"
                              format="DD.MM.YYYY HH:mm:ss"
                />
            </label>
        </div>
        <div>
            <h2>Example 4</h2>
            <p>With timepicker only hours and minutes</p>
            <label>
                <vue-calendar :calendars-count="1"
                              :class="theme"
                              v-model="model4"
                              title="SelectDate"
                              time-title="SelectTime"
                              format="DD.MM.YYYY HH:mm"
                />
            </label>
        </div>
        <div>
            <h2>Example 5</h2>
            <p>With min date</p>
            <label>
                <vue-calendar :calendars-count="1"
                              :class="theme"
                              v-model="model5"
                              :min="model1"
                              title="SelectDate"
                              time-title="SelectTime"
                              format="DD.MM.YYYY"
                />
            </label>
        </div>
        <div>
            <h2>Example 6</h2>
            <p>DateTime With min date</p>
            <label>
                <vue-calendar :calendars-count="1"
                              :class="theme"
                              v-model="model6"
                              :min="model4"
                              :max="model3"
                              title="SelectDate"
                              time-title="SelectTime"
                              format="DD.MM.YYYY HH:mm"
                />
            </label>
        </div>
        <div>
            <h2>Example 7</h2>
            <p>Disabled</p>
            <label>
                <vue-calendar :calendars-count="1"
                              :class="theme"
                              v-model="model6"
                              :min="model4"
                              :max="model3"
                              :disabled="true"
                              title="SelectDate"
                              time-title="SelectTime"
                              format="DD.MM.YYYY HH:mm"
                />
            </label>
        </div>
    </div>
</template>

<script>

import VueCalendar from "../index";
import 'font-awesome/css/font-awesome.css';

export default {
    name: "Layout",
    components: {
        VueCalendar
    },
    data() {
        return {
            theme: 'light',
            model1: '',
            model2: '',
            model3: '',
            model4: '',
            model5: '',
            model6: '',
        };
    },
}
</script>

<style scoped>
.container {
    margin-bottom: 500px;
}
</style>