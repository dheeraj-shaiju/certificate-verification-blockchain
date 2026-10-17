/**
 * A labelled input with an optional hint and error message.
 * Pass type="select" plus "options" to render a dropdown instead of a text box.
 */
export default function FormField({
  label,
  name,
  value,
  onChange,
  error,
  hint,
  type = 'text',
  options = [],
  placeholder,
  ...rest
}) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  const commonProps = {
    id: name,
    name,
    value,
    onChange,
    className: error ? 'input has-error' : 'input',
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    ...rest,
  };

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>

      {type === 'select' ? (
        <select {...commonProps}>
          <option value="">{placeholder || 'Select…'}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} {...commonProps} />
      )}

      {error ? (
        <p id={`${name}-error`} className="field-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${name}-hint`} className="field-hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
