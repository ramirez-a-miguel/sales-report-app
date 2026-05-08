import React from 'react';
import ReactDOM from 'react-dom/client';
import { Box, Button, CssBaseline, IconButton as MuiIconButton, MenuItem, Slider, TextField, ThemeProvider, createTheme } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import { jsPDF } from 'jspdf';
import {
  Activity,
  ArrowDownToLine,
  Boxes,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  CloudCog,
  Database,
  FileText,
  Gauge,
  Layers3,
  ListChecks,
  PackagePlus,
  Plus,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import './styles.css';

type Segment = 'SMB' | 'Enterprise';
type Phase = 'Discovery' | 'Qualification' | 'Solution Design' | 'POC' | 'Proposal' | 'Handover';
type Risk = 'Low' | 'Medium' | 'High';
type TaskStatus = 'Done' | 'In progress' | 'Blocked';

type Task = {
  id: string;
  title: string;
  owner: string;
  status: TaskStatus;
  due: string;
};

type StackItem = {
  id: string;
  layer: string;
  product: string;
  vendor: string;
  purpose: string;
  criticality: 'Standard' | 'Critical';
};

type SbomItem = {
  id: string;
  component: string;
  version: string;
  license: string;
  supplier: string;
  securityNotes: string;
};

type Project = {
  id: string;
  customer: string;
  opportunity: string;
  segment: Segment;
  phase: Phase;
  progress: number;
  value: number;
  nextMilestone: string;
  due: string;
  risk: Risk;
  summary: string;
  tasks: Task[];
  stack: StackItem[];
  sbom: SbomItem[];
};

const phases: Phase[] = ['Discovery', 'Qualification', 'Solution Design', 'POC', 'Proposal', 'Handover'];
const risks: Risk[] = ['Low', 'Medium', 'High'];
const taskStatuses: TaskStatus[] = ['Done', 'In progress', 'Blocked'];

const seedProjects: Project[] = [
  {
    id: 'p-cloudlift',
    customer: 'Northwind Manufacturing',
    opportunity: 'Azure landing zone and ERP migration',
    segment: 'Enterprise',
    phase: 'POC',
    progress: 68,
    value: 420000,
    nextMilestone: 'POC readout with security and infrastructure leads',
    due: '2026-05-22',
    risk: 'Medium',
    summary: 'Validated network topology, identity model, and migration waves. Cost governance is still being aligned with finance.',
    tasks: [
      { id: 't1', title: 'Complete POC success criteria matrix', owner: 'Miguel', status: 'Done', due: '2026-05-03' },
      { id: 't2', title: 'Review private endpoint design', owner: 'Customer security', status: 'In progress', due: '2026-05-12' },
      { id: 't3', title: 'Prepare migration timeline for steering committee', owner: 'Miguel', status: 'In progress', due: '2026-05-18' },
    ],
    stack: [
      { id: 's1', layer: 'Cloud', product: 'Azure Landing Zone', vendor: 'Microsoft', purpose: 'Subscription, policy, identity and network foundation', criticality: 'Critical' },
      { id: 's2', layer: 'Security', product: 'Microsoft Defender for Cloud', vendor: 'Microsoft', purpose: 'Cloud security posture management', criticality: 'Critical' },
      { id: 's3', layer: 'Observability', product: 'Azure Monitor', vendor: 'Microsoft', purpose: 'Metrics, logs and alerting', criticality: 'Standard' },
    ],
    sbom: [
      { id: 'b1', component: 'Terraform AzureRM Provider', version: '4.31.0', license: 'MPL-2.0', supplier: 'HashiCorp', securityNotes: 'Pinned provider version for reproducible deployments.' },
      { id: 'b2', component: 'Azure Verified Modules', version: '0.20.x', license: 'MIT', supplier: 'Microsoft', securityNotes: 'Review module source before production promotion.' },
    ],
  },
  {
    id: 'p-retail-ai',
    customer: 'BrightCart Retail',
    opportunity: 'Customer analytics platform on AWS',
    segment: 'SMB',
    phase: 'Solution Design',
    progress: 42,
    value: 145000,
    nextMilestone: 'Architecture decision record sign-off',
    due: '2026-06-05',
    risk: 'Low',
    summary: 'Business sponsor approved MVP scope. Data retention and dashboard access model need final confirmation.',
    tasks: [
      { id: 't4', title: 'Map source systems and ingestion cadence', owner: 'Customer data lead', status: 'Done', due: '2026-04-29' },
      { id: 't5', title: 'Estimate monthly platform run cost', owner: 'Miguel', status: 'Done', due: '2026-05-02' },
      { id: 't6', title: 'Draft dashboard user roles', owner: 'Miguel', status: 'In progress', due: '2026-05-14' },
    ],
    stack: [
      { id: 's4', layer: 'Cloud', product: 'Amazon S3', vendor: 'AWS', purpose: 'Data lake storage', criticality: 'Critical' },
      { id: 's5', layer: 'Analytics', product: 'Amazon QuickSight', vendor: 'AWS', purpose: 'Executive dashboards', criticality: 'Standard' },
    ],
    sbom: [
      { id: 'b3', component: 'dbt Core', version: '1.8.x', license: 'Apache-2.0', supplier: 'dbt Labs', securityNotes: 'Used for transformation models in MVP.' },
    ],
  },
  {
    id: 'p-health-sec',
    customer: 'CareWell Clinics',
    opportunity: 'Zero trust review and Microsoft 365 hardening',
    segment: 'Enterprise',
    phase: 'Proposal',
    progress: 84,
    value: 260000,
    nextMilestone: 'Commercial proposal review with procurement',
    due: '2026-05-16',
    risk: 'High',
    summary: 'Technical scope is agreed. Timeline pressure remains because the customer wants rollout before audit season.',
    tasks: [
      { id: 't7', title: 'Finalize recommended control roadmap', owner: 'Miguel', status: 'Done', due: '2026-05-01' },
      { id: 't8', title: 'Confirm licensing delta', owner: 'Partner manager', status: 'Blocked', due: '2026-05-09' },
      { id: 't9', title: 'Produce executive summary slide', owner: 'Miguel', status: 'In progress', due: '2026-05-11' },
    ],
    stack: [
      { id: 's6', layer: 'Identity', product: 'Microsoft Entra ID', vendor: 'Microsoft', purpose: 'Conditional access and identity protection', criticality: 'Critical' },
      { id: 's7', layer: 'Endpoint', product: 'Microsoft Intune', vendor: 'Microsoft', purpose: 'Device management and compliance', criticality: 'Critical' },
    ],
    sbom: [
      { id: 'b4', component: 'PowerShell Graph SDK', version: '2.27.0', license: 'MIT', supplier: 'Microsoft', securityNotes: 'Used for configuration evidence collection.' },
    ],
  },
];

const uid = () => Math.random().toString(36).slice(2, 10);
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3001';
const azureTheme = createTheme({
  palette: {
    primary: {
      main: '#0078d4',
      dark: '#005a9e',
      light: '#50a7e8',
    },
    secondary: {
      main: '#2b88d8',
    },
    background: {
      default: '#f3f8fd',
      paper: '#ffffff',
    },
    error: {
      main: '#d13438',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
});

type ApiState = 'connecting' | 'postgres' | 'offline';

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function useProjectStore() {
  const [projects, setProjects] = React.useState<Project[]>(seedProjects);
  const [apiState, setApiState] = React.useState<ApiState>('connecting');

  const loadProjects = React.useCallback(async () => {
    try {
      await apiRequest<{ ok: boolean }>('/api/health');
      const loadedProjects = await apiRequest<Project[]>('/api/projects');
      setProjects(loadedProjects);
      setApiState('postgres');
    } catch {
      setProjects(seedProjects);
      setApiState('offline');
    }
  }, []);

  React.useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  return { projects, setProjects, apiState, setApiState, loadProjects };
}

function App() {
  const { projects, setProjects, apiState, setApiState } = useProjectStore();
  const [selectedId, setSelectedId] = React.useState(projects[0]?.id ?? '');
  const [query, setQuery] = React.useState('');
  const [segmentFilter, setSegmentFilter] = React.useState<'All' | Segment>('All');
  const [reportMode, setReportMode] = React.useState<'Manager' | 'Architecture'>('Manager');

  const selectedProject = projects.find((project) => project.id === selectedId) ?? projects[0];

  React.useEffect(() => {
    if (!projects.some((project) => project.id === selectedId) && projects.length > 0) {
      setSelectedId(projects[0].id);
    }
  }, [projects, selectedId]);

  const visibleProjects = projects.filter((project) => {
    const matchesQuery = `${project.customer} ${project.opportunity}`.toLowerCase().includes(query.toLowerCase());
    const matchesSegment = segmentFilter === 'All' || project.segment === segmentFilter;
    return matchesQuery && matchesSegment;
  });

  const completedTasks = projects.flatMap((project) => project.tasks).filter((task) => task.status === 'Done').length;
  const openTasks = projects.flatMap((project) => project.tasks).filter((task) => task.status !== 'Done').length;
  const weightedProgress = Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / Math.max(projects.length, 1));
  const pipeline = projects.reduce((sum, project) => sum + project.value, 0);
  const highRiskCount = projects.filter((project) => project.risk === 'High').length;

  const updateProject = async (updated: Project) => {
    setProjects((current) => current.map((project) => (project.id === updated.id ? updated : project)));
    try {
      const saved = await apiRequest<Project>(`/api/projects/${updated.id}`, {
        method: 'PUT',
        body: JSON.stringify(updated),
      });
      setProjects((current) => current.map((project) => (project.id === saved.id ? saved : project)));
      setApiState('postgres');
    } catch {
      setApiState('offline');
    }
  };

  const addProject = async () => {
    const newProject: Project = {
      id: `p-${uid()}`,
      customer: 'New customer',
      opportunity: 'Cloud modernization opportunity',
      segment: 'SMB',
      phase: 'Discovery',
      progress: 10,
      value: 50000,
      nextMilestone: 'Schedule discovery workshop',
      due: new Date().toISOString().slice(0, 10),
      risk: 'Low',
      summary: 'Capture business drivers, constraints, current architecture and buying process.',
      tasks: [{ id: `t-${uid()}`, title: 'Run discovery workshop', owner: 'Pre-sales engineer', status: 'In progress', due: new Date().toISOString().slice(0, 10) }],
      stack: [],
      sbom: [],
    };
    setSelectedId(newProject.id);
    setProjects((current) => [newProject, ...current]);
    try {
      const saved = await apiRequest<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify(newProject),
      });
      setProjects((current) => current.map((project) => (project.id === saved.id ? saved : project)));
      setApiState('postgres');
    } catch {
      setApiState('offline');
    }
  };

  const deleteProject = async (projectId: string) => {
    setProjects((current) => current.filter((project) => project.id !== projectId));
    try {
      await apiRequest<void>(`/api/projects/${projectId}`, { method: 'DELETE' });
      setApiState('postgres');
    } catch {
      setApiState('offline');
    }
  };

  const resetProjects = async () => {
    setProjects(seedProjects);
    setSelectedId(seedProjects[0].id);
    try {
      const reset = await apiRequest<Project[]>('/api/projects/reset', { method: 'POST' });
      setProjects(reset);
      setSelectedId(reset[0]?.id ?? '');
      setApiState('postgres');
    } catch {
      setApiState('offline');
    }
  };

  const copyReport = async () => {
    if (!selectedProject) return;
    await navigator.clipboard.writeText(buildReport(selectedProject, reportMode));
  };

  const downloadPdf = () => {
    if (!selectedProject) return;
    downloadReportPdf(selectedProject, reportMode);
  };

  const downloadCsv = () => {
    if (!selectedProject) return;
    downloadReportCsv(selectedProject, reportMode);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <CloudCog size={24} />
          </div>
          <div>
            <h1>Solution Desk</h1>
            <span>Pre-sales project reporting</span>
          </div>
        </div>

        <div className="search-row">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search accounts" />
        </div>

        <div className="filter-row" aria-label="Segment filter">
          {(['All', 'SMB', 'Enterprise'] as const).map((segment) => (
            <button className={segmentFilter === segment ? 'active' : ''} key={segment} onClick={() => setSegmentFilter(segment)}>
              {segment}
            </button>
          ))}
        </div>

        <Button className="primary-action" variant="contained" startIcon={<Plus size={17} />} onClick={addProject}>
          Project
        </Button>

        <div className="project-list">
          {visibleProjects.map((project) => (
            <button className={`project-card ${project.id === selectedProject?.id ? 'selected' : ''}`} key={project.id} onClick={() => setSelectedId(project.id)}>
              <div>
                <strong>{project.customer}</strong>
                <span>{project.opportunity}</span>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p>Cloud solutions architecture</p>
            <h2>Project Progress Command Center</h2>
          </div>
          <Button className="ghost-button" variant="outlined" startIcon={<ArrowDownToLine size={16} />} onClick={resetProjects}>
            Reset seed data
          </Button>
        </header>

        <section className="metrics-grid" aria-label="Portfolio metrics">
          <Metric icon={<BriefcaseBusiness />} label="Active projects" value={projects.length.toString()} />
          <Metric icon={<CircleDollarSign />} label="Pipeline value" value={currency.format(pipeline)} />
          <Metric icon={<Gauge />} label="Avg progress" value={`${weightedProgress}%`} />
          <Metric icon={<ClipboardCheck />} label="Tasks done" value={`${completedTasks}/${completedTasks + openTasks}`} />
          <Metric icon={<ShieldCheck />} label="High risk" value={highRiskCount.toString()} />
          <Metric icon={<Database />} label="Storage" value={apiState === 'postgres' ? 'Postgres' : apiState === 'connecting' ? 'Connecting' : 'Offline seed'} />
        </section>

        {selectedProject ? (
          <div className="detail-grid">
            <section className="panel project-editor">
              <div className="section-heading">
                <div>
                  <p>Selected opportunity</p>
                  <h3>{selectedProject.customer}</h3>
                </div>
                <MuiIconButton className="icon-button danger" onClick={() => deleteProject(selectedProject.id)} title="Delete project" color="error">
                  <Trash2 size={17} />
                </MuiIconButton>
              </div>
              <ProjectForm project={selectedProject} onChange={updateProject} />
            </section>

            <section className="panel">
              <div className="section-heading">
                <div>
                  <p>Progression</p>
                  <h3>Stage and delivery health</h3>
                </div>
                <Activity size={19} />
              </div>
              <PhaseStepper phase={selectedProject.phase} progress={selectedProject.progress} />
              <TaskBoard project={selectedProject} onChange={updateProject} />
            </section>

            <section className="panel wide">
              <div className="section-heading">
                <div>
                  <p>Architecture inputs</p>
                  <h3>Tech stack and SBOM forms</h3>
                </div>
                <Boxes size={19} />
              </div>
              <ArchitectureForms project={selectedProject} onChange={updateProject} />
            </section>

            <section className="panel wide stack-panel">
              <div className="section-heading">
                <div>
                  <p>Implementation stack</p>
                  <h3>Desktop, backend and storage</h3>
                </div>
                <Server size={19} />
              </div>
              <div className="runtime-grid">
                <Metric icon={<CloudCog />} label="Desktop shell" value="Electron" />
                <Metric icon={<Server />} label="Backend API" value="Express" />
                <Metric icon={<Database />} label="Database" value="Postgres" />
                <Metric icon={<Boxes />} label="Containers" value="Docker" />
              </div>
            </section>

            <section className="panel report-panel">
              <div className="section-heading">
                <div>
                  <p>Manager delivery</p>
                  <h3>Report preview</h3>
                </div>
                <div className="segmented">
                  {(['Manager', 'Architecture'] as const).map((mode) => (
                    <button className={reportMode === mode ? 'active' : ''} onClick={() => setReportMode(mode)} key={mode}>
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <ReportPreview project={selectedProject} mode={reportMode} />
              <div className="report-actions">
              <Button className="primary-action fit" variant="contained" startIcon={<FileText size={16} />} onClick={copyReport}>
                Copy report
              </Button>
              <Button className="ghost-button fit" variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={downloadPdf}>
                PDF
              </Button>
              <Button className="ghost-button fit" variant="outlined" startIcon={<TableViewIcon />} onClick={downloadCsv}>
                CSV
              </Button>
              </div>
            </section>
          </div>
        ) : (
          <section className="empty-state">
            <Sparkles size={32} />
            <h3>Create your first project</h3>
            <p>Add an opportunity to start tracking phases, tasks, stack decisions and report output.</p>
            <Button className="primary-action" variant="contained" startIcon={<Plus size={17} />} onClick={addProject}>
              Project
            </Button>
          </section>
        )}
      </section>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className="metric">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ProjectForm({ project, onChange }: { project: Project; onChange: (project: Project) => void }) {
  const patch = <K extends keyof Project>(key: K, value: Project[K]) => onChange({ ...project, [key]: value });

  return (
    <form className="form-grid">
      <TextField label="Customer" value={project.customer} onChange={(event) => patch('customer', event.target.value)} size="small" />
      <TextField label="Opportunity" value={project.opportunity} onChange={(event) => patch('opportunity', event.target.value)} size="small" />
      <TextField select label="Segment" value={project.segment} onChange={(event) => patch('segment', event.target.value as Segment)} size="small">
        <MenuItem value="SMB">SMB</MenuItem>
        <MenuItem value="Enterprise">Enterprise</MenuItem>
      </TextField>
      <TextField select label="Phase" value={project.phase} onChange={(event) => patch('phase', event.target.value as Phase)} size="small">
        {phases.map((phase) => (
          <MenuItem value={phase} key={phase}>{phase}</MenuItem>
        ))}
      </TextField>
      <Box className="slider-field">
        <span>Progress</span>
        <Slider value={project.progress} min={0} max={100} valueLabelDisplay="auto" onChange={(_event, value) => patch('progress', value as number)} />
        <strong>{project.progress}%</strong>
      </Box>
      <TextField label="Opportunity value" type="number" value={project.value} onChange={(event) => patch('value', Number(event.target.value))} size="small" />
      <TextField label="Due date" type="date" value={project.due} onChange={(event) => patch('due', event.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} />
      <TextField select label="Risk" value={project.risk} onChange={(event) => patch('risk', event.target.value as Risk)} size="small">
        {risks.map((risk) => (
          <MenuItem value={risk} key={risk}>{risk}</MenuItem>
        ))}
      </TextField>
      <TextField className="span-2" label="Next milestone" value={project.nextMilestone} onChange={(event) => patch('nextMilestone', event.target.value)} size="small" />
      <TextField className="span-2" label="Status summary" value={project.summary} onChange={(event) => patch('summary', event.target.value)} minRows={3} multiline />
    </form>
  );
}

function PhaseStepper({ phase, progress }: { phase: Phase; progress: number }) {
  const activeIndex = phases.indexOf(phase);
  return (
    <div>
      <div className="progress-track">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="phase-stepper">
        {phases.map((item, index) => (
          <div className={`phase ${index <= activeIndex ? 'complete' : ''}`} key={item}>
            <div>{index <= activeIndex ? <Check size={14} /> : index + 1}</div>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskBoard({ project, onChange }: { project: Project; onChange: (project: Project) => void }) {
  const addTask = () => {
    onChange({
      ...project,
      tasks: [...project.tasks, { id: `t-${uid()}`, title: 'New delivery task', owner: 'Miguel', status: 'In progress', due: new Date().toISOString().slice(0, 10) }],
    });
  };

  const updateTask = (id: string, patch: Partial<Task>) => {
    onChange({ ...project, tasks: project.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)) });
  };

  const removeTask = (id: string) => onChange({ ...project, tasks: project.tasks.filter((task) => task.id !== id) });

  return (
    <div className="task-section">
      <div className="mini-heading">
        <ListChecks size={17} />
        <strong>Tasks done and in flight</strong>
        <MuiIconButton className="icon-button" onClick={addTask} title="Add task" color="primary">
          <Plus size={16} />
        </MuiIconButton>
      </div>
      <div className="task-list">
        {project.tasks.map((task) => (
          <article className={`task ${task.status.toLowerCase().replace(' ', '-')}`} key={task.id}>
            <TextField value={task.title} onChange={(event) => updateTask(task.id, { title: event.target.value })} label="Task" size="small" />
            <TextField value={task.owner} onChange={(event) => updateTask(task.id, { owner: event.target.value })} label="Owner" size="small" />
            <TextField select value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value as TaskStatus })} label="Status" size="small">
              {taskStatuses.map((status) => (
                <MenuItem value={status} key={status}>{status}</MenuItem>
              ))}
            </TextField>
            <TextField type="date" value={task.due} onChange={(event) => updateTask(task.id, { due: event.target.value })} label="Due" size="small" slotProps={{ inputLabel: { shrink: true } }} />
            <MuiIconButton className="icon-button danger" onClick={() => removeTask(task.id)} title="Remove task" color="error">
              <Trash2 size={15} />
            </MuiIconButton>
          </article>
        ))}
      </div>
    </div>
  );
}

function ArchitectureForms({ project, onChange }: { project: Project; onChange: (project: Project) => void }) {
  const addStack = () =>
    onChange({
      ...project,
      stack: [...project.stack, { id: `s-${uid()}`, layer: 'Application', product: 'New platform component', vendor: 'Vendor', purpose: 'Role in the proposed architecture', criticality: 'Standard' }],
    });

  const addSbom = () =>
    onChange({
      ...project,
      sbom: [...project.sbom, { id: `b-${uid()}`, component: 'New component', version: '1.0.0', license: 'TBD', supplier: 'Supplier', securityNotes: 'Assessment notes' }],
    });

  const updateStack = (id: string, patch: Partial<StackItem>) => onChange({ ...project, stack: project.stack.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  const updateSbom = (id: string, patch: Partial<SbomItem>) => onChange({ ...project, sbom: project.sbom.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  const removeStack = (id: string) => onChange({ ...project, stack: project.stack.filter((item) => item.id !== id) });
  const removeSbom = (id: string) => onChange({ ...project, sbom: project.sbom.filter((item) => item.id !== id) });

  return (
    <div className="architecture-grid">
      <div>
        <div className="mini-heading">
          <Layers3 size={17} />
          <strong>Tech stack</strong>
          <MuiIconButton className="icon-button" onClick={addStack} title="Add stack item" color="primary">
            <Plus size={16} />
          </MuiIconButton>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Product</th>
                <th>Vendor</th>
                <th>Purpose</th>
                <th>Criticality</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.stack.map((item) => (
                <tr key={item.id}>
                  <td><TextField value={item.layer} onChange={(event) => updateStack(item.id, { layer: event.target.value })} size="small" /></td>
                  <td><TextField value={item.product} onChange={(event) => updateStack(item.id, { product: event.target.value })} size="small" /></td>
                  <td><TextField value={item.vendor} onChange={(event) => updateStack(item.id, { vendor: event.target.value })} size="small" /></td>
                  <td><TextField value={item.purpose} onChange={(event) => updateStack(item.id, { purpose: event.target.value })} size="small" /></td>
                  <td>
                    <TextField select value={item.criticality} onChange={(event) => updateStack(item.id, { criticality: event.target.value as StackItem['criticality'] })} size="small">
                      <MenuItem value="Standard">Standard</MenuItem>
                      <MenuItem value="Critical">Critical</MenuItem>
                    </TextField>
                  </td>
                  <td>
                    <MuiIconButton className="icon-button danger" onClick={() => removeStack(item.id)} title="Delete stack item" color="error">
                      <Trash2 size={15} />
                    </MuiIconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div className="mini-heading">
          <PackagePlus size={17} />
          <strong>SBOM</strong>
          <MuiIconButton className="icon-button" onClick={addSbom} title="Add SBOM component" color="primary">
            <Plus size={16} />
          </MuiIconButton>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Version</th>
                <th>License</th>
                <th>Supplier</th>
                <th>Security notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.sbom.map((item) => (
                <tr key={item.id}>
                  <td><TextField value={item.component} onChange={(event) => updateSbom(item.id, { component: event.target.value })} size="small" /></td>
                  <td><TextField value={item.version} onChange={(event) => updateSbom(item.id, { version: event.target.value })} size="small" /></td>
                  <td><TextField value={item.license} onChange={(event) => updateSbom(item.id, { license: event.target.value })} size="small" /></td>
                  <td><TextField value={item.supplier} onChange={(event) => updateSbom(item.id, { supplier: event.target.value })} size="small" /></td>
                  <td><TextField value={item.securityNotes} onChange={(event) => updateSbom(item.id, { securityNotes: event.target.value })} size="small" /></td>
                  <td>
                    <MuiIconButton className="icon-button danger" onClick={() => removeSbom(item.id)} title="Delete SBOM component" color="error">
                      <Trash2 size={15} />
                    </MuiIconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportPreview({ project, mode }: { project: Project; mode: 'Manager' | 'Architecture' }) {
  return (
    <pre className="report-preview">
      {buildReport(project, mode)}
    </pre>
  );
}

function buildReport(project: Project, mode: 'Manager' | 'Architecture') {
  const doneTasks = project.tasks.filter((task) => task.status === 'Done');
  const activeTasks = project.tasks.filter((task) => task.status !== 'Done');
  const base = [
    `${mode} Report: ${project.customer}`,
    `Opportunity: ${project.opportunity}`,
    `Segment: ${project.segment}`,
    `Phase: ${project.phase} | Progress: ${project.progress}% | Risk: ${project.risk}`,
    `Value: ${currency.format(project.value)} | Due: ${project.due}`,
    '',
    `Status: ${project.summary}`,
    `Next milestone: ${project.nextMilestone}`,
    '',
    'Tasks completed:',
    ...(doneTasks.length ? doneTasks.map((task) => `- ${task.title} (${task.owner})`) : ['- None yet']),
    '',
    'Open tasks:',
    ...(activeTasks.length ? activeTasks.map((task) => `- ${task.title} | ${task.status} | owner: ${task.owner} | due: ${task.due}`) : ['- None']),
  ];

  if (mode === 'Architecture') {
    base.push(
      '',
      'Tech stack:',
      ...(project.stack.length ? project.stack.map((item) => `- ${item.layer}: ${item.product} by ${item.vendor} (${item.criticality})`) : ['- Not captured']),
      '',
      'SBOM:',
      ...(project.sbom.length ? project.sbom.map((item) => `- ${item.component} ${item.version} | ${item.license} | ${item.supplier}`) : ['- Not captured']),
    );
  }

  return base.join('\n');
}

function downloadReportPdf(project: Project, mode: 'Manager' | 'Architecture') {
  const doc = new jsPDF();
  const report = buildReport(project, mode);
  const lines = doc.splitTextToSize(report, 180);
  let y = 18;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 120, 212);
  doc.setFontSize(16);
  doc.text(`${mode} Report`, 14, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 39, 51);
  doc.setFontSize(10);

  lines.forEach((line: string) => {
    if (y > 280) {
      doc.addPage();
      y = 18;
    }
    doc.text(line, 14, y);
    y += 6;
  });

  doc.save(`${fileSafe(project.customer)}-${mode.toLowerCase()}-report.pdf`);
}

function downloadReportCsv(project: Project, mode: 'Manager' | 'Architecture') {
  const rows: string[][] = [
    ['Section', 'Field', 'Value'],
    ['Overview', 'Customer', project.customer],
    ['Overview', 'Opportunity', project.opportunity],
    ['Overview', 'Segment', project.segment],
    ['Overview', 'Phase', project.phase],
    ['Overview', 'Progress', `${project.progress}%`],
    ['Overview', 'Risk', project.risk],
    ['Overview', 'Value', String(project.value)],
    ['Overview', 'Due', project.due],
    ['Overview', 'Next milestone', project.nextMilestone],
    ['Overview', 'Summary', project.summary],
    ...project.tasks.map((task) => ['Task', task.status, `${task.title} | Owner: ${task.owner} | Due: ${task.due}`]),
  ];

  if (mode === 'Architecture') {
    rows.push(
      ...project.stack.map((item) => ['Tech stack', item.layer, `${item.product} | ${item.vendor} | ${item.criticality} | ${item.purpose}`]),
      ...project.sbom.map((item) => ['SBOM', item.component, `${item.version} | ${item.license} | ${item.supplier} | ${item.securityNotes}`]),
    );
  }

  downloadBlob(`${fileSafe(project.customer)}-${mode.toLowerCase()}-report.csv`, rows.map((row) => row.map(csvEscape).join(',')).join('\n'), 'text/csv;charset=utf-8');
}

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function fileSafe(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'report';
}

function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={azureTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
);
