import dayjs from 'dayjs';

export default function formatDate(format: string) {
    return dayjs(new Date()).add(9, 'h').format(format);
}
