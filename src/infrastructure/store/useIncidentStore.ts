import { create } from 'zustand';
import { type Incident, type IncidentStatus, type DecisionRecord, type AutomatedAction } from '../../types';

interface IncidentState {
  incidents: Incident[];
  activeIncidentId: string | null;
  createIncident: (incident: Omit<Incident, 'id' | 'detectedAt' | 'alertedAt' | 'status' | 'automatedActions' | 'decisionAuditTrail'>) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  acknowledgeIncident: (id: string) => void;
  resolveIncident: (id: string) => void;
  assignIncident: (id: string, staff: string) => void;
  addDecisionRecord: (id: string, record: DecisionRecord) => void;
  executeAutomatedAction: (id: string, actionId: string, status: AutomatedAction['status'], result: string) => void;
  selectIncident: (id: string | null) => void;
}

function generateRandomId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().substring(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],
  activeIncidentId: null,

  createIncident: (incidentData) => set((state) => {
    const id = generateRandomId('inc');
    const newIncident: Incident = {
      ...incidentData,
      id,
      status: 'detected',
      detectedAt: Date.now(),
      alertedAt: Date.now(),
      respondedAt: null,
      resolvedAt: null,
      automatedActions: [
        {
          id: generateRandomId('act'),
          action: 'Broadcast alert to zone staff pagers',
          timestamp: Date.now(),
          status: 'executed',
          result: 'Success - 5 alerts delivered to local operators',
        },
      ],
      decisionAuditTrail: [
        {
          timestamp: Date.now(),
          decision: 'Automatic system alert classification',
          rationale: `Anomaly threshold violated for ${incidentData.type}`,
          dataInputs: ['Sensor streams', 'Occupancy numbers'],
          outcome: 'Dispatched pre-programmed responders alert',
          madeBy: 'system',
        },
      ],
    };
    return { 
      incidents: [newIncident, ...state.incidents],
      activeIncidentId: id
    };
  }),

  updateIncidentStatus: (id, status) => set((state) => ({
    incidents: state.incidents.map((incident) => {
      if (incident.id === id) {
        const respondedAt = status === 'responding' ? Date.now() : incident.respondedAt;
        const resolvedAt = status === 'resolved' ? Date.now() : incident.resolvedAt;
        
        // Add log entry into audit trail
        const newDecision: DecisionRecord = {
          timestamp: Date.now(),
          decision: `Status updated to ${status}`,
          rationale: 'Operator manual update or simulator response trigger',
          dataInputs: ['Operator interface action'],
          outcome: `Incident is now categorized as ${status}`,
          madeBy: 'operator',
        };

        return {
          ...incident,
          status,
          respondedAt,
          resolvedAt,
          decisionAuditTrail: [...incident.decisionAuditTrail, newDecision],
        };
      }
      return incident;
    }),
  })),

  acknowledgeIncident: (id) => set((state) => ({
    incidents: state.incidents.map((incident) => {
      if (incident.id === id) {
        return {
          ...incident,
          status: 'responding',
          respondedAt: Date.now(),
          decisionAuditTrail: [
            ...incident.decisionAuditTrail,
            {
              timestamp: Date.now(),
              decision: 'Acknowledge alert & assign playbook',
              rationale: 'Operator accepted alert and initiated first responder checklist',
              dataInputs: ['Operator ID', 'Playbook ID'],
              outcome: 'Status changed to responding. Medical/security team notified.',
              madeBy: 'operator',
            },
          ],
        };
      }
      return incident;
    }),
  })),

  resolveIncident: (id) => set((state) => ({
    incidents: state.incidents.map((incident) => {
      if (incident.id === id) {
        return {
          ...incident,
          status: 'resolved',
          resolvedAt: Date.now(),
          decisionAuditTrail: [
            ...incident.decisionAuditTrail,
            {
              timestamp: Date.now(),
              decision: 'Mark incident resolved',
              rationale: 'First responders confirmed the situation is clear and normalized',
              dataInputs: ['Field agent feedback'],
              outcome: 'All alerts cleared. Scene secure.',
              madeBy: 'operator',
            },
          ],
        };
      }
      return incident;
    }),
  })),

  assignIncident: (id, staff) => set((state) => ({
    incidents: state.incidents.map((incident) => {
      if (incident.id === id) {
        return {
          ...incident,
          assignedTo: staff,
          decisionAuditTrail: [
            ...incident.decisionAuditTrail,
            {
              timestamp: Date.now(),
              decision: `Assign incident to ${staff}`,
              rationale: 'Dispatched closest resource to incident location coordinates',
              dataInputs: ['Resource GPS tracking', 'Incident location'],
              outcome: `${staff} is en-route.`,
              madeBy: 'operator',
            },
          ],
        };
      }
      return incident;
    }),
  })),

  addDecisionRecord: (id, record) => set((state) => ({
    incidents: state.incidents.map((incident) => {
      if (incident.id === id) {
        return {
          ...incident,
          decisionAuditTrail: [...incident.decisionAuditTrail, record],
        };
      }
      return incident;
    }),
  })),

  executeAutomatedAction: (id, actionId, status, result) => set((state) => ({
    incidents: state.incidents.map((incident) => {
      if (incident.id === id) {
        const updatedActions = incident.automatedActions.map((action) => {
          if (action.id === actionId) {
            return { ...action, status, result, timestamp: Date.now() };
          }
          return action;
        });
        return { ...incident, automatedActions: updatedActions };
      }
      return incident;
    }),
  })),

  selectIncident: (id) => set({ activeIncidentId: id }),
}));
