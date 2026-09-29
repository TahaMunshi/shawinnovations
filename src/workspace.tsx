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

const STORAGE_KEY = "shaw-community-tabs-v2";

type WorkspaceState = {
  members: Persona[];
  messages: Message[];
  requests: OnboardingRequest[];
  calls: GroupCall[];
};

type RequestInput = Omit<OnboardingRequest, "id" | "status" | "createdAt">;

type AddMemberInput = {
  name: string;
  email: string;
  title: string;
  organization: string;
  role: Persona["role"];
  groupId: string;
  ndaMethod: "esign" | "in-person";
  ndaSignature?: string;
  ndaSignerName?: string;
};

type WorkspaceValue = WorkspaceState & {
  sendMessage: (channelId: string, authorId: string, body: string) => void;
  submitRequest: (request: RequestInput) => void;
  approveRequest: (requestId: string, groupId: string) => Persona | null;
  addMember: (input: AddMemberInput) => Persona;
  addMemberToGroup: (memberId: string, groupId: string) => void;
  removeMemberFromGroup: (memberId: string, groupId: string) => void;
  suspendMember: (memberId: string) => void;
  reinstateMember: (memberId: string) => void;
  removeMember: (memberId: string) => void;
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
      preferredTabId: "engineering",
      ndaSignature: "Taylor Reed",
      ndaSignerName: "Taylor Reed",
      ndaSignedAt: "2026-09-15T14:40:00.000Z",
      status: "pending",
      createdAt: "2026-09-15T14:45:00.000Z",
    },
  ],
  calls: [],
});

function normalizeMember(member: Persona): Persona {
  return {
    ...member,
    status: member.status ?? "active",
    nda: member.nda === undefined ? null : member.nda,
    groupIds: Array.isArray(member.groupIds) ? member.groupIds : [],
  };
}

function readState(): WorkspaceState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialState();
    const parsed = JSON.parse(stored) as Partial<WorkspaceState>;
    if (!Array.isArray(parsed.members) || !Array.isArray(parsed.messages) || !Array.isArray(parsed.requests) || !Array.isArray(parsed.calls)) {
      return initialState();
    }
    return {
      members: parsed.members.map((member) => normalizeMember(member as Persona)),
      messages: parsed.messages,
      requests: parsed.requests as OnboardingRequest[],
      calls: parsed.calls,
    };
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
      const author = state.members.find((member) => member.id === authorId);
      if (author && author.status === "suspended") return;
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
        status: "active",
        nda: {
          method: "esign",
          signedAt: request.ndaSignedAt,
          signature: request.ndaSignature,
          signerName: request.ndaSignerName,
        },
      };
      commit((current) => ({
        ...current,
        members: [...current.members, member],
        requests: current.requests.map((item) => item.id === requestId ? { ...item, status: "approved" } : item),
      }));
      return member;
    },
    addMember(input) {
      const member: Persona = {
        id: uniqueId("member"),
        name: input.name,
        email: input.email,
        title: input.title,
        organization: input.organization,
        role: input.role,
        panels: [],
        groupIds: [input.groupId],
        status: "active",
        nda: {
          method: input.ndaMethod,
          signedAt: new Date().toISOString(),
          signature: input.ndaSignature,
          signerName: input.ndaSignerName ?? input.name,
        },
      };
      commit((current) => ({
        ...current,
        members: [...current.members, member],
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
    suspendMember(memberId) {
      commit((current) => ({
        ...current,
        members: current.members.map((member) =>
          member.id === memberId && member.role !== "admin"
            ? { ...member, status: "suspended" }
            : member),
      }));
    },
    reinstateMember(memberId) {
      commit((current) => ({
        ...current,
        members: current.members.map((member) =>
          member.id === memberId ? { ...member, status: "active" } : member),
      }));
    },
    removeMember(memberId) {
      commit((current) => ({
        ...current,
        members: current.members.filter((member) => member.id !== memberId || member.role === "admin"),
        messages: current.messages.filter((message) => {
          if (message.authorId === memberId) return false;
          if (message.channelId === `direct-${memberId}`) return false;
          return true;
        }),
        calls: current.calls.map((call) => ({
          ...call,
          participantIds: call.participantIds.filter((id) => id !== memberId),
        })),
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
          body: "Started a Zoom meeting for this community. Assigned members can join from the meeting panel above.",
          createdAt: now,
        }],
      }));
    },
    joinCall(groupId, memberId) {
      const member = state.members.find((item) => item.id === memberId);
      if (member?.status === "suspended") return;
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
