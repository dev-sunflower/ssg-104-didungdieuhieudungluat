export type UserRole = 'user' | 'admin'

export interface LicenseType {
  id: string
  code: string // 'A1', 'B2', 'C', ...
  name: string
  description: string | null
  total_questions: number
  pass_score: number
  created_at: string
}

export interface QuestionOption {
  key: string   // 'A', 'B', 'C', 'D'
  text: string
}

export interface Question {
  id: string
  license_type_id: string
  question_number: number | null
  content: string
  image_url: string | null
  options: QuestionOption[]
  correct_answer: string // 'A' | 'B' | 'C' | 'D'
  explanation: string | null
  is_critical: boolean   // điểm liệt — auto-fail if wrong
  topic: string | null   // 'Biển báo', 'Tốc độ', ...
  created_at: string
  // Joined
  license_types?: LicenseType
}

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  question_id: string
  is_correct: boolean
  answered_at: string
  // Joined
  questions?: Question
}

export interface ExamSession {
  id: string
  user_id: string
  license_type_id: string
  score: number
  total_questions: number
  passed: boolean
  answers: Record<string, string> | null // { question_id: selected_answer }
  created_at: string
  // Joined
  license_types?: LicenseType
}

export interface GameSession {
  id: string
  player_name: string
  score: number
  questions_answered: number
  hearts_remaining: number
  created_at: string
}
