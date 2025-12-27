import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchAgentFeed } from '@/lib/api/agent';
import { AgentFeedItem } from '@/components/AgentFeedItem';

const AgentFeed = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  const { data: feed, isLoading } = useQuery({
    queryKey: ['agent-feed', id],
    queryFn: () => fetchAgentFeed(id as string),
    enabled: !!id && !!session,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!feed) {
    return <div>No feed data available.</div>;
  }

  return (
    <div>
      <h2>Agent Feed</h2>
      {feed.map((item) => (
        <AgentFeedItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default AgentFeed;