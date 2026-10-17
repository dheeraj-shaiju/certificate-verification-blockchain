/**
 * Loads a certificate's PDF from browser storage and gives back a temporary URL
 * that an <iframe> or link can use. The URL is cleaned up automatically.
 *
 *   const { url, blob, isLoading, error } = usePdfUrl('CERT-2026-K7QM-4XPA');
 */
import { useEffect, useState } from 'react';
import { useCertificates } from '../context/CertificateContext';

export function usePdfUrl(certificateId) {
  const { getPdf } = useCertificates();
  const [state, setState] = useState({ url: null, blob: null, isLoading: true, error: '' });

  useEffect(() => {
    let isActive = true;
    let objectUrl = null;
    setState({ url: null, blob: null, isLoading: true, error: '' });

    getPdf(certificateId)
      .then((blob) => {
        if (!isActive) return;
        if (!blob) {
          setState({
            url: null,
            blob: null,
            isLoading: false,
            error: 'The PDF for this certificate is missing from this browser’s storage.',
          });
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setState({ url: objectUrl, blob, isLoading: false, error: '' });
      })
      .catch(() => {
        if (isActive) {
          setState({
            url: null,
            blob: null,
            isLoading: false,
            error: 'The PDF could not be loaded.',
          });
        }
      });

    return () => {
      isActive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [certificateId, getPdf]);

  return state;
}
