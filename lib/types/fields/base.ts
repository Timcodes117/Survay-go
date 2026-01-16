export interface BaseField {
  id: string;
  type: string;
  alias: string;
  order: number;
  title: string;
  description: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number | boolean | null;
  helpText?: string;
  visible?: boolean;
}


