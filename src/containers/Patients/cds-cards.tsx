import { ContainerProps } from "@beda.software/emr/dist/components/Dashboard/types";
import { service } from "@beda.software/emr/services";
import { sharedAuthorizedPractitioner } from "@beda.software/emr/sharedState";
import { useService, RenderRemoteData } from '@beda.software/fhir-react';
import { Patient } from "fhir/r4b";
import { v4 as uuidv4 } from 'uuid';
import { Card, Tag, Typography } from 'antd';
import config from "@beda.software/emr-config";

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

interface CDSResponse {
    uuid: string,
    summary: string,
    detail: string,
    indicator: string,
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
                (data) => <>{data.cards.map(c => <ClinicalDecisionSupportCard key={c.uuid} card={c} />)}</>
            }
        </RenderRemoteData>
    );
}

function ClinicalDecisionSupportCard({ card }: { card: CDSResponse }) {
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
            </Typography.Paragraph>
        </Card>
    );
}
