export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-emerald-800 text-white hover:bg-emerald-900 focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2',
    secondary: 'border-2 border-amber-600 text-amber-600 hover:bg-amber-50 focus:ring-2 focus:ring-amber-600 focus:ring-offset-2',
    text: 'text-sky-600 hover:text-sky-700 underline-offset-2 hover:underline',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}