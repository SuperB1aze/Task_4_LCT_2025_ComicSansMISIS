// Константы для системы управления инструментами

export const STANDARD_TOOLKIT = [
  { id: 1, name: "Отвертка «-»", serial_number: "SN001", category: "hand_tools" },
  { id: 2, name: "Отвертка «+»", serial_number: "SN002", category: "hand_tools" },
  { id: 3, name: "Отвертка на смещенный крест", serial_number: "SN003", category: "hand_tools" },
  { id: 4, name: "Коловорот", serial_number: "SN004", category: "hand_tools" },
  { id: 5, name: "Пассатижи контровочные", serial_number: "SN005", category: "hand_tools" },
  { id: 6, name: "Пассатижи", serial_number: "SN006", category: "hand_tools" },
  { id: 7, name: "Шэрница", serial_number: "SN007", category: "hand_tools" },
  { id: 8, name: "Разводной ключ", serial_number: "SN008", category: "hand_tools" },
  { id: 9, name: "Открывашка для банок с маслом", serial_number: "SN009", category: "hand_tools" },
  { id: 10, name: "Ключ рожковый/накидной 3⁄4", serial_number: "SN010", category: "hand_tools" },
  { id: 11, name: "Бокорезы", serial_number: "SN011", category: "hand_tools" }
];

export const TRANSACTION_TYPES = {
  ISSUANCE: 'issuance',
  RETURN: 'return'
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;
