# vue-multi-calendar-picker

Calendar picker for Vue 2.7 based on dayjs.

## Installation

```bash
yarn add vue-multi-calendar-picker dayjs
```

Vue is a peer dependency and must be provided by the host application.

## Usage

```vue
<template>
  <vue-calendar
    v-model="date"
    format="DD.MM.YYYY HH:mm"
    :calendars-count="2"
    :min="min"
    :max="max"
    :marked-range="markedRange"
    :disabled-days="disabledDays"
    @selected="onSelected"
  />
</template>

<script>
import VueCalendar from 'vue-multi-calendar-picker';

export default {
  components: { VueCalendar },
  data() {
    return {
      date: '',
      layers: [],
      min: '01.05.2026 09:00',
      max: '31.05.2026 18:00',
      markedRange: [
        {
          period: {
            start: '10.05.2026 00:00',
            end: '15.05.2026 23:59'
          },
          class: 'marked'
        }
      ]
    };
  },
  methods: {
    disabledDays(day) {
      return [6, 7].includes(day.isoWeekday());
    },
    onSelected(layers) {
      this.layers = layers;
    }
  }
};
</script>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `String` | - | Selected value used by `v-model`. |
| `placeholder` | `String` | - | Input placeholder. |
| `format` | `String` | `DD.MM.YYYY` | dayjs parse/format string. Include `H`, `h`, `k`, `m`, or `s` to enable time selection. |
| `calendarsCount` | `Number` | `1` | Number of month layers displayed at once. |
| `inputClass` | `Object\|String` | `form-control` | Class binding for the input. |
| `min` | `String` | `null` | Minimum selectable date in the same format. |
| `max` | `String` | `null` | Maximum selectable date in the same format. |
| `markedRange` | `Array` | `[]` | Ranges to decorate on the calendar. |
| `title` | `String` | `null` | Date picker title. |
| `timeTitle` | `String` | `null` | Time picker title. |
| `disabledDays` | `Function` | `null` | Receives a dayjs date, return `true` to disable the day. |
| `disabled` | `Boolean` | `false` | Disables the input. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `input` | `String` | Emitted for `v-model` changes. |
| `selected` | `Array` | Emitted after a date, or date and time, is selected. |
| `dayHover` | `dayjs\|undefined` | Emitted when hovering a day. |
| `layerChange` | `Array` | Emitted when visible months/years change. |
| `focus` | `Array` | Emitted when the input is focused by the component method. |
| `close` | `Array` | Emitted when the picker closes. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `day` | `{ day }` | Custom day cell content. |
| `title` | - | Custom date picker title. |
| `time-title` | - | Custom time picker title. |
| `previousSign` | - | Custom previous month control. |
| `nextSign` | - | Custom next month control. |

## Build

```bash
yarn install --immutable
yarn lint
yarn build
```

The library build is generated in `dist`.

The default package entry imports `src/sass/style.scss`, so bundler-based applications receive the component styles automatically. For direct UMD usage, include `dist/vue-multi-calendar-picker.css` next to the UMD script.

## Vue 3 migration notes

This package currently targets Vue 2.7. A Vue 3 major version should replace `value`/`input` with `modelValue`/`update:modelValue`, update the click-outside directive lifecycle, and switch the example app/build tooling to Vite.
