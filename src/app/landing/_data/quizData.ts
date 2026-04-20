export type QuizItem = {
  signId: number
  question: string
  answers: string[]
  correct: number
  explanation: string
}

export const QUIZ_DATA: QuizItem[] = [
  {
    signId: 1,
    question: 'Biển báo số 1 quy định tốc độ tối đa là bao nhiêu?',
    answers: ['30 km/h', '50 km/h', '70 km/h', '90 km/h'],
    correct: 1,
    explanation: 'Biển báo tốc độ tối đa 50 km/h — bạn không được đi nhanh hơn mức này trong khu vực đó.',
  },
  {
    signId: 2,
    question: 'Khi gặp biển "Cấm đi vào", tài xế phải làm gì?',
    answers: ['Giảm tốc độ', 'Dừng hẳn', 'Không được vào đường đó', 'Bấm còi rồi vào'],
    correct: 2,
    explanation: 'Biển cấm đi vào nghĩa là tuyệt đối không được đi vào con đường đó dù bất kỳ lý do gì.',
  },
  {
    signId: 3,
    question: 'Biển "STOP" yêu cầu tài xế phải?',
    answers: ['Giảm tốc rồi tiếp tục', 'Dừng hẳn trước vạch kẻ', 'Còi xe rồi qua', 'Nhường xe bên phải'],
    correct: 1,
    explanation: 'STOP là lệnh dừng bắt buộc — phải dừng hoàn toàn trước vạch, quan sát, rồi mới tiếp tục.',
  },
  {
    signId: 4,
    question: 'Biển nhường đường có hình dạng gì?',
    answers: ['Hình tròn đỏ', 'Hình vuông xanh', 'Tam giác ngược viền đỏ', 'Hình thoi vàng'],
    correct: 2,
    explanation: 'Biển nhường đường có hình tam giác ngược, viền đỏ — dễ nhận biết để giảm tốc nhường đường.',
  },
  {
    signId: 5,
    question: 'Trong đoạn đường có biển "Cấm vượt", hành vi nào sau đây bị cấm?',
    answers: ['Dừng đỗ xe', 'Quay đầu xe', 'Vượt xe phía trước', 'Đi chậm lại'],
    correct: 2,
    explanation: 'Biển cấm vượt nghĩa là không được vượt bất kỳ phương tiện nào đang đi cùng chiều.',
  },
  {
    signId: 6,
    question: 'Khi thấy biển "Người đi bộ qua đường", tài xế phải ưu tiên cho ai?',
    answers: ['Xe cứu thương', 'Người đi bộ', 'Xe tải nặng', 'Xe máy đến trước'],
    correct: 1,
    explanation: 'Tại vạch sang đường, người đi bộ có quyền ưu tiên — tài xế phải dừng hoặc giảm tốc nhường.',
  },
  {
    signId: 7,
    question: 'Biển "Cấm đỗ xe" khác biển "Cấm dừng xe" ở điểm nào?',
    answers: [
      'Cấm đỗ chỉ áp dụng ban đêm',
      'Cấm đỗ cho phép dừng tạm để đón trả khách',
      'Cấm đỗ cấm cả dừng lẫn đỗ',
      'Không có sự khác biệt',
    ],
    correct: 1,
    explanation: 'Cấm đỗ xe cho phép dừng tạm thời (đón/trả khách), nhưng cấm đậu lại lâu. Cấm dừng thì không được dừng gì cả.',
  },
  {
    signId: 8,
    question: 'Biển công trường yêu cầu tài xế?',
    answers: ['Tăng tốc qua nhanh', 'Bấm còi liên tục', 'Giảm tốc và chú ý', 'Dừng hẳn và chờ'],
    correct: 2,
    explanation: 'Khu vực công trường có công nhân và máy móc — phải giảm tốc độ và quan sát kỹ để đảm bảo an toàn.',
  },
]
