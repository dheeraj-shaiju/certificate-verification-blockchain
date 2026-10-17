import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  const showToast = useToast();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast(
        'Copying is blocked in this browser. Select the text and copy it manually.',
        'error',
      );
    }
  }

  return (
    <button
      type="button"
      className="icon-btn icon-btn-small"
      onClick={handleCopy}
      aria-label={label}
      title={label}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}
