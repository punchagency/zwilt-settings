import React from 'react'

const StoreDomain = () => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
        return process.env.NEXT_PUBLIC_STORE_APP;
    }
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        return 'https://staging.zwilt.com';
    }
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
        return 'https://app.zwilt.com';
    }
    return '';
}

function getSalesAppDomain() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
        return 'http://localhost:3000/sequence/app';
    }
    return 'https://sales.zwilt.com/sequence/app'; // Same for both dev and prod
}
function getMailDomain() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
        return 'https://punch.agency:2096/';
    }
    return 'https://punch.agency:2096/'; // Same for both dev and prod
}
 function getRecrowdlyAppDomain() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
        return 'http://localhost:3000';
    }
    return process.env.NEXT_PUBLIC_NODE_ENV === 'development'
        ? 'https://stagingconvert.zwilt.com'
        : 'https://convert.zwilt.com';
}
 function getTrackerApp() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
        return 'http://localhost:3000';
    }
    return process.env.NEXT_PUBLIC_NODE_ENV === 'development'
        ? 'https://staging-tracker.zwilt.com'
        : 'https://tracker.zwilt.com';
}
 function getZwiltSettingApp() {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
        return 'http://localhost:3000';
    }
    return process.env.NEXT_PUBLIC_NODE_ENV === 'development'
        ? 'https://staging-settings.zwilt.com'
        : 'https://settings.zwilt.com';
}


const GetDomains = () => {
  return {
    StoreDomain,
    getSalesAppDomain,
    getRecrowdlyAppDomain,
    getTrackerApp,
    getZwiltSettingApp,
    getMailDomain

  }
}

export default GetDomains