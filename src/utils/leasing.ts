export const calculateLeasingDetails = (
    vehiclePrice: number,
    downPayment: number,
    interestRate: number,
    months: number
) => {
    const principal = Math.max(0, vehiclePrice - downPayment);

    if (principal <= 0) return {monthly: 0, total: 0};
    if (months <= 0) return {monthly: 0, total: 0};

    let monthlyInstallment = 0;
    let totalAmount = 0;

    // Monthly interest rate (Annual rate / 100 / 12)
    const oneMonthInterest = interestRate / 100 / 12;

    if (interestRate === 0) {
        monthlyInstallment = principal / months;
        totalAmount = principal;
    } else {
        const ratePower = Math.pow(1 + oneMonthInterest, months);
        const factor = (oneMonthInterest * ratePower) / (ratePower - 1);
        monthlyInstallment = factor * principal;
        totalAmount = monthlyInstallment * months;
    }

    return {
        monthly: parseFloat(monthlyInstallment.toFixed(2)),
        total: parseFloat(totalAmount.toFixed(2)),
    };
};