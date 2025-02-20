interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-[#463C2D]/95 backdrop-blur border-b border-[#C0A172]">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-xl font-bold text-center text-[#E8D4B9]">{title}</h1>
      </div>
    </div>
  );
}