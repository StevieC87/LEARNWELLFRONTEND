import Skeleton from '@/components/ui/Skeleton.jsx';
export default function Loading() {
  return (
    <div className="loading-container">
      <Skeleton kind="block" height="48rem" />
    </div>
  );
}