'use client';

import { usePathname, useRouter } from 'next/navigation';

import { CoralLogo, Text, Tooltip } from '@/components/Shared';
import { useChatRoutes } from '@/hooks/chatRoutes';
import { useConversations } from '@/hooks/conversation';
import { useFileActions } from '@/hooks/files';
import { useAgentsStore, useCitationsStore, useConversationStore, useParamsStore } from '@/stores';
import { cn } from '@/utils';
import { getCohereColor } from '@/utils/getCohereColor';

type Props = {
  name: string;
  isBaseAgent?: boolean;
  id?: string;
};

/**
 * @description This component renders an agent card.
 * It shows the agent's name and a colored icon with the first letter of the agent's name.
 * If the agent is a base agent, it shows the Coral logo instead.
 */
export const AgentCard: React.FC<Props> = ({ name, id, isBaseAgent }) => {
  const { conversationId } = useChatRoutes();
  const router = useRouter();
  const pathname = usePathname();
  const { data: conversations } = useConversations({ agentId: id });

  const isActive = isBaseAgent
    ? conversationId
      ? pathname === `/c/${conversationId}`
      : pathname === '/'
    : conversationId
    ? pathname === `/a/${id}/c/${conversationId}`
    : pathname === `/a/${id}`;

  const { setEditAgentPanelOpen } = useAgentsStore();
  const { resetConversation } = useConversationStore();
  const { resetCitations } = useCitationsStore();
  const { resetFileParams } = useParamsStore();
  const { clearComposerFiles } = useFileActions();

  const resetConversationSettings = () => {
    setEditAgentPanelOpen(false);
    clearComposerFiles();
    resetConversation();
    resetCitations();
    resetFileParams();
  };

  const handleClick = () => {
    if (isActive) return;

    const newestConversationId =
      conversations?.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))[0]?.id ??
      '';
    const conversationPath = newestConversationId ? `c/${newestConversationId}` : '';
    const url = isBaseAgent
      ? `/c/${newestConversationId}`
      : id
      ? `/a/${id}/${conversationPath}`
      : '/';
    router.push(url);

    resetConversationSettings();
  };

  return (
    <Tooltip label={name} placement="bottom" hover size="sm">
      <div
        onClick={handleClick}
        className={cn(
          'group flex w-full items-center justify-between gap-x-2 rounded-lg p-2 transition-colors hover:cursor-pointer hover:bg-mushroom-900/80 dark:hover:bg-volcanic-200',
          {
            'bg-mushroom-900/80 dark:bg-volcanic-200': isActive,
          }
        )}
      >
        <div
          className={cn(
            'flex size-8 flex-shrink-0 items-center justify-center rounded duration-300',
            getCohereColor(id, { background: true, contrastText: true })
          )}
        >
          {isBaseAgent && <CoralLogo />}
          {!isBaseAgent && (
            <Text className="uppercase" styleAs="p-lg">
              {name[0]}
            </Text>
          )}
        </div>
      </div>
    </Tooltip>
  );
};
