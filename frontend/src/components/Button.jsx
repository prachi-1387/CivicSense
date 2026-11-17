
function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) {
  const baseStyles =
    'rounded-lg px-5 py-2.5 font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary:
      'bg-emerald-500 text-slate-950 hover:bg-emerald-400',

    secondary:
      'border border-slate-300 text-slate-700 hover:bg-slate-100',

    danger:
      'bg-red-600 text-white hover:bg-red-500',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
