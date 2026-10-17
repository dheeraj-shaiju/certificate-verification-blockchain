/**
 * Draws a certificate's QR code with the "qrcode.react" library
 * and lets the user download it as a PNG image.
 */
import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import { buildQrPayload } from '../utils/qrPayload';
import { downloadUrl } from '../utils/fileHelpers';

// canvasRef is optional: pass one in if a parent needs the canvas (e.g. its own download button).
export default function QRCodeBlock({ record, size = 168, showDownload = true, canvasRef }) {
  const ownRef = useRef(null);
  const ref = canvasRef || ownRef;

  function handleDownload() {
    const canvas = ref.current;
    if (!canvas) return;
    downloadUrl(canvas.toDataURL('image/png'), `QR_${record.certificateId}.png`);
  }

  return (
    <div className="qr-block">
      <div className="qr-frame">
        {/* Drawn at 512px for a sharp download, shown smaller on screen. */}
        <QRCodeCanvas
          ref={ref}
          value={buildQrPayload(record)}
          size={512}
          level="M"
          marginSize={2}
          bgColor="#ffffff"
          fgColor="#0a1030"
          style={{ width: size, height: size }}
          title={`QR code for ${record.certificateId}`}
          role="img"
          aria-label={`QR code for certificate ${record.certificateId}`}
        />
      </div>
      {showDownload && (
        <button type="button" className="btn btn-small btn-secondary" onClick={handleDownload}>
          <Download size={15} aria-hidden="true" />
          Download QR
        </button>
      )}
    </div>
  );
}
