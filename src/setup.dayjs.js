import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isoWeek from 'dayjs/plugin/isoWeek';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
export default dayjs;