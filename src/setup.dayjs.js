import dayjs from 'dayjs/esm';
import isoWeek from 'dayjs/esm/plugin/isoWeek';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import 'dayjs/esm/locale/en';
import 'dayjs/esm/locale/ru';
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
export default dayjs;
