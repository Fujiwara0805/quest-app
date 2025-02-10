// 型定義が存在しない場合の対応として、モジュール宣言を行います。
declare module '@radix-ui/react-alert-dialog';
declare module '@radix-ui/react-aspect-ratio';
declare module '@radix-ui/react-avatar';
// react-day-picker の型定義が存在しない場合に備えて、モジュール宣言を追加
declare module 'react-day-picker';

// embla-carousel-react の型定義が存在しない場合に備えて、モジュール宣言を追加
declare module 'embla-carousel-react';

// 既存の宣言の下部に以下を追加
declare module 'cmdk';
declare module '@radix-ui/react-context-menu';
declare module 'vaul';
declare module 'input-otp';
declare module '@radix-ui/react-menubar';
declare module '@radix-ui/react-navigation-menu';
declare module '@radix-ui/react-popover';
declare module '@radix-ui/react-progress'; 