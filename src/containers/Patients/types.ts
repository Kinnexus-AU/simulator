import {
    AllergyIntolerance,
    Condition,
    Encounter,
    Immunization,
    MedicationRequest,
    MedicationStatement,
    Observation,
    Patient,
    Procedure,
    RelatedPerson,
    Resource,
} from 'fhir/r4b';

export interface DashboardRT<T extends Resource> {
    title: string;
    icon: JSX.Element;
    columns: Array<{
        title: string;
        key: string;
        render: (resource: T) => React.ReactNode;
        width?: number;
    }>;
}

export type ResourceByKey = {
    AllergyIntolerance: AllergyIntolerance;
    Condition: Condition;
    Observation: Observation;
    Immunization: Immunization;
    MedicationStatement: MedicationStatement;
    MedicationRequest: MedicationRequest;
    Procedure: Procedure;
    RelatedPerson: RelatedPerson;
    Encounter: Encounter;
    Patient: Patient;
};

export type AvailableResourceTypesStr = keyof ResourceByKey;

export type AvailableResourceTypes = ResourceByKey[AvailableResourceTypesStr];

export type MapResourceConfigType = {
    [K in AvailableResourceTypesStr]: DashboardRT<ResourceByKey[K]>;
};
