export interface ISearch {
    key?: string;

}

export enum ServiceRequestStatus {
    PENDING = 1,
    SERVING = 2,
    COMPLETED = 3,
    CANCELED = 4,
}


// export enum ServiceRequestStatus {
//     CHECKED_IN = 'Chưa Check-in',
//     PENDING = 'Đang Đợi',
//     SERVING = 'Đang Phục Vụ',
//     COMPLETED = 'Hoàn Thành',
//     CANCELED = 'Đã Hủy',
// }

export default ServiceRequestStatus;