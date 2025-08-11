import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { I18nProvider } from '@lingui/react';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Route } from 'react-router-dom';

import { MenuLayout } from '@beda.software/emr/dist/components/BaseLayout/Sidebar/SidebarTop/context';
import { PatientsIcon } from '@beda.software/emr/icons';
import '@beda.software/emr/dist/services/initialize';
import 'antd/dist/reset.css';
import '@beda.software/emr/dist/style.css';

// You can copy dashboard into your project workspace and adjust appearance and widgets.
// Use https://github.com/beda-software/fhir-emr/blob/master/src/dashboard.config.ts as example;

// You can specify your own theme to ajdust color,
// Use you https://github.com/beda-software/fhir-emr/blob/master/src/theme/ThemeProvider.tsx as example
import { App } from '@beda.software/emr/containers';
import { ThemeProvider } from '@beda.software/emr/theme';
import { ValueSetExpandProvider } from '@beda.software/emr/contexts';

import { dynamicActivate, getCurrentLocale } from './services/i18n';
import { PatientList, PatientDetails } from './containers/Patients';
import { isSuccess } from '@beda.software/remote-data';
import { expandExternalTerminology } from '@beda.software/emr/services';
import { Coding } from 'fhir/r4b';

const menu = () => [{ label: t`Residents`, path: '/patients', icon: <PatientsIcon /> }]

async function expandEMRValueSet(
    answerValueSet: string | undefined,
    searchText: string,
    preferredTerminologyServer?: string,
): Promise<Coding[]> {
    if (!answerValueSet) {
        return [];
    }

    if (answerValueSet) {
        const res = await expandExternalTerminology(preferredTerminologyServer ?? 'https://tx.dev.hl7.org.au/fhir', answerValueSet, searchText);
        if (isSuccess(res)) {
            return res.data;
        }
    }

    return [];
}



export const AppWithContext = () => {
    useEffect(() => {
        dynamicActivate(getCurrentLocale());
    }, []);

    return (
        <I18nProvider i18n={i18n}>
            <ThemeProvider>
                <ValueSetExpandProvider.Provider value={expandEMRValueSet}>
                    <MenuLayout.Provider value={menu}>
                        <App
                            authenticatedRoutes={
                                <>
                                    <Route path="/patients" element={<PatientList />} />
                                    <Route path="/patients/:id" element={<PatientDetails />} />
                                    <Route path="/patients/:id/*" element={<PatientDetails />} />
                                </>
                            }
                        />
                    </MenuLayout.Provider>
                </ValueSetExpandProvider.Provider>
            </ThemeProvider>
        </I18nProvider>
    );
};

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppWithContext />
    </React.StrictMode>,
);
