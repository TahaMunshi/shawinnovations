import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  personas,
  seededGroupMessages,
  type GroupCall,
  type Message,
  type OnboardingRequest,
  type Persona,
} from "./data";

const STORAGE_KEY = "shaw-fixed-groups-v1";

type WorkspaceState = {
  members: Persona[];
  messages: Message[];
  requests: OnboardingRequest[];
  calls: GroupCall[];
};

type RequestInput = Omit<OnboardingRequest, "id" | "status" | "createdAt">;

type WorkspaceValue = WorkspaceState & {
  sendMessage: (channelId: string, authorId: string, body: string) => void;
  submitRequest: (request: RequestInput) => void;
  approveRequest: (requestId: string, groupId: string) => Persona | null;
  addMemberToGroup: (memberId: string, groupId: string) => void;
  removeMemberFromGroup: (memberId: string, groupId: string) => void;
  startCall: (groupId: string, adminId: string) => void;
  joinCall: (groupId: string, memberId: string) => void;
  endCall: (groupId: string) => void;
  resetWorkspace: () => void;
};

const initialState = (): WorkspaceState => ({
  members: personas,
  messages: seededGroupMessages,
  requests: [
    {
      id: "request-sample",
      name: "Taylor Reed",
      email: "taylor@example.test",
      title: "Biomedical engineer",
      organization: "Independent Product Lab",
      role: "engineer",
      note: "Interested in supporting prototype testing and design review.",
      status: "pending",
      createdAt: "2026-09-15T14:45:00.000Z",
    },
  ],
  calls: [],
});

function readState(): WorkspaceState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialState();
    const parsed = JSON.parse(stored) as Partial<WorkspaceState>;
    if (!Array.isArray(parsed.members) || !Array.isArray(parsed.messages) || !Array.isArray(parsed.requests) || !Array.isArray(parsed.calls)) {
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
        messages: [...current.messages, {
          id: uniqueId("message"),
          channelId,
          authorId,
          body: cleanBody,
          createdAt: new Date().toISOString(),
        }],
      }));
    },
    submitRequest(request) {
      commit((current) => ({
        ...current,
        requests: [...current.requests, {
          ...request,
          id: uniqueId("request"),
          status: "pending",
          createdAt: new Date().toISOString(),
        }],
      }));
    },
    approveRequest(requestId, groupId) {
      const request = state.requests.find((item) => item.id === requestId && item.status === "pending");
      if (!request) return null;
      const member: Persona = {
        id: uniqueId("member"),
        name: request.name,
        email: request.email,
        title: request.title,
        organization: request.organization,
        role: request.role,
        panels: [],
        groupIds: [groupId],
      };
      commit((current) => ({
        ...current,
        members: [...current.members, member],
        requests: current.requests.map((item) => item.id === requestId ? { ...item, status: "approved" } : item),
      }));
      return member;
    },
    addMemberToGroup(memberId, groupId) {
      commit((current) => ({
        ...current,
        members: current.members.map((member) => member.id === memberId
          ? { ...member, groupIds: [...new Set([...member.groupIds, groupId])] }
          : member),
      }));
    },
    removeMemberFromGroup(memberId, groupId) {
      commit((current) => ({
        ...current,
        members: current.members.map((member) =>
          member.id === memberId && member.role !== "admin"
            ? { ...member, groupIds: member.groupIds.filter((id) => id !== groupId) }
            : member),
      }));
    },
    startCall(groupId, adminId) {
      const now = new Date().toISOString();
      commit((current) => ({
        ...current,
        calls: [
          ...current.calls.filter((call) => call.groupId !== groupId),
          { groupId, startedBy: adminId, startedAt: now, participantIds: [adminId] },
        ],
        messages: [...current.messages, {
          id: uniqueId("call-message"),
          channelId: `group-${groupId}`,
          authorId: adminId,
          body: "Started a private group call. Assigned members can join from the call panel above.",
          createdAt: now,
        }],
      }));
    },
    joinCall(groupId, memberId) {
      commit((current) => ({
        ...current,
        calls: current.calls.map((call) => call.groupId === groupId
          ? { ...call, participantIds: [...new Set([...call.participantIds, memberId])] }
          : call),
      }));
    },
    endCall(groupId) {
      commit((current) => ({ ...current, calls: current.calls.filter((call) => call.groupId !== groupId) }));
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

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return value;
}
