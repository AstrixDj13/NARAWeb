import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const EVENT_API_URL = import.meta.env.VITE_EVENT_API_URL || 'http://localhost:3001';

const getSessionId = () => {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = `sess_${uuidv4()}`;
        sessionStorage.setItem('session_id', sessionId);
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

export const useEventTracker = () => {
    const trackEvent = useCallback(async (eventName, properties = {}) => {
        const event = {
            event_id: uuidv4(),
            event_name: eventName,
            event_timestamp: new Date().toISOString(),
            session_id: getSessionId(),
            anonymous_id: getAnonymousId(),
            page_url: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title,
            device_type: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
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