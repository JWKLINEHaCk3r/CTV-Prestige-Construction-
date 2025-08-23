// Observer Manager for CTV Prestige Construction
// Centralized management of all observer patterns with lifecycle control

class ObserverManager {
    constructor() {
        this.observers = new Map();
        this.observerCount = 0;
        this.init();
    }

    init() {
        console.log('👁️ Observer Manager initialized');
        this.setupGlobalCleanup();
    }

    // Factory method for creating different observer types
    createObserver(type, options = {}, callback) {
        const observerId = `observer_${++this.observerCount}_${type}`;
        
        try {
            let observer;
            
            switch (type) {
                case 'intersection':
                    observer = new IntersectionObserver(callback, options);
                    break;
                case 'resize':
                    observer = new ResizeObserver(callback);
                    break;
                case 'mutation':
                    observer = new MutationObserver(callback);
                    break;
                case 'performance':
                    observer = new PerformanceObserver(callback);
                    break;
                default:
                    throw new Error(`Unsupported observer type: ${type}`);
            }

            this.observers.set(observerId, {
                instance: observer,
                type,
                options,
                callback,
                observedElements: new Set(),
                performanceEntryTypes: new Set(),
                createdAt: Date.now()
            });

            console.log(`✅ Created ${type} observer: ${observerId}`);
            return observerId;

        } catch (error) {
            console.error(`❌ Failed to create ${type} observer:`, error);
            throw error;
        }
    }

    // Observe an element or performance entry with a specific observer
    observeElement(observerId, element, options = {}) {
        const observerData = this.observers.get(observerId);
        if (!observerData) {
            throw new Error(`Observer ${observerId} not found`);
        }

        try {
            if (observerData.type === 'performance') {
                // For PerformanceObserver, we observe entry types, not elements
                const entryTypes = options.type ? [options.type] : options.entryTypes || [];
                entryTypes.forEach(entryType => {
                    observerData.instance.observe(options);
                    observerData.performanceEntryTypes.add(entryType);
                });
                console.log(`👀 Performance observer ${observerId} now observing: ${Array.from(observerData.performanceEntryTypes).join(', ')}`);
            } else {
                // For other observers, observe DOM elements
                observerData.instance.observe(element, options);
                observerData.observedElements.add(element);
                console.log(`👀 ${observerData.type} observer ${observerId} now observing element`);
            }
            
            return true;

        } catch (error) {
            console.error(`❌ Failed to observe with ${observerData.type} observer:`, error);
            return false;
        }
    }

    // Unobserve an element
    unobserveElement(observerId, element) {
        const observerData = this.observers.get(observerId);
        if (!observerData) {
            throw new Error(`Observer ${observerId} not found`);
        }

        try {
            observerData.instance.unobserve(element);
            observerData.observedElements.delete(element);
            
            console.log(`👋 ${observerData.type} observer ${observerId} stopped observing element`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to unobserve element:`, error);
            return false;
        }
    }

    // Disconnect and remove an observer
    disconnectObserver(observerId) {
        const observerData = this.observers.get(observerId);
        if (!observerData) {
            console.warn(`Observer ${observerId} not found for disconnection`);
            return false;
        }

        try {
            // Handle different observer types appropriately
            switch (observerData.type) {
                case 'performance':
                    // PerformanceObserver uses takeRecords() before disconnect
                    observerData.instance.takeRecords();
                    observerData.instance.disconnect();
                    break;
                case 'intersection':
                case 'resize':
                case 'mutation':
                    // Standard disconnect for DOM observers
                    observerData.instance.disconnect();
                    break;
                default:
                    observerData.instance.disconnect();
            }

            this.observers.delete(observerId);
            
            console.log(`🔌 Disconnected ${observerData.type} observer: ${observerId}`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to disconnect observer ${observerId}:`, error);
            
            // Force cleanup even if disconnect fails
            try {
                this.observers.delete(observerId);
                console.log(`🧹 Forcefully removed observer ${observerId} from registry`);
            } catch (cleanupError) {
                console.error(`❌ Failed to cleanup observer ${observerId}:`, cleanupError);
            }
            
            return false;
        }
    }

    // Cleanup specific observer type
    cleanupObserversByType(type) {
        const observersToCleanup = this.getObserversByType(type);
        let cleanedCount = 0;

        observersToCleanup.forEach(observer => {
            if (this.disconnectObserver(observer.id)) {
                cleanedCount++;
            }
        });

        console.log(`🧹 Cleaned up ${cleanedCount} ${type} observers`);
        return cleanedCount;
    }

    // Get memory usage with more detailed breakdown
    getMemoryUsage() {
        let total = 0;
        const breakdown = {};

        for (const [_, data] of this.observers) {
            const observerSize = 1024; // ~1KB per observer instance
            const elementsSize = data.observedElements.size * 128; // ~128B per observed element
            const entryTypesSize = data.performanceEntryTypes.size * 64; // ~64B per performance entry type
            
            const observerTotal = observerSize + elementsSize + entryTypesSize;
            total += observerTotal;
            
            breakdown[data.type] = (breakdown[data.type] || 0) + observerTotal;
        }

        return {
            total: `${(total / 1024).toFixed(2)} KB`,
            breakdown
        };
    }

    // Get all observers of a specific type
    getObserversByType(type) {
        const result = [];
        for (const [id, data] of this.observers) {
            if (data.type === type) {
                result.push({ id, ...data });
            }
        }
        return result;
    }

    // Get observer statistics
    getStats() {
        const stats = {
            total: this.observers.size,
            byType: {},
            memoryUsage: this.getMemoryUsage()
        };

        for (const [_, data] of this.observers) {
            stats.byType[data.type] = (stats.byType[data.type] || 0) + 1;
        }

        return stats;
    }

    // Estimate memory usage (approximate)
    getMemoryUsage() {
        let total = 0;
        for (const [_, data] of this.observers) {
            // Rough estimate: each observer instance + metadata
            total += 1024; // ~1KB per observer
            total += data.observedElements.size * 128; // ~128B per observed element
        }
        return `${(total / 1024).toFixed(2)} KB`;
    }

    // Cleanup all observers
    cleanupAll() {
        const count = this.observers.size;
        for (const [observerId] of this.observers) {
            this.disconnectObserver(observerId);
        }
        console.log(`🧹 Cleaned up ${count} observers`);
        return count;
    }

    // Setup global cleanup on page unload
    setupGlobalCleanup() {
        window.addEventListener('beforeunload', () => {
            this.cleanupAll();
        });

        window.addEventListener('pagehide', () => {
            this.cleanupAll();
        });
    }

    // Utility: Create intersection observer for scroll animations
    createScrollAnimationObserver(threshold = 0.1, rootMargin = '0px 0px -50px 0px') {
        return this.createObserver('intersection', { threshold, rootMargin }, (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // Stop observing after animation completes
                    const observerId = this.findObserverByInstance(entry.target);
                    if (observerId) {
                        this.unobserveElement(observerId, entry.target);
                    }
                }
            });
        });
    }

    // Utility: Create resize observer for responsive elements
    createResponsiveResizeObserver(callback) {
        return this.createObserver('resize', {}, callback);
    }

    // Utility: Create responsive element observer that handles common responsive patterns
    createResponsiveElementObserver(element, breakpoints = {}, callback) {
        const observerId = this.createObserver('resize', {}, (entries) => {
            const entry = entries[0];
            const width = entry.contentRect.width;
            
            // Check breakpoints and call callback with current breakpoint
            let currentBreakpoint = 'default';
            let matchedBreakpoint = null;
            
            for (const [breakpoint, minWidth] of Object.entries(breakpoints)) {
                if (width >= minWidth) {
                    matchedBreakpoint = breakpoint;
                }
            }
            
            if (matchedBreakpoint) {
                currentBreakpoint = matchedBreakpoint;
            }
            
            callback(width, currentBreakpoint, entry);
        });
        
        this.observeElement(observerId, element);
        return observerId;
    }

    // Utility: Create mutation observer for dynamic content
    createDynamicContentObserver(targetNode, config = { childList: true, subtree: true }, callback) {
        return this.createObserver('mutation', config, callback);
    }

    // Utility: Observe gallery items for lazy loading
    createLazyLoadObserver(rootMargin = '200px', threshold = 0.1) {
        return this.createObserver('intersection', { rootMargin, threshold }, (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    this.unobserveElement(this.findObserverByInstance(img), img);
                }
            });
        });
    }

    // Find observer by observed element
    findObserverByInstance(element) {
        for (const [observerId, data] of this.observers) {
            if (data.observedElements.has(element)) {
                return observerId;
            }
        }
        return null;
    }

    // Check if browser supports specific observer type
    static supportsObserver(type) {
        switch (type) {
            case 'intersection': return 'IntersectionObserver' in window;
            case 'resize': return 'ResizeObserver' in window;
            case 'mutation': return 'MutationObserver' in window;
            case 'performance': return 'PerformanceObserver' in window;
            default: return false;
        }
    }

    // Get browser support matrix
    static getBrowserSupport() {
        return {
            intersection: ObserverManager.supportsObserver('intersection'),
            resize: ObserverManager.supportsObserver('resize'),
            mutation: ObserverManager.supportsObserver('mutation'),
            performance: ObserverManager.supportsObserver('performance')
        };
    }
}

// Make available globally
window.ObserverManager = ObserverManager;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ObserverManager;
}

// Auto-initialize if not in test environment
if (typeof window !== 'undefined' && !window.__TEST__) {
    window.observerManager = new ObserverManager();
    
    // Log browser support on init
    console.log('🌐 Browser Observer Support:', ObserverManager.getBrowserSupport());
}
