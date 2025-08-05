import type { Dashboard, DashboardInstance } from '@beda.software/emr/dist/components/Dashboard/types';

const patientDashboardConfig: DashboardInstance = {
    top: [],
    left: [],
    right: [],
    bottom: [],
}

export const dashboard: Dashboard = {
    default: patientDashboardConfig,
};
