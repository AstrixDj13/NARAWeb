import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const EVENT_API_URL = import.meta.env.VITE_EVENT_API_URL || 'http://localhost:3001';

const getSessionId = () => {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = `sess_${uuidv4()}`;
        sessionStorage.setItem('session_id', sessionId);
        sessionStorage.setItem('original_referrer', document.referrer);
    }
    return sessionId;
};

const getAnonymousId = () => {
    let anonId = localStorage.getItem('anonymous_id');
    if (!anonId) {
        anonId = `anon_${uuidv4()}`;
        localStorage.setItem('anonymous_id', anonId);
    }
    return anonId;
};

const getUserId = () => {
    return localStorage.getItem('user_id') || undefined;
};

const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser_name = "Unknown";
    let browser_version = "Unknown";

    if (ua.indexOf("Firefox") > -1) {
        browser_name = "Firefox";
        const match = ua.match(/Firefox\/([0-9.]+)/);
        if (match) browser_version = match[1];
    } else if (ua.indexOf("SamsungBrowser") > -1) {
        browser_name = "Samsung Internet";
    } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
        browser_name = "Opera";
    } else if (ua.indexOf("Trident") > -1) {
        browser_name = "Internet Explorer";
    } else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) {
        browser_name = "Edge";
    } else if (ua.indexOf("Chrome") > -1) {
        browser_name = "Chrome";
        const match = ua.match(/Chrome\/([0-9.]+)/);
        if (match) browser_version = match[1];
    } else if (ua.indexOf("Safari") > -1) {
        browser_name = "Safari";
        const match = ua.match(/Version\/([0-9.]+)/);
        if (match) browser_version = match[1];
    }
    return { browser_name, browser_version };
};

const getOSInfo = () => {
    const ua = navigator.userAgent;
    let os_name = "Unknown";
    let os_version = "Unknown";

    if (ua.indexOf("Win") !== -1) {
        os_name = "Windows";
        const match = ua.match(/Windows NT ([0-9.]+)/);
        if (match) os_version = match[1];
    }
    else if (ua.indexOf("Mac") !== -1) {
        os_name = "macOS";
        const match = ua.match(/Mac OS X ([0-9_]+)/);
        if (match) os_version = match[1] ? match[1].replace(/_/g, '.') : "Unknown";
    }
    else if (ua.indexOf("Linux") !== -1) {
        os_name = "Linux";
    }
    else if (ua.indexOf("Android") !== -1) {
        os_name = "Android";
        const match = ua.match(/Android ([0-9.]+)/);
        if (match) os_version = match[1];
    }
    else if (ua.indexOf("like Mac OS X") !== -1 || ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) {
        os_name = "iOS";
        const match = ua.match(/OS ([0-9_]+)/);
        if (match) os_version = match[1] ? match[1].replace(/_/g, '.') : "Unknown";
    }
    return { os_name, os_version };
};

const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

const getSessionUTM = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    let sessionUtms = JSON.parse(sessionStorage.getItem('utm_params')) || {};
    let updated = false;

    utms.forEach(param => {
        const val = urlParams.get(param);
        if (val) {
            sessionUtms[param] = val;
            updated = true;
        }
    });

    if (updated) {
        sessionStorage.setItem('utm_params', JSON.stringify(sessionUtms));
    }

    return {
        ...sessionUtms,
        traffic_source: sessionUtms.utm_source ? 'paid' : (document.referrer ? 'referral' : 'direct'),
        traffic_medium: sessionUtms.utm_medium,
        traffic_campaign: sessionUtms.utm_campaign
    };
};

const detectPageType = (path) => {
    if (path === '/') return 'home';
    if (path.startsWith('/collection')) return 'collection';
    if (path.startsWith('/product')) return 'product';
    if (path === '/cart') return 'cart';
    if (path.startsWith('/checkout')) return 'checkout';
    if (path === '/login') return 'login';
    if (path === '/search') return 'search';
    if (path.startsWith('/profile')) return 'account';
    return 'other';
};

// Geography caching to avoid redundant API calls
let geoDataCache = null;
const fetchGeoData = async () => {
    if (geoDataCache) return geoDataCache;
    const cached = sessionStorage.getItem('geo_data');
    if (cached) {
        geoDataCache = JSON.parse(cached);
        return geoDataCache;
    }
    try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data && data.country_code) {
            geoDataCache = {
                country: data.country_code,
                state: data.region,
                city: data.city,
                pincode: data.postal,
                ip_address: data.ip
            };
            sessionStorage.setItem('geo_data', JSON.stringify(geoDataCache));
            return geoDataCache;
        }
    } catch (e) {
        // Silently fail if ipapi is blocked
    }
    return {};
};

export const useEventTracker = () => {
    // We can pre-fetch geo location when the hook mounts
    useEffect(() => {
        fetchGeoData();
    }, []);

    const trackEvent = useCallback(async (eventName, properties = {}) => {
        const browserInfo = getBrowserInfo();
        const osInfo = getOSInfo();
        const utmData = getSessionUTM();
        const geoData = geoDataCache || JSON.parse(sessionStorage.getItem('geo_data') || '{}');

        // Capture data spanning 3.1, 3.3, 3.4, 3.5, 3.6
        const event = {
            // 3.1 Universal Fields
            event_id: uuidv4(),
            event_name: eventName,
            event_timestamp: new Date().toISOString(),
            session_id: getSessionId(),
            anonymous_id: getAnonymousId(),
            user_id: getUserId(),

            // 3.3 Device & Browser Fields
            device_type: getDeviceType(),
            browser_name: browserInfo.browser_name,
            browser_version: browserInfo.browser_version,
            os_name: osInfo.os_name,
            os_version: osInfo.os_version,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,

            // 3.4 Traffic Source Fields
            ...utmData,

            // 3.5 Geography Fields

            ...geoData,

            // 3.6 Page Context Fields
            page_url: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title,
            page_type: detectPageType(window.location.pathname),
            page_referrer: document.referrer || sessionStorage.getItem('original_referrer'),

            // Custom Properties override
            ...properties,
        };

        try {
            await fetch(`${EVENT_API_URL}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });
        } catch (error) {
            console.error('Track Error:', error);
        }
    }, []);

    return { trackEvent };
};

export default useEventTracker;