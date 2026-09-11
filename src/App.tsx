import {
  Component,
  useEffect,
  useState,
  type ErrorInfo,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  FileBox,
  Lightbulb,
  LogOut,
  Menu,
  ShieldCheck,
  Stethoscope,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ProtectedRoute, safeReturnTo, useAuth } from "./auth";
import { calendarEvents, getPanel, getPersona, meetings, panels, personas } from "./data";

const ease = [0.16, 1, 0.3, 1] as const;
const SPLASH_KEY = "shaw-splash-seen";

function Splash() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    if (reduce) return false;
    try {
      return sessionStorage.getItem(SPLASH_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const fade = window.setTimeout(() => setLeaving(true), 1800);
    const done = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SPLASH_KEY, "1");
      } catch {
        /* preview-only */
      }
      setVisible(false);
    }, 2300);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      className="splash"
      role="dialog"
      aria-label="Shaw Innovations"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.5, ease }}
    >
      <motion.div
        className="splash-card"
        initial={reduce ? false : { scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
      >
        <img src="/brand/logo-mark.png" alt="" />
      </motion.div>
      <motion.span
        className="splash-rule"
        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25, ease }}
      />
      <motion.p
        initial={reduce ? false : { y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35, ease }}
      >
        Medical device collaboration
      </motion.p>
    </motion.div>
  );
}

function PreviewBanner() {
  return (
    <div className="preview-banner" role="status">
      Public design preview · Browser-only sample session · No data is stored or submitted
    </div>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link className={`brand ${light ? "light" : ""}`} to="/" aria-label="Shaw Innovations home">
      <img src="/brand/logo-mark.png" alt="" />
      <span>
        <strong>Shaw Innovations</strong>
        <small>Medical Device Collaboration</small>
      </span>
    </Link>
  );
}

function Header({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.header
      className={`site-header ${compact ? "compact" : ""} ${overlay ? "overlay" : ""}`}
      initial={reduce ? false : { y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="header-inner">
        <Brand light={overlay && !compact} />
        <nav className="desktop-nav" aria-label="Primary">
          <Link to="/#who">Who it’s for</Link>
          <Link to="/#ecosystem">Ecosystem</Link>
          <Link to="/#how-it-works">How it works</Link>
          <Link to="/#security">Security</Link>
        </nav>
        <div className="header-actions">
          {session ? (
            <>
              <Link className="text-link" to="/admin">Admin preview</Link>
              <Link className="button small" to="/dashboard">Dashboard</Link>
              <button className="icon-button desktop-only" onClick={signOut} aria-label="Log out">
                <LogOut aria-hidden="true" />
              </button>
            </>
          ) : <Link className="button small" to="/login">Preview login</Link>}
          <button
            className="icon-button menu-button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile">
          <Link to="/#who">Who it’s for</Link>
          <Link to="/#ecosystem">Ecosystem</Link>
          <Link to="/#how-it-works">How it works</Link>
          <Link to="/#security">Security</Link>
          {session && <button onClick={signOut}>Log out of preview</button>}
        </nav>
      )}
    </motion.header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="page footer-grid">
        <div><Brand /><p>Exploring better ways to collaborate on medical device innovation.</p></div>
        <div><strong>Preview notice</strong><p>Privacy and permission controls shown here describe intended production behavior. This public SPA stores no project data.</p></div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Shaw Innovations · Design preview</div>
    </footer>
  );
}

function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => {
        const id = decodeURIComponent(location.hash.slice(1));
        document.getElementById(id)?.scrollIntoView();
      });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);
  return null;
}

function Layout({ children }: { children: ReactNode }) {
  const home = useLocation().pathname === "/";
  return (
    <div className={`app-shell ${home ? "home-shell" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {!home && <PreviewBanner />}
      <Header overlay={home} />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { y: 28, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function HomePage() {
  const reduce = useReducedMotion();
  const audiences = [
    [Stethoscope, "Clinical advisors", "Sample advisor hubs, credentials, and feedback channels."],
    [Users, "Hospital partners", "Prospective facility communities represented as static fixtures."],
    [Wrench, "Engineering teams", "CAD, prototype, and milestone concepts in one preview."],
    [ShieldCheck, "Governance partners", "A model for future permission-aware legal workflows."],
  ] as const;

  return (
    <>
      <section className="hero">
        <img className="hero-photo" src="/imagery/hero-lab.jpg" alt="" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-copy page">
          <p className="hero-pill">
            <span aria-hidden="true" />
            Now streamlining — Cross-disciplinary synergies
          </p>
          <h1>
            The exclusive collaboration
            <br />
            ecosystem for <em>leading innovators.</em>
          </h1>
          <p>
            An invitation-only preview of how sonographers, researchers, and
            engineering pioneers could coordinate on medical device breakthroughs.
          </p>
          <div className="button-row">
            <Link className="button" to="/login">Enter preview <ArrowRight aria-hidden="true" /></Link>
            <Link className="quiet-link" to="/#ecosystem">Explore ecosystem</Link>
          </div>
        </div>
        <a className="scroll-cue" href="#who">Scroll</a>
      </section>

      <section id="who" className="section page">
        <div className="split">
          <Reveal>
            <p className="eyebrow">Who it’s for</p>
            <h2>Every perspective in the device journey.</h2>
            <p className="lead">Clinicians, hospitals, engineers, and governance partners share one calm, invitation-only preview — the same people who would later shape a real device program.</p>
          </Reveal>
          <Reveal className="media-card">
            <img src="/imagery/clinic-sonography.jpg" alt="" />
            <span className="media-chip">Sonography advisors</span>
          </Reveal>
        </div>
        <div className="card-grid four">
          {audiences.map(([Icon, title, text], index) => (
            <Reveal key={title} delay={index * 0.09}>
              <motion.article className="card" whileHover={reduce ? undefined : { y: -6 }}>
                <span className="icon-well"><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="ecosystem" className="section mint">
        <div className="page">
          <Reveal>
            <p className="eyebrow">Ecosystem</p>
            <h2>Connected communities, designed with purpose.</h2>
            <p className="lead">The preview groups {panels.length} sample and reserved panels across clinical, hospital, engineering, partner, and governance communities.</p>
          </Reveal>
          <div className="bento">
            <Reveal className="media-card tall">
              <img src="/imagery/clinic-team.jpg" alt="" />
              <span className="media-chip">Hospital + clinical communities</span>
            </Reveal>
            <div className="bento-list">
              {[...new Set(panels.map(({ community }) => community))].map((community, index) => (
                <Reveal key={community} delay={(index % 3) * 0.08}>
                  <article className="card compact">
                    <span className="icon-well small"><FileBox aria-hidden="true" /></span>
                    <div>
                      <h3>{community}</h3>
                      <p>{panels.filter((panel) => panel.community === community).length} panel concepts</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section page">
        <div className="split">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2>A clear preview of the future collaboration flow.</h2>
            <p className="lead">
              Explore communities, enter a sample panel, review staged resources and
              milestones, then inspect the proposed directory and administration tools.
            </p>
          </Reveal>
          <Reveal className="media-card">
            <img src="/imagery/device-review.jpg" alt="" />
            <span className="media-chip">Shared design review</span>
          </Reveal>
        </div>
        <div className="card-grid four">
          {[
            ["01", "Discover", "Understand the people and communities involved."],
            ["02", "Enter a panel", "Preview resources, milestones, meetings, and minutes."],
            ["03", "Connect", "See how a cross-panel member directory could work."],
            ["04", "Coordinate", "Explore future administration and scheduling flows."],
          ].map(([number, title, text], index) => (
            <Reveal key={title} delay={index * 0.09}>
              <article className="card">
                <span className="step-orb">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="security" className="section">
        <div className="page">
          <Reveal className="cta-banner">
            <img src="/imagery/clinic-team.jpg" alt="" />
            <div className="cta-shade" aria-hidden="true" />
            <div className="cta-copy">
              <p className="eyebrow">Production intent</p>
              <h2>Security is a roadmap requirement—not a staging claim.</h2>
              <div className="notice">
                <ShieldCheck aria-hidden="true" />
                <p>A production service should enforce authentication, least-privilege authorization, auditability, and protected storage. This public build does none of those things; its login is only a browser-local staging gate.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function LoginPage() {
  const { session, login } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const destination = safeReturnTo(params.get("returnTo"));
  if (session) return <Navigate to={destination} replace />;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!username || !password) {
      setError("Enter any non-empty username and password.");
      return;
    }
    login(username);
    navigate(destination, { replace: true });
  };

  return (
    <section className="auth-page page">
      <div className="auth-visual media-card">
        <img src="/imagery/clinic-sonography.jpg" alt="" />
        <span className="media-chip">Design preview only</span>
      </div>
      <div className="auth-stack">
      <div className="auth-panel"><p className="eyebrow">Staging gate</p><h1>Explore the collaboration concept.</h1><p>This is not real authentication. Any non-empty credentials work; only the username is kept in session storage and the password is never stored.</p></div>
      <form className="form-card" onSubmit={submit} noValidate>
        <h2>Preview login</h2>
        <div className="field"><label htmlFor="username">Username</label><input id="username" name="username" autoComplete="username" required /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
        <p className="form-message error" role="alert" aria-live="polite">{error}</p>
        <button className="button" type="submit">Enter design preview</button>
      </form>
      </div>
    </section>
  );
}

function DashboardPage() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="section page">
      <PageHeading eyebrow="Member preview" title={`Welcome, ${session?.username}.`} text="All panels below are static examples. Visibility here does not represent real permissions." />
      <div className="stats"><Stat label="Panel concepts" value={panels.length} /><Stat label="Directory profiles" value={personas.length} /><Stat label="Calendar events" value={calendarEvents.length} /></div>
      <section><h2>Your preview panels</h2><div className="card-grid three">{panels.map((panel) => <Link className="card panel-card" key={panel.slug} to={`/sections/${panel.slug}`}><span>{panel.community}</span><h3>{panel.name}</h3><p>{panel.description}</p></Link>)}</div></section>
      <section className="section-tight">
        <h2>Upcoming calendar</h2>
        <div className="card-grid two">
          {calendarEvents.map((event) => (
            <article className="card" key={event.id}>
              <CalendarDays aria-hidden="true" />
              <span className="eyebrow">{event.kind}</span>
              <h3>{event.title}</h3>
              <p>{formatDate(event.date)}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-tight"><h2>Cross-panel directory</h2><div className="directory">{personas.map((person) => <article className="person" key={person.id}>{person.headshot ? <img className="avatar photo" src={person.headshot} alt="" /> : <div className="avatar" aria-hidden="true">{person.name.split(" ").map((part) => part[0]).slice(0, 2)}</div>}<div><h3>{person.name}</h3><p>{person.title} · {person.organization}{person.certification ? ` · ${person.certification}` : ""}</p></div></article>)}</div></section>
      <button className="button secondary" onClick={() => { logout(); navigate("/"); }}>Log out of preview</button>
    </div>
  );
}

function SectionPage() {
  const { slug } = useParams();
  const panel = getPanel(slug);
  if (!panel) return <NotFoundPage />;
  const panelMeetings = meetings.filter((meeting) => meeting.panel === panel.slug);
  return (
    <div className="section page">
      <Back to="/dashboard">Back to dashboard</Back>
      <PageHeading eyebrow={panel.community} title={panel.name} text={panel.description} />
      {panel.reserved && <div className="notice"><Lightbulb aria-hidden="true" /><p>This is an intentionally blank, reserved panel.</p></div>}
      <div className="card-grid two">
        <DataCard title="Resources">{panel.resources.length ? panel.resources.map((resource) => <Item key={resource.title} title={resource.title} meta={`${resource.kind} · ${resource.status}`} />) : <Empty />}</DataCard>
        <DataCard title="CAD & prototype-linked milestones">{panel.milestones.length ? panel.milestones.map((milestone) => <Item key={milestone.title} title={milestone.title} meta={`${milestone.date} · ${milestone.status}${milestone.linkedAsset ? ` · ${milestone.linkedAsset}` : ""}`} />) : <Empty />}</DataCard>
      </div>
      <DataCard title="Meetings, minutes & AI summaries">{panelMeetings.length ? panelMeetings.map((meeting) => <Item key={meeting.id} title={meeting.title} meta={`${formatDate(meeting.date)} · ${meeting.minutes} ${meeting.aiSummary}`} />) : <Empty />}</DataCard>
    </div>
  );
}

function AdminPage() {
  const [message, setMessage] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    setMessage("Preview complete. Nothing was saved and no invitation was sent.");
  };
  return (
    <div className="section page">
      <PageHeading eyebrow="Admin design preview" title="Platform control concept." text="This route is available to every staged session. It demonstrates proposed administration screens and provides no authorization or persistent controls." />
      <div className="stats"><Stat label="Sample profiles" value={personas.length} /><Stat label="Panel concepts" value={panels.length} /><Stat label="Sample meetings" value={meetings.length} /></div>
      <div className="admin-grid">
        <DataCard title="Directory & panel visibility">{personas.map((person) => <Link className="admin-row" key={person.id} to={`/admin/users/${person.id}`}><span><b>{person.name}</b><small>{person.title}</small></span><span>{person.panels.length} panels</span></Link>)}</DataCard>
        <form className="form-card" onSubmit={submit}>
          <h2>Try invite workflow</h2>
          <div className="field"><label htmlFor="invite-name">Name</label><input id="invite-name" required /></div>
          <div className="field"><label htmlFor="invite-email">Email</label><input id="invite-email" type="email" required /></div>
          <button className="button" type="submit">Preview invitation</button>
          <p className="form-message success" role="status" aria-live="polite">{message}</p>
        </form>
      </div>
      <Link className="button secondary" to="/admin/meetings"><CalendarDays aria-hidden="true" /> Meeting manager preview</Link>
    </div>
  );
}

function AdminUserPage() {
  const { id } = useParams();
  const person = getPersona(id);
  if (!person) return <NotFoundPage />;
  return (
    <div className="section page narrow"><Back to="/admin">Back to admin preview</Back><PageHeading eyebrow="Sample directory profile" title={person.name} text={`${person.title} · ${person.organization}${person.certification ? ` · ${person.certification}` : ""}`} />
      <DataCard title="Proposed panel visibility"><p className="muted">Display-only sample. No permission is granted or enforced.</p>{panels.map((panel) => <div className="admin-row" key={panel.slug}><span>{panel.name}</span><b>{person.panels.includes(panel.slug) ? "Shown in concept" : "Not shown"}</b></div>)}</DataCard>
    </div>
  );
}

function MeetingsPage() {
  const [message, setMessage] = useState("");
  return (
    <div className="section page"><Back to="/admin">Back to admin preview</Back><PageHeading eyebrow="Static scheduling concept" title="Meetings and minutes." text="Scheduling controls are interactive mockups only. They do not contact attendees or save data." />
      <div className="admin-grid"><form className="form-card" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); setMessage("Meeting preview created locally, then discarded. Nothing was saved."); }}><h2>Try scheduling</h2><div className="field"><label htmlFor="meeting-title">Meeting title</label><input id="meeting-title" required /></div><div className="field"><label htmlFor="meeting-date">Date and time</label><input id="meeting-date" type="datetime-local" required /></div><button className="button" type="submit">Preview meeting</button><p className="form-message success" role="status" aria-live="polite">{message}</p></form>
        <DataCard title="Sample meetings">{meetings.map((meeting) => <Item key={meeting.id} title={meeting.title} meta={`${formatDate(meeting.date)} · ${meeting.duration} min · ${meeting.attendees.join(", ")} · ${meeting.aiSummary}`} />)}</DataCard></div>
    </div>
  );
}

function NotFoundPage() {
  return <section className="not-found page"><div className="brand-mark large" aria-hidden="true">S</div><p className="eyebrow">404 · Lost in collaboration</p><h1>This panel isn’t in the preview.</h1><p>The address may be outdated, or the concept has not been defined.</p><Link className="button" to="/">Return home</Link></section>;
}

function PageHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <header className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p></header>;
}
function Back({ to, children }: { to: string; children: ReactNode }) { return <Link className="back" to={to}><ChevronLeft aria-hidden="true" />{children}</Link>; }
function Stat({ label, value }: { label: string; value: number }) { return <div className="stat"><span>{label}</span><b>{value}</b></div>; }
function DataCard({ title, children }: { title: string; children: ReactNode }) { return <section className="data-card"><h2>{title}</h2>{children}</section>; }
function Item({ title, meta }: { title: string; meta: string }) { return <article className="item"><h3>{title}</h3><p>{meta}</p></article>; }
function Empty() { return <p className="empty">No sample content is defined for this panel.</p>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Preview route failed", error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="not-found page" role="alert">
          <div className="brand-mark large" aria-hidden="true">S</div>
          <p className="eyebrow">Preview error</p>
          <h1>This screen could not be displayed.</h1>
          <p>Reload the design preview or return to its home page.</p>
          <div className="button-row">
            <button className="button" onClick={() => window.location.reload()}>Reload preview</button>
            <a className="button secondary" href="/">Return home</a>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <Layout>
      <Splash />
      <ScrollManager />
      <AppErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/sections/:slug" element={<ProtectedRoute><SectionPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/users/:id" element={<ProtectedRoute><AdminUserPage /></ProtectedRoute>} />
          <Route path="/admin/meetings" element={<ProtectedRoute><MeetingsPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppErrorBoundary>
    </Layout>
  );
}
