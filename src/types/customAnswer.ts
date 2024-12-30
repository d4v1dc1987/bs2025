export interface CustomAnswer {
  value: string;
  customValue?: string;
}

export const isCustomAnswer = (value: unknown): value is CustomAnswer => {
  return typeof value === 'object' && value !== null && 'value' in value;
};