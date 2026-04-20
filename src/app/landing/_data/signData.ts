export type SignInfo = {
  id: number;
  name: string;
  rule: string;
};

export const SIGN_DATA: SignInfo[] = [
  {
    id: 1,
    name: "Biển báo tốc độ tối đa 50",
    rule: "Không được đi quá 50 km/h trong khu vực này.",
  },
  {
    id: 2,
    name: "Biển cấm đi vào",
    rule: "Tuyệt đối không được đi vào đường này.",
  },
  {
    id: 3,
    name: "Biển dừng lại",
    rule: "Phải dừng hẳn trước vạch kẻ và nhường đường.",
  },
  {
    id: 4,
    name: "Biển nhường đường",
    rule: "Phải giảm tốc và nhường đường cho xe ưu tiên.",
  },
  {
    id: 10,
    name: "Biển báo giao thông",
    rule: "Chú ý tuân thủ hiệu lệnh giao thông tại khu vực này.",
  },
  {
    id: 11,
    name: "Biển báo giao thông",
    rule: "Chú ý tuân thủ hiệu lệnh giao thông tại khu vực này.",
  },
  {
    id: 12,
    name: "Biển báo giao thông",
    rule: "Chú ý tuân thủ hiệu lệnh giao thông tại khu vực này.",
  },
  {
    id: 13,
    name: "Biển báo giao thông",
    rule: "Chú ý tuân thủ hiệu lệnh giao thông tại khu vực này.",
  },
];
