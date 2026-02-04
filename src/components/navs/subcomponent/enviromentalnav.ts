// environmentUtils.ts
type AppName = 'zwiltStore' | 'salesApp' | 'recrowdlyApp' | 'trackerApp' | 'zwiltSettingApp';

export function getAppDomain(appName: AppName): string {
    const env = process.env.NEXT_PUBLIC_NODE_ENV;

    switch (appName) {
        case 'zwiltStore':
            if (env === 'local') return process.env.NEXT_PUBLIC_APP_SERVER || '';
            if (env === 'development') return 'https://staging.zwilt.com';
            if (env === 'production') return 'https://app.zwilt.com';
            break;

        case 'salesApp':
            return env === 'local'
                ? 'http://localhost:3000/sequence/app'
                : 'https://sales.zwilt.com/sequence/app';

        case 'recrowdlyApp':
            if (env === 'local') return 'http://localhost:3000';
            return env === 'development'
                ? 'https://stagingconvert.zwilt.com'
                : 'https://convert.zwilt.com';

        case 'trackerApp':
            if (env === 'local') return 'http://localhost:3000';
            return env === 'development'
                ? 'https://staging-tracker.zwilt.com'
                : 'https://tracker.zwilt.com';

        case 'zwiltSettingApp':
            if (env === 'local') return 'http://localhost:3000';
            return env === 'development'
                ? 'https://staging-settings.zwilt.com'
                : 'https://settings.zwilt.com';

        default:
            return '';
    }

    return '';
}
