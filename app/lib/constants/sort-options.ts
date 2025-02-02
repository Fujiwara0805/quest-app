export const SORT_OPTIONS = {
  nearDate: '開催日が近い順',
  highPrice: 'チケット代金が高い順',
  lowPrice: 'チケット代金が少ない順',
  lowTickets: 'チケット残りが少ない順',
  difficulty: '難易度順'
} as const;

export type SortType = keyof typeof SORT_OPTIONS;