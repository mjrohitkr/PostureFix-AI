export function Tabs({ children }) {
  return <div>{children}</div>;
}

export function TabsList({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ children, className, ...props }) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

export function TabsContent({ children, className }) {
  return <div className={className}>{children}</div>;
}