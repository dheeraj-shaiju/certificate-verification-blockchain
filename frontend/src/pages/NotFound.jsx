import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      title="This page does not exist"
      message="The link may be mistyped. Go back to the start page."
    >
      <Link to="/" className="btn btn-primary">
        Go to the start page
      </Link>
    </EmptyState>
  );
}
