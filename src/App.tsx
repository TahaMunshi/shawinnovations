import {
  Component,
  useEffect,
  useRef,
  useState,
  type ErrorInfo,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  FileBox,
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
  useSearchParams,
} from "react-router-dom";
import { AdminRoute, ProtectedRoute, safeReturnTo, useAuth } from "./auth";
import { fixedGroups, type Persona } from "./data";
import {
  AdminPage,
  DirectMessagePage,
  GroupChatPage,
  WorkspaceHome,
} from "./WorkspaceApp";
import { useWorkspace } from "./workspace";

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
      Public design preview · Sample activity is stored only in this browser · Nothing is submitted
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
              {session.role === "admin" && <Link className="text-link" to="/admin">Admin</Link>}
              <Link className="button small" to="/app">Open workspace</Link>
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
        <div><strong>Preview notice</strong><p>Sample messages and access changes remain only in this browser. The permission controls shown here are not production authorization.</p></div>
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
  const pathname = useLocation().pathname;
  const home = pathname === "/";
  const workspace = pathname.startsWith("/app") || pathname.startsWith("/admin");
  if (workspace) {
    return (
      <div className="app-shell workspace-app">
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </div>
    );
  }
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
    [Stethoscope, "Clinical advisors", "A dedicated community for sonography workflow insight and clinical feedback."],
    [Users, "Project collaborators", "Admin-assigned groups bring the right approved people into each focused conversation."],
    [Wrench, "Engineering teams", "Product, mechanical, electrical, and industrial design conversations in one place."],
    [ShieldCheck, "Program administrators", "Team oversight and role-aware access represented as a frontend prototype."],
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
            An invitation-only community where sonographers, advisors, and engineers
            can talk inside carefully assigned groups and move a medical device forward together.
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
            <p className="lead">Clinicians, engineers, researchers, and legal partners collaborate inside six community tabs after NDA e-sign and administrator approval.</p>
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
            <h2>Focused rooms. Shared product progress.</h2>
            <p className="lead">Six community tabs keep sonography, clinical, engineering, prototype, university, and IP conversations clear—Slack-style community chat, with admin-only direct messages.</p>
          </Reveal>
          <div className="bento">
            <Reveal className="media-card tall">
              <img src="/imagery/clinic-team.jpg" alt="" />
              <span className="media-chip">Hospital + clinical communities</span>
            </Reveal>
            <div className="bento-list">
              {fixedGroups.map((group, index) => (
                <Reveal key={group.id} delay={(index % 3) * 0.08}>
                  <article className="card compact">
                    <span className="icon-well small"><FileBox aria-hidden="true" /></span>
                    <div>
                      <h3>{group.name}</h3>
                      <p>{group.description}</p>
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
              <h2>From NDA to community tab.</h2>
            <p className="lead">
              Complete onboarding with an e-signed NDA, wait for admin approval and tab
              assignment, then collaborate with others in your community.
            </p>
          </Reveal>
          <Reveal className="media-card">
            <img src="/imagery/device-review.jpg" alt="" />
            <span className="media-chip">Shared design review</span>
          </Reveal>
        </div>
        <div className="card-grid four">
          {[
            ["01", "Apply + e-sign", "Complete onboarding and e-sign the NDA for any module."],
            ["02", "Get approved", "An administrator reviews the NDA and assigns your community tab."],
            ["03", "Collaborate", "Talk with others in your tab’s community chat—no peer DMs."],
            ["04", "Meet on Zoom", "Admin can start a Zoom meeting for that community from the portal."],
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

function SignaturePad({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prepare = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const previous = canvas.toDataURL("image/png");
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.lineWidth = 2;
      context.lineCap = "round";
      context.strokeStyle = "#1d3b5c";
      if (value.startsWith("data:image")) {
        const image = new Image();
        image.onload = () => context.drawImage(image, 0, 0, width, height);
        image.src = value || previous;
      }
    };
    prepare();
    window.addEventListener("resize", prepare);
    return () => window.removeEventListener("resize", prepare);
    // Intentionally run once on mount; drawing updates value without remounting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, [value]);

  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const bounds = canvas.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };

  const start = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    drawing.current = true;
    canvas.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    context.beginPath();
    context.moveTo(x, y);
  };

  const move = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    onChange(canvas.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="signature-pad">
      <canvas
        ref={canvasRef}
        aria-label="NDA signature pad"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      />
      <button type="button" className="signature-clear" onClick={clear}>Clear signature</button>
    </div>
  );
}

function LoginPage() {
  const { session, login } = useAuth();
  const { members, submitRequest } = useWorkspace();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "onboarding">("signin");
  const [submitted, setSubmitted] = useState(false);
  const [signature, setSignature] = useState("");
  const [signerName, setSignerName] = useState("");
  const destination = safeReturnTo(params.get("returnTo"));
  if (session) return <Navigate to={destination} replace />;

  const enter = (member: Persona) => {
    if (member.status === "suspended") return;
    login(member);
    navigate(destination, { replace: true });
  };

  const apply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!signature.trim() || !signerName.trim()) return;
    const data = new FormData(event.currentTarget);
    submitRequest({
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      title: String(data.get("title") ?? "").trim(),
      organization: String(data.get("organization") ?? "").trim(),
      role: String(data.get("role") ?? "advisor") as Persona["role"],
      note: String(data.get("note") ?? "").trim(),
      preferredTabId: String(data.get("tab") ?? "sonography-advisors"),
      ndaSignature: signature,
      ndaSignerName: signerName.trim(),
      ndaSignedAt: new Date().toISOString(),
    });
    event.currentTarget.reset();
    setSignature("");
    setSignerName("");
    setSubmitted(true);
  };

  const activeMembers = members.filter((member) => member.status === "active");

  return (
    <section className="auth-page page">
      <div className="auth-visual media-card">
        <img src="/imagery/clinic-sonography.jpg" alt="" />
        <span className="media-chip">Design preview only</span>
      </div>
      <div className="auth-stack">
        <div className="auth-panel">
          <p className="eyebrow">Private community access</p>
          <h1>Enter the collaboration workspace.</h1>
          <p>A refined space for approved collaborators. E-sign the NDA, join your community tab, and work with the people who matter to the device.</p>
        </div>
        <div className="auth-tabs" role="tablist" aria-label="Access options">
          <button className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")} role="tab" aria-selected={mode === "signin"}>Approved member</button>
          <button className={mode === "onboarding" ? "active" : ""} onClick={() => setMode("onboarding")} role="tab" aria-selected={mode === "onboarding"}>Request access</button>
        </div>
        {mode === "signin" ? (
          <div className="form-card role-entry approved-entry">
            <h2>Approved member preview</h2>
            <p>Select a member to demonstrate their assigned community access.</p>
            <div>
              {activeMembers.map((person) => (
                <button key={person.id} type="button" onClick={() => enter(person)}>
                  <span className="avatar" aria-hidden="true">{person.name.split(" ").map((part) => part[0]).slice(0, 2)}</span>
                  <span><strong>{person.name}</strong><small>{person.title} · {person.role}</small></span>
                  <ArrowRight aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form className="form-card onboarding-form" onSubmit={apply}>
            <h2>Member onboarding + NDA</h2>
            {submitted && <p className="onboarding-success" role="status">NDA submitted. An admin will review your e-signature and assign a community tab.</p>}
            <div className="form-grid">
              <div className="field"><label htmlFor="apply-name">Full name</label><input id="apply-name" name="name" required /></div>
              <div className="field"><label htmlFor="apply-email">Email</label><input id="apply-email" name="email" type="email" required /></div>
              <div className="field"><label htmlFor="apply-title">Title or specialty</label><input id="apply-title" name="title" required /></div>
              <div className="field"><label htmlFor="apply-organization">Organization</label><input id="apply-organization" name="organization" required /></div>
            </div>
            <div className="field">
              <label htmlFor="apply-role">Professional role</label>
              <select id="apply-role" name="role">
                <option value="advisor">Advisor / sonographer</option>
                <option value="engineer">Engineer / designer</option>
                <option value="faculty">University faculty</option>
                <option value="legal">IP / legal</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="apply-tab">Preferred community tab</label>
              <select id="apply-tab" name="tab">
                {fixedGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
              </select>
            </div>
            <div className="field"><label htmlFor="apply-note">How would you contribute?</label><textarea id="apply-note" name="note" rows={3} required /></div>

            <fieldset className="nda-fieldset">
              <legend>Non-disclosure agreement</legend>
              <p>
                By signing below, you agree not to disclose confidential Shaw Innovations product,
                clinical, or intellectual-property information shared in this collaboration preview.
                This is a design preview of e-sign capture—not a binding production contract.
              </p>
              <div className="field">
                <label htmlFor="nda-signer">Type your full legal name</label>
                <input id="nda-signer" value={signerName} onChange={(event) => setSignerName(event.target.value)} required />
              </div>
              <div className="field">
                <span className="field-label">Draw your signature</span>
                <SignaturePad value={signature} onChange={setSignature} />
                <button
                  type="button"
                  className="signature-clear"
                  disabled={!signerName.trim()}
                  onClick={() => setSignature(signerName.trim())}
                >
                  Use typed name as signature
                </button>
              </div>
            </fieldset>

            <button className="button" type="submit" disabled={!signature || !signerName.trim()}>
              Submit NDA for approval
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function NotFoundPage() {
  return <section className="not-found page"><div className="brand-mark large" aria-hidden="true">S</div><p className="eyebrow">404 · Lost in collaboration</p><h1>This room isn’t in the preview.</h1><p>The address may be outdated, or the workspace has not been defined.</p><Link className="button" to="/">Return home</Link></section>;
}

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
          <Route path="/app" element={<ProtectedRoute><WorkspaceHome /></ProtectedRoute>} />
          <Route path="/app/group/:groupId" element={<ProtectedRoute><GroupChatPage /></ProtectedRoute>} />
          <Route path="/app/direct/:memberId" element={<ProtectedRoute><DirectMessagePage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="/sections/:slug" element={<Navigate to="/app" replace />} />
          <Route path="/admin/teams" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/users/:id" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/meetings" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppErrorBoundary>
    </Layout>
  );
}
