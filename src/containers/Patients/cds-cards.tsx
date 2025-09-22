import { ContainerProps } from "@beda.software/emr/dist/components/Dashboard/types";
import { service } from "@beda.software/emr/services";
import { sharedAuthorizedPractitioner } from "@beda.software/emr/sharedState";
import { useService, RenderRemoteData } from '@beda.software/fhir-react';
import { Patient } from "fhir/r4b";
import { v4 as uuidv4 } from 'uuid';


const CDSBaseUrl = 'http://localhost:8000/';
interface CDSHook {
    hook: string,
    title: string,
    description: string,
    id: string,
    prefetch: Record<string, string>
};

export function CDSCards({ patient }: ContainerProps) {
    const [services] = useService(() => service<Array<CDSHook>>({ baseURL: CDSBaseUrl, url: 'cds-services' }));
    return (
        <RenderRemoteData remoteData={services}>
            {
                (data) => <>{data.map(hook=> <CDSCard key={hook.id} hook={hook} patient={patient} />)}</>
            }
        </RenderRemoteData>
    );
}

interface CDSCardProps {
    hook: CDSHook,
    patient: Patient
}

interface CDSResponse {
    uuid: string,
    summary: string,
    detail: string,
    indicator: string,
}

function CDSCard({ hook, patient }: CDSCardProps) {
    const [services] = useService(() => service<{ cards: Array<CDSResponse> }>({
        baseURL: CDSBaseUrl,
        url: `cds-services/${hook.id}`,
        method: 'POST',
        data: {
            hook: 'patient-view',
            hookInstance: uuidv4(),
            patient: `Patient/${patient.id}`,
            prefetch: {
                patient: patient,
                practitioner: sharedAuthorizedPractitioner.getSharedState()!,
            }
        },
    }));
    return (
        <RenderRemoteData
            remoteData={services}
            renderFailure={(error) => <pre>{JSON.stringify(error, undefined, 4)}</pre>}
        >
            {
                (data) => <>{data.cards.map(c => <Card key={c.uuid} card={c} />)}</>
            }
        </RenderRemoteData>
    );
}

function Card({ card }: { card: CDSResponse }) {
    return <pre>{JSON.stringify(card, undefined, 4)}</pre>
}
