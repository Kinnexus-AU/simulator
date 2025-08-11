import { PlusOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Patient } from 'fhir/r4b';

import { questionnaireAction, navigationAction, ResourceListPage } from '@beda.software/emr/components';
import { SearchBarColumnType } from '@beda.software/emr/dist/components/SearchBar/types';
import { formatHumanDate, renderHumanName } from '@beda.software/emr/utils';

export function PatientList() {
    return (
        <ResourceListPage<Patient>
            headerTitle={t`Residents`}
            resourceType="Patient"
            getTableColumns={() => [
                {
                    title: <Trans>Name</Trans>,
                    dataIndex: 'name',
                    key: 'name',
                    render: (_text, { resource }) => renderHumanName(resource.name?.[0]),
                    width: 300,
                },
                {
                    title: <Trans>Birth date</Trans>,
                    dataIndex: 'birthDate',
                    key: 'birthDate',
                    render: (_text, { resource }) => (resource.birthDate ? formatHumanDate(resource.birthDate) : null),
                    width: 150,
                },
                {
                    title: <Trans>Gender</Trans>,
                    dataIndex: 'gender',
                    key: 'gender',
                    render: (_text, { resource }) => resource.gender,
                    width: 150,
                },
            ]}
            getFilters={() => [
                {
                    id: 'name',
                    searchParam: 'name',
                    type: SearchBarColumnType.STRING,
                    placeholder: t`Find resident`,
                    placement: ['search-bar', 'table'],
                },
                {
                    id: 'birthDate',
                    searchParam: 'birthdate',
                    type: SearchBarColumnType.SINGLEDATE,
                    placeholder: t`Birth date`,
                    placement: ['table'],
                },
                {
                    id: 'gender',
                    searchParam: 'gender',
                    type: SearchBarColumnType.CHOICE,
                    placeholder: t`Choose gender`,
                    options: [
                        {
                            value: {
                                Coding: {
                                    code: 'male',
                                    display: 'Male',
                                },
                            },
                        },
                        {
                            value: {
                                Coding: {
                                    code: 'female',
                                    display: 'Female',
                                },
                            },
                        },
                    ],
                    placement: ['table'],
                },
            ]}
            getRecordActions={(record) => [
                navigationAction('Open', `/patients/${record.resource.id}`),
                questionnaireAction('Edit', 'patient'),
            ]}
            getHeaderActions={() => [
                questionnaireAction(<Trans>Add resident</Trans>, 'patient', {
                    icon: <PlusOutlined />,
                    extra: {qrfProps: {launchContextParameters: [{name: 'Patient', resource: {resourceType: 'Patient'}}]}},
                } ),
            ]}
            getReportColumns={(bundle) => [
                {
                    title: t`Number of residents`,
                    value: bundle.total,
                },
            ]}
        ></ResourceListPage>
    );
}
