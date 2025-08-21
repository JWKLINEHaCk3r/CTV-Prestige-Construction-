// Service Worker Cleanup Script
// This script helps clear any cached AI functionality from service workers

console.log('Service Worker Cleanup Script Loaded');

// Function to unregister all service workers
async function unregisterServiceWorkers() {
    if ('serviceWorker' in navigator) {
        try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            
            console.log(`Found ${registrations.length} service worker registration(s)`);
            
            for (const registration of registrations) {
                console.log('Unregistering service worker:', registration.scope);
                await registration.unregister();
                console.log('Service worker unregistered successfully');
            }
            
            // Also clear any cached data
            if ('caches' in window) {
                console.log('Clearing cache storage...');
                const cacheNames = await caches.keys();
                for (const cacheName of cacheNames) {
                    await caches.delete(cacheName);
                    console.log('Deleted cache:', cacheName);
                }
            }
            
            console.log('Service worker cleanup completed successfully');
            return true;
            
        } catch (error) {
            console.error('Error during service worker cleanup:', error);
            return false;
        }
    } else {
        console.log('Service workers not supported in this browser');
        return true;
    }
}

// Function to clear localStorage and sessionStorage of any AI-related data
function clearBrowserStorage() {
    try {
        // Clear localStorage
        const localStorageKeys = Object.keys(localStorage);
        let aiKeysRemoved = 0;
        
        for (const key of localStorageKeys) {
            if (key.toLowerCase().includes('ai') || 
                key.toLowerCase().includes('model') ||
                key.toLowerCase().includes('api') ||
                key.toLowerCase().includes('endpoint')) {
                localStorage.removeItem(key);
                aiKeysRemoved++;
                console.log('Removed AI-related localStorage key:', key);
            }
        }
        
        // Clear sessionStorage
        const sessionStorageKeys = Object.keys(sessionStorage);
        for (const key of sessionStorageKeys) {
            if (key.toLowerCase().includes('ai') || 
                key.toLowerCase().includes('model') ||
                key.toLowerCase().includes('api') ||
                key.toLowerCase().includes('endpoint')) {
                sessionStorage.removeItem(key);
                aiKeysRemoved++;
                console.log('Removed AI-related sessionStorage key:', key);
            }
        }
        
        console.log(`Cleared ${aiKeysRemoved} AI-related storage items`);
        return aiKeysRemoved;
        
    } catch (error) {
        console.error('Error clearing browser storage:', error);
        return 0;
    }
}

// Function to perform comprehensive cleanup
async function performComprehensiveCleanup() {
    console.log('Starting comprehensive AI cleanup...');
    
    // Clear service workers
    const swCleaned = await unregisterServiceWorkers();
    
    // Clear browser storage
    const storageCleaned = clearBrowserStorage();
    
    // Clear cookies (if any AI-related cookies exist)
    document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        if (name.trim().toLowerCase().includes('ai') || 
            name.trim().toLowerCase().includes('model') ||
            name.trim().toLowerCase().includes('api')) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            console.log('Removed AI-related cookie:', name.trim());
        }
    });
    
    console.log('Comprehensive cleanup completed');
    console.log('Service workers cleaned:', swCleaned);
    console.log('Storage items cleaned:', storageCleaned);
    
    return {
        serviceWorkersCleaned: swCleaned,
        storageItemsCleaned: storageCleaned
    };
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        unregisterServiceWorkers,
        clearBrowserStorage,
        performComprehensiveCleanup
    };
}

// Auto-run if included directly in browser
if (typeof window !== 'undefined') {
    console.log('Service Worker Cleanup Script ready');
    // You can call performComprehensiveCleanup() when needed
}
