import { useState, type FormEvent, type ReactNode } from "react";
import {
  Archive,
  ChevronRight,
  Hash,
  LogOut,
  Menu,
  MessageSquarePlus,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./auth";
import { communities, getPersona, personas, type ProjectTeam } from "./data";
import { useWorkspace } from "./workspace";

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("");
}

function Avatar({ userId, small = false }: { userId: string; small?: boolean }) {
  const person = getPersona(userId);
  if (!person) return null;
  return person.headshot
    ? <img className={`workspace-avatar photo ${small ? "small" : ""}`} src={person.headshot} alt="" />
    : <span className={`workspace-avatar ${small ? "small" : ""}`} aria-hidden="true">{initials(person.name)}</span>;
}

function roleLabel(role: string) {
  return role === "admin" ? "Platform admin" : role.charAt(0).toUpperCase() + role.slice(1);
}

function SpaceMark({ label, active }: { label: string; active: boolean }) {
  return <span className={`space-mark ${active ? "active" : ""}`} aria-hidden="true">{label.slice(0, 2).toUpperCase()}</span>;
}

function WorkspaceNavigation({
  activeType,
  activeId,
  mobileOpen,
  closeMobile,
}: {
  activeType?: "community" | "team";
  activeId?: string;
  mobileOpen: boolean;
  closeMobile: () => void;
}) {
  const { session, logout } = useAuth();
  const { teams } = useWorkspace();
  const navigate = useNavigate();
  const visibleCommunities = communities.filter((community) =>
    session?.role === "admin" || community.roles.includes(session?.role ?? "advisor"));
  const visibleTeams = teams.filter((team) =>
    !team.archived && (session?.role === "admin" || team.memberIds.includes(session?.userId ?? "")));

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <aside className="space-rail" aria-label="Workspaces">
        <Link className="space-logo" to="/" aria-label="Shaw Innovations home">
          <img src="/brand/logo-mark.png" alt="" />
        </Link>
        <span className="rail-rule" />
        {visibleCommunities.map((community) => (
          <Link
            key={community.id}
            to={`/app/community/${community.id}/channel/${community.channelIds[0]}`}
            aria-label={community.name}
            title={community.name}
          >
            <SpaceMark label={community.name} active={activeType === "community" && activeId === community.id} />
          </Link>
        ))}
        <span className="rail-rule" />
        {visibleTeams.map((team) => (
          <Link
            key={team.id}
            to={`/app/team/${team.id}/channel/${team.channelIds[0]}`}
            aria-label={team.name}
            title={team.name}
          >
            <SpaceMark label={team.name} active={activeType === "team" && activeId === team.id} />
          </Link>
        ))}
        <Link className="rail-add" to="/app/new-team" aria-label="Create cross-functional team" title="Create team"><Plus /></Link>
      </aside>

      <nav className={`channel-sidebar ${mobileOpen ? "mobile-open" : ""}`} aria-label="Workspace navigation">
        <div className="channel-brand">
          <div><strong>Shaw Innovations</strong><small>Medical device collaboration</small></div>
          <button className="sidebar-close" onClick={closeMobile} aria-label="Close workspace navigation"><X /></button>
        </div>
        <div className="sidebar-scroll">
          <SidebarSection title="Communities">
            {visibleCommunities.map((community) => (
              <SpaceLink
                key={community.id}
                label={community.name}
                active={activeType === "community" && activeId === community.id}
                to={`/app/community/${community.id}/channel/${community.channelIds[0]}`}
                onClick={closeMobile}
              />
            ))}
          </SidebarSection>
          <SidebarSection title="My project teams" action={<Link to="/app/new-team" aria-label="Create team"><Plus /></Link>}>
            {visibleTeams.map((team) => (
              <SpaceLink
                key={team.id}
                label={team.name}
                active={activeType === "team" && activeId === team.id}
                to={`/app/team/${team.id}/channel/${team.channelIds[0]}`}
                onClick={closeMobile}
              />
            ))}
          </SidebarSection>
          <div className="sidebar-tools" aria-label="Workspace tools">
            <Link to="/app/directory" onClick={closeMobile}><Users /> Member directory</Link>
            {session?.role === "admin" && <Link to="/admin/teams" onClick={closeMobile}><Settings /> Team oversight</Link>}
          </div>
        </div>
        <div className="current-user">
          <Avatar userId={session?.userId ?? ""} small />
          <div><strong>{session?.username}</strong><small>{roleLabel(session?.role ?? "")}</small></div>
          <button onClick={signOut} aria-label="Log out"><LogOut /></button>
        </div>
      </nav>
    </>
  );
}

function SidebarSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="sidebar-section">
      <header><span>{title}</span>{action}</header>
      <div>{children}</div>
    </section>
  );
}

function SpaceLink({ label, active, to, onClick }: { label: string; active: boolean; to: string; onClick: () => void }) {
  return <Link className={active ? "active" : ""} to={to} onClick={onClick}><ChevronRight />{label}</Link>;
}

function WorkspaceFrame({
  children,
  activeType,
  activeId,
}: {
  children: ReactNode;
  activeType?: "community" | "team";
  activeId?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="workspace-shell">
      <WorkspaceNavigation
        activeType={activeType}
        activeId={activeId}
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
  const first = communities.find((community) =>
    session?.role === "admin" || community.roles.includes(session?.role ?? "advisor"));
  if (first) return <Navigate to={`/app/community/${first.id}/channel/${first.channelIds[0]}`} replace />;
  return <Navigate to="/app/directory" replace />;
}

export function ChatWorkspace({ type }: { type: "community" | "team" }) {
  const { spaceId, channelId } = useParams();
  const { session } = useAuth();
  const { channels, teams, messages, sendMessage, updateTeamMembers } = useWorkspace();
  const [draft, setDraft] = useState("");
  const community = type === "community" ? communities.find((item) => item.id === spaceId) : undefined;
  const team = type === "team" ? teams.find((item) => item.id === spaceId) : undefined;
  const space = community ?? team;
  const allowed = community
    ? session?.role === "admin" || community.roles.includes(session?.role ?? "advisor")
    : team && !team.archived && (session?.role === "admin" || team.memberIds.includes(session?.userId ?? ""));
  const activeChannel = channels.find((channel) => channel.id === channelId);
  const spaceChannels = channels.filter((channel) => space?.channelIds.includes(channel.id));
  const channelMessages = messages.filter((message) => message.channelId === channelId);
  const memberIds = team
    ? team.memberIds
    : personas.filter((person) => session?.role === "admin" || community?.roles.includes(person.role)).map((person) => person.id);

  if (!space || !activeChannel) return <Navigate to="/app" replace />;
  if (!allowed) return <AccessDenied />;

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    sendMessage(activeChannel.id, session.userId, draft);
    setDraft("");
  };

  return (
    <WorkspaceFrame activeType={type} activeId={space.id}>
      <aside className="room-sidebar">
        <div className="room-title">
          <span>{type === "community" ? "Community" : "Project team"}</span>
          <strong>{space.name}</strong>
          <p>{space.description}</p>
        </div>
        <nav aria-label={`${space.name} channels`}>
          <span className="channel-label">Text channels</span>
          {spaceChannels.map((channel) => (
            <Link
              className={channel.id === channelId ? "active" : ""}
              key={channel.id}
              to={`/app/${type}/${space.id}/channel/${channel.id}`}
            >
              <Hash />{channel.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <div><Hash /><span><strong>{activeChannel.name}</strong><small>{activeChannel.description}</small></span></div>
          <span className="prototype-badge">Browser-only prototype</span>
        </header>
        <section className="message-list" aria-label={`${activeChannel.name} messages`} aria-live="polite">
          <div className="channel-intro">
            <span><Hash /></span>
            <h1>Welcome to #{activeChannel.name}</h1>
            <p>{activeChannel.description}</p>
          </div>
          {channelMessages.map((message) => {
            const author = getPersona(message.authorId);
            return (
              <article className="message" key={message.id}>
                <Avatar userId={message.authorId} />
                <div>
                  <header><strong>{author?.name ?? "Platform member"}</strong><span>{roleLabel(author?.role ?? "")}</span><time>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(message.createdAt))}</time></header>
                  <p>{message.body}</p>
                </div>
              </article>
            );
          })}
        </section>
        <form className="message-composer" onSubmit={submitMessage}>
          <MessageSquarePlus aria-hidden="true" />
          <label className="sr-only" htmlFor="message-draft">Message #{activeChannel.name}</label>
          <input id="message-draft" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message #${activeChannel.name}`} />
          <button type="submit" disabled={!draft.trim()}>Send</button>
        </form>
      </main>

      <MembersPanel key={team?.id ?? community?.id} team={team} memberIds={memberIds} canManage={Boolean(team && (session?.role === "admin" || team.ownerId === session?.userId))} onSave={updateTeamMembers} />
    </WorkspaceFrame>
  );
}

function MembersPanel({
  team,
  memberIds,
  canManage,
  onSave,
}: {
  team?: ProjectTeam;
  memberIds: string[];
  canManage: boolean;
  onSave: (teamId: string, memberIds: string[]) => void;
}) {
  const [selection, setSelection] = useState(memberIds);

  const toggle = (id: string) => {
    setSelection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <aside className="members-panel" aria-label="Members">
      <header><span>Members</span><b>{memberIds.length}</b></header>
      <div className="members-list">
        {memberIds.map((id) => {
          const person = getPersona(id);
          return person ? <div className="member-row" key={id}><Avatar userId={id} small /><span><strong>{person.name}</strong><small>{roleLabel(person.role)}{team?.ownerId === id ? " · Owner" : ""}</small></span></div> : null;
        })}
      </div>
      {team && canManage && (
        <details className="roster-editor">
          <summary>Manage team roster</summary>
          <div>
            {personas.map((person) => (
              <label key={person.id}>
                <input type="checkbox" checked={selection.includes(person.id)} disabled={team.ownerId === person.id} onChange={() => toggle(person.id)} />
                <span>{person.name}<small>{roleLabel(person.role)}</small></span>
              </label>
            ))}
            <button className="workspace-button" type="button" onClick={() => onSave(team.id, selection)}>Save membership</button>
          </div>
        </details>
      )}
    </aside>
  );
}

function AccessDenied() {
  return (
    <WorkspaceFrame>
      <main className="workspace-page centered">
        <span className="page-icon"><Users /></span>
        <h1>This space isn’t assigned to you.</h1>
        <p>Choose one of your communities or project teams from the workspace navigation.</p>
        <Link className="workspace-button" to="/app">Return to your workspace</Link>
      </main>
    </WorkspaceFrame>
  );
}

export function DirectoryPage() {
  const [query, setQuery] = useState("");
  const filtered = personas.filter((person) =>
    `${person.name} ${person.title} ${person.organization} ${person.role}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <WorkspaceFrame>
      <main className="workspace-page">
        <header className="workspace-page-heading">
          <div><span>Platform directory</span><h1>Find a collaborator.</h1><p>Everyone available for advisor, engineering, research, and project teams.</p></div>
          <Link className="workspace-button" to="/app/new-team"><Plus /> Create a team</Link>
        </header>
        <label className="directory-search"><Search /><span className="sr-only">Search members</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, role, or organization" /></label>
        <div className="workspace-directory">
          {filtered.map((person) => <article key={person.id}><Avatar userId={person.id} /><div><span>{roleLabel(person.role)}</span><h2>{person.name}</h2><p>{person.title}<br />{person.organization}{person.certification ? ` · ${person.certification}` : ""}</p></div></article>)}
        </div>
      </main>
    </WorkspaceFrame>
  );
}

export function CreateTeamPage() {
  const { session } = useAuth();
  const { createTeam } = useWorkspace();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const candidates = personas.filter((person) => person.id !== session?.userId);

  const toggle = (id: string) => setSelected((current) =>
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("team-name") ?? "").trim();
    const description = String(form.get("team-description") ?? "").trim();
    if (!name) {
      setError("Give the project team a name.");
      return;
    }
    if (!selected.length) {
      setError("Select at least one other platform member.");
      return;
    }
    const team = createTeam({ name, description, ownerId: session.userId, memberIds: selected });
    navigate(`/app/team/${team.id}/channel/${team.channelIds[0]}`);
  };

  return (
    <WorkspaceFrame>
      <main className="workspace-page">
        <header className="workspace-page-heading compact">
          <div><span>Member-created workspace</span><h1>Create a cross-functional team.</h1><p>Bring advisors and engineers together around a focused sonography product initiative.</p></div>
        </header>
        <form className="team-builder" onSubmit={submit}>
          <section>
            <h2>Project details</h2>
            <label>Team name<input name="team-name" placeholder="e.g. Probe Ergonomics Review" /></label>
            <label>Purpose<textarea name="team-description" rows={4} placeholder="What will this team work on?" /></label>
            <div className="team-note"><strong>You’ll be the team owner.</strong><p>You can update membership later. Admins can oversee every team in this browser-only prototype.</p></div>
          </section>
          <section>
            <h2>Add platform members</h2>
            <p>Select any combination of advisors, engineers, faculty, and administrators.</p>
            <div className="member-picker">
              {candidates.map((person) => (
                <label key={person.id} className={selected.includes(person.id) ? "selected" : ""}>
                  <input type="checkbox" checked={selected.includes(person.id)} onChange={() => toggle(person.id)} />
                  <Avatar userId={person.id} small />
                  <span><strong>{person.name}</strong><small>{roleLabel(person.role)} · {person.title}</small></span>
                </label>
              ))}
            </div>
          </section>
          <footer>
            <p className="form-message error" role="alert">{error}</p>
            <Link className="workspace-button secondary" to="/app">Cancel</Link>
            <button className="workspace-button" type="submit">Create team</button>
          </footer>
        </form>
      </main>
    </WorkspaceFrame>
  );
}

export function AdminTeamsPage() {
  const { teams, toggleTeamArchived, resetWorkspace } = useWorkspace();
  return (
    <WorkspaceFrame>
      <main className="workspace-page">
        <header className="workspace-page-heading">
          <div><span>Admin oversight</span><h1>Cross-functional teams.</h1><p>Inspect and manage every seeded or member-created project team in this local prototype.</p></div>
          <Link className="workspace-button" to="/app/new-team"><Plus /> Create a team</Link>
        </header>
        <div className="oversight-list">
          {teams.map((team) => {
            const owner = getPersona(team.ownerId);
            return (
              <article key={team.id} className={team.archived ? "archived" : ""}>
                <div className="team-symbol">{team.name.slice(0, 2).toUpperCase()}</div>
                <div><span>{team.archived ? "Archived" : "Active project"}</span><h2>{team.name}</h2><p>{team.description}</p><small>Owner: {owner?.name} · {team.memberIds.length} members · {team.channelIds.length} channels</small></div>
                <div>
                  {!team.archived && <Link className="workspace-button secondary" to={`/app/team/${team.id}/channel/${team.channelIds[0]}`}>Open</Link>}
                  <button className="workspace-button ghost" type="button" onClick={() => toggleTeamArchived(team.id)}><Archive /> {team.archived ? "Restore" : "Archive"}</button>
                </div>
              </article>
            );
          })}
        </div>
        <button className="reset-link" type="button" onClick={resetWorkspace}>Reset all local demo data</button>
      </main>
    </WorkspaceFrame>
  );
}
