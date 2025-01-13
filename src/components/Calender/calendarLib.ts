import moment, { Moment } from "moment";

export type CalenderDataItem = {
    day: string
    sampleImage: string | null;
}


type DayCellData = {
    date: moment.Moment;
    hasEntries: boolean;
    image: string | null | undefined;
    isToday: boolean;
    isFuture: boolean;
} | null


export const generateCalenderGrid = (inputMonth: Moment, calenderData?: CalenderDataItem[]) => {
    const today = moment().startOf('d');
    const daysInMonth = inputMonth.daysInMonth();
    const startDay = inputMonth.startOf('month').day();
    const map = new Map<number, CalenderDataItem>();

    const year = inputMonth.year()
    const month = inputMonth.month()

    if (calenderData) for (const e of calenderData) map.set(+e.day, e)

    const result: DayCellData[] = Array(startDay).fill(null)

    for (let day = 1; day <= daysInMonth; day++) {
        const date = moment([year, month, day])
        const entry = map.get(day)

        result.push({
            date: date,
            hasEntries: Boolean(entry),
            image: entry?.sampleImage,
            isToday: date.isSame(today),
            isFuture: date.isAfter(today),
        });
    }

    return result
};

export const QUARTER_COUNT = 5;
export const QUARTER_LIMIT = QUARTER_COUNT + 2;

export const halfQuarterCount = Math.floor(QUARTER_COUNT / 2);


export const generateInitialQuarterList = (refMonth: Moment) => {
    const diffWithCurrent = moment().endOf('Q').diff(refMonth, 'Q');

    const futureQuarter =
        diffWithCurrent < 0
            ? 0
            : diffWithCurrent > halfQuarterCount
                ? halfQuarterCount
                : diffWithCurrent;

    const result: Moment[] = [];
    const diffWithStarList = QUARTER_COUNT - futureQuarter;

    const startOfList = refMonth.clone().startOf('Q');

    for (let i = 1; i <= QUARTER_COUNT; i++) {
        result.push(startOfList.clone().add(i - diffWithStarList, 'Q'));
    }

    return result;
};