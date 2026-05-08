import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT ?? 3001);
const databaseUrl = process.env.DATABASE_URL ?? 'postgres://presales:presales@127.0.0.1:5432/presales_reports';
const pool = new Pool({ connectionString: databaseUrl });
const seedProjects = JSON.parse(await readFile(path.join(__dirname, '..', 'data', 'seed-projects.json'), 'utf8'));

app.use(cors());
app.use(express.json({ limit: '2mb' }));

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      customer TEXT NOT NULL,
      opportunity TEXT NOT NULL,
      segment TEXT NOT NULL,
      phase TEXT NOT NULL,
      progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
      value NUMERIC NOT NULL DEFAULT 0,
      next_milestone TEXT NOT NULL,
      due TEXT NOT NULL,
      risk TEXT NOT NULL,
      summary TEXT NOT NULL,
      tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
      stack JSONB NOT NULL DEFAULT '[]'::jsonb,
      sbom JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM projects');
  if (rows[0].count === 0) {
    await replaceProjects(seedProjects);
  }
}

function toProject(row) {
  return {
    id: row.id,
    customer: row.customer,
    opportunity: row.opportunity,
    segment: row.segment,
    phase: row.phase,
    progress: Number(row.progress),
    value: Number(row.value),
    nextMilestone: row.next_milestone,
    due: row.due,
    risk: row.risk,
    summary: row.summary,
    tasks: row.tasks ?? [],
    stack: row.stack ?? [],
    sbom: row.sbom ?? [],
  };
}

async function upsertProject(project) {
  const result = await pool.query(
    `
      INSERT INTO projects (
        id, customer, opportunity, segment, phase, progress, value,
        next_milestone, due, risk, summary, tasks, stack, sbom
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14::jsonb)
      ON CONFLICT (id) DO UPDATE SET
        customer = EXCLUDED.customer,
        opportunity = EXCLUDED.opportunity,
        segment = EXCLUDED.segment,
        phase = EXCLUDED.phase,
        progress = EXCLUDED.progress,
        value = EXCLUDED.value,
        next_milestone = EXCLUDED.next_milestone,
        due = EXCLUDED.due,
        risk = EXCLUDED.risk,
        summary = EXCLUDED.summary,
        tasks = EXCLUDED.tasks,
        stack = EXCLUDED.stack,
        sbom = EXCLUDED.sbom,
        updated_at = NOW()
      RETURNING *
    `,
    [
      project.id,
      project.customer,
      project.opportunity,
      project.segment,
      project.phase,
      project.progress,
      project.value,
      project.nextMilestone,
      project.due,
      project.risk,
      project.summary,
      JSON.stringify(project.tasks ?? []),
      JSON.stringify(project.stack ?? []),
      JSON.stringify(project.sbom ?? []),
    ],
  );

  return toProject(result.rows[0]);
}

async function replaceProjects(projects) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE projects');
    for (const project of projects) {
      await client.query(
        `
          INSERT INTO projects (
            id, customer, opportunity, segment, phase, progress, value,
            next_milestone, due, risk, summary, tasks, stack, sbom
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14::jsonb)
        `,
        [
          project.id,
          project.customer,
          project.opportunity,
          project.segment,
          project.phase,
          project.progress,
          project.value,
          project.nextMilestone,
          project.due,
          project.risk,
          project.summary,
          JSON.stringify(project.tasks ?? []),
          JSON.stringify(project.stack ?? []),
          JSON.stringify(project.sbom ?? []),
        ],
      );
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1');
    response.json({ ok: true, storage: 'postgres', runtime: 'node-api' });
  } catch (error) {
    response.status(503).json({ ok: false, storage: 'postgres', message: error.message });
  }
});

app.get('/api/projects', async (_request, response, next) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY updated_at DESC, customer ASC');
    response.json(result.rows.map(toProject));
  } catch (error) {
    next(error);
  }
});

app.post('/api/projects', async (request, response, next) => {
  try {
    const project = await upsertProject(request.body);
    response.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

app.put('/api/projects/:id', async (request, response, next) => {
  try {
    const project = await upsertProject({ ...request.body, id: request.params.id });
    response.json(project);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/projects/:id', async (request, response, next) => {
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [request.params.id]);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post('/api/projects/reset', async (_request, response, next) => {
  try {
    await replaceProjects(seedProjects);
    const result = await pool.query('SELECT * FROM projects ORDER BY updated_at DESC, customer ASC');
    response.json(result.rows.map(toProject));
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: error.message ?? 'Unexpected server error' });
});

initializeDatabase()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Pre-sales report API listening on ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database', error);
    process.exit(1);
  });
