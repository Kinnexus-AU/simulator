const config = {
    clientId: 'web',

    tier: 'production',
    version: import.meta.env.VITE_APP_VERSION,
    baseURL: 'https://aidbox.simulator.kinnexus.beda.software',
    CDSBaseUrl: 'https://cds.kinnexus.beda.software',
};

export { config as default };
