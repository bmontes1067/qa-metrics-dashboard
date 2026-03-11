<template>
  <div class="app">
    <div class="grain"></div>

    <header class="header">
      <div class="header-left">
        <div class="logo-mark">QA</div>
        <div>
          <h1 class="header-title">Quality Metrics</h1>
          <p class="header-sub">Sprint dashboard · {{ selectedSprint }}</p>
        </div>
      </div>
      <div class="header-right">
        <div class="data-source-tag">📁 mock data</div>
        <div class="sprint-selector">
          <label class="select-label">Sprint</label>
          <select v-model="selectedSprint" class="sprint-select">
            <option v-for="s in sprintData" :key="s.sprint" :value="s.sprint">{{ s.sprint }}</option>
          </select>
        </div>
      </div>
    </header>

    <!-- Banner explicando origen de datos -->
    <div class="data-banner">
      <span>ℹ️</span>
      <span>
        Data is <strong>static mock</strong> defined in <code>src/data/metrics.ts</code>.
        To connect real data (Jira, TestRail, your CI...) replace that file with calls to your API
        — the TypeScript types are the same. See section
        <a href="#connect">How to connect real data?</a>
      </span>
    </div>

    <main class="main">

      <!-- KPIs reactivos al selected sprint -->
      <section class="kpi-row">
        <div class="kpi-card" style="animation-delay:0ms">
          <div class="kpi-icon">✅</div>
          <div class="kpi-value">{{ currentSprint.passRate }}%</div>
          <div class="kpi-label">Pass Rate</div>
          <div class="kpi-delta" :class="passRateDelta >= 0 ? 'positive' : 'negative'">
            {{ passRateDelta >= 0 ? '+' : '' }}{{ passRateDelta }}% vs previous sprint
          </div>
        </div>
        <div class="kpi-card" style="animation-delay:80ms">
          <div class="kpi-icon">🤖</div>
          <div class="kpi-value">{{ currentSprint.totalTests }}</div>
          <div class="kpi-label">Automated Tests</div>
          <div class="kpi-delta" :class="testsDelta >= 0 ? 'positive' : 'negative'">
            {{ testsDelta >= 0 ? '+' : '' }}{{ testsDelta }} vs previous sprint
          </div>
        </div>
        <div class="kpi-card" style="animation-delay:160ms">
          <div class="kpi-icon">🐛</div>
          <div class="kpi-value">{{ currentSprint.bugsFound }}</div>
          <div class="kpi-label">Bugs Found</div>
          <div class="kpi-delta" :class="bugsDelta <= 0 ? 'positive' : 'negative'">
            {{ bugsDelta >= 0 ? '+' : '' }}{{ bugsDelta }} vs previous sprint
          </div>
        </div>
        <div class="kpi-card" style="animation-delay:240ms">
          <div class="kpi-icon">⚡</div>
          <div class="kpi-value">{{ currentSprint.avgResponseTime }}ms</div>
          <div class="kpi-label">Avg Response Time</div>
          <div class="kpi-delta" :class="responseDelta <= 0 ? 'positive' : 'negative'">
            {{ responseDelta >= 0 ? '+' : '' }}{{ responseDelta }}ms vs previous sprint
          </div>
        </div>
      </section>

      <!-- Sprint detail: tabla + mini stats del selected sprint -->
      <section class="sprint-detail-section">
        <div class="chart-header">
          <h2 class="chart-title">{{ selectedSprint }} Detail</h2>
          <span class="chart-badge">selected sprint</span>
        </div>
        <div class="sprint-detail-grid">
          <div class="detail-stat">
            <span class="detail-stat-label">Pass / Fail / Skip</span>
            <div class="detail-bar-group">
              <div class="detail-bar pass" :style="{ width: currentSprint.passRate + '%' }"></div>
              <div class="detail-bar fail" :style="{ width: currentSprint.failRate + '%' }"></div>
              <div class="detail-bar skip" :style="{ width: currentSprint.skipRate + '%' }"></div>
            </div>
            <div class="detail-bar-legend">
              <span class="leg pass-text">✅ {{ currentSprint.passRate }}%</span>
              <span class="leg fail-text">❌ {{ currentSprint.failRate }}%</span>
              <span class="leg skip-text">⏭ {{ currentSprint.skipRate }}%</span>
            </div>
          </div>
          <div class="detail-stat">
            <span class="detail-stat-label">Bugs found vs resolved</span>
            <div class="bug-comparison">
              <div>
                <div class="bug-num red">{{ currentSprint.bugsFound }}</div>
                <div class="bug-label">found</div>
              </div>
              <div class="bug-arrow">→</div>
              <div>
                <div class="bug-num green">{{ currentSprint.bugsFixed }}</div>
                <div class="bug-label">resolved</div>
              </div>
              <div>
                <div class="bug-num amber">{{ currentSprint.bugsFound - currentSprint.bugsFixed }}</div>
                <div class="bug-label">pending</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Charts -->
      <section class="charts-grid">
        <div class="chart-card chart-wide">
          <div class="chart-header">
            <h2 class="chart-title">Pass Rate — history</h2>
            <span class="chart-badge">amber dot = selected sprint · click point to switch</span>
          </div>
          <div class="chart-wrap"><canvas ref="passRateCanvas"></canvas></div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h2 class="chart-title">Coverage by Type</h2>
            <span class="chart-badge">%</span>
          </div>
          <div class="chart-wrap chart-wrap--radar"><canvas ref="coverageCanvas"></canvas></div>
        </div>

        <div class="chart-card chart-wide">
          <div class="chart-header">
            <h2 class="chart-title">Bugs by Module & Severity</h2>
            <span class="chart-badge">stacked</span>
          </div>
          <div class="chart-wrap"><canvas ref="bugsCanvas"></canvas></div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h2 class="chart-title">Avg Response Time</h2>
            <span class="chart-badge">ms · click point to switch sprint</span>
          </div>
          <div class="chart-wrap"><canvas ref="responseCanvas"></canvas></div>
        </div>
      </section>

      <!-- Tabla historial -->
      <section class="table-section">
        <div class="chart-header">
          <h2 class="chart-title">Full history</h2>
          <div style="display:flex;gap:8px;align-items:center">
            <span class="chart-badge">{{ sprintData.length }} sprints · click row to select</span>
          </div>
        </div>
        <div class="table-wrap">
          <table class="metrics-table">
            <thead>
              <tr>
                <th>Sprint</th><th>Tests</th><th>Pass</th><th>Fail</th>
                <th>Bugs ↑</th><th>Bugs ↓</th><th>Response</th><th>Health</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in sprintData" :key="row.sprint"
                  :class="{ highlight: row.sprint === selectedSprint }"
                  @click="selectedSprint = row.sprint" style="cursor:pointer">
                <td class="sprint-col">{{ row.sprint }}</td>
                <td>{{ row.totalTests }}</td>
                <td><span class="pass-pill">{{ row.passRate }}%</span></td>
                <td><span class="fail-pill">{{ row.failRate }}%</span></td>
                <td>{{ row.bugsFound }}</td>
                <td>{{ row.bugsFixed }}</td>
                <td>{{ row.avgResponseTime }}ms</td>
                <td>
                  <div class="health-bar-wrap">
                    <div class="health-bar" :style="{ width: row.passRate + '%' }"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Section: how to connect real data -->
      <section class="how-to-section" id="connect">
        <div class="chart-header">
          <h2 class="chart-title">How to connect real data?</h2>
          <span class="chart-badge">docs</span>
        </div>
        <div class="how-to-grid">
          <div class="how-to-card">
            <div class="how-to-num">01</div>
            <h3>Typical data sources</h3>
            <p>QA data typically comes from <strong>Jira</strong> (bugs), <strong>TestRail / Xray</strong> (results), <strong>SonarQube</strong> (coverage) or the JSON/XML reports from your CI pipeline (pytest, Cypress, Allure).</p>
          </div>
          <div class="how-to-card">
            <div class="how-to-num">02</div>
            <h3>Replace the mocks</h3>
            <p>Mock data lives in <code>src/data/metrics.ts</code>. The <code>SprintMetrics</code> type defines exactly what fields the dashboard needs. Create a composable that fetches from your API returning that same type — nothing else changes.</p>
          </div>
          <div class="how-to-card">
            <div class="how-to-num">03</div>
            <h3>Minimal example</h3>
            <pre class="code-block">// composables/useMetrics.ts
import type { SprintMetrics } from '../data/metrics'

export async function fetchSprints() {
  const res = await fetch('/api/qa/sprints')
  return res.json() as Promise&lt;SprintMetrics[]&gt;
}

// En App.vue, sustituye la línea:
// import { sprintData } from './data/metrics'
// Por:
// const sprintData = await fetchSprints()</pre>
          </div>
        </div>
      </section>

    </main>

    <footer class="footer">
      Built by <a href="https://github.com/bmontes1067" target="_blank">Belén Montes</a>
      · QA Automation Engineer · Vue 3 + Chart.js
      · Data: static mock in <code>src/data/metrics.ts</code>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import { sprintData, bugsByModule, coverageByType } from './data/metrics'

// ─── Estado principal ────────────────────────────────────────────────────────
// El selected sprint controla TODOS los elementos del dashboard:
// KPIs, detalle de sprint, punto destacado en gráficas, y fila en tabla.
const selectedSprint = ref(sprintData[sprintData.length - 1].sprint)

// ─── Datos del selected sprint ───────────────────────────────────────────
const currentSprint = computed(() =>
  sprintData.find(s => s.sprint === selectedSprint.value) ?? sprintData[sprintData.length - 1]
)
const previousSprint = computed(() => {
  const idx = sprintData.findIndex(s => s.sprint === selectedSprint.value)
  return idx > 0 ? sprintData[idx - 1] : null
})

// ─── Deltas vs previous sprint ────────────────────────────────────────────────
const passRateDelta = computed(() =>
  previousSprint.value ? currentSprint.value.passRate - previousSprint.value.passRate : 0)
const testsDelta = computed(() =>
  previousSprint.value ? currentSprint.value.totalTests - previousSprint.value.totalTests : 0)
const bugsDelta = computed(() =>
  previousSprint.value ? currentSprint.value.bugsFound - previousSprint.value.bugsFound : 0)
const responseDelta = computed(() =>
  previousSprint.value ? currentSprint.value.avgResponseTime - previousSprint.value.avgResponseTime : 0)

// ─── Canvas refs ──────────────────────────────────────────────────────────────
const passRateCanvas = ref<HTMLCanvasElement>()
const coverageCanvas = ref<HTMLCanvasElement>()
const bugsCanvas     = ref<HTMLCanvasElement>()
const responseCanvas = ref<HTMLCanvasElement>()

// Guardamos instancias para destruirlas antes de redibujar
let charts: Chart[] = []

// ─── Colores ──────────────────────────────────────────────────────────────────
const AMBER = '#f59e0b'
const GREEN = '#10b981'
const RED   = '#ef4444'
const BLUE  = '#3b82f6'
const MUTED = 'rgba(255,255,255,0.07)'
const TEXT  = 'rgba(255,255,255,0.5)'

Chart.defaults.color = TEXT
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)'
Chart.defaults.font.family = "'DM Mono', monospace"

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => buildAllCharts())

// Cuando cambia el selected sprint, reconstruimos las gráficas
// to correctly update the highlighted (amber) dot.
watch(selectedSprint, async () => {
  await nextTick()
  buildAllCharts()
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pointColors(baseColor: string) {
  return sprintData.map(s => s.sprint === selectedSprint.value ? AMBER : baseColor)
}
function pointSizes() {
  return sprintData.map(s => s.sprint === selectedSprint.value ? 10 : 5)
}

function destroyAll() {
  charts.forEach(c => c.destroy())
  charts = []
}

function buildAllCharts() {
  destroyAll()
  charts.push(buildPassRateChart())
  charts.push(buildCoverageChart())
  charts.push(buildBugsChart())
  charts.push(buildResponseChart())
}

function buildPassRateChart(): Chart {
  return new Chart(passRateCanvas.value!, {
    type: 'line',
    data: {
      labels: sprintData.map(s => s.sprint),
      datasets: [
        {
          label: 'Pass %',
          data: sprintData.map(s => s.passRate),
          borderColor: GREEN,
          backgroundColor: 'rgba(16,185,129,0.08)',
          fill: true, tension: 0.4,
          pointBackgroundColor: pointColors(GREEN),
          pointRadius: pointSizes() as any,
          pointHoverRadius: 9,
        },
        {
          label: 'Fail %',
          data: sprintData.map(s => s.failRate),
          borderColor: RED,
          backgroundColor: 'rgba(239,68,68,0.06)',
          fill: true, tension: 0.4,
          pointBackgroundColor: RED,
          pointRadius: 5, pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      onClick: (_e, elements) => {
        if (elements.length) selectedSprint.value = sprintData[elements[0].index].sprint
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            afterBody: (items) => {
              const s = sprintData[items[0].dataIndex]
              return [`Tests: ${s.totalTests}`, `Bugs: ${s.bugsFound}`, `Response: ${s.avgResponseTime}ms`]
            }
          }
        }
      },
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v => v + '%' }, grid: { color: MUTED } },
        x: { grid: { color: MUTED } },
      },
    },
  })
}

function buildCoverageChart(): Chart {
  return new Chart(coverageCanvas.value!, {
    type: 'radar',
    data: {
      labels: coverageByType.labels,
      datasets: [{
        label: 'Coverage %',
        data: coverageByType.values,
        borderColor: AMBER,
        backgroundColor: 'rgba(245,158,11,0.15)',
        pointBackgroundColor: AMBER,
        pointRadius: 5,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { stepSize: 25, backdropColor: 'transparent' },
          grid: { color: MUTED },
          pointLabels: { color: TEXT, font: { size: 12 } },
          angleLines: { color: MUTED },
        },
      },
    },
  })
}

function buildBugsChart(): Chart {
  return new Chart(bugsCanvas.value!, {
    type: 'bar',
    data: {
      labels: bugsByModule.map(b => b.module),
      datasets: [
        { label: 'Critical', data: bugsByModule.map(b => b.critical), backgroundColor: '#ef4444' },
        { label: 'High',     data: bugsByModule.map(b => b.high),     backgroundColor: '#f97316' },
        { label: 'Medium',   data: bugsByModule.map(b => b.medium),   backgroundColor: AMBER },
        { label: 'Low',      data: bugsByModule.map(b => b.low),      backgroundColor: 'rgba(255,255,255,0.18)' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { stacked: true, grid: { color: MUTED } },
        y: { stacked: true, grid: { color: MUTED } },
      },
    },
  })
}

function buildResponseChart(): Chart {
  return new Chart(responseCanvas.value!, {
    type: 'line',
    data: {
      labels: sprintData.map(s => s.sprint),
      datasets: [{
        label: 'Avg Response (ms)',
        data: sprintData.map(s => s.avgResponseTime),
        borderColor: BLUE,
        backgroundColor: 'rgba(59,130,246,0.08)',
        fill: true, tension: 0.4,
        pointBackgroundColor: pointColors(BLUE),
        pointRadius: pointSizes() as any,
        pointHoverRadius: 8,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      onClick: (_e, elements) => {
        if (elements.length) selectedSprint.value = sprintData[elements[0].index].sprint
      },
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: v => v + 'ms' }, grid: { color: MUTED } },
        x: { grid: { color: MUTED } },
      },
    },
  })
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bricolage+Grotesque:wght@400;600;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0c0c0e;--card:#18181d;--border:rgba(255,255,255,0.07);--amber:#f59e0b;--green:#10b981;--red:#ef4444;--blue:#3b82f6;--text:#e4e4f0;--muted:#6b6b85}
html,body{height:100%;background:var(--bg);color:var(--text)}
.app{min-height:100vh;font-family:'Bricolage Grotesque',sans-serif}
.grain{position:fixed;inset:0;pointer-events:none;z-index:100;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* Header */
.header{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid var(--border);background:rgba(12,12,14,.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:50}
.header-left{display:flex;align-items:center;gap:16px}
.logo-mark{width:42px;height:42px;background:var(--amber);color:#000;font-family:'DM Mono',monospace;font-size:13px;font-weight:500;display:grid;place-items:center;border-radius:10px}
.header-title{font-size:1.15rem;font-weight:800;letter-spacing:-.5px}
.header-sub{font-size:.73rem;color:var(--muted);font-family:'DM Mono',monospace;margin-top:2px}
.header-right{display:flex;align-items:center;gap:12px}
.data-source-tag{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:1px;color:var(--muted);border:1px solid var(--border);padding:4px 10px;border-radius:100px}
.sprint-selector{display:flex;align-items:center;gap:8px}
.select-label{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted)}
.sprint-select{background:var(--card);border:1px solid rgba(245,158,11,.4);color:var(--text);padding:7px 12px;border-radius:8px;font-family:'DM Mono',monospace;font-size:13px;cursor:pointer;outline:none;transition:border-color .2s}
.sprint-select:focus,.sprint-select:hover{border-color:var(--amber)}

/* Banner */
.data-banner{display:flex;align-items:flex-start;gap:10px;background:rgba(245,158,11,.06);border-bottom:1px solid rgba(245,158,11,.12);padding:10px 32px;font-size:.78rem;color:rgba(255,255,255,.55);line-height:1.6}
.data-banner code{background:rgba(255,255,255,.08);padding:1px 5px;border-radius:4px;font-family:'DM Mono',monospace;font-size:10px;color:var(--amber)}
.data-banner a{color:var(--amber)}
.data-banner strong{color:rgba(255,255,255,.8)}

/* Main */
.main{padding:28px 32px;max-width:1400px;margin:0 auto}

/* KPIs */
.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.kpi-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px 18px;animation:fadeUp .5s both;transition:border-color .2s,transform .2s}
.kpi-card:hover{border-color:rgba(245,158,11,.4);transform:translateY(-2px)}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.kpi-icon{font-size:1.3rem;margin-bottom:10px}
.kpi-value{font-size:2rem;font-weight:800;letter-spacing:-1px;transition:all .3s}
.kpi-label{font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin:5px 0 7px;font-family:'DM Mono',monospace}
.kpi-delta{font-size:.72rem;font-family:'DM Mono',monospace}
.kpi-delta.positive{color:var(--green)}
.kpi-delta.negative{color:var(--red)}

/* Sprint detail */
.sprint-detail-section{background:var(--card);border:1px solid rgba(245,158,11,.15);border-radius:14px;padding:22px;margin-bottom:24px;animation:fadeUp .55s both}
.sprint-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:4px}
.detail-stat{}
.detail-stat-label{font-family:'DM Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);display:block;margin-bottom:10px}
.detail-bar-group{display:flex;height:8px;border-radius:4px;overflow:hidden;gap:2px;margin-bottom:8px}
.detail-bar{height:100%;border-radius:4px;transition:width .5s ease}
.detail-bar.pass{background:var(--green)}
.detail-bar.fail{background:var(--red)}
.detail-bar.skip{background:var(--muted)}
.detail-bar-legend{display:flex;gap:16px}
.leg{font-family:'DM Mono',monospace;font-size:11px}
.pass-text{color:var(--green)}
.fail-text{color:var(--red)}
.skip-text{color:var(--muted)}
.bug-comparison{display:flex;align-items:center;gap:24px}
.bug-num{font-size:2rem;font-weight:800;letter-spacing:-1px}
.bug-num.red{color:var(--red)}
.bug-num.green{color:var(--green)}
.bug-num.amber{color:var(--amber)}
.bug-label{font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
.bug-arrow{font-size:1.5rem;color:var(--muted)}

/* Charts */
.charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
.chart-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px;animation:fadeUp .6s both}
.chart-wide{}
.chart-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:8px}
.chart-title{font-size:.92rem;font-weight:600}
.chart-badge{font-family:'DM Mono',monospace;font-size:9px;background:rgba(245,158,11,.1);color:var(--amber);border:1px solid rgba(245,158,11,.2);padding:3px 9px;border-radius:100px;letter-spacing:.3px}
.chart-wrap{height:230px;position:relative}
.chart-wrap--radar{height:250px}

/* Table */
.table-section{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px;margin-bottom:24px;animation:fadeUp .65s both}
.table-wrap{overflow-x:auto;margin-top:4px}
.metrics-table{width:100%;border-collapse:collapse;font-size:.8rem}
.metrics-table th{text-align:left;padding:9px 13px;font-family:'DM Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);border-bottom:1px solid var(--border)}
.metrics-table td{padding:11px 13px;border-bottom:1px solid rgba(255,255,255,.03);font-family:'DM Mono',monospace;color:rgba(255,255,255,.7);transition:background .2s}
.metrics-table tr:last-child td{border-bottom:none}
.metrics-table tr:hover td{background:rgba(255,255,255,.025)}
.metrics-table tr.highlight td{background:rgba(245,158,11,.07)!important}
.metrics-table tr.highlight .sprint-col{color:var(--amber)!important}
.sprint-col{color:rgba(245,158,11,.7);font-weight:500}
.pass-pill{background:rgba(16,185,129,.15);color:var(--green);padding:2px 7px;border-radius:100px;font-size:10px}
.fail-pill{background:rgba(239,68,68,.12);color:var(--red);padding:2px 7px;border-radius:100px;font-size:10px}
.health-bar-wrap{width:80px;height:4px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden}
.health-bar{height:100%;background:var(--green);border-radius:2px}

/* How to */
.how-to-section{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px;animation:fadeUp .7s both}
.how-to-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:6px}
.how-to-card{padding:18px;background:rgba(255,255,255,.02);border-radius:10px;border:1px solid var(--border)}
.how-to-num{font-family:'DM Mono',monospace;font-size:10px;color:var(--amber);letter-spacing:2px;margin-bottom:8px}
.how-to-card h3{font-size:.85rem;font-weight:600;margin-bottom:7px}
.how-to-card p{font-size:.78rem;color:var(--muted);line-height:1.7}
.how-to-card code{background:rgba(255,255,255,.07);padding:1px 5px;border-radius:4px;font-family:'DM Mono',monospace;font-size:10px;color:var(--amber)}
.code-block{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;font-family:'DM Mono',monospace;font-size:9.5px;color:rgba(255,255,255,.55);line-height:1.75;margin-top:8px;overflow-x:auto;white-space:pre}

/* Footer */
.footer{text-align:center;padding:28px;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);border-top:1px solid var(--border)}
.footer a{color:var(--amber);text-decoration:none}
.footer a:hover{text-decoration:underline}
.footer code{font-size:9px;background:rgba(255,255,255,.05);padding:1px 5px;border-radius:4px}

@media(max-width:1024px){.how-to-grid{grid-template-columns:1fr}.sprint-detail-grid{grid-template-columns:1fr}}
@media(max-width:900px){.kpi-row{grid-template-columns:repeat(2,1fr)}.charts-grid{grid-template-columns:1fr}.main{padding:20px}}
@media(max-width:500px){.header{padding:14px 16px}.header-title{font-size:1rem}.data-source-tag{display:none}}
</style>
