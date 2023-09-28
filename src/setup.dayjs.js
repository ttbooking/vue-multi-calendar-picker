import dayjs from 'dayjs/esm';
import isoWeek from 'dayjs/esm/plugin/isoWeek';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
export default dayjs;