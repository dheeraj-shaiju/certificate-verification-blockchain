// Modal content for the admin "View" action: the PDF, all details and the QR code.
import Modal from './Modal';
import PdfPreview from './PdfPreview';
import CertificateDetails from './CertificateDetails';
import QRCodeBlock from './QRCodeBlock';

export default function CertificateViewer({ record, onClose }) {
  return (
    <Modal title={`Certificate · ${record.studentName}`} onClose={onClose} size="large">
      <div className="viewer-layout">
        <PdfPreview record={record} />
        <aside className="viewer-side">
          <QRCodeBlock record={record} size={150} />
          <CertificateDetails record={record} />
        </aside>
      </div>
    </Modal>
  );
}
