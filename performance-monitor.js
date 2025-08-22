// Performance monitoring for CTV Prestige Construction
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor Core Web Vitals
        this.monitorCLS();
        this.monitorLCP();
        this.monitorFID();
        this.monitorFCP();
        
        // Monitor resource loading
        this.monitorResources();
        
        // Monitor user interactions
        this.monitorUserInteractions();
    }

    monitorCLS() {
        let clsValue = 0;
        let clsEntries = [];

        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    clsEntries.push(entry);
                }
            }
        });

        try {
            observer.observe({ type: 'layout-shift', buffered: true });
            this.metrics.CLS = { value: clsValue, entries: clsEntries };
        } catch (e) {
            console.log('CLS monitoring not supported');
        }
    }

    monitorLCP() {
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.LCP = lastEntry.startTime;
        });

        try {
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
            console.log('LCP monitoring not supported');
        }
    }

    monitorFID() {
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            this.metrics.FID = entries[0].processingStart - entries[0].startTime;
        });

        try {
            observer.observe({ type: 'first-input', buffered: true });
        } catch (e) {
            console.log('FID monitoring not supported');
        }
    }

    monitorFCP() {
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            this.metrics.FCP = entries[0].startTime;
        });

        try {
            observer.observe({ type: 'paint', buffered: true });
        } catch (e) {
            console.log('FCP monitoring not supported');
        }
    }

    monitorResources() {
        const resources = performance.getEntriesByType('resource');
        this.metrics.resources = resources.map(resource => ({
            name: resource.name,
            duration: resource.duration,
            transferSize: resource.transferSize,
            initiatorType: resource.initiatorType
        }));
    }

    monitorUserInteractions() {
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            const target = e.target;
            const interaction = {
                type: 'click',
                target: target.tagName,
                className: target.className,
                id: target.id,
                timestamp: Date.now()
            };
            
            // Log important interactions
            if (target.classList.contains('cta-button') || 
                target.classList.contains('email-button') ||
                target.href && target.href.includes('mailto:')) {
                console.log('User interaction:', interaction);
            }
        });
    }

    getMetrics() {
        return {
            ...this.metrics,
            navigation: performance.getEntriesByType('navigation')[0],
            timing: performance.timing,
            memory: performance.memory || 'Not supported'
        };
    }

    logMetrics() {
        const metrics = this.getMetrics();
        console.group('Performance Metrics');
        console.log('CLS:', metrics.CLS);
        console.log('LCP:', metrics.LCP);
        console.log('FID:', metrics.FID);
        console.log('FCP:', metrics.FCP);
        console.log('Navigation:', metrics.navigation);
        console.groupEnd();
        
        return metrics;
    }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
    window.performanceMonitor = new PerformanceMonitor();
    
    // Log metrics after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.performanceMonitor.logMetrics();
        }, 3000);
    });
}

module.exports = PerformanceMonitor;
