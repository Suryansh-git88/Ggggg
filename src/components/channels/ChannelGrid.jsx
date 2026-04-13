import ChannelCard from './ChannelCard';
import EmptyState from '../common/EmptyState';

export default function ChannelGrid({ channels }) {
  if (!channels || channels.length === 0) return <EmptyState title="No channels" message="No channels found." icon="📺" />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 fade-in">
      {channels.map((ch) => <ChannelCard key={ch.link} channel={ch} />)}
    </div>
  );
}
