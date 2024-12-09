export interface DialogConfig {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  imagePath?: string;
  confirmText?: string;
  cancelText?: string;
}
