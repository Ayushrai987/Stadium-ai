import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVenueStore } from '../../../infrastructure/store/useVenueStore';
import { useIncidentStore } from '../../../infrastructure/store/useIncidentStore';
import { useKPIStore } from '../../../infrastructure/store/useKPIStore';
import { useEnergyStore } from '../../../infrastructure/store/useEnergyStore';
import { useCrowdStore } from '../../../infrastructure/store/useCrowdStore';
import { useSimulationStore } from '../../../infrastructure/store/useSimulationStore';
import { useShallow } from 'zustand/react/shallow';
import { StadiumHeatmap } from '../../components/stadium/StadiumHeatmap';
import { AlertFeed } from '../../components/stadium/AlertFeed';
import { KPICard, MetricChart, ProgressRing, StatusIndicator, SimulationControl, showToast } from '../../components/common';
import { rateLimiter } from '../../../infrastructure/security/RateLimiter';
import {
  Users,
  Clock,
  DollarSign,
  Zap,
  Activity,
  ArrowLeft,
  Settings,
  Thermometer,
  Wind,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { type Zone, type Incident } from '../../../types';
import { formatNumber, formatCurrency, calcOccupancyPercent } from '../../../utils/formatters';
import { DashboardSidebar, ZoneDetailPanel, IncidentPlaybook, EnergyPanel } from './';

/**
 * Stadium Operations Command Dashboard page.
 * Operator cockpit displaying the live venue heatmap, real-time alert logs feed,
 * business outcome KPIs, detailed zone telemetry drill-downs, and automated response actions.
 */
export function OperatorDashboard() {
  const navigate = useNavigate();
  const { venues, selectedVenueId, getSelectedVenue, getSensorStats, selectVenue } = useVenueStore(useShallow(state => ({
    venues: state.venues,
    selectedVenueId: state.selectedVenueId,
    getSelectedVenue: state.getSelectedVenue,
    getSensorStats: state.getSensorStats,
    selectVenue: state.selectVenue
  })));
  const { incidents, acknowledgeIncident, resolveIncident, selectIncident, activeIncidentId } = useIncidentStore(useShallow(state => ({
    incidents: state.incidents,
    acknowledgeIncident: state.acknowledgeIncident,
    resolveIncident: state.resolveIncident,
    selectIncident: state.selectIncident,
    activeIncidentId: state.activeIncidentId
  })));
  const { kpis } = useKPIStore(useShallow(state => ({ kpis: state.kpis })));
  const { metrics } = useEnergyStore(useShallow(state => ({ metrics: state.metrics })));
  const { history } = useCrowdStore(useShallow(state => ({ history: state.history })));
  const { eventPhase } = useSimulationStore(useShallow(state => ({ eventPhase: state.eventPhase })));
  
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const currentVenue = getSelectedVenue();
  const sensorStats = getSensorStats();

  // Reset zone choice if venue changes
  useEffect(() => {
    setSelectedZone(null);
  }, [selectedVenueId]);

  if (!currentVenue) {
    return (
      <div role="alert" style={{ padding: '40px', color: 'red', textAlign: 'center', background: '#0a0e1a', minHeight: '100vh' }}>
        <h2>Error: Venue not initialized</h2>
      </div>
    );
  }

  // Find currently active incident detail
  const activeIncident = incidents.find(i => i.id === activeIncidentId);

  // Parse history points for selected zone (if any) to render crowd flow chart
  const selectedZoneHistory = selectedZone ? (history[selectedZone.id] || []) : [];
  const chartData = selectedZoneHistory.map((h, i) => ({
    time: `${i}s`,
    value: Math.round(h.occupancyPercent),
  }));

  // Build some general occupancy trend data for the main chart if no zone is chosen
  const mainChartData = (currentVenue.zones[0] ? history[currentVenue.zones[0].id] || [] : []).map((_h, i) => ({
    time: `${i}s`,
    value: Math.round((currentVenue.currentAttendance / currentVenue.capacity) * 100 + Math.sin(i * 0.2) * 2),
  }));

  const handleZoneClick = (zone: Zone) => {
    setSelectedZone(zone);
    showToast(`Viewing details for ${zone.name}`, 'info');
  };

  const handleIncidentSelect = (incident: Incident) => {
    selectIncident(incident.id);
    const z = currentVenue.zones.find(zone => zone.id === incident.zoneId);
    if (z) setSelectedZone(z);
    showToast(`Focused on incident: ${incident.title}`, 'warning');
  };

  const handleAcknowledge = (id: string) => {
    if (!rateLimiter.isAllowed('ops-action', 10, 60000)) {
      showToast('Rate limit exceeded. Please wait before taking action.', 'error');
      return;
    }
    acknowledgeIncident(id);
    showToast('Playbook triggered. Dispatch responders routed.', 'success');
  };

  const handleResolve = (id: string) => {
    if (!rateLimiter.isAllowed('ops-action', 10, 60000)) {
      showToast('Rate limit exceeded. Please wait before taking action.', 'error');
      return;
    }
    resolveIncident(id);
    showToast('Incident marked resolved.', 'success');
  };

  const handleVenueClick = (id: string) => {
    selectVenue(id);
    showToast(`Switched venue view to ${venues.find(v => v.id === id)?.name || ''}`, 'info');
  };

  const handleVenueKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleVenueClick(id);
    }
  };

  const currentOccupancyPercent = calcOccupancyPercent(currentVenue.currentAttendance, currentVenue.capacity);

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <DashboardSidebar 
        venues={venues}
        selectedVenueId={selectedVenueId}
        sensorStats={sensorStats}
        onVenueSelect={handleVenueClick}
      />

      {/* Main Command Console Dashboard Panel */}
      <main id="main-content" className="dashboard-main">
        {/* Topbar Banner */}
        <header className="dashboard-topbar" role="banner">
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>{currentVenue.name} Command</h1>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {currentVenue.city}, {currentVenue.country} · Regulatory Zone: {currentVenue.regulatoryRegion}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} role="status">
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Event Phase: {eventPhase.toUpperCase()}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Dynamic pricing live</span>
            </div>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              aria-label="Open operations dashboard settings"
            >
              <Settings size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Scrollable grid area */}
        <div className="dashboard-content-scroll">
          {/* Business KPIs outcomes before / after */}
          <div className="kpi-row" role="region" aria-label="Operations KPI overview panel">
            <KPICard
              label="Live Attendance"
              value={formatNumber(currentVenue.currentAttendance)}
              unit={`/ ${formatNumber(currentVenue.capacity)}`}
              percentChange={currentOccupancyPercent}
              icon={Users}
              color="#3b82f6"
            />
            <KPICard
              label="Avg Wait Time"
              value={`${kpis.queueTimeReduction.after} min`}
              previousValue={`${kpis.queueTimeReduction.before} min`}
              percentChange={kpis.queueTimeReduction.percentChange}
              icon={Clock}
              color="#f59e0b"
            />
            <KPICard
              label="Concession Revenue"
              value={formatCurrency(kpis.revenueLift.current)}
              percentChange={kpis.revenueLift.percentChange}
              icon={DollarSign}
              color="#10b981"
            />
            <KPICard
              label="Energy Optimization"
              value={`${metrics?.totalConsumption || 0} kWh`}
              percentChange={-kpis.energySavings.percentSaved}
              icon={Zap}
              color="#8b5cf6"
            />
          </div>

          <div className="dashboard-grid">
            {/* Heatmap (8 columns) */}
            <div className="col-8">
              <StadiumHeatmap
                zones={currentVenue.zones}
                onZoneClick={handleZoneClick}
                selectedZoneId={selectedZone?.id}
              />
            </div>

            {/* Alert Feed (4 columns) */}
            <div className="col-4">
              <AlertFeed
                incidents={incidents}
                onIncidentClick={handleIncidentSelect}
                onAcknowledge={handleAcknowledge}
              />
            </div>

            {/* Incident / Zone detail drill down panels */}
            {selectedZone && (
              <ZoneDetailPanel 
                zone={selectedZone} 
                chartData={chartData} 
                onClose={() => setSelectedZone(null)} 
              />
            )}

            {/* Selected active incident resolution playbook */}
            {activeIncident && (
              <IncidentPlaybook 
                incident={activeIncident} 
                onDeselect={() => selectIncident(null)} 
                onAcknowledge={handleAcknowledge} 
                onResolve={handleResolve} 
              />
            )}

            {/* If neither incident nor zone detail is opened, show general crowd & energy summary chart */}
            {!selectedZone && !activeIncident && (
              <div className="col-8">
                <div style={{
                  background: 'rgba(15,22,41,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', margin: '0 0 16px' }}>
                    Overall Stadium Occupancy Rate %
                  </h3>
                  {mainChartData.length > 0 ? (
                    <div aria-hidden="true">
                      <MetricChart data={mainChartData} color="#10b981" title="Stadium Occupancy Over Time" />
                    </div>
                  ) : (
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }} role="status">
                      Loading simulation metrics...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Energy metrics dashboard block */}
            {!selectedZone && !activeIncident && (
              <EnergyPanel metrics={metrics} />
            )}
          </div>
        </div>
      </main>

      {/* Floating Simulation Control Panel */}
      <SimulationControl />
    </div>
  );
}

export default OperatorDashboard;
