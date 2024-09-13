export type MonthlyRentRecord = {
    vacancy: boolean;
    rentAmount: number;
    rentDueDate: Date;
};

export type MonthlyRentRecords = Array<MonthlyRentRecord>;

/**
 *
 * @param startDateParam : Record date (Date)
 * @param rentRateChangeFrequency : How frequent (in months) is the rent going to change. (Number)
 * @param rentChangeRate : The rent change rate. (Number)
 * @param currentRentAmount : The current price of rent. (Number)
 * @param monthsSinceLastRateChangeParam : How many months have passed since the rent was changed the last time. (Number)
 * @param vacancy : Whether the record will have vancy True or False. (Boolean)
 * @returns
 */
function calculateWholeMonth(
    startDateParam: Date,
    rentRateChangeFrequency: number,
    rentChangeRate: number,
    currentRentAmount: number,
    monthsSinceLastRateChangeParam: number,
    vacancy: boolean
): [Date, MonthlyRentRecord, number, number] {
    let startDate = new Date(startDateParam);
    let rentAmount = currentRentAmount;
    let monthsSinceLastRateChange = monthsSinceLastRateChangeParam;

    // Is it time to increase the rent?
    if (rentRateChangeFrequency <= monthsSinceLastRateChange) {
        // Is the rentChangeRate appliable?
        if (
            (vacancy && rentChangeRate < 0) ||
            (!vacancy && rentChangeRate > 0)
        ) {
            rentAmount *= 1 + rentChangeRate;
            monthsSinceLastRateChange = 0;
        }
    }

    // Create new record
    rentAmount = Math.round((rentAmount + Number.EPSILON) * 100) / 100;
    let newRecord: MonthlyRentRecord = {
        vacancy,
        rentAmount,
        rentDueDate: new Date(startDate),
    };

    monthsSinceLastRateChange++;
    startDate.setMonth(startDate.getMonth() + 1);
    return [startDate, newRecord, rentAmount, monthsSinceLastRateChange];
}

/**
 * Determines the vacancy, rent amount and due date for each month in a given time window
 *
 * @param baseMonthlyRent : The base or starting monthly rent for unit (Number)
 * @param leaseStartDate : The date that the tenant's lease starts (Date)
 * @param windowStartDate : The first date of the given time window (Date)
 * @param windowEndDate : The last date of the given time window (Date)
 * @param dayOfMonthRentDue : The day of each month on which rent is due (Number)
 * @param rentRateChangeFrequency : The frequency in months the rent is changed (Number)
 * @param rentChangeRate : The rate to increase or decrease rent, input as decimal (not %), positive for increase, negative for decrease (Number),
 * @returns Array<MonthlyRentRecord>;
 */
export function calculateMonthlyRent(
    baseMonthlyRent: number,
    leaseStartDate: Date,
    windowStartDate: Date,
    windowEndDate: Date,
    dayOfMonthRentDue: number,
    rentRateChangeFrequency: number,
    rentChangeRate: number
) {
    const monthlyRentRecords: MonthlyRentRecords = [];
    let rentAmount: number = baseMonthlyRent;
    let monthsSinceLastRateChange = 0;

    // Is the window invalid?
    if (windowStartDate > windowEndDate) {
        return [];
    }

    if (windowStartDate < leaseStartDate) {
        //Unit is vacant
        let startDate: Date = new Date(windowStartDate);

        //Create a record for each month while the unit is vacant.
        while (startDate < leaseStartDate) {
            let [
                updatedStartDate,
                newRecord,
                updatedRentAmount,
                monthsWithoutChange,
            ] = calculateWholeMonth(
                startDate,
                rentRateChangeFrequency,
                rentChangeRate,
                rentAmount,
                monthsSinceLastRateChange,
                true
            );

            startDate = updatedStartDate;
            monthlyRentRecords.push(newRecord);
            rentAmount = updatedRentAmount;
            monthsSinceLastRateChange = monthsWithoutChange;
        }
        monthsSinceLastRateChange = 0;
    }

    //Unit is not vacant anymore and the window is still open
    if (windowEndDate >= leaseStartDate && windowEndDate > leaseStartDate) {
        const leaseStartDay: number = leaseStartDate.getDate();
        let firstMonthPayRate: number = 0;

        // Calculate proration
        if (leaseStartDay < dayOfMonthRentDue) {
            firstMonthPayRate = (dayOfMonthRentDue - leaseStartDay) / 30;
        } else {
            firstMonthPayRate = 1 - (leaseStartDay - dayOfMonthRentDue) / 30;
        }
        const firstRentAmount =
            Math.round(
                (rentAmount * firstMonthPayRate + Number.EPSILON) * 100
            ) / 100;

        monthlyRentRecords.push({
            vacancy: false,
            rentAmount: firstRentAmount,
            rentDueDate: new Date(leaseStartDate),
        });

        // Calculate further payments until windowEndDate
        let rentDueDate: Date = new Date(leaseStartDate);
        rentDueDate.setDate(dayOfMonthRentDue);

        // If the first payment was made after the current month's monthlyRentDate then start records on the next month.
        if (leaseStartDate >= rentDueDate) {
            rentDueDate.setMonth(rentDueDate.getMonth() + 1);
            monthsSinceLastRateChange++;
        }

        // Create the rest of the records for the occuppied unit 
        while (rentDueDate < windowEndDate) {
            let [
                updatedStartDate,
                newRecord,
                updatedRentAmount,
                monthsWithoutChange,
            ] = calculateWholeMonth(
                rentDueDate,
                rentRateChangeFrequency,
                rentChangeRate,
                rentAmount,
                monthsSinceLastRateChange,
                false
            );

            rentDueDate = updatedStartDate;
            monthlyRentRecords.push(newRecord);
            rentAmount = updatedRentAmount;
            monthsSinceLastRateChange = monthsWithoutChange;
        }
    }
    return monthlyRentRecords;
}

/**
 * Calculates the new monthly rent
 *
 * @param baseMonthlyRent : the base amount of rent
 * @param rentChangeRate : the rate that rent my increase or decrease (positive for increase, negative for decrease)
 * @returns number
 *
 */
function calculateNewMonthlyRent(
    baseMonthlyRent: number,
    rentChangeRate: number
) {
    return baseMonthlyRent * (1 + rentChangeRate);
}

/**
 * Determines if the year is a leap year
 *
 * @param year
 * @returns boolean
 *
 */
function isLeapYear(year: number) {
    return year % 4 == 0 && year % 100 != 0;
}
