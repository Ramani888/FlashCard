interface FontConfig {
  readonly regular: string;
  readonly medium: string;
  readonly semiBold: string;
  readonly bold: string;
}

const Font: FontConfig = {
  regular: 'Inter_24pt-Regular',
  medium: 'Inter_24pt-Medium',
  semiBold: 'Inter_24pt-SemiBold',
  bold: 'Inter_24pt-Bold',
} as const;

export default Font;
