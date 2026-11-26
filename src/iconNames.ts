// Názvy ikon admin aplikácií – bez závislosti na Vue, aby ich mohla kontrolovať aj syntéza CDK v aquariu.
export const APP_ICON_NAMES = ['app', 'book', 'building', 'chart', 'graduation', 'template', 'music', 'school', 'shield', 'users'] as const
export type AppIconName = (typeof APP_ICON_NAMES)[number]
