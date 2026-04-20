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
    question: 'Biển tròn xanh có mũi tên xoay vòng này báo hiệu điều gì?',
    answers: ['Đường một chiều', 'Giao lộ vòng xuyến — phải đi theo chiều mũi tên', 'Được phép quay đầu xe', 'Khu vực cấm dừng'],
    correct: 1,
    explanation: 'Biển vòng xuyến (chỉ dẫn) yêu cầu xe phải đi theo chiều kim đồng hồ ngược lại theo mũi tên trong vòng xuyến.',
  },
  {
    signId: 2,
    question: 'Biển hình tròn đỏ rỗng (chỉ có viền) này có ý nghĩa gì?',
    answers: ['Hết mọi lệnh cấm', 'Cấm đi vào', 'Giới hạn tốc độ tối thiểu', 'Đường ưu tiên'],
    correct: 0,
    explanation: 'Biển hình tròn đỏ rỗng báo hiệu "Hết tất cả các lệnh cấm" — các hạn chế trước đó không còn hiệu lực từ điểm này.',
  },
  {
    signId: 3,
    question: 'Biển tam giác vàng có dấu chấm than (!!) cảnh báo điều gì?',
    answers: ['Cấm đỗ xe', 'Nguy hiểm tổng quát — cần chú ý đặc biệt', 'Khu vực trường học', 'Đường hẹp phía trước'],
    correct: 1,
    explanation: 'Biển tam giác vàng với dấu chấm than là cảnh báo nguy hiểm tổng quát — tài xế phải giảm tốc và quan sát kỹ phía trước.',
  },
  {
    signId: 4,
    question: 'Biển xanh chữ nhật hình đường hai làn xe này có nghĩa là gì?',
    answers: ['Đường nông thôn', 'Bắt đầu đường cao tốc', 'Khu vực đỗ xe', 'Đường cấm xe máy'],
    correct: 1,
    explanation: 'Biển chỉ dẫn đường cao tốc — từ điểm này áp dụng các quy tắc riêng của đường cao tốc (tốc độ tối thiểu, cấm xe thô sơ...).',
  },
  {
    signId: 5,
    question: 'Biển xanh hình vuông có người đi bộ trên vạch kẻ nghĩa là gì?',
    answers: ['Cấm người đi bộ qua đường', 'Nơi người đi bộ được phép qua đường', 'Khu vực trường học', 'Đường dành riêng cho người đi bộ'],
    correct: 1,
    explanation: 'Biển chỉ dẫn nơi người đi bộ qua đường — tài xế phải nhường đường và sẵn sàng dừng lại cho người đi bộ.',
  },
  {
    signId: 6,
    question: 'Biển hình tròn đỏ có gạch trắng nằm ngang ở giữa nghĩa là gì?',
    answers: ['Hết tốc độ tối đa', 'Cấm đi vào', 'Dừng lại kiểm tra', 'Đường ưu tiên'],
    correct: 1,
    explanation: 'Biển "Cấm đi vào" — tuyệt đối không được đi vào đường này từ phía bạn đang đứng.',
  },
  {
    signId: 7,
    question: 'Biển tam giác ngược màu đỏ với lõi vàng yêu cầu tài xế làm gì?',
    answers: ['Dừng hẳn và chờ tín hiệu', 'Nhường đường cho xe đến từ hướng khác', 'Giảm tốc vì đường nguy hiểm', 'Cấm vượt xe'],
    correct: 1,
    explanation: 'Biển "Nhường đường" — phải giảm tốc hoặc dừng lại nhường cho xe đang có quyền ưu tiên đi trước.',
  },
  {
    signId: 8,
    question: 'Biển tròn đỏ nền xanh có dấu X đỏ cấm hành vi nào?',
    answers: ['Cấm vượt xe', 'Cấm đỗ xe', 'Cấm dừng và đỗ xe hoàn toàn', 'Cấm còi'],
    correct: 2,
    explanation: 'Biển "Cấm dừng và đỗ xe" — nghiêm cấm cả dừng lẫn đậu xe tại khu vực này, kể cả dừng tạm thời.',
  },
]
