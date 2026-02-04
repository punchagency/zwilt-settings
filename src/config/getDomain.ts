export function getZwiltStoreDomain() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
        return process.env.NEXT_PUBLIC_APP_SERVER;
    }
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return 'https://staging.zwilt.com';
    }
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
        return 'https://app.zwilt.com';
    }
    return '';
}
export function getSalesAppDomain() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
        return 'http://localhost:3000/sequence/app';
    }
    return 'https://sales.zwilt.com/sequence/app'; // Same for both dev and prod
}
export function getRecrowdlyAppDomain() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
        return 'http://localhost:3000';
    }
    return process.env.NEXT_PUBLIC_NODE_ENV === 'development'
        ? 'https://stagingconvert.zwilt.com'
        : 'https://convert.zwilt.com';
}
export function getTrackerApp() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
        return 'http://localhost:3000';
    }
    return process.env.NEXT_PUBLIC_NODE_ENV === 'development'
        ? 'https://staging-tracker.zwilt.com'
        : 'https://tracker.zwilt.com';
}
export function getZwiltSettingApp() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
        return 'http://localhost:3000';
    }
    return process.env.NEXT_PUBLIC_NODE_ENV === 'development'
        ? 'https://staging-settings.zwilt.com'
        : 'https://settings.zwilt.com';
}