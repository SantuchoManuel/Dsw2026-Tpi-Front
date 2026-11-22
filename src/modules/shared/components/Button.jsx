function Button({
  children,
  type = 'button',
  variant = 'default',
  className = '',
  ...restProps
}) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  const variantStyle = {
    default:
      'bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition',
    secondary:
      'border border-med-primary-900 text-med-primary-900 bg-white hover:bg-med-primary-50 font-medium px-4 py-2 rounded-lg transition',
    outline:
      'border border-med-border text-med-text-main bg-white hover:bg-gray-50 font-medium px-4 py-2 rounded-lg transition',
    ghost:
      'text-med-text-sub hover:bg-med-primary-50 hover:text-med-primary-900 font-medium px-3 py-2 rounded-lg transition',
    danger:
      'bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition',
    icon: 
      'p-1.5 rounded-lg text-med-primary-600 hover:bg-med-primary-50 hover:text-med-primary-900 transition cursor-pointer',
    iconDanger:
      'p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer',
    link:
      'text-xs font-semibold text-med-primary-700 hover:text-med-primary-900 hover:underline transition cursor-pointer',
  };

  const appliedClass =
    `${variantStyle[variant] || variantStyle.default} ${className}`.trim();

  return (
    <button {...restProps} className={appliedClass} type={type}>
      {children}
    </button>
  );
}

export default Button;
