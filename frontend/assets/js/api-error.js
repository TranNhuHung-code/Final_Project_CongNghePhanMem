async function getApiErrorMessage(response) {
    const messages = {
        400: "Thông tin không hợp lệ. Vui lòng kiểm tra lại.",
        401: "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.",
        403: "Bạn không có quyền thực hiện thao tác này.",
        404: "Không tìm thấy thông tin yêu cầu.",
        409: "Dữ liệu đã tồn tại hoặc xảy ra xung đột.",
        413: "File tải lên vượt quá dung lượng cho phép.",
        500: "Hệ thống gặp sự cố. Vui lòng thử lại sau."
    };

    return messages[response.status]
        || "Đã xảy ra lỗi. Vui lòng thử lại.";
}