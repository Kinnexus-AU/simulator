import type { Dashboard, DashboardInstance } from '@beda.software/emr/dist/components/Dashboard/types';
import { GeneralInformationDashboardContainer } from '@beda.software/emr/dist/containers/PatientDetails/PatientOverviewDynamic/containers/GeneralIInformationDashboardContainer/index';

const patientDashboardConfig: DashboardInstance = {
    top: [
        {
            widget: GeneralInformationDashboardContainer,
        }
    ],
    left: [],
    right: [],
    bottom: [],
}

export const dashboard: Dashboard = {
    default: patientDashboardConfig,
};
