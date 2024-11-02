export const calculateTotalAmount = (orderDetails: any[]): number => {
    return orderDetails.reduce((total, orderDetail) => {
        return total + (orderDetail.price * orderDetail.quantity);
    }, 0);
};