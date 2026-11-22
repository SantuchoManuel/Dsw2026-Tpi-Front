function Input({ label, error = '', icon, className = '', ...restProps }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-med-text-main">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-med-text-muted">
            {icon}
          </span>
        )}
        <input
          className={`w-full border rounded-lg ${icon ? 'pl-9 pr-3.5' : 'px-3.5'} py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent ${
            error ? 'border-red-400 bg-red-50/20' : 'border-med-border'
          } ${className}`}
          {...restProps}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export default Input;