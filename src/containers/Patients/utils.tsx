import {
    AlertOutlined,
    CheckOutlined,
    ContactsOutlined,
    ExceptionOutlined,
    ExperimentOutlined,
    HeartOutlined,
    MedicineBoxOutlined,
    SubnodeOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import {
    AllergyIntolerance,
    Bundle,
    Condition,
    Encounter,
    Immunization,
    MedicationRequest,
    MedicationStatement,
    Observation,
    Patient,
    Procedure,
    RelatedPerson,
} from 'fhir/r4b';

import { formatFHIRDate } from 'aidbox-react/lib/utils/date';

import type { OverviewCard } from '@beda.software/emr/dist/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/types';
import { SearchParams } from '@beda.software/fhir-react';

import {
    allergyDate,
    allergyName,
    birthDate,
    conditionDate,
    conditionName,
    encounterAdmitSource,
    encounterDischargeDisposition,
    encouterEnd,
    encouterStart,
    encouterStatus,
    immunizationDate,
    immunizationVaccine,
    mrDosage,
    mrName,
    mrReason,
    mrStatus,
    msDate,
    msDosage,
    msMedication,
    observationDate,
    observationName,
    observationValue,
    patientMedicare,
    patientSex,
    procedureDate,
    procedureTitle,
    rpName,
    rpRelationShip,
} from './resourceDataGetters';
import { AvailableResourceTypesStr, MapResourceConfigType, ResourceByKey } from './types';

export function getPatientSearchParamsForPractitioner(practitionerId: string): SearchParams {
    return {
        status: 'active',
        category: 'data-sharing',
        period: formatFHIRDate(new Date()),
        actor: practitionerId,
        _include: ['Consent:patient:Patient'],
    };
}

export function getResourceConfigData<K extends AvailableResourceTypesStr>(key: K): MapResourceConfigType[K] {
    const mapResourceConfigs: MapResourceConfigType = {
        AllergyIntolerance: {
            title: 'Allergies',
            icon: <ExperimentOutlined />,
            columns: [
                {
                    title: `Name`,
                    key: 'name',
                    render: allergyName,
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: allergyDate,
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
                    render: conditionName,
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: conditionDate,
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
                    render: encouterStatus,
                },
                {
                    title: `Start`,
                    key: 'start',
                    render: encouterStart,
                },
                {
                    title: `Source of admission`,
                    key: 'source',
                    render: encounterAdmitSource,
                },
                {
                    title: `end`,
                    key: 'end',
                    render: encouterEnd,
                },
                {
                    title: `Residential/living status after discharge`,
                    key: 'discharge',
                    render: encounterDischargeDisposition,
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
                    render: observationName,
                    width: 200,
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: observationDate,
                },
                {
                    title: `Value`,
                    key: 'value',
                    render: observationValue,
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
                    render: immunizationVaccine,
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: immunizationDate,
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
                    render: msMedication,
                },
                {
                    title: 'Dosage',
                    key: 'dosage',
                    render: msDosage,
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: msDate,
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
                    render: birthDate,
                },
                {
                    title: 'Sex',
                    key: 'sex',
                    render: patientSex,
                },
                {
                    title: 'Medicare',
                    key: 'medicare',
                    render: patientMedicare,
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
                    render: procedureTitle,
                },
                {
                    title: `Date`,
                    key: 'date',
                    render: procedureDate,
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
                    render: rpName,
                },
                {
                    title: `Relationship`,
                    key: 'relationship',
                    render: rpRelationShip,
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
                    render: mrName,
                },
                {
                    title: 'Reason',
                    key: 'reason',
                    render: mrReason,
                },
                {
                    title: 'Dosage',
                    key: 'date',
                    render: mrDosage,
                    width: 200,
                },
                {
                    title: 'Status',
                    key: 'status',
                    render: mrStatus,
                },
            ],
        },
    };

    return mapResourceConfigs[key];
}

function prepareResource<K extends AvailableResourceTypesStr>(
    resources: ResourceByKey[K][],
    bundle: Bundle<ResourceByKey[K]>,
    key: K,
): OverviewCard<ResourceByKey[K]> {
    const { title, columns, icon } = getResourceConfigData(key);

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
): OverviewCard<AllergyIntolerance> => prepareResource(r, bundle, 'AllergyIntolerance');
export const prepareConditions = (r: Condition[], bundle: Bundle<Condition>): OverviewCard<Condition> =>
    prepareResource(r, bundle, 'Condition');
export const prepareEncounters = (r: Encounter[], bundle: Bundle<Encounter>): OverviewCard<Encounter> =>
    prepareResource(r, bundle, 'Encounter');
export const prepareObservations = (r: Observation[], bundle: Bundle<Observation>): OverviewCard<Observation> =>
    prepareResource(r, bundle, 'Observation');
export const prepareImmunizations = (r: Immunization[], bundle: Bundle<Immunization>): OverviewCard<Immunization> =>
    prepareResource(r, bundle, 'Immunization');
export const prepareMedicationStatements = (
    r: MedicationStatement[],
    bundle: Bundle<MedicationStatement>,
): OverviewCard<MedicationStatement> => prepareResource(r, bundle, 'MedicationStatement');
export const preparePatient = (r: Patient[], bundle: Bundle<Patient>): OverviewCard<Patient> =>
    prepareResource(r, bundle, 'Patient');
export const prepareProcedures = (r: Procedure[], bundle: Bundle<Procedure>): OverviewCard<Procedure> =>
    prepareResource(r, bundle, 'Procedure');
export const prepareRelatedPersons = (r: RelatedPerson[], bundle: Bundle<RelatedPerson>): OverviewCard<RelatedPerson> =>
    prepareResource(r, bundle, 'RelatedPerson');
export const prepareMedicationRequests = (
    r: MedicationRequest[],
    bundle: Bundle<MedicationRequest>,
): OverviewCard<MedicationRequest> => prepareResource(r, bundle, 'MedicationRequest');
