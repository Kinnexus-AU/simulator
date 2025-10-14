import { formatFHIRDate } from 'aidbox-react/lib/utils/date';

import { SearchParams } from '@beda.software/fhir-react';

import {
    AlertOutlined,
    CheckOutlined,
    ExperimentOutlined,
    HeartOutlined,
    MedicineBoxOutlined,
    SubnodeOutlined,
    UsergroupAddOutlined,
    ExceptionOutlined,
    ContactsOutlined,
} from '@ant-design/icons';
import {
    AllergyIntolerance,
    Bundle,
    Condition,
    Immunization,
    MedicationStatement,
    Observation,
    Procedure,
    RelatedPerson,
    MedicationRequest,
    Encounter,
    Patient,
} from 'fhir/r4b';

import type { OverviewCard } from '@beda.software/emr/dist/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/types';

import {
    makeRenderer,
    allergyName,
    allergyDate,
    conditionName,
    conditionDate,
    observationName,
    observationDate,
    observationValue,
    immunizationVaccine,
    immunizationDate,
    msMedication,
    msDosage,
    msDate,
    procedureTitle,
    procedureDate,
    rpName,
    rpRelationShip,
    mrName,
    mrReason,
    mrDosage,
    mrStatus,
    encouterStart,
    encouterEnd,
    encouterStatus,
    encounterAdmitSource,
    encounterDischargeDisposition,
    birthDate,
    patientSex,
    patientMedicare,
} from './resourceDataGetters';


import { AvailableResourceTypesStr, MapResourceConfigType, UberListRT, DashboardRT, AvailableResourceTypes } from './types';


export function getPatientSearchParamsForPractitioner(practitionerId: string): SearchParams {
    return {
        status: 'active',
        category: 'data-sharing',
        period: formatFHIRDate(new Date()),
        actor: practitionerId,
        _include: ['Consent:patient:Patient'],
    };
}

export function getResourceConfigData<T extends AvailableResourceTypes, RCM extends 'uberList' | 'dashboard'>(
    key: AvailableResourceTypesStr,
    renderColumnMode: RCM,
): typeof renderColumnMode extends 'uberList' ? UberListRT<T> : DashboardRT<T> {
    const mapResourceConfigs: MapResourceConfigType = {
        AllergyIntolerance: {
            title: 'Allergies',
            icon: <ExperimentOutlined />,
            columns: [
                {
                    title: `Name`,
                    key: 'name',
                    render: makeRenderer(allergyName, renderColumnMode),
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: makeRenderer(allergyDate, renderColumnMode),
                    width: 120,
                },
            ],
        },
       Condition: {
            title: 'Conditions',
            icon: <AlertOutlined />,
            columns: [
                {
                    title: `Name`,
                    key: 'name',
                    render: makeRenderer(conditionName, renderColumnMode),
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: makeRenderer(conditionDate, renderColumnMode),
                    width: 120,
                },
            ],
        },
        Encounter: {
            title: 'Admissions',
            icon: <AlertOutlined />,
            columns: [
                {
                    title: `Status`,
                    key: 'status',
                    render: makeRenderer(encouterStatus, renderColumnMode),
                },
                {
                    title: `Start`,
                    key: 'start',
                    render: makeRenderer(encouterStart, renderColumnMode),
                },
                {
                    title: `Source of admission`,
                    key: 'source',
                    render: makeRenderer(encounterAdmitSource, renderColumnMode),
                },
                {
                    title: `end`,
                    key: 'end',
                    render: makeRenderer(encouterEnd, renderColumnMode),
                },
                {
                    title: `Residential/living status after discharge`,
                    key: 'discharge',
                    render: makeRenderer(encounterDischargeDisposition, renderColumnMode),
                },
            ],
        },
        Observation: {
            title: 'Observations',
            icon: <HeartOutlined />,
            columns: [
                {
                    title: `Name`,
                    key: 'name',
                    render: makeRenderer(observationName, renderColumnMode),
                    width: 200,
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: makeRenderer(observationDate, renderColumnMode),
                },
                {
                    title: `Value`,
                    key: 'value',
                    render: makeRenderer(observationValue, renderColumnMode),
                },
            ],
        },
        Immunization: {
            title: 'Immunizations',
            icon: <MedicineBoxOutlined />,
            columns: [
                {
                    title: `Vaccine`,
                    key: 'vaccine',
                    render: makeRenderer(immunizationVaccine, renderColumnMode),
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: makeRenderer(immunizationDate, renderColumnMode),
                    width: 120,
                },
            ],
        },
        MedicationStatement: {
            title: 'Medications',
            icon: <CheckOutlined />,
            columns: [
                {
                    title: `Medication`,
                    key: 'medication',
                    render: makeRenderer(msMedication, renderColumnMode),
                },
                {
                    title: 'Dosage',
                    key: 'dosage',
                    render: makeRenderer(msDosage, renderColumnMode),
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: makeRenderer(msDate, renderColumnMode),
                    width: 120,
                },
            ],
        },
        Patient: {
            title: 'General information',
            icon: <ContactsOutlined />,
            columns: [
                {
                    title: 'Birth date',
                    key: 'birthdate',
                    render: makeRenderer(birthDate, renderColumnMode),
                },
                {
                    title: 'Sex',
                    key: 'sex',
                    render: makeRenderer(patientSex, renderColumnMode),
                },
                {
                    title: 'Medicare',
                    key: 'medicare',
                    render: makeRenderer(patientMedicare, renderColumnMode),
                },


            ],
        },
        Procedure: {
            title: 'Procedures',
            icon: <SubnodeOutlined />,
            columns: [
                {
                    title: `Title`,
                    key: 'title',
                    render: makeRenderer(procedureTitle, renderColumnMode),
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: makeRenderer(procedureDate, renderColumnMode),
                    width: 120,
                },
            ],
        },
        RelatedPerson: {
            title: 'Related Persons',
            icon: <UsergroupAddOutlined />,
            columns: [
                {
                    title: `Name`,
                    key: 'name',
                    render: makeRenderer(rpName, renderColumnMode),
                },
                {
                    title: `Relationship`,
                    key: 'relationship',
                    render: makeRenderer(rpRelationShip, renderColumnMode),
                    width: 120,
                },
            ],
        },
        MedicationRequest: {
            title: 'Medication Requests',
            icon: <ExceptionOutlined />,
            columns: [
                {
                    title: 'Name',
                    key: 'name',
                    render: makeRenderer(mrName, renderColumnMode),
                },
                {
                    title: 'Reason',
                    key: 'reason',
                    render: makeRenderer(mrReason, renderColumnMode),
                },
                {
                    title: 'Dosage',
                    key: 'date',
                    render: makeRenderer(mrDosage, renderColumnMode),
                    width: 200,
                },
                {
                    title: 'Status',
                    key: 'status',
                    render: makeRenderer(mrStatus, renderColumnMode),
                },
            ],
        },
    };

    return mapResourceConfigs[key] as any;
}

function prepareResource<T extends AvailableResourceTypes>(
    resources: T[],
    bundle: Bundle<T>,
    key: AvailableResourceTypesStr,
): OverviewCard<T> {
    const { title, columns, icon } = getResourceConfigData(key, 'dashboard');

    return {
        title: title,
        key: key,
        icon: icon,
        data: resources,
        total: bundle.total ?? 0,
        getKey: (r) => r.id!,
        columns: columns,
    };
}

export const prepareAllergies = (
    r: AllergyIntolerance[],
    bundle: Bundle<AllergyIntolerance>,
): OverviewCard<AllergyIntolerance> => prepareResource<AllergyIntolerance>(r, bundle, 'AllergyIntolerance');
export const prepareConditions = (r: Condition[], bundle: Bundle<Condition>): OverviewCard<Condition> =>
    prepareResource(r, bundle, 'Condition');
export const prepareEncounters = (
    r: Encounter[],
    bundle: Bundle<Encounter>,
): OverviewCard<Encounter> => prepareResource(r, bundle, 'Encounter');
export const prepareObservations = (r: Observation[], bundle: Bundle<Observation>): OverviewCard<Observation> =>
    prepareResource(r, bundle, 'Observation');
export const prepareImmunizations = (r: Immunization[], bundle: Bundle<Immunization>): OverviewCard<Immunization> =>
    prepareResource(r, bundle, 'Immunization');
export const prepareMedicationStatements = (
    r: MedicationStatement[],
    bundle: Bundle<MedicationStatement>,
): OverviewCard<MedicationStatement> => prepareResource(r, bundle, 'MedicationStatement');
export const preparePatient = (
    r: Patient[],
    bundle: Bundle<Patient>,
): OverviewCard<Patient> => prepareResource(r, bundle, 'Patient');
export const prepareProcedures = (r: Procedure[], bundle: Bundle<Procedure>): OverviewCard<Procedure> =>
    prepareResource(r, bundle, 'Procedure');
export const prepareRelatedPersons = (r: RelatedPerson[], bundle: Bundle<RelatedPerson>): OverviewCard<RelatedPerson> =>
    prepareResource(r, bundle, 'RelatedPerson');
export const prepareMedicationRequests = (
    r: MedicationRequest[],
    bundle: Bundle<MedicationRequest>,
): OverviewCard<MedicationRequest> => prepareResource(r, bundle, 'MedicationRequest');

