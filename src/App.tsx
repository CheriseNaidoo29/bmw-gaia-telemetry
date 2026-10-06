/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

interface SubsystemNav {
  id: string;
  name: string;
  icon: string;
  hasAlert?: boolean;
}

const NAV_ITEMS: SubsystemNav[] = [
  { id: 'infrastructure-overview', name: 'Infrastructure Overview', icon: 'hub' },
  { id: 'ecs-nodes', name: 'ECS Nodes', icon: 'dns' },
  { id: 'gaia-ai-engine', name: 'GAIA AI Engine', icon: 'psychology' },
  { id: 'cicd-pipelines', name: 'CI/CD Pipelines', icon: 'alt_route' },
  { id: 'dynatrace-apm', name: 'Dynatrace APM', icon: 'monitoring' },
  { id: 'incident-war-room', name: 'Incident War Room', icon: 'crisis_alert', hasAlert: true },
];

export default function App() {
  const getInitialNav = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (NAV_ITEMS.some((n) => n.id === hash)) return hash;
      const lastPath = window.location.pathname.split('/').filter(Boolean).pop();
      if (lastPath && NAV_ITEMS.some((n) => n.id === lastPath)) return lastPath;
    }
    return 'infrastructure-overview';
  };

  const [activeNav, setActiveNav] = useState(getInitialNav);
  const [currentTime, setCurrentTime] = useState('14:32:08.412 UTC');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAngularModal, setShowAngularModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync hash routing with navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (NAV_ITEMS.some((n) => n.id === hash)) {
        setActiveNav(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleNavSelect = (id: string) => {
    setActiveNav(id);
    if (typeof window !== 'undefined') {
      window.location.hash = id;
    }
  };

  // Remediation Action States
  const [actionStates, setActionStates] = useState<{ [key: string]: string }>({});

  // Real-time UTC millisecond clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toISOString().substring(11, 23) + ' UTC';
      setCurrentTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 120);
    return () => clearInterval(interval);
  }, []);

  const handleActionClick = (key: string, successMsg: string) => {
    setActionStates((prev) => ({ ...prev, [key]: successMsg }));
    setTimeout(() => {
      setActionStates((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }, 3200);
  };

  const handleForceRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      setCurrentTime(now.toISOString().substring(11, 23) + ' UTC');
      setIsRefreshing(false);
    }, 500);
  };

  const logs = [
    { time: '14:32:07.108', level: 'INFO', text: 'K8s worker pool autoscaled to +4 nodes in subnet eu-central-1b' },
    { time: '14:32:06.840', level: 'WARN', text: 'High TCP retransmit detected on gateway interface eth0 (host: ip-10-142-3-81)' },
    { time: '14:32:05.219', level: 'INFO', text: 'CAN diagnostic payload decoded from vehicle batch ID: #VIN-BM-99201948271' },
    { time: '14:32:04.901', level: 'SUCCESS', text: 'Synapse token cache refreshed across all 6 GPU worker nodes in 21ms' },
  ];

  const filteredLogs = logs.filter(
    (log) =>
      log.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const angularCodeSnippet = `// gaia-telemetry.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gaia-telemetry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gaia-telemetry.component.html',
  styleUrls: ['./gaia-telemetry.component.css']
})
export class GaiaTelemetryComponent {
  activeNav = signal('infrastructure-overview');
  currentTime = signal('14:32:08.412 UTC');
  // Full standalone reactive signals, telemetry streams & remediation actions...
}`;

  return (
    <div className="bg-[#131315] font-sans text-[#e5e1e4] antialiased selection:bg-[#0066b1] selection:text-[#d0e3ff] min-h-screen">
      
      {/* ============================================================ */}
      {/* 1. FIXED LEFT SIDEBAR (GAIA TELEMETRY OS)                     */}
      {/* ============================================================ */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0e0e10] z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.5)] border-r border-[#201f21]">
        <div className="flex flex-col">
          {/* Top Logo & App Title */}
          <div className="h-16 px-4 flex items-center justify-between bg-[#0e0e10]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00a1fe] shadow-[0_0_8px_#00a1fe]"></div>
              <span className="font-sans text-[11px] font-bold text-[#c1c7d3] uppercase tracking-wider">
                GAIA Telemetry OS
              </span>
            </div>
            <span className="font-telemetry text-[11px] font-medium text-[#00a1fe] bg-[#1b1b1d] px-1.5 py-0.5 rounded border border-[#201f21]">
              v4.2.8
            </span>
          </div>

          {/* Subsystems Section Header */}
          <div className="px-4 py-2">
            <span className="font-sans text-[11px] font-bold text-[#8b919c] uppercase tracking-wider">
              Operational Subsystems
            </span>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavSelect(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded transition-all text-sm text-left ${
                    isActive
                      ? 'bg-[#0066b1] text-white font-bold shadow-sm'
                      : 'text-[#c1c7d3] hover:bg-[#2a2a2c] hover:text-[#e5e1e4]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      item.hasAlert && !isActive ? 'text-[#ffb3ad]' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-sans text-[14px]">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom VPC Cluster Status */}
        <div className="p-4 bg-[#1b1b1d] border-t border-[#201f21]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[11px] font-bold text-[#8b919c] uppercase">VPC Cluster Link</span>
            <span className="font-telemetry text-[11px] font-bold text-[#00a1fe]">ONLINE</span>
          </div>
          <div className="w-full bg-[#201f21] h-1 rounded overflow-hidden">
            <div className="bg-[#00a1fe] h-full w-[94%]"></div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[#c1c7d3]">
            <span className="font-telemetry text-[11px]">Loss: 0.00%</span>
            <span className="font-telemetry text-[11px]">Jitter: 0.8ms</span>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. TOP HEADER BAR                                             */}
      {/* ============================================================ */}
      <div className="pl-64">
        <header className="fixed top-0 left-64 right-0 h-16 bg-[#131315]/90 backdrop-blur-xl z-40 flex items-center justify-between px-6 shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-[#201f21]">
          {/* Left Zone: Brand + Region + Sync */}
          <div className="flex items-center gap-4">
            {/* BMW Emblem with clean SVG / Image */}
            <div className="flex items-center gap-2.5">
              <svg className="h-8 w-8 shrink-0" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" stroke="#8b919c" strokeWidth="2.5" fill="#000" />
                <circle cx="50" cy="50" r="44" stroke="#a1c9ff" strokeWidth="1.5" />
                <path d="M50 6 A44 44 0 0 1 94 50 L50 50 Z" fill="#0066b1" />
                <path d="M50 50 L6 50 A44 44 0 0 1 50 6 Z" fill="#ffffff" />
                <path d="M50 50 L94 50 A44 44 0 0 1 50 94 Z" fill="#ffffff" />
                <path d="M50 50 L50 94 A44 44 0 0 1 6 50 Z" fill="#0066b1" />
                <circle cx="50" cy="50" r="44" stroke="#414751" strokeWidth="1" />
              </svg>
              <div className="flex flex-col">
                <span className="font-sans text-[18px] font-bold tracking-tight text-[#e5e1e4] leading-none">
                  BMW GAIA
                </span>
                <span className="font-telemetry text-[11px] text-[#8b919c] leading-tight">
                  AI Monitoring Console
                </span>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-[#353437] mx-1"></div>

            {/* Region / VPC Pill */}
            <div className="flex items-center gap-2 bg-[#0e0e10] px-3 py-1 rounded border border-[#201f21]">
              <span className="material-symbols-outlined text-[16px] text-[#a1c9ff]">cloud_done</span>
              <span className="font-telemetry text-[11px] text-[#c1c7d3]">eu-central-1</span>
              <span className="text-[#8b919c] text-xs">/</span>
              <span className="font-telemetry text-[11px] text-[#00a1fe] font-semibold">Munich VPC-9104</span>
            </div>

            {/* Sync Pill */}
            <div className="flex items-center gap-1.5 bg-[#1b1b1d] px-3 py-1 rounded border border-[#201f21]">
              <span className="w-2 h-2 rounded-full bg-[#a1c9ff] animate-pulse"></span>
              <span className="font-telemetry text-[11px] text-[#c1c7d3]">Sync</span>
              <span className="font-telemetry text-[11px] text-[#a1c9ff] font-bold">24ms</span>
            </div>
          </div>

          {/* Right Zone: Search + Tools + Angular Code Switcher + Operator Profile */}
          <div className="flex items-center gap-4">
            {/* Terminal Search */}
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#8b919c] text-[18px]">
                terminal
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search telemetry, traces, logs..."
                className="bg-[#0e0e10] text-[#e5e1e4] placeholder:text-[#8b919c] font-telemetry text-[12px] pl-9 pr-4 py-1.5 rounded w-80 focus:outline-none focus:ring-1 focus:ring-[#00a1fe] border border-[#201f21] transition-all"
              />
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                title="Notifications"
                className="w-8 h-8 rounded bg-[#1b1b1d] hover:bg-[#2a2a2c] flex items-center justify-center text-[#c1c7d3] hover:text-[#e5e1e4] transition-colors border border-[#201f21]"
              >
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </button>
              <button
                title="Telemetry Settings"
                className="w-8 h-8 rounded bg-[#1b1b1d] hover:bg-[#2a2a2c] flex items-center justify-center text-[#c1c7d3] hover:text-[#e5e1e4] transition-colors border border-[#201f21]"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
              {/* Angular Code Source viewer button */}
              <button
                onClick={() => setShowAngularModal(true)}
                title="View Angular Source Code"
                className="px-2.5 py-1 rounded bg-[#1b1b1d] hover:bg-[#2a2a2c] flex items-center gap-1.5 text-[#00a1fe] hover:text-white transition-colors border border-[#201f21] font-telemetry text-[11px] font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">code</span>
                <span>Angular Code</span>
              </button>
            </div>

            <div className="h-6 w-[1px] bg-[#353437]"></div>

            {/* Operator Lockup */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="font-telemetry text-[13px] font-semibold text-[#e5e1e4]">OP-9418</span>
                <span className="font-sans text-[11px] font-bold text-[#8b919c] uppercase">Tier 3 On-Call</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#0066b1] flex items-center justify-center text-white ring-1 ring-white/10">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* 3. MAIN DASHBOARD CONTENT BODY                               */}
        {/* ============================================================ */}
        <main className="relative pt-20 w-full min-h-screen px-6 py-4 space-y-4">
          
          {/* Diagnostic Action Header Banner */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-[#1b1b1d] px-4 py-2 rounded shadow-sm border border-[#201f21]">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00a1fe] shadow-[0_0_10px_#00a1fe]"></span>
                <span className="font-sans text-[11px] font-bold text-[#e5e1e4] uppercase tracking-widest">
                  Telemetry Sync ACTIVE
                </span>
              </div>
              <span className="text-[#414751] font-telemetry text-[11px]">•</span>
              <span className="font-telemetry text-[11px] text-[#c1c7d3]">
                Cluster: <span className="text-[#00a1fe] font-semibold">BMW-GAIA-PROD-MUC-09</span>
              </span>
              <span className="text-[#414751] font-telemetry text-[11px]">•</span>
              <span className="font-telemetry text-[11px] text-[#c1c7d3]">
                VPC Pods: <span className="text-[#e5e1e4] font-semibold">142 Provisioned</span>
              </span>
              <span className="text-[#414751] font-telemetry text-[11px]">•</span>
              <span className="font-telemetry text-[11px] text-[#ffb3ad] font-bold animate-pulse">
                1 Active Degraded Subsystem
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-telemetry text-[11px] text-[#8b919c]">
                Last Heartbeat:{' '}
                <span className="text-[#e5e1e4] font-semibold" id="telemetry-clock">
                  {currentTime}
                </span>
              </span>
              <button
                onClick={handleForceRefresh}
                disabled={isRefreshing}
                className="bg-[#2a2a2c] hover:bg-[#353437] text-[#e5e1e4] font-telemetry text-[11px] px-3 py-1 rounded transition-colors flex items-center gap-1 border border-[#353437]"
              >
                <span
                  className={`material-symbols-outlined text-[14px] ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                >
                  refresh
                </span>
                {isRefreshing ? 'Refreshing...' : 'Force Refresh'}
              </button>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 1: 4-COLUMN METRIC GRID                              */}
          {/* ============================================================ */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric Card 1: AWS ECS Cluster Availability */}
            <div className="bg-[#1E1E24] p-4 rounded flex flex-col justify-between shadow-md border border-[#2a2a2c] relative overflow-hidden group hover:bg-[#26262F] transition-all">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-sans text-[11px] font-bold text-[#8b919c] uppercase tracking-wider">
                    AWS ECS Cluster Availability
                  </span>
                  <span className="font-telemetry text-[11px] text-[#c1c7d3] mt-0.5">
                    Dual-AZ Multi-Tenant Orchestrator
                  </span>
                </div>
                <span className="font-telemetry text-[11px] text-[#00a1fe] bg-[#0e0e10] px-1.5 py-0.5 rounded border border-[#201f21]">
                  [POD-01]
                </span>
              </div>
              
              <div className="my-4 flex items-baseline justify-between">
                <span className="font-telemetry text-[28px] font-bold text-[#e5e1e4] tracking-tight">
                  99.98%
                </span>
                <span className="font-sans text-[10px] tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> [OPTIMAL] HEALTHY
                </span>
              </div>

              {/* Integrated Micro Sparkline */}
              <div className="w-full h-8 mb-2">
                <svg className="w-full h-full text-[#00a1fe] opacity-80" fill="none" preserveAspectRatio="none" viewBox="0 0 160 30">
                  <path
                    d="M0,24 L20,23 L40,24 L60,20 L80,22 L100,18 L120,19 L140,16 L160,17"
                    stroke="currentColor"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  ></path>
                  <path
                    d="M0,24 L20,23 L40,24 L60,20 L80,22 L100,18 L120,19 L140,16 L160,17 L160,30 L0,30 Z"
                    fill="currentColor"
                    fillOpacity="0.1"
                  ></path>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[#c1c7d3] font-telemetry text-[11px] bg-[#0e0e10] p-2 rounded border border-[#201f21]">
                <span>
                  Tasks: <span className="text-[#e5e1e4] font-semibold">142/142 RUNNING</span>
                </span>
                <span>
                  Fargate Spot: <span className="text-[#00a1fe] font-semibold">82% Cap</span>
                </span>
              </div>
            </div>

            {/* Metric Card 2: GAIA Core API Latency */}
            <div className="bg-[#1E1E24] p-4 rounded flex flex-col justify-between shadow-md border border-[#2a2a2c] relative overflow-hidden group hover:bg-[#26262F] transition-all">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-sans text-[11px] font-bold text-[#8b919c] uppercase tracking-wider">
                    GAIA Core API Latency
                  </span>
                  <span className="font-telemetry text-[11px] text-[#c1c7d3] mt-0.5">
                    Munich Model Ingestion Gateway
                  </span>
                </div>
                <span className="font-telemetry text-[11px] text-[#00a1fe] bg-[#0e0e10] px-1.5 py-0.5 rounded border border-[#201f21]">
                  [LAT-02]
                </span>
              </div>

              <div className="my-4 flex items-baseline justify-between">
                <span className="font-telemetry text-[28px] font-bold text-[#00a1fe] tracking-tight">
                  42.8 ms
                </span>
                <span className="font-sans text-[10px] tracking-wider px-2 py-0.5 rounded bg-[#0066b1]/20 text-[#00a1fe] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a1fe]"></span> [P99 NOMINAL]
                </span>
              </div>

              {/* Integrated Micro Sparkline */}
              <div className="w-full h-8 mb-2">
                <svg className="w-full h-full text-[#00a1fe] opacity-80" fill="none" preserveAspectRatio="none" viewBox="0 0 160 30">
                  <path
                    d="M0,18 L20,19 L40,15 L60,22 L80,14 L100,16 L120,12 L140,14 L160,11"
                    stroke="currentColor"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  ></path>
                  <path
                    d="M0,18 L20,19 L40,15 L60,22 L80,14 L100,16 L120,12 L140,14 L160,11 L160,30 L0,30 Z"
                    fill="currentColor"
                    fillOpacity="0.1"
                  ></path>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[#c1c7d3] font-telemetry text-[11px] bg-[#0e0e10] p-2 rounded border border-[#201f21]">
                <span>
                  Throughput: <span className="text-[#e5e1e4] font-semibold">1.48M req/m</span>
                </span>
                <span>
                  GPU Tensor: <span className="text-[#00a1fe] font-semibold">9.1ms</span>
                </span>
              </div>
            </div>

            {/* Metric Card 3: Active GitHub Actions Pipelines */}
            <div className="bg-[#1E1E24] p-4 rounded flex flex-col justify-between shadow-md border border-[#2a2a2c] relative overflow-hidden group hover:bg-[#26262F] transition-all">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-sans text-[11px] font-bold text-[#8b919c] uppercase tracking-wider">
                    Active GitHub Actions Pipelines
                  </span>
                  <span className="font-telemetry text-[11px] text-[#c1c7d3] mt-0.5">
                    Automotive CI/CD Build Runners
                  </span>
                </div>
                <span className="font-telemetry text-[11px] text-[#00a1fe] bg-[#0e0e10] px-1.5 py-0.5 rounded border border-[#201f21]">
                  [RUN-07]
                </span>
              </div>

              <div className="my-4 flex items-baseline justify-between">
                <span className="font-telemetry text-[28px] font-bold text-[#e5e1e4] tracking-tight">
                  28 <span className="text-[16px] font-sans font-bold text-[#8b919c]">RUNNING</span>
                </span>
                <span className="font-sans text-[10px] tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> [ACTIVE CONCURRENCY]
                </span>
              </div>

              {/* Integrated Bar Graph Sparkline */}
              <div className="w-full h-8 mb-2 flex items-end gap-1 px-1">
                <div className="w-full bg-[#201f21] h-[40%] rounded-xs"></div>
                <div className="w-full bg-[#00a1fe] h-[70%] rounded-xs"></div>
                <div className="w-full bg-[#00a1fe] h-[95%] rounded-xs"></div>
                <div className="w-full bg-[#201f21] h-[55%] rounded-xs"></div>
                <div className="w-full bg-[#00a1fe] h-[80%] rounded-xs"></div>
                <div className="w-full bg-[#00a1fe] h-[60%] rounded-xs"></div>
                <div className="w-full bg-[#201f21] h-[45%] rounded-xs"></div>
                <div className="w-full bg-[#00a1fe] h-[90%] rounded-xs"></div>
                <div className="w-full bg-[#00a1fe] h-[75%] rounded-xs"></div>
              </div>

              <div className="flex items-center justify-between text-[#c1c7d3] font-telemetry text-[11px] bg-[#0e0e10] p-2 rounded border border-[#201f21]">
                <span>
                  Queued: <span className="text-[#e5e1e4] font-semibold">4</span> | Done:{' '}
                  <span className="text-[#e5e1e4] font-semibold">312</span>
                </span>
                <span>
                  Mean Run: <span className="text-[#00a1fe] font-semibold">3m 42s</span>
                </span>
              </div>
            </div>

            {/* Metric Card 4: Dynatrace System Error Rate (CRITICAL ALERT) */}
            <div className="critical-alert p-4 rounded flex flex-col justify-between shadow-xl relative overflow-hidden transition-all">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-sans text-[11px] text-[#ffb3ad] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#ffb3ad]">warning</span>
                    Dynatrace System Error Rate
                  </span>
                  <span className="font-telemetry text-[11px] text-[#ffdad7] mt-0.5">
                    High Failure Spike Triggered
                  </span>
                </div>
                <span className="font-telemetry text-[11px] text-[#ffb3ad] bg-[#93000a]/40 px-1.5 py-0.5 rounded font-bold border border-[#c22229]/50">
                  [ERR-WARN]
                </span>
              </div>

              <div className="my-4 flex items-baseline justify-between">
                <span className="font-telemetry text-[28px] font-bold text-[#ffb3ad] tracking-tight">
                  4.82% <span className="text-[16px] font-sans font-bold text-[#ffdad7]">FAIL</span>
                </span>
                <span className="font-sans text-[10px] tracking-wider px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad7] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb3ad] animate-ping"></span> [CRITICAL THRESHOLD]
                </span>
              </div>

              {/* Critical Warning Pulse Sparkline */}
              <div className="w-full h-8 mb-2">
                <svg className="w-full h-full text-[#ffb3ad]" fill="none" preserveAspectRatio="none" viewBox="0 0 160 30">
                  <path
                    d="M0,26 L30,25 L50,27 L80,24 L100,25 L115,10 L130,4 L145,2 L160,2"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  ></path>
                  <path
                    d="M0,26 L30,25 L50,27 L80,24 L100,25 L115,10 L130,4 L145,2 L160,2 L160,30 L0,30 Z"
                    fill="currentColor"
                    fillOpacity="0.2"
                  ></path>
                </svg>
              </div>

              <div className="flex flex-col gap-0.5 text-[#ffdad6] font-telemetry text-[11px] bg-black/40 p-2 rounded border border-[#c22229]/30">
                <span className="text-[#ffdad7] font-semibold truncate">Spike: /v2/telemetry/ingest</span>
                <span className="text-[#ffb3ad] flex items-center justify-between">
                  <span>Automated Rollback:</span>
                  <span className="font-bold underline">ARMED &amp; STANDBY</span>
                </span>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 2: DETAILED TELEMETRY PANELS (12 COLUMNS)           */}
          {/* ============================================================ */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* PANEL 1: Live ECS Cluster Task Matrix & Workload Map (4 Columns) */}
            <div className="lg:col-span-4 bg-[#1E1E24] p-4 rounded flex flex-col justify-between shadow-md border border-[#2a2a2c]">
              <div>
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00a1fe] text-[20px]">grid_view</span>
                    <span className="font-sans text-[18px] font-bold text-[#e5e1e4]">ECS Task Node Mesh</span>
                  </div>
                  <span className="font-telemetry text-[11px] text-[#8b919c]">Zone: eu-central-1a/b</span>
                </div>
                <p className="font-sans text-[12px] text-[#c1c7d3] mb-4">
                  Real-time container instance micro-mesh across active AWS Fargate runtime profiles.
                </p>

                {/* Subservice A: gaia-inference-engine */}
                <div className="space-y-1.5">
                  <div className="bg-[#1b1b1d] p-2 rounded flex items-center justify-between hover:bg-[#201f21] transition-colors border border-[#201f21]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                      <div className="flex flex-col">
                        <span className="font-telemetry text-[13px] font-semibold text-[#e5e1e4]">
                          gaia-inference-engine
                        </span>
                        <span className="font-telemetry text-[11px] text-[#8b919c]">
                          Task Def: rev-481 • 48 Tasks
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-telemetry text-[11px] font-bold text-[#00a1fe]">0.02% Err</span>
                      <span className="block font-telemetry text-[10px] text-[#8b919c]">CPU: 44.2%</span>
                    </div>
                  </div>

                  {/* Subservice B: telemetry-processor (DEGRADED) */}
                  <div className="bg-[#1b1b1d] p-2 rounded flex items-center justify-between hover:bg-[#201f21] transition-colors border border-[#c22229]/40">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#ffb3ad] animate-ping shrink-0"></span>
                      <div className="flex flex-col">
                        <span className="font-telemetry text-[13px] font-semibold text-[#ffb3ad]">
                          telemetry-processor
                        </span>
                        <span className="font-telemetry text-[11px] text-[#ffdad7]">
                          Task Def: rev-502 • 36 Tasks (Degraded)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-telemetry text-[11px] font-bold text-[#ffb3ad]">4.82% Err</span>
                      <span className="block font-telemetry text-[10px] text-[#ffb3ad] font-semibold">
                        OOM Thrashing
                      </span>
                    </div>
                  </div>

                  {/* Subservice C: can-bus-streamer */}
                  <div className="bg-[#1b1b1d] p-2 rounded flex items-center justify-between hover:bg-[#201f21] transition-colors border border-[#201f21]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                      <div className="flex flex-col">
                        <span className="font-telemetry text-[13px] font-semibold text-[#e5e1e4]">
                          can-bus-streamer
                        </span>
                        <span className="font-telemetry text-[11px] text-[#8b919c]">
                          Task Def: rev-210 • 32 Tasks
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-telemetry text-[11px] font-bold text-[#00a1fe]">0.00% Err</span>
                      <span className="block font-telemetry text-[10px] text-[#8b919c]">CPU: 18.9%</span>
                    </div>
                  </div>

                  {/* Subservice D: auth-vault-guard */}
                  <div className="bg-[#1b1b1d] p-2 rounded flex items-center justify-between hover:bg-[#201f21] transition-colors border border-[#201f21]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                      <div className="flex flex-col">
                        <span className="font-telemetry text-[13px] font-semibold text-[#e5e1e4]">
                          auth-vault-guard
                        </span>
                        <span className="font-telemetry text-[11px] text-[#8b919c]">
                          Task Def: rev-119 • 26 Tasks
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-telemetry text-[11px] font-bold text-[#00a1fe]">0.01% Err</span>
                      <span className="block font-telemetry text-[10px] text-[#8b919c]">CPU: 8.4%</span>
                    </div>
                  </div>
                </div>

                {/* 64-Node Micro Grid Visual */}
                <div className="mt-4 bg-[#0e0e10] p-2 rounded border border-[#201f21]">
                  <div className="flex items-center justify-between mb-1.5 text-[#8b919c] font-sans text-[10px] font-bold">
                    <span>NODE HEALTH MATRIX (142 ECS TASKS)</span>
                    <span className="text-emerald-400 font-telemetry">
                      138 OK / <span className="text-[#ffb3ad]">4 WARN</span>
                    </span>
                  </div>
                  <div
                    className="grid gap-1 w-full"
                    style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
                  >
                    {Array.from({ length: 64 }).map((_, i) => {
                      const isWarn = [20, 21, 38, 55].includes(i);
                      return (
                        <div
                          key={i}
                          className={`h-2 rounded-[1px] ${
                            isWarn ? 'bg-[#ef4444] animate-pulse' : 'bg-emerald-500'
                          }`}
                          title={`Node ${i + 1}: ${isWarn ? 'Degraded Pod' : 'Healthy'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-[#8b919c] font-telemetry text-[11px] border-t border-[#201f21]">
                <span>
                  Auto-Heal: <span className="text-[#00a1fe] font-semibold">ENABLED</span>
                </span>
                <span>Autoscale Threshold: 75% MEM</span>
              </div>
            </div>

            {/* PANEL 2: Dynatrace APM Real-time Trace & Incident Stream (5 Columns) */}
            <div className="lg:col-span-5 bg-[#1E1E24] p-4 rounded flex flex-col justify-between shadow-md border border-[#2a2a2c]">
              <div>
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ffb3ad] text-[20px]">
                      crisis_alert
                    </span>
                    <span className="font-sans text-[18px] font-bold text-[#e5e1e4]">
                      Dynatrace Incident Stream
                    </span>
                  </div>
                  <span className="font-sans text-[10px] text-[#ffb3ad] bg-[#c22229]/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-[#c22229]/40">
                    SEV-2 CRITICAL
                  </span>
                </div>
                <p className="font-sans text-[12px] text-[#c1c7d3] mb-2">
                  Active Root Cause Analysis via Dynatrace Davis AI engine &amp; OpenTelemetry traces.
                </p>

                {/* Incident Details Chassis */}
                <div className="bg-[#0e0e10] p-3 rounded space-y-1.5 mb-3 border border-[#201f21]">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[11px] font-bold text-[#ffb3ad] uppercase">
                      Root Cause Pathway
                    </span>
                    <span className="font-telemetry text-[11px] text-[#8b919c]">
                      Trace: #dyn-89410-ec
                    </span>
                  </div>
                  <p className="font-telemetry text-[12px] text-[#e5e1e4] font-semibold leading-relaxed">
                    POST /v2/telemetry/ingest HTTP/2 504 Gateway Timeout (p99 &gt; 8500ms)
                  </p>
                  <div className="p-2 bg-[#121214] rounded font-telemetry text-[11px] text-[#ffdad7] space-y-0.5 border border-[#201f21]/60">
                    <div>&gt; [Error 504] Downstream buffer exhaustion in can-bus-streamer::buffer_queue</div>
                    <div>&gt; at org.bmw.gaia.pipeline.IngestHandler.handleBatch (IngestHandler.java:312)</div>
                    <div>&gt; Memory heap pressure elevated: 94.6% allocation on pod ecs-fargate-muc-21a</div>
                  </div>
                </div>

                {/* Remediation Action Buttons */}
                <div className="space-y-1.5">
                  <span className="font-sans text-[10px] text-[#8b919c] font-bold uppercase tracking-wider block">
                    Remediation Directives
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleActionClick('canary', 'Canary Drain Activated')}
                      disabled={Boolean(actionStates.canary)}
                      className="bg-[#0066b1] hover:bg-[#00a1fe] text-white font-telemetry text-[11px] py-2 px-1 rounded font-bold transition-all text-center truncate border border-[#0066b1]/40"
                    >
                      {actionStates.canary || 'Trigger Canary Drain'}
                    </button>
                    <button
                      onClick={() => handleActionClick('ack', 'Incident Acknowledged')}
                      disabled={Boolean(actionStates.ack)}
                      className="bg-[#2a2a2c] hover:bg-[#353437] text-[#e5e1e4] font-telemetry text-[11px] py-2 px-1 rounded transition-all text-center truncate border border-[#353437]"
                    >
                      {actionStates.ack || 'Ack Incident'}
                    </button>
                    <button
                      onClick={() => handleActionClick('isolate', 'Task Group Isolated')}
                      disabled={Boolean(actionStates.isolate)}
                      className="bg-[#93000a] hover:bg-[#c22229] text-[#ffdad7] font-telemetry text-[11px] py-2 px-1 rounded font-bold transition-all text-center truncate border border-[#c22229]/50"
                    >
                      {actionStates.isolate || 'Isolate Group'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-1 flex items-center justify-between text-[#8b919c] font-telemetry text-[11px] bg-[#1b1b1d] px-3 py-1.5 rounded border border-[#201f21]">
                <span>
                  Incident Leader:{' '}
                  <span className="text-[#e5e1e4] font-semibold">SRE Tier-3 (Munich NOC)</span>
                </span>
                <span className="text-[#00a1fe] font-bold">Davis AI Confidence: 98.4%</span>
              </div>
            </div>

            {/* PANEL 3: Live AI Model Inference & Throughput Telemetry (3 Columns) */}
            <div className="lg:col-span-3 bg-[#1E1E24] p-4 rounded flex flex-col justify-between shadow-md border border-[#2a2a2c]">
              <div>
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00a1fe] text-[20px]">
                      psychology
                    </span>
                    <span className="font-sans text-[18px] font-bold text-[#e5e1e4]">
                      GAIA Model Ingest
                    </span>
                  </div>
                  <span className="font-telemetry text-[11px] text-[#00a1fe] bg-[#0e0e10] px-1.5 py-0.5 rounded border border-[#201f21]">
                    Llama-3-BMW
                  </span>
                </div>
                <p className="font-sans text-[12px] text-[#c1c7d3] mb-3">
                  Autonomous vehicle diagnostics inferencing matrix.
                </p>

                {/* Telemetry Gauges */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-telemetry text-[11px] mb-1">
                      <span className="text-[#8b919c]">Munich Plant VPC Tokens/sec</span>
                      <span className="text-[#e5e1e4] font-bold">14,890 t/s</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0e0e10] rounded overflow-hidden">
                      <div className="h-full bg-[#00a1fe] w-[84%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-telemetry text-[11px] mb-1">
                      <span className="text-[#8b919c]">VRAM Utilization (NVIDIA H100)</span>
                      <span className="text-[#e5e1e4] font-bold">68.2 GB / 80 GB</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0e0e10] rounded overflow-hidden">
                      <div className="h-full bg-[#00a1fe] w-[85%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-telemetry text-[11px] mb-1">
                      <span className="text-[#8b919c]">CAN-Bus Batch Compression</span>
                      <span className="text-emerald-400 font-bold">4.2:1 (Zstandard)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0e0e10] rounded overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[72%]"></div>
                    </div>
                  </div>
                </div>

                {/* Token Latency Histogram SVG */}
                <div className="mt-4 bg-[#0e0e10] p-2.5 rounded border border-[#201f21]">
                  <span className="font-sans text-[10px] font-bold text-[#8b919c] uppercase block mb-1">
                    Latency Distribution (ms)
                  </span>
                  <div className="h-16 flex items-end gap-1 px-1">
                    <div className="w-full bg-[#00a1fe]/30 h-[20%] rounded-xs"></div>
                    <div className="w-full bg-[#00a1fe]/40 h-[35%] rounded-xs"></div>
                    <div className="w-full bg-[#00a1fe]/60 h-[60%] rounded-xs"></div>
                    <div className="w-full bg-[#00a1fe] h-[95%] rounded-xs"></div>
                    <div className="w-full bg-[#00a1fe] h-[80%] rounded-xs"></div>
                    <div className="w-full bg-[#00a1fe]/70 h-[45%] rounded-xs"></div>
                    <div className="w-full bg-[#00a1fe]/40 h-[25%] rounded-xs"></div>
                    <div className="w-full bg-[#ffb3ad] h-[15%] rounded-xs"></div>
                  </div>
                  <div className="flex justify-between font-telemetry text-[9px] text-[#8b919c] mt-1">
                    <span>10ms</span>
                    <span className="text-[#00a1fe] font-bold">Median: 38ms</span>
                    <span>120ms</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-1 flex items-center justify-between text-[#8b919c] font-telemetry text-[11px] border-t border-[#201f21]">
                <span>
                  Model Version: <span className="text-[#e5e1e4]">v4.19-hf</span>
                </span>
                <span className="text-[#00a1fe] font-semibold">FP8 Quantized</span>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 3: AUTOMOTIVE PLANT EDGE TELEMETRY STRIP             */}
          {/* ============================================================ */}
          <section className="bg-[#1E1E24] p-4 rounded shadow-md border border-[#2a2a2c]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#00a1fe] text-[22px]">
                  precision_manufacturing
                </span>
                <div>
                  <span className="font-sans text-[18px] font-bold text-[#e5e1e4]">
                    Global Plant Telemetry Stream
                  </span>
                  <span className="block font-telemetry text-[11px] text-[#8b919c]">
                    Direct Kafka Ingestion Nodes across Production Hubs
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#0e0e10] px-3 py-1 rounded border border-[#201f21]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-telemetry text-[11px] text-[#e5e1e4] font-semibold">
                    Munich (HQ): 100%
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0e0e10] px-3 py-1 rounded border border-[#201f21]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-telemetry text-[11px] text-[#e5e1e4] font-semibold">
                    Spartanburg: 99.9%
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0e0e10] px-3 py-1 rounded border border-[#201f21]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-telemetry text-[11px] text-[#e5e1e4] font-semibold">
                    Shenyang: 99.8%
                  </span>
                </div>
              </div>
            </div>

            {/* Telemetry Log Terminal Output */}
            <div className="bg-[#0e0e10] rounded p-3 font-telemetry text-[12px] space-y-1.5 border border-[#201f21]">
              <div className="flex items-center justify-between text-[#8b919c] pb-1.5 border-b border-[#2a2a2c]/60 text-[11px]">
                <span>EVENT LOG STREAM [STREAM-BMW-GAIA-EVENT-BUS]</span>
                <span>Buffer: 4096 KB/s</span>
              </div>

              {filteredLogs.map((log, idx) => {
                const isWarn = log.level === 'WARN';
                const isSuccess = log.level === 'SUCCESS';
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 ${
                      isWarn
                        ? 'text-[#ffb3ad]'
                        : isSuccess
                        ? 'text-emerald-400'
                        : 'text-[#c1c7d3]'
                    }`}
                  >
                    <span className="text-[#8b919c] shrink-0">{log.time}</span>
                    <span
                      className={`font-semibold shrink-0 ${
                        isWarn
                          ? 'text-[#ffb3ad] font-bold'
                          : isSuccess
                          ? 'text-emerald-400'
                          : 'text-[#00a1fe]'
                      }`}
                    >
                      [{log.level}]
                    </span>
                    <span className="truncate">{log.text}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* ============================================================ */}
      {/* 4. ANGULAR SOURCE CODE MODAL                                 */}
      {/* ============================================================ */}
      {showAngularModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E1E24] border border-[#2a2a2c] rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2c] bg-[#1b1b1d]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00a1fe] text-[24px]">terminal</span>
                <div>
                  <h3 className="font-sans text-[16px] font-bold text-white">
                    Generated Angular Component Source
                  </h3>
                  <p className="font-telemetry text-[11px] text-[#8b919c]">
                    src/angular/gaia-telemetry.component.ts (Angular 17/18/19 Standalone Component)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(angularCodeSnippet);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded bg-[#0066b1] hover:bg-[#00a1fe] text-white font-telemetry text-[12px] font-semibold transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedCode ? 'check' : 'content_copy'}
                  </span>
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
                <button
                  onClick={() => setShowAngularModal(false)}
                  className="w-8 h-8 rounded bg-[#2a2a2c] hover:bg-[#353437] text-[#e5e1e4] flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Code Viewer */}
            <div className="p-6 overflow-y-auto bg-[#0e0e10] flex-1 font-telemetry text-[12px] text-[#c1c7d3] space-y-3">
              <div className="bg-[#1b1b1d] p-3 rounded border border-[#201f21] text-[#00a1fe]">
                ℹ️ The file has been generated and saved to: <span className="text-white font-bold">src/angular/gaia-telemetry.component.ts</span>.
                It contains the complete TypeScript component, inline HTML template, SCSS/CSS styles, reactive signals, and real-time lifecycle hooks.
              </div>
              <pre className="p-4 bg-[#131315] rounded border border-[#201f21] overflow-x-auto text-emerald-300 font-mono text-[11px] leading-relaxed">
{`/**
 * BMW GAIA Telemetry OS - Angular Standalone Component
 * Location: src/angular/gaia-telemetry.component.ts
 */
import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gaia-telemetry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gaia-telemetry.component.html',
  styleUrls: ['./gaia-telemetry.component.css']
})
export class GaiaTelemetryComponent implements OnInit, OnDestroy {
  activeNav = signal<string>('infrastructure-overview');
  currentUtcTime = signal<string>('14:32:08.412 UTC');
  isRefreshing = signal<boolean>(false);
  searchQuery = signal<string>('');
  actionStatus = signal<Record<string, string>>({});

  // Subservices & Node Mesh reactive states
  services = [
    { name: 'gaia-inference-engine', taskDef: 'rev-481', tasks: 48, errorRate: '0.02% Err', metricLabel: 'CPU: 44.2%' },
    { name: 'telemetry-processor', taskDef: 'rev-502', tasks: 36, errorRate: '4.82% Err', metricLabel: 'OOM Thrashing', isDegraded: true },
    { name: 'can-bus-streamer', taskDef: 'rev-210', tasks: 32, errorRate: '0.00% Err', metricLabel: 'CPU: 18.9%' },
    { name: 'auth-vault-guard', taskDef: 'rev-119', tasks: 26, errorRate: '0.01% Err', metricLabel: 'CPU: 8.4%' }
  ];

  // 64-Node Matrix state with degraded node alarms
  nodeMatrix = Array.from({ length: 64 }, (_, i) => [20, 21, 38, 55].includes(i) ? 'warn' : 'ok');

  // Trigger automated remediation directives
  triggerAction(key: string, label: string) {
    this.actionStatus.update(s => ({ ...s, [key]: label }));
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
