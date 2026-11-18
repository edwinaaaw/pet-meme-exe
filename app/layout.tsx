import './globals.css';
import { TemplateTools } from '@/components/template-tools';
export const metadata = {
  title: '宠物变身.exe · 效果展示',
  description: '选择你的英雄，看看它最适合演什么。',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <TemplateTools />
      </body>
    </html>
  );
}
