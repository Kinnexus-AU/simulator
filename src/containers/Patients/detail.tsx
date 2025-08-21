import { Patient } from 'fhir/r4b';

import { PatientDashboardProvider } from '@beda.software/emr/dist/components/Dashboard/contexts';
import { PatientOverview } from '@beda.software/emr/dist/containers/PatientDetails/PatientOverviewDynamic/index';
import { ResourceDetailPage, Tab } from '@beda.software/emr/dist/uberComponents/ResourceDetailPage/index';
import { compileAsFirst, selectCurrentUserRoleResource } from '@beda.software/emr/dist/utils/index';

import { dashboard } from './dashboard';
import { PatientDocuments } from '@beda.software/emr/dist/containers/PatientDetails/PatientDocuments/index';
import { Route, Routes } from 'react-router-dom';
import { PatientDocument } from '@beda.software/emr/dist/containers/PatientDetails/PatientDocument/index';
import { PatientDocumentDetails } from '@beda.software/emr/dist/containers/PatientDetails/PatientDocumentDetails/index';
import { PatientApps } from '@beda.software/emr/dist/containers/PatientDetails/PatientApps/index';
import { WithId } from '@beda.software/fhir-react';


const getName = compileAsFirst<Patient, string>("Patient.name.given.first() + ' ' + Patient.name.family");


const tabs: Array<Tab<WithId<Patient>>> = [
    {
        path: '',
        label: 'Overview',
        component: ({ resource }) => <PatientOverview patient={resource} />,
    },
    {
        path: 'documents',
        label: 'Documents',
        component: ({ resource }) => <Documents patient={resource}/>
    },
    {
        path: 'apps',
        label: 'Smart Apps',
        component: ({ resource }) => <PatientApps patient={resource} />,
    }
];

function Documents({ patient }: { patient: WithId<Patient> }) {
    const author = selectCurrentUserRoleResource();
    return (
        <Routes>
            <Route path="/" element={<PatientDocuments patient={patient} />} />
            <Route
                path="/new/:questionnaireId"
                element={
                    <PatientDocument
                        patient={patient}
                        author={author}
                        autoSave={true}
                    />
                }
            />
            <Route
                path="/:qrId/*"
                element={<PatientDocumentDetails patient={patient} />}
            />

        </Routes>
    );
}

export function PatientDetails() {
    return (
        <PatientDashboardProvider dashboard={dashboard}>
            <ResourceDetailPage<Patient>
                resourceType="Patient"
                getSearchParams={({ id }) => ({ _id: id })}
                getTitle={({ resource, bundle }) => getName(resource, { bundle })!}
                tabs={tabs}
            />
        </PatientDashboardProvider>
    );
}

