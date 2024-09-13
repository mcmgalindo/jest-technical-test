import {
    calculateMonthlyRent,
    MonthlyRentRecord,
    MonthlyRentRecords,
} from "../../src/StorageRent/StorageRent";

describe("calculateMonthlyRent function", () => {
    it("Should return MonthlyRentRecords", () => {
        const baseMonthlyRent = 100.0;
        const leaseStartDate = new Date("2023-01-01T00:00:00");
        const windowStartDate = new Date("2023-01-01T00:00:00");
        const windowEndDate = new Date("2023-03-31T00:00:00");
        const dayOfMonthRentDue = 1;
        const rentRateChangeFrequency = 1;
        const rentChangeRate = 0.1;

        const result = calculateMonthlyRent(
            baseMonthlyRent,
            leaseStartDate,
            windowStartDate,
            windowEndDate,
            dayOfMonthRentDue,
            rentRateChangeFrequency,
            rentChangeRate
        );

        let expectedResult = [
            {
                vacancy: false,
                rentAmount: 100.0,
                rentDueDate: new Date("2023-01-01T00:00:00"),
            },
            {
                vacancy: false,
                rentAmount: 110.0,
                rentDueDate: new Date("2023-02-01T00:00:00"),
            },
            {
                vacancy: false,
                rentAmount: 121.0,
                rentDueDate: new Date("2023-03-01T00:00:00"),
            },
        ];

        expect(result).toEqual(expectedResult);
    });

    test.each([
        {
            rentRateChangeFrequency: 2,
            description: "rentRateChangeFrequency = 2",
        },
        {
            rentRateChangeFrequency: 3,
            description: "rentRateChangeFrequency = 3",
        },
        {
            rentRateChangeFrequency: 4,
            description: "rentRateChangeFrequency = 4",
        },
    ])(
        "Should work correctly with different rentRateChangeFrequency. This run: $description.",
        ({ rentRateChangeFrequency }) => {
            const baseMonthlyRent = 50.0;
            const leaseStartDate = new Date("2023-01-01T00:00:00");
            const windowStartDate = new Date("2023-01-01T00:00:00");
            const windowEndDate = new Date("2023-05-18T00:00:00");
            const dayOfMonthRentDue = 15;
            // const rentRateChangeFrequency = 2;
            const rentChangeRate = 0.1;

            const result = calculateMonthlyRent(
                baseMonthlyRent,
                leaseStartDate,
                windowStartDate,
                windowEndDate,
                dayOfMonthRentDue,
                rentRateChangeFrequency,
                rentChangeRate
            );

            let expectedResult;
            switch (rentRateChangeFrequency) {
                case 2:
                    expectedResult = [
                        {
                            vacancy: false,
                            rentAmount: 23.33,
                            rentDueDate: new Date("2023-01-01T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 50,
                            rentDueDate: new Date("2023-01-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 50,
                            rentDueDate: new Date("2023-02-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 55,
                            rentDueDate: new Date("2023-03-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 55,
                            rentDueDate: new Date("2023-04-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 60.5,
                            rentDueDate: new Date("2023-05-15T00:00:00"),
                        },
                    ];

                    break;
                case 3:
                    expectedResult = [
                        {
                            vacancy: false,
                            rentAmount: 23.33,
                            rentDueDate: new Date("2023-01-01T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 50,
                            rentDueDate: new Date("2023-01-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 50,
                            rentDueDate: new Date("2023-02-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 50,
                            rentDueDate: new Date("2023-03-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 55,
                            rentDueDate: new Date("2023-04-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 55,
                            rentDueDate: new Date("2023-05-15T00:00:00"),
                        },
                    ];
                    break;
                case 4:
                    expectedResult = [
                        {
                            vacancy: false,
                            rentAmount: 23.33,
                            rentDueDate: new Date("2023-01-01T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 50,
                            rentDueDate: new Date("2023-01-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 50,
                            rentDueDate: new Date("2023-02-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 50,
                            rentDueDate: new Date("2023-03-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 50,
                            rentDueDate: new Date("2023-04-15T00:00:00"),
                        },
                        {
                            vacancy: false,
                            rentAmount: 55,
                            rentDueDate: new Date("2023-05-15T00:00:00"),
                        },
                    ];
                    break;
                default:
                    break;
            }
            expect(result).toEqual(expectedResult);
        }
    );

    it("Should decrease the rate while the unit is vacant.", () => {
        const baseMonthlyRent = 100.0;
        const leaseStartDate = new Date("2023-04-11T00:00:00");
        const windowStartDate = new Date("2023-01-01T00:00:00");
        const windowEndDate = new Date("2023-04-10T00:00:00");
        const dayOfMonthRentDue = 3;
        const rentRateChangeFrequency = 1;
        const rentChangeRate = -0.1;

        const result = calculateMonthlyRent(
            baseMonthlyRent,
            leaseStartDate,
            windowStartDate,
            windowEndDate,
            dayOfMonthRentDue,
            rentRateChangeFrequency,
            rentChangeRate
        );

        let expectedResult = [
            {
                vacancy: true,
                rentAmount: 100.0,
                rentDueDate: new Date("2023-01-01T00:00:00"),
            },
            {
                vacancy: true,
                rentAmount: 90,
                rentDueDate: new Date("2023-02-01T00:00:00"),
            },
            {
                vacancy: true,
                rentAmount: 81,
                rentDueDate: new Date("2023-03-01T00:00:00"),
            },
            {
                vacancy: true,
                rentAmount: 72.9,
                rentDueDate: new Date("2023-04-01T00:00:00"),
            },
        ];

        expect(result).toEqual(expectedResult);
    });

    test.each([
        { rentChangeRate: 0.1, description: "rentChangeRate = 0.1" },
        { rentChangeRate: -0.1, description: "rentChangeRate = -0.1" },
    ])(
        "Should handle the change from vacant to occupied correctly with $description.",
        ({ rentChangeRate, description }) => {
            const baseMonthlyRent = 100.0;
            const leaseStartDate = new Date("2023-04-10T00:00:00");
            const windowStartDate = new Date("2023-01-01T00:00:00");
            const windowEndDate = new Date("2023-07-05T00:00:00");
            const dayOfMonthRentDue = 3;
            const rentRateChangeFrequency = 1;
            // const rentChangeRate = 0.1;

            const result = calculateMonthlyRent(
                baseMonthlyRent,
                leaseStartDate,
                windowStartDate,
                windowEndDate,
                dayOfMonthRentDue,
                rentRateChangeFrequency,
                rentChangeRate
            );

            let expectedResult;
            if (rentChangeRate == -0.1) {
                expectedResult = [
                    {
                        vacancy: true,
                        rentAmount: 100.0,
                        rentDueDate: new Date("2023-01-01T00:00:00"),
                    },
                    {
                        vacancy: true,
                        rentAmount: 90,
                        rentDueDate: new Date("2023-02-01T00:00:00"),
                    },
                    {
                        vacancy: true,
                        rentAmount: 81,
                        rentDueDate: new Date("2023-03-01T00:00:00"),
                    },
                    {
                        vacancy: true,
                        rentAmount: 72.9,
                        rentDueDate: new Date("2023-04-01T00:00:00"),
                    },
                    {
                        vacancy: false,
                        rentAmount: 55.89,
                        rentDueDate: new Date("2023-04-10T00:00:00"),
                    },
                    {
                        vacancy: false,
                        rentAmount: 72.9,
                        rentDueDate: new Date("2023-05-03T00:00:00"),
                    },
                    {
                        vacancy: false,
                        rentAmount: 72.9,
                        rentDueDate: new Date("2023-06-03T00:00:00"),
                    },
                    {
                        vacancy: false,
                        rentAmount: 72.9,
                        rentDueDate: new Date("2023-07-03T00:00:00"),
                    },
                ];
            } else {
                expectedResult = [
                    {
                        vacancy: true,
                        rentAmount: 100.0,
                        rentDueDate: new Date("2023-01-01T00:00:00"),
                    },
                    {
                        vacancy: true,
                        rentAmount: 100,
                        rentDueDate: new Date("2023-02-01T00:00:00"),
                    },
                    {
                        vacancy: true,
                        rentAmount: 100,
                        rentDueDate: new Date("2023-03-01T00:00:00"),
                    },
                    {
                        vacancy: true,
                        rentAmount: 100,
                        rentDueDate: new Date("2023-04-01T00:00:00"),
                    },
                    {
                        vacancy: false,
                        rentAmount: 76.67,
                        rentDueDate: new Date("2023-04-10T00:00:00"),
                    },
                    {
                        vacancy: false,
                        rentAmount: 110,
                        rentDueDate: new Date("2023-05-03T00:00:00"),
                    },
                    {
                        vacancy: false,
                        rentAmount: 121,
                        rentDueDate: new Date("2023-06-03T00:00:00"),
                    },
                    {
                        vacancy: false,
                        rentAmount: 133.1,
                        rentDueDate: new Date("2023-07-03T00:00:00"),
                    },
                ];
            }

            expect(result).toEqual(expectedResult);
        }
    );

    it("Should correctly check invalid window dates.", () => {
        const baseMonthlyRent = 50.0;
        const leaseStartDate = new Date("2023-01-01T00:00:00");
        const windowStartDate = new Date("2023-01-01T00:00:00");
        const windowEndDate = new Date("2021-05-18T00:00:00");
        const dayOfMonthRentDue = 15;
        const rentRateChangeFrequency = 2;
        const rentChangeRate = 0.1;

        const result = calculateMonthlyRent(
            baseMonthlyRent,
            leaseStartDate,
            windowStartDate,
            windowEndDate,
            dayOfMonthRentDue,
            rentRateChangeFrequency,
            rentChangeRate
        );

        let expectedResult = [];

        expect(result).toEqual(expectedResult);
    });

    it("Should return MonthlyRentRecords validate first payment due date and first month pro-rate when lease start is before monthly due date", () => {
        const baseMonthlyRent = 100.0;
        const leaseStartDate = new Date("2023-01-01T00:00:00");
        const windowStartDate = new Date("2023-01-01T00:00:00");
        const windowEndDate = new Date("2023-03-31T00:00:00");
        const dayOfMonthRentDue = 15;
        const rentRateChangeFrequency = 1;
        const rentChangeRate = 0.1;

        const result = calculateMonthlyRent(
            baseMonthlyRent,
            leaseStartDate,
            windowStartDate,
            windowEndDate,
            dayOfMonthRentDue,
            rentRateChangeFrequency,
            rentChangeRate
        );

        let expectedResult = [
            {
                vacancy: false,
                rentAmount: 46.67,
                rentDueDate: new Date("2023-01-01T00:00:00"),
            },
            {
                vacancy: false,
                rentAmount: 100,
                rentDueDate: new Date("2023-01-15T00:00:00"),
            },
            {
                vacancy: false,
                rentAmount: 110.0,
                rentDueDate: new Date("2023-02-15T00:00:00"),
            },
            {
                vacancy: false,
                rentAmount: 121.0,
                rentDueDate: new Date("2023-03-15T00:00:00"),
            },
        ];

        expect(result).toEqual(expectedResult);
    });
});
