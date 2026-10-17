/**
 * A dialog box shown on top of the page.
 * Closes with the X button, the Escape key, or a click on the dark background.
 */
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, size = 'medium' }) {
  const dialogRef = useRef(null);
  // Keep the latest onClose in a ref so the effect below runs only once per opening.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onCloseRef.current();
    }
    const previouslyFocused = document.activeElement;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // stop the page behind from scrolling
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`modal modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
