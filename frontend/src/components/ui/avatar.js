export function Avatar({ children, className }) {
  return <div className={className}>{children}</div>;
}
export function AvatarImage(props) {
  return <img {...props} />;
}
export function AvatarFallback({ children, className }) {
  return <div className={className}>{children}</div>;
}