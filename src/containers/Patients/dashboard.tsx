import type { Dashboard, DashboardInstance } from '@beda.software/emr/dist/components/Dashboard/types';
import { CDSCards } from './cds-cards';
import { StandardCardContainerFabric } from '@beda.software/emr/dist/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric/index';
import { Patient } from 'fhir/r4b';

import {
    prepareAllergies,
    prepareEncounters,
    prepareImmunizations,
    prepareObservations,
    preparePatient,
    prepareRelatedPersons,
} from './utils';



const patientDashboardConfig: DashboardInstance = {
    top: [
        {
            widget: CDSCards,
        },
        {
            query: {
                resourceType: 'Patient',
                search: (patient: Patient) => ({
                    _id: patient.id,
                    _count: 1,
                }),
            },
            widget: StandardCardContainerFabric(preparePatient),
        },
        {
            query: {
                resourceType: 'Encounter',
                search: (patient: Patient) => ({
                    patient: patient.id,
                    _sort: '-date',
                    _count: 7,
                }),
            },
            widget: StandardCardContainerFabric(prepareEncounters),
        }
    ],
    left: [{
        query: {
            resourceType: 'AllergyIntolerance',
            search: (patient: Patient) => ({
                patient: patient.id,
                _sort: '-date',
                _count: 7,
            }),
        },
        widget: StandardCardContainerFabric(prepareAllergies),
    },
    {
        query: {
            resourceType: 'Immunization',
            search: (patient: Patient) => ({
                patient: patient.id,
                _sort: '-date',
                _count: 7,
            }),
        },
        widget: StandardCardContainerFabric(prepareImmunizations),
    },

    ],
    right: [
        {
            query: {
                resourceType: 'Observation',
                search: (patient: Patient) => ({
                    subject: patient.id,
                    _sort: '-date',
                    _count: 7,
                }),
            },
            widget: StandardCardContainerFabric(prepareObservations),
        },
        {
            query: {
                resourceType: 'RelatedPerson',
                search: (patient: Patient) => ({
                    patient: patient.id,
                    _count: 7,
                }),
            },
            widget: StandardCardContainerFabric(prepareRelatedPersons),
        },

    ],
    bottom: [],
}

export const dashboard: Dashboard = {
    default: patientDashboardConfig,
};
