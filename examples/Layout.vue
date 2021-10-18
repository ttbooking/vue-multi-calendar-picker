<template>
    <div class="container">
        <div>
            <h2>Example 1</h2>
            <p>single</p>
            <label>
                <vue-calendar v-model="model1"/>
            </label>
        </div>
        <div>
            <h2>Example 2</h2>
            <p>3 calendars</p>
            <label>
                <vue-calendar :calendars-count="3"
                              v-model="model2"
                />
            </label>
        </div>
        <div>
            <h2>Example 3</h2>
            <p>With timepicker</p>
            <label>
                <vue-calendar :calendars-count="1"
                              :with-time="true"
                              v-model="model3"
                              title="SelectDate"
                              time-title="SelectTime"
                              format="DD.MM.YYYY HH:mm:ss"
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
            model1: '',
            model2: '',
            model3: '',
        };
    },
}
</script>

<style scoped>

</style>