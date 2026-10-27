// Values shared across the whole app.

// Colleges using the platform. Each has its own admin account (see services/auth.js).
// To add a college for the demo, add it here and give it an admin in DEMO_ADMINS.
export const INSTITUTIONS = [
  {
    id: 'gect',
    name: 'Government Engineering College, Thrissur',
    shortName: 'GEC Thrissur',
    university: 'APJ Abdul Kalam Technological University, Kerala',
  },
  {
    id: 'geck',
    name: 'Government Engineering College, Kozhikode',
    shortName: 'GEC Kozhikode',
    university: 'APJ Abdul Kalam Technological University, Kerala',
  },
];

export const DEFAULT_INSTITUTION_ID = 'gect';

export function getInstitution(id) {
  return INSTITUTIONS.find((inst) => inst.id === id) || INSTITUTIONS[0];
}

export const COURSES = [
  'B.Tech Computer Science & Engineering',
  'B.Tech Electronics & Communication Engineering',
  'B.Tech Electrical & Electronics Engineering',
  'B.Tech Mechanical Engineering',
  'B.Tech Civil Engineering',
  'B.Tech Chemical Engineering',
  'M.Tech Computer Science & Engineering',
  'Master of Computer Applications (MCA)',
];

export const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const MIN_GRADUATION_YEAR = 2000;
export const MAX_GRADUATION_YEAR = new Date().getFullYear() + 5;

// Where a certificate's PDF is kept.
export const PROTOTYPE_STATUS = 'Saved in this browser';
export const IPFS_STATUS = 'Stored on IPFS';
