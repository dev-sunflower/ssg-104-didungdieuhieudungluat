export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full overflow-y-auto flex flex-col gap-4 p-5 min-w-0">
      {children}
    </div>
  );
}
