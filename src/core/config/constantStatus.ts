// models/ServiceRequestStatus.js
const constantStatus = Object.freeze({
  CHECKED_IN: 'Chưa Check-in',
  PENDING: 'Đang Đợi',
  SERVING: 'Đang Phục Vụ',
  COMPLETED: 'Hoàn Thành',
  CANCELED: 'Đã Hủy',
});

export default constantStatus;