export interface ISearch {
    key?: string;

}

// export enum AppointmentStatus {
//     CHECKED_IN = 'Chưa Check-in',
//     PENDING = 'Đang Đợi',
//     SERVING = 'Đang Phục Vụ',
//     COMPLETED = 'Hoàn Thành',
//     CANCELED = 'Đã Hủy',
// }


export enum AppointmentStatus {
    WAITING = 0,
    CHECKED_IN = 1,
    PENDING = 2,
    SERVING = 3,
    COMPLETED = 4,
    CANCELED = 5,
}

export default AppointmentStatus;