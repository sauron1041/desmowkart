"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMessages = {
    // notifi
    CREATE_FAILED: "Tạo thất bại",
    UPDATE_FAILED: "Cập nhật thất bại",
    DELETE_FAILED: "Xóa thất bại",
    FIND_BY_ID_FAILED: "Không tìm thấy dữ liệu",
    FIND_ALL_FAILED: "Không tìm thấy dữ liệu",
    CREATE_SUCCESS: "Tạo thành công",
    UPDATE_SUCCESS: "Cập nhật thành công",
    DELETE_SUCCESS: "Xóa thành công",
    FIND_BY_ID_SUCCESS: "Tìm thấy",
    FIND_ALL_SUCCESS: "Tìm thấy",
    NOT_FOUND: "Không tìm thấy dữ liệu",
    SUCCESS: "Thành công",
    FAILED: "Thất bại",
    UPLOAD_FAILED: "Upload thất bại",
    UPLOAD_SUCCESS: "Upload thành công",
    INVALID_FILE: "File không hợp lệ",
    FILE_NOT_FOUND: "File không tồn tại",
    LOGOUT_SUCCESS: "Đăng xuất thành công",
    LOGOUT_FAILED: "Đăng xuất thất bại",
    LOGIN_SUCCESS: "Đăng nhập thành công",
    LOGIN_FAILED: "Đăng nhập thất bại",
    REGISTER_SUCCESS: "Đăng ký thành công",
    REGISTER_FAILED: "Đăng ký thất bại",
    SEARCH_SUCCESS: "Tìm thấy",
    SEARCH_FAILED: "Không tìm thấy",
    REFRESH_TOKEN_FAILED: "Refresh token thất bại",
    STATISTICS_SUCCESS: "Thống kê thành công",
    CODE_EXISTED: "Mã đã tồn tại",
    NAME_EXIST: "Tên đã tồn tại",
    MISSING_NAME: "Tên không được để trống",
    MISSING_CODE: "Mã không được để trống",
    MISSING_ID: "ID không được để trống",
    MISSING_EMAIL: "Email không được để trống",
    MISSING_PHONE: "Số điện thoại không được để trống",
    MISSING_PASSWORD: "Mật khẩu không được để trống",
    MISSING_USERNAME: "Tên đăng nhập không được để trống",
    MISSING_AVATAR: "Ảnh đại diện không được để trống",
    MISSING_WEIGHT: "Trọng lượng không được để trống",
    MISSING_UNIT: "Đơn vị không được để trống",
    MISSING_DESCRIPTION: "Mô tả không được để trống",
    MISSING_IS_SELL: "Trạng thái không được để trống",
    MISSING_PRODUCT_TYPE_ID: "Loại sản phẩm không được để trống",
    MISSING_BRAND_ID: "Thương hiệu không được để trống",
    MISSING_RETAIL_PRICE: "Giá bán lẻ không được để trống",
    MISSING_WHOLESALE_PRICE: "Giá bán sỉ không được để trống",
    MISSING_IMPORT_PRICE: "Giá nhập không được để trống",
    MISSING_IMAGE: "Ảnh không được để trống",
    INVALID_FILE_QUANTITY: "Số lượng ảnh không hợp lệ",
    INVALID_FILE_NAME: "Tên file không hợp lệ",
    // validate
    INVALID_ID: "ID không hợp lệ",
    INVALID_NAME: "Tên không hợp lệ",
    INVALID_PAGE_LIMIT: "page, limit không hợp lệ",
    INVALID_LIMIT: "Trường limit không hợp lệ",
    INVALID_EMAIL: "Email không hợp lệ",
    INVALID_PHONE: "Số điện thoại không hợp lệ",
    INVALID_PASSWORD: "Mật khẩu không hợp lệ",
    INVALID_STATUS: "Trạng thái không hợp lệ",
    INVALID_PARAMS: "Tham số không hợp lệ",
    MISSING_PARAMS: "Thiếu tham số",
    // exist
    EMAIL_EXISTED: "Email đã tồn tại",
    PHONE_EXISTED: "Số điện thoại đã tồn tại",
    TAX_CODE_EXISTED: "Mã số thuế đã tồn tại",
    TAX_CODE_NOT_EXISTED: "Mã số thuế không tồn tại",
    USERNAME_EXISTED: "Tên đăng nhập đã tồn tại",
    USERNAME_NOT_EXISTED: "Tên đăng nhập không tồn tại",
    EMAIL_NOT_EXISTED: "Email không tồn tại",
    PHONE_NOT_EXISTED: "Số điện thoại không tồn tại",
    PASSWORD_NOT_EXISTED: "Mật khẩu không tồn tại",
    PASSWORD_INCORRECT: "Mật khẩu không chính xác",
    MODEL_IS_EMPTY: "Model không tồn tại",
    AVATAR_NOT_EXISTED: "Ảnh đại diện không tồn tại",
    EXISTED: "Đã tồn tại",
    NOT_EXISTED: "Không tồn tại",
    PRODUCT_TYPE_NOT_EXISTED: "Loại sản phẩm không tồn tại",
    BRAND_NOT_EXISTED: "Thương hiệu không tồn tại",
    NAME_EXISTED: "Tên đã tồn tại",
    // auth
    INVALID_USERNAME: "Tên đăng nhập không hợp lệ",
    INVALID_FULLNAME: "Họ tên không hợp lệ",
    INVALID_TOKEN: "Token không hợp lệ",
    REFRESH_TOKEN_NOT_EXISTED: "Refresh token không tồn tại",
    CHANGE_PASSWORD_FAILED: "Thay đổi mật khẩu thất bại",
    CHANGE_PASSWORD_SUCCESS: "Thay đổi mật khẩu thành công",
    REFRESH_TOKEN_SUCCESS: "Refresh token thành công",
    //cccd
    INVALID_CCCD: "CCCD không hợp lệ",
    REQUIRED_CCCD: "CCCD thì bắt buộc",
    CARD_FRONT_IMAGE_NOT_EXISTED: "Ảnh mặt trước CCCD không tồn tại",
    CARD_BACK_IMAGE_NOT_EXISTED: "Ảnh mặt sau CCCD không tồn tại",
    // group
    GROUP_EXISTED: "Nhóm đã tồn tại",
    GROUP_NOT_EXISTED: "Nhóm không tồn tại",
    GROUP_NAME_EXISTED: "Tên nhóm đã tồn tại",
    GROUP_NAME_NOT_EXISTED: "Tên nhóm không tồn tại",
    //service package
    SERVICE_PACKAGE_EXISTED: "Gói dịch vụ đã tồn tại",
    SERVICE_PACKAGE_NOT_EXISTED: "Gói dịch vụ không tồn tại",
    SERVICE_PACKAGE_NAME_EXISTED: "Tên gói dịch vụ đã tồn tại",
    SERVICE_PACKAGE_NAME_NOT_EXISTED: "Tên gói dịch vụ không tồn tại",
    //excel
    OVER_LIMIT: "Vượt quá giới hạn",
    MAX_ROW_EXCEL: "File excel vượt quá giới hạn",
    IMPORT_SUCCESS: "Import thành công",
    IMPORT_FAILED: "Import thất bại",
    // files
    INVALID_FILE_SIZE: "File quá lớn",
    PRODUCT_NAME_EXISTED: "Tên sản phẩm đã tồn tại",
    LIMIT_FILE_SIZE: "File quá lớn",
    FILE_TYPE_INVALID: "File không hợp lệ",
    FILE_OVER_LIMIT: "Ảnh vượt quá số lượng cho phép",
    CREATE_FOLDER_FAILED: "Tạo thư mục thất bại",
    //order
    ORDER_STATUS_NEW: "Đơn hàng mới",
    ORDER_STATUS_PROCESSING: "Đang xử lý",
    ORDER_STATUS_DELIVERING: "Đang giao",
    ORDER_STATUS_DELIVERED: "Hoàn thành",
    ORDER_STATUS_CANCEL: "Đã hủy",
    ORDER_STATUS_RETURN: "Đã trả hàng",
    ORDER_STATUS_REFUND: "Đã hoàn tiền",
    ORDER_STATUS_NOT_EXISTED: "Trạng thái đơn hàng không tồn tại",
    ORDER_NOT_EXISTED: "Đơn hàng không tồn tại",
    ORDER_EXISTED: "Đơn hàng đã tồn tại",
    ORDER_STATUS_INVALID: "Trạng thái đơn hàng không hợp lệ",
    ORDER_STATUS_NOT_ALLOW: "Không thể thay đổi trạng thái đơn hàng",
    //product
    PRICE_MUST_GREATER_THAN_ZERO: "Giá phải lớn hơn 0",
    //city
    CITY_NOT_EXISTED: "Thành phố không tồn tại",
    CITY_EXISTED: "Thành phố đã tồn tại",
    CITY_NAME_EXISTED: "Tên thành phố đã tồn tại",
    CITY_NAME_NOT_EXISTED: "Tên thành phố không tồn tại",
    //district
    DISTRICT_NOT_EXISTED: "Quận huyện không tồn tại",
    DISTRICT_EXISTED: "Quận huyện đã tồn tại",
    DISTRICT_NAME_EXISTED: "Tên quận huyện đã tồn tại",
    DISTRICT_NAME_NOT_EXISTED: "Tên quận huyện không tồn tại",
    //ward
    WARD_NOT_EXISTED: "Xã phường không tồn tại",
    WARD_EXISTED: "Xã phường đã tồn tại",
    WARD_NAME_EXISTED: "Tên xã phường đã tồn tại",
    WARD_NAME_NOT_EXISTED: "Tên xã phường không tồn tại",
    //hanle check in
    HANDLE_CHECK_IN_FAILED: "Check in thất bại",
    HANDLE_CHECK_IN_SUCCESS: "Check in thành công",
    HANDLE_CHECK_OUT_FAILED: "Check out thất bại",
    NO_TECHNICAN_AVAILABLE: "Không có kỹ thuật viên nào phù hợp",
    SET_TECHNICAN_STATUS_FAILED: "Cập nhật trạng thái kỹ thuật viên thất bại",
    CHECK_IN_SUCCESS: "Check in thành công",
    CHECK_OUT_SUCCESS: "Check out thành công",
    CHECK_IN_FAILED: "Check in thất bại",
    CHECK_OUT_FAILED: "Check out thất bại",
    CHECK_IN_NOT_EXISTED: "Check in không tồn tại",
    CHECK_OUT_NOT_EXISTED: "Check out không tồn tại",
    //service request
    SERVICE_REQUEST_EXISTED: "Yêu cầu dịch vụ đã tồn tại",
    SERVICE_REQUEST_NOT_EXISTED: "Yêu cầu dịch vụ không tồn tại",
    SERVICE_REQUEST_NAME_EXISTED: "Tên yêu cầu dịch vụ đã tồn tại",
    SERVICE_REQUEST_NAME_NOT_EXISTED: "Tên yêu cầu dịch vụ không tồn tại",
    SERVICE_REQUEST_STATUS_NOT_EXISTED: "Trạng thái yêu cầu dịch vụ không tồn tại",
    SERVICE_REQUEST_STATUS_EXISTED: "Trạng thái yêu cầu dịch vụ đã tồn tại",
    CREATE_SERVICE_REQUEST_FAILED: "Tạo yêu cầu dịch vụ thất bại",
    UPDATE_SERVICE_REQUEST_FAILED: "Cập nhật yêu cầu dịch vụ thất bại",
    DELETE_SERVICE_REQUEST_FAILED: "Xóa yêu cầu dịch vụ thất bại",
    SERVICE_REQUEST_NOT_ALLOW: "Không thể thay đổi trạng thái yêu cầu dịch vụ",
    SERVICE_REQUEST_STATUS_INVALID: "Trạng thái yêu cầu dịch vụ không hợp lệ",
    CREATE_SERVICE_REQUEST_SUCCESS: "Tạo yêu cầu dịch vụ thành công",
    UPDATE_SERVICE_REQUEST_SUCCESS: "Cập nhật yêu cầu dịch vụ thành công",
    DELETE_SERVICE_REQUEST_SUCCESS: "Xóa yêu cầu dịch vụ thành công",
    //reception employee
    ACCEPT_CHECK_IN_FAILED: "Chấp nhận check in thất bại",
    ACCEPT_CHECK_IN_SUCCESS: "Chấp nhận check in thành công",
    CANCEL_CHECK_IN_FAILED: "Hủy check in thất bại",
    CANCEL_CHECK_IN_SUCCESS: "Hủy check in thành công",
    //appointment
    CREATE_APPOINTMENT_FAILED: "Tạo lịch hẹn thất bại",
    CREATE_APPOINTMENT_SUCCESS: "Tạo lịch hẹn thành công",
    UPDATE_APPOINTMENT_FAILED: "Cập nhật lịch hẹn thất bại",
    UPDATE_APPOINTMENT_SUCCESS: "Cập nhật lịch hẹn thành công",
    DELETE_APPOINTMENT_FAILED: "Xóa lịch hẹn thất bại",
    DELETE_APPOINTMENT_SUCCESS: "Xóa lịch hẹn thành công",
    APPOINTMENT_NOT_EXISTED: "Lịch hẹn không tồn tại",
    APPOINTMENT_EXISTED: "Lịch hẹn đã tồn tại",
    APPOINTMENT_STATUS_NOT_EXISTED: "Trạng thái lịch hẹn không tồn tại",
    APPOINTMENT_STATUS_EXISTED: "Trạng thái lịch hẹn đã tồn tại",
    APPOINTMENT_STATUS_INVALID: "Trạng thái lịch hẹn không hợp lệ",
    APPOINTMENT_NOT_ALLOW: "Không thể thay đổi trạng thái lịch hẹn",
    APPOINTMENT_STATUS_NEW: "Lịch hẹn mới",
    APPOINTMENT_STATUS_PROCESSING: "Đang xử lý",
};
exports.default = errorMessages;
//# sourceMappingURL=constants.js.map