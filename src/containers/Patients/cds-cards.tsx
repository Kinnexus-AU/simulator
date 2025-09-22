import { ContainerProps } from "@beda.software/emr/dist/components/Dashboard/types";
import { service } from "@beda.software/emr/services";
import { sharedAuthorizedPractitioner } from "@beda.software/emr/sharedState";
import { useService, RenderRemoteData } from '@beda.software/fhir-react';
import { Patient } from "fhir/r4b";
import { v4 as uuidv4 } from 'uuid';
import { Card, Tag, Typography, Button } from 'antd';
import config from "@beda.software/emr-config";
import { Client } from '@beda.software/aidbox-types';
import { getFHIRResources as getAidboxResources, extractBundleResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import { useLaunchApp } from "@beda.software/emr/dist/containers/PatientDetails/PatientApps/index";

interface CDSHook {
    hook: string,
    title: string,
    description: string,
    id: string,
    prefetch: Record<string, string>
};

export function CDSCards({ patient }: ContainerProps) {
    const [services] = useService(() => service<{services: Array<CDSHook>}>({ baseURL: config.CDSBaseUrl, url: 'cds-services' }));
    return (
        <RenderRemoteData remoteData={services}>
            {
                (data) => <>{data.services.map(hook=> <ClinicalDecisionSupportServiceCard key={hook.id} hook={hook} patient={patient} />)}</>
            }
        </RenderRemoteData>
    );
}

interface ClinicalDecisionSupportServiceCardProps {
    hook: CDSHook,
    patient: Patient
}

interface CDSLink {
    label: string,
    url: string,
    type: string,
}

interface CDSResponse {
    uuid: string,
    summary: string,
    detail: string,
    indicator: string,
    links: Array<CDSLink>
}

function ClinicalDecisionSupportServiceCard({ hook, patient }: ClinicalDecisionSupportServiceCardProps) {
    const [services] = useService(() => service<{ cards: Array<CDSResponse> }>({
        baseURL: config.CDSBaseUrl,
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
                (data) => <>{data.cards.map(c => <ClinicalDecisionSupportCard key={c.uuid} card={c} patient={patient} />)}</>
            }
        </RenderRemoteData>
    );
}

function ClinicalDecisionSupportCard({ card, patient }: { card: CDSResponse, patient: Patient }) {
    const getIndicatorColor = (indicator: string) => {
        switch (indicator.toLowerCase()) {
            case 'info':
                return 'blue';
            case 'warning':
                return 'orange';
            case 'critical':
                return 'red';
            case 'success':
                return 'green';
            default:
                return 'default';
        }
    };

    return (
        <Card
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Typography.Text strong>{card.summary}</Typography.Text>
                    <Tag color={getIndicatorColor(card.indicator)}>
                        {card.indicator.toUpperCase()}
                    </Tag>
                </div>
            }
            style={{ marginBottom: '16px' }}
            size="small"
        >
            <Typography.Paragraph style={{ margin: 0 }}>
                {card.detail}
                <br/>
                <>{card.links.filter(({type}) => type === 'smart').map(l => <CDSSmartLaunch key={l.url} patient={patient} link={l}/>)}</>
            </Typography.Paragraph>
        </Card>
    );
}

interface CDSSmartLaunchProps {
    patient: Patient;
    link: CDSLink;
}

function CDSSmartLaunch({ link, patient }: CDSSmartLaunchProps){
    const [appResponse] = useService(async () => {
        return mapSuccess(await getAidboxResources<Client>('Client', { ['.smart.launch_uri']: link.url }),
                          (bundle) => extractBundleResources(bundle).Client[0]);
    });

    return (
        <RenderRemoteData remoteData={appResponse}>
            {(client) => {
                if(client){
                    return <SmartButton patient={patient} app={client} link={link}/>
                }
                return <div/>;
            }}
        </RenderRemoteData>
    );
}

function SmartButton({link, ...props}: {patient: Patient, app: Client, link: CDSLink}){
    const launchApp = useLaunchApp(props);
    return <Button onClick={launchApp} type="primary">{link.label}</Button>
}
