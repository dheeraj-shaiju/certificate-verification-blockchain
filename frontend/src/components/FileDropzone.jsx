/**
 * Lets the admin pick a PDF by clicking or by dragging a file onto the box.
 * The parent component decides whether the file is valid (see validation.js).
 */
import { useRef, useState } from 'react';
import { FileUp, FileText, X } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function FileDropzone({ file, onFileSelected, onClear, error }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleInputChange(event) {
    const selected = event.target.files?.[0];
    if (selected) onFileSelected(selected);
    event.target.value = ''; // lets the same file be chosen again later
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) onFileSelected(dropped);
  }

  const className = ['dropzone', isDragging && 'dragging', error && 'has-error']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="form-field">
      <span className="label-text" id="pdf-label">
        Certificate PDF
      </span>

      {file ? (
        <div className={`selected-file ${error ? 'has-error' : ''}`}>
          <FileText size={22} aria-hidden="true" />
          <div className="selected-file-info">
            <strong>{file.name}</strong>
            <span>{formatBytes(file.size)}</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClear} aria-label="Remove file">
            <X size={18} />
          </button>
        </div>
      ) : (
        <div
          className={className}
          role="button"
          tabIndex={0}
          aria-labelledby="pdf-label"
          aria-describedby={error ? 'pdf-error' : 'pdf-hint'}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <FileUp size={26} aria-hidden="true" />
          <p>
            <strong>Choose a PDF</strong> or drag it here
          </p>
          <p className="dropzone-note">PDF only, up to 5 MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleInputChange}
        hidden
      />

      {error ? (
        <p id="pdf-error" className="field-error">
          {error}
        </p>
      ) : (
        <p id="pdf-hint" className="field-hint">
          The signed degree certificate issued by the college.
        </p>
      )}
    </div>
  );
}
