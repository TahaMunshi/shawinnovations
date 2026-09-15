import { useState, type FormEvent, type ReactNode } from "react";
import {
  Camera,
  Hash,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  PhoneOff,
  Search,
  Settings,
  ShieldCheck,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./auth";
import { fixedGroups, type CollaborationGroup, type Persona } from "./data";
import { useWorkspace } from "./workspace";

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("");
}

function roleLabel(role: Persona["role"]) {
  return role === "admin" ? "Platform admin" : role.charAt(0).toUpperCase() + role.slice(1);
}

function Avatar({ member, small = false }: { member?: Persona; small?: boolean }) {
  if (!member) return null;
  return member.headshot
    ? <img className={`workspace-avatar photo ${small ? "small" : ""}`} src={member.headshot} alt="" />
    : <span className={`workspace-avatar ${small ? "small" : ""}`} aria-hidden="true">{initials(member.name)}</span>;
}

function WorkspaceNavigation({
  activeGroupId,
  activeDirectId,
  mobileOpen,
  closeMobile,
}: {
  activeGroupId?: string;
  activeDirectId?: string;
  mobileOpen: boolean;
  closeMobile: () => void;
}) {
  const { session, logout } = useAuth();
  const { members, requests } = useWorkspace();
  const navigate = useNavigate();
  const currentMember = members.find((member) => member.id === session?.userId);
  const visibleGroups = fixedGroups.filter((group) => currentMember?.groupIds.includes(group.id));
  const directMembers = members.filter((member) => member.role !== "admin");

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <aside className="space-rail" aria-label="Assigned groups">
        <Link className="space-logo" to="/" aria-label="Shaw Innovations home"><img src="/brand/logo-mark.png" alt="" /></Link>
        <span className="rail-rule" />
        {visibleGroups.map((group) => (
          <Link key={group.id} to={`/app/group/${group.id}`} aria-label={group.name} title={group.name}>
            <span className={`space-mark ${activeGroupId === group.id ? "active" : ""}`}>{group.shortName}</span>
          </Link>
        ))}
      </aside>

      <nav className={`channel-sidebar ${mobileOpen ? "mobile-open" : ""}`} aria-label="Workspace navigation">
        <div className="channel-brand">
          <div><strong>Shaw Innovations</strong><small>Medical device collaboration</small></div>
          <button className="sidebar-close" onClick={closeMobile} aria-label="Close workspace navigation"><X /></button>
        </div>
        <div className="sidebar-scroll">
          <SidebarSection title="Your groups">
            {visibleGroups.map((group) => (
              <Link className={activeGroupId === group.id ? "active" : ""} key={group.id} to={`/app/group/${group.id}`} onClick={closeMobile}>
                <Hash />{group.name}
              </Link>
            ))}
          </SidebarSection>

          {session?.role === "admin" && (
            <>
              <SidebarSection title="Direct messages">
                {directMembers.map((member) => (
                  <Link className={activeDirectId === member.id ? "active" : ""} key={member.id} to={`/app/direct/${member.id}`} onClick={closeMobile}>
                    <Avatar member={member} small />{member.name}
                  </Link>
                ))}
              </SidebarSection>
              <div className="sidebar-tools">
                <Link to="/admin" onClick={closeMobile}>
                  <Settings /> Administration
                  {requests.some((request) => request.status === "pending") && <b>{requests.filter((request) => request.status === "pending").length}</b>}
                </Link>
              </div>
            </>
          )}
          {session?.role !== "admin" && currentMember && (
            <SidebarSection title="Direct messages">
              <Link className={activeDirectId === currentMember.id ? "active" : ""} to={`/app/direct/${currentMember.id}`} onClick={closeMobile}>
                <MessageCircle /> Platform admin
              </Link>
            </SidebarSection>
          )}
        </div>
        <div className="current-user">
          <Avatar member={currentMember} small />
          <div><strong>{session?.username}</strong><small>{session ? roleLabel(session.role) : ""}</small></div>
          <button onClick={signOut} aria-label="Log out"><LogOut /></button>
        </div>
      </nav>
    </>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="sidebar-section"><header><span>{title}</span></header><div>{children}</div></section>;
}

function WorkspaceFrame({
  children,
  activeGroupId,
  activeDirectId,
}: {
  children: ReactNode;
  activeGroupId?: string;
  activeDirectId?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="workspace-shell fixed-group-shell">
      <WorkspaceNavigation
        activeGroupId={activeGroupId}
        activeDirectId={activeDirectId}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />
      <button className="workspace-menu" onClick={() => setMobileOpen(true)} aria-label="Open workspace navigation"><Menu /></button>
      {mobileOpen && <button className="sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="Close workspace navigation" />}
      {children}
    </div>
  );
}

export function WorkspaceHome() {
  const { session } = useAuth();
  const { members } = useWorkspace();
  const member = members.find((item) => item.id === session?.userId);
  const firstGroup = fixedGroups.find((group) => member?.groupIds.includes(group.id));
  if (firstGroup) return <Navigate to={`/app/group/${firstGroup.id}`} replace />;
  return (
    <WorkspaceFrame>
      <main className="workspace-page centered">
        <span className="page-icon"><ShieldCheck /></span>
        <h1>No group has been assigned yet.</h1>
        <p>An administrator must approve your access and add you to one of the six collaboration groups.</p>
      </main>
    </WorkspaceFrame>
  );
}

export function GroupChatPage() {
  const { groupId } = useParams();
  const { session } = useAuth();
  const { members, messages, calls, sendMessage, startCall, joinCall, endCall } = useWorkspace();
  const [draft, setDraft] = useState("");
  const group = fixedGroups.find((item) => item.id === groupId);
  const currentMember = members.find((member) => member.id === session?.userId);
  const allowed = group && currentMember?.groupIds.includes(group.id);
  const groupMembers = members.filter((member) => group && member.groupIds.includes(group.id));
  const groupMessages = messages.filter((message) => message.channelId === group?.channelId);
  const call = calls.find((item) => item.groupId === group?.id);

  if (!group) return <Navigate to="/app" replace />;
  if (!allowed) return <AccessDenied />;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    sendMessage(group.channelId, session.userId, draft);
    setDraft("");
  };

  return (
    <WorkspaceFrame activeGroupId={group.id}>
      <main className="chat-panel fixed-chat-panel">
        <header className="chat-header">
          <div><Hash /><span><strong>{group.name}</strong><small>{group.description}</small></span></div>
          {session?.role === "admin" && !call && <button className="call-start" onClick={() => startCall(group.id, session.userId)}><Video /> Start group call</button>}
        </header>

        <section className="message-list" aria-label={`${group.name} messages`} aria-live="polite">
          <GroupCallPanel group={group} call={call} currentMember={currentMember} members={members} onJoin={joinCall} onEnd={endCall} />
          <div className="channel-intro">
            <span><Hash /></span>
            <h1>{group.name}</h1>
            <p>{group.description} Only members assigned by an administrator can view and participate.</p>
          </div>
          {groupMessages.map((message) => {
            const author = members.find((member) => member.id === message.authorId);
            return <MessageRow key={message.id} author={author} body={message.body} createdAt={message.createdAt} />;
          })}
        </section>

        <form className="message-composer" onSubmit={submit}>
          <MessageCircle aria-hidden="true" />
          <label className="sr-only" htmlFor="group-message">Message {group.name}</label>
          <input id="group-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${group.name}`} />
          <button type="submit" disabled={!draft.trim()}>Send</button>
        </form>
      </main>
      <MembersPanel group={group} members={groupMembers} />
    </WorkspaceFrame>
  );
}

function GroupCallPanel({
  group,
  call,
  currentMember,
  members,
  onJoin,
  onEnd,
}: {
  group: CollaborationGroup;
  call?: ReturnType<typeof useWorkspace>["calls"][number];
  currentMember?: Persona;
  members: Persona[];
  onJoin: (groupId: string, memberId: string) => void;
  onEnd: (groupId: string) => void;
}) {
  if (!call || !currentMember) return null;
  const joined = call.participantIds.includes(currentMember.id);
  return (
    <section className={`group-call ${joined ? "joined" : ""}`} aria-label="Active group call">
      <div className="call-heading">
        <span><Camera /></span>
        <div><strong>{group.name} call is live</strong><small>Private dummy call · available only inside this group</small></div>
        {!joined && <button onClick={() => onJoin(group.id, currentMember.id)}>Join call</button>}
        {joined && currentMember.role === "admin" && <button className="end" onClick={() => onEnd(group.id)}><PhoneOff /> End call</button>}
      </div>
      {joined && (
        <div className="call-stage">
          {call.participantIds.map((id) => {
            const participant = members.find((member) => member.id === id);
            return <div key={id}><Avatar member={participant} /><strong>{participant?.name}</strong><span><Camera /> Connected</span></div>;
          })}
        </div>
      )}
    </section>
  );
}

function MessageRow({ author, body, createdAt }: { author?: Persona; body: string; createdAt: string }) {
  return (
    <article className="message">
      <Avatar member={author} />
      <div>
        <header><strong>{author?.name ?? "Platform member"}</strong>{author && <span>{roleLabel(author.role)}</span>}<time>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(createdAt))}</time></header>
        <p>{body}</p>
      </div>
    </article>
  );
}

function MembersPanel({ group, members }: { group: CollaborationGroup; members: Persona[] }) {
  return (
    <aside className="members-panel fixed-members-panel" aria-label={`${group.name} members`}>
      <header><span>Group members</span><b>{members.length}</b></header>
      <p className="member-access-note">Only these assigned members can access this chat.</p>
      <div className="members-list">
        {members.map((member) => (
          <div className="member-row" key={member.id}><Avatar member={member} small /><span><strong>{member.name}</strong><small>{roleLabel(member.role)}</small></span></div>
        ))}
      </div>
    </aside>
  );
}

export function DirectMessagePage() {
  const { memberId } = useParams();
  const { session } = useAuth();
  const { members, messages, sendMessage } = useWorkspace();
  const [draft, setDraft] = useState("");
  const target = members.find((member) => member.id === memberId && member.role !== "admin");
  const admin = members.find((member) => member.id === session?.userId);
  const channelId = `direct-${target?.id}`;

  if (!session) return <Navigate to="/login" replace />;
  const canAccess = session?.role === "admin" || session?.userId === target?.id;
  if (!canAccess) return <Navigate to="/app" replace />;
  if (!target) return <Navigate to="/app" replace />;
  const directMessages = messages.filter((message) => message.channelId === channelId);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(channelId, session.userId, draft);
    setDraft("");
  };

  return (
    <WorkspaceFrame activeDirectId={target.id}>
      <main className="chat-panel direct-chat-panel">
        <header className="chat-header"><div><Avatar member={target} small /><span><strong>{target.name}</strong><small>Private admin direct message · {target.title}</small></span></div><span className="prototype-badge">Private message</span></header>
        <section className="message-list" aria-label={`Direct messages with ${target.name}`}>
          <div className="channel-intro"><Avatar member={target} /><h1>{target.name}</h1><p>This private conversation is available only to the platform admin and {target.name}.</p></div>
          {!directMessages.length && <p className="empty-conversation">No direct messages yet. Start the conversation below.</p>}
          {directMessages.map((message) => <MessageRow key={message.id} author={message.authorId === admin?.id ? admin : target} body={message.body} createdAt={message.createdAt} />)}
        </section>
        <form className="message-composer" onSubmit={submit}>
          <Mail />
          <label className="sr-only" htmlFor="direct-message">Message {target.name}</label>
          <input id="direct-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${target.name}`} />
          <button type="submit" disabled={!draft.trim()}>Send</button>
        </form>
      </main>
    </WorkspaceFrame>
  );
}

function AccessDenied() {
  return (
    <WorkspaceFrame>
      <main className="workspace-page centered">
        <span className="page-icon"><ShieldCheck /></span>
        <h1>This group isn’t assigned to you.</h1>
        <p>Members can only view and talk in groups assigned by an administrator.</p>
        <Link className="workspace-button" to="/app">Return to your groups</Link>
      </main>
    </WorkspaceFrame>
  );
}

export function AdminPage() {
  const {
    members,
    requests,
    approveRequest,
    addMemberToGroup,
    removeMemberFromGroup,
    resetWorkspace,
  } = useWorkspace();
  const [query, setQuery] = useState("");
  const pending = requests.filter((request) => request.status === "pending");
  const visibleMembers = members.filter((member) => `${member.name} ${member.email} ${member.title}`.toLowerCase().includes(query.toLowerCase()));

  const approve = (event: FormEvent<HTMLFormElement>, requestId: string) => {
    event.preventDefault();
    const groupId = String(new FormData(event.currentTarget).get("group"));
    approveRequest(requestId, groupId);
  };

  const invite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const groupId = String(data.get("group") ?? "");
    const group = fixedGroups.find((item) => item.id === groupId);
    const subject = encodeURIComponent(`Invitation to ${group?.name ?? "Shaw Innovations"}`);
    const body = encodeURIComponent(`You’re invited to apply for access to the ${group?.name ?? ""} group at Shaw Innovations.\n\nOpen the collaboration preview and complete the onboarding form.`);
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
  };

  return (
    <WorkspaceFrame>
      <main className="workspace-page admin-workspace">
        <header className="workspace-page-heading">
          <div><span>Platform administration</span><h1>Members and group access.</h1><p>Approve onboarding requests, assign members to one of six fixed groups, and prepare email invitations.</p></div>
          <Link className="workspace-button secondary" to="/app"><Hash /> Open groups</Link>
        </header>

        <section className="admin-summary">
          <article><strong>6</strong><span>Fixed groups</span></article>
          <article><strong>{members.length}</strong><span>Approved members</span></article>
          <article><strong>{pending.length}</strong><span>Pending approvals</span></article>
        </section>

        <div className="admin-columns">
          <section className="admin-panel">
            <header><div><UserPlus /><span><h2>Pending onboarding</h2><p>Approve each person and choose their initial group.</p></span></div><b>{pending.length}</b></header>
            {!pending.length && <p className="admin-empty">No pending onboarding requests.</p>}
            {pending.map((request) => (
              <article className="approval-card" key={request.id}>
                <div><span>{roleLabel(request.role)}</span><h3>{request.name}</h3><p>{request.title} · {request.organization}<br />{request.email}</p><small>{request.note}</small></div>
                <form onSubmit={(event) => approve(event, request.id)}>
                  <label>Assign group<select name="group">{fixedGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>
                  <button className="workspace-button" type="submit">Approve and add</button>
                </form>
              </article>
            ))}
          </section>

          <form className="admin-panel invite-panel" onSubmit={invite}>
            <header><div><Mail /><span><h2>Email invitation</h2><p>Open your email app with a prepared group invitation.</p></span></div></header>
            <label>Email address<input name="email" type="email" required placeholder="new.member@example.com" /></label>
            <label>Suggested group<select name="group">{fixedGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>
            <button className="workspace-button" type="submit"><Mail /> Prepare email invite</button>
          </form>
        </div>

        <section className="admin-panel member-management">
          <header><div><Users /><span><h2>Approved members</h2><p>Add or remove group access. The admin remains in every group.</p></span></div></header>
          <label className="directory-search"><Search /><span className="sr-only">Search approved members</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search members" /></label>
          <div className="member-admin-list">
            {visibleMembers.map((member) => (
              <article key={member.id}>
                <div className="member-admin-profile"><Avatar member={member} /><span><strong>{member.name}</strong><small>{member.email}<br />{roleLabel(member.role)} · {member.title}</small></span></div>
                <div className="group-access-list">
                  {fixedGroups.map((group) => {
                    const assigned = member.groupIds.includes(group.id);
                    return (
                      <button
                        type="button"
                        key={group.id}
                        className={assigned ? "assigned" : ""}
                        disabled={member.role === "admin"}
                        onClick={() => assigned ? removeMemberFromGroup(member.id, group.id) : addMemberToGroup(member.id, group.id)}
                      >
                        {assigned ? "✓ " : "+ "}{group.name}
                      </button>
                    );
                  })}
                </div>
                {member.role !== "admin" && <Link className="dm-link" to={`/app/direct/${member.id}`}><MessageCircle /> Direct message</Link>}
              </article>
            ))}
          </div>
        </section>
        <button className="reset-link" type="button" onClick={resetWorkspace}>Reset all local demo data</button>
      </main>
    </WorkspaceFrame>
  );
}
