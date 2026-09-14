import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  channels as seededChannels,
  seededMessages,
  seededTeams,
  type Channel,
  type Message,
  type ProjectTeam,
} from "./data";

const STORAGE_KEY = "shaw-community-workspace-v1";

type WorkspaceState = {
  channels: Channel[];
  teams: ProjectTeam[];
  messages: Message[];
};

type CreateTeamInput = {
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
};

type WorkspaceValue = WorkspaceState & {
  sendMessage: (channelId: string, authorId: string, body: string) => void;
  createTeam: (input: CreateTeamInput) => ProjectTeam;
  updateTeamMembers: (teamId: string, memberIds: string[]) => void;
  toggleTeamArchived: (teamId: string) => void;
  resetWorkspace: () => void;
};

const initialState = (): WorkspaceState => ({
  channels: seededChannels,
  teams: seededTeams,
  messages: seededMessages,
});

function readState(): WorkspaceState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialState();
    const parsed = JSON.parse(stored) as Partial<WorkspaceState>;
    if (!Array.isArray(parsed.channels) || !Array.isArray(parsed.teams) || !Array.isArray(parsed.messages)) {
      return initialState();
    }
    return parsed as WorkspaceState;
  } catch {
    return initialState();
  }
}

function uniqueId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "new-team";
}

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(readState);

  const commit = (updater: (current: WorkspaceState) => WorkspaceState) => {
    setState((current) => {
      const next = updater(current);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* The preview remains usable when browser storage is unavailable. */
      }
      return next;
    });
  };

  const value = useMemo<WorkspaceValue>(() => ({
    ...state,
    sendMessage(channelId, authorId, body) {
      const cleanBody = body.trim();
      if (!cleanBody) return;
      commit((current) => ({
        ...current,
        messages: [
          ...current.messages,
          {
            id: uniqueId("message"),
            channelId,
            authorId,
            body: cleanBody,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    createTeam(input) {
      const id = `${slugify(input.name)}-${Date.now()}`;
      const channelIds = [`${id}-general`, `${id}-clinical-design`];
      const team: ProjectTeam = {
        id,
        name: input.name.trim(),
        description: input.description.trim() || "A member-created cross-functional project team.",
        ownerId: input.ownerId,
        memberIds: [...new Set([input.ownerId, ...input.memberIds])],
        channelIds,
      };
      const nextChannels: Channel[] = [
        { id: channelIds[0], name: "general", description: `Team-wide discussion for ${team.name}.` },
        { id: channelIds[1], name: "clinical-design", description: "Clinical feedback and engineering decisions in one room." },
      ];
      commit((current) => ({
        ...current,
        teams: [...current.teams, team],
        channels: [...current.channels, ...nextChannels],
        messages: [
          ...current.messages,
          {
            id: uniqueId("message"),
            channelId: channelIds[0],
            authorId: input.ownerId,
            body: `Created ${team.name} and opened this space for cross-functional collaboration.`,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
      return team;
    },
    updateTeamMembers(teamId, memberIds) {
      commit((current) => ({
        ...current,
        teams: current.teams.map((team) => team.id === teamId
          ? { ...team, memberIds: [...new Set([team.ownerId, ...memberIds])] }
          : team),
      }));
    },
    toggleTeamArchived(teamId) {
      commit((current) => ({
        ...current,
        teams: current.teams.map((team) => team.id === teamId
          ? { ...team, archived: !team.archived }
          : team),
      }));
    },
    resetWorkspace() {
      const next = initialState();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* preview-only */
      }
      setState(next);
    },
  }), [state]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

// Context and provider stay together so the preview state has one public entry point.
// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return value;
}
