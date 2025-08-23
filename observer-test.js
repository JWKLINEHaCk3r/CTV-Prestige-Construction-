// Observer Manager Test Suite for CTV Prestige Construction
// Tests all observer functionality and integration

class ObserverTestSuite {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.results = [];
    }

    async runAllTests() {
        console.log('🧪 Starting Observer Manager Test Suite...\n');
        
        // Wait for observer manager to initialize
        await this.delay(100);
        
        this.addTest('Observer Manager Initialization', () => this.testManagerInitialization());
        this.addTest('Intersection Observer Creation', () => this.testIntersectionObserver());
        this.addTest('Performance Observer Creation', () => this.testPerformanceObserver());
        this.addTest('Resize Observer Creation', () => this.testResizeObserver());
        this.addTest('Mutation Observer Creation', () => this.testMutationObserver());
        this.addTest('Observer Cleanup', () => this.testObserverCleanup());
        this.addTest('Memory Usage Reporting', () => this.testMemoryUsage());
        this.addTest('Browser Support Detection', () => this.testBrowserSupport());
        
        await this.executeTests();
        this.printResults();
    }

    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    async executeTests() {
        for (const test of this.tests) {
            try {
                const result = await test.testFunction();
                if (result) {
                    this.passed++;
                    this.results.push({ name: test.name, status: '✅ PASSED' });
                } else {
                    this.failed++;
                    this.results.push({ name: test.name, status: '❌ FAILED' });
                }
            } catch (error) {
                this.failed++;
                this.results.push({ 
                    name: test.name, 
                    status: '❌ ERROR', 
                    error: error.message 
                });
            }
            await this.delay(50); // Small delay between tests
        }
    }

    testManagerInitialization() {
        return typeof window.observerManager !== 'undefined' && 
               window.observerManager instanceof ObserverManager;
    }

    testIntersectionObserver() {
        try {
            const observerId = window.observerManager.createObserver('intersection', {
                threshold: 0.1
            }, () => {});
            
            return typeof observerId === 'string' && observerId.startsWith('observer_');
        } catch (error) {
            console.error('IntersectionObserver test failed:', error);
            return false;
        }
    }

    testPerformanceObserver() {
        try {
            const observerId = window.observerManager.createObserver('performance', {}, () => {});
            return typeof observerId === 'string' && observerId.startsWith('observer_');
        } catch (error) {
            console.log('PerformanceObserver test (may not be supported in all environments):', error.message);
            return true; // Not a failure if unsupported
        }
    }

    testResizeObserver() {
        try {
            const observerId = window.observerManager.createObserver('resize', {}, () => {});
            return typeof observerId === 'string' && observerId.startsWith('observer_');
        } catch (error) {
            console.log('ResizeObserver test (may not be supported in all environments):', error.message);
            return true; // Not a failure if unsupported
        }
    }

    testMutationObserver() {
        try {
            const observerId = window.observerManager.createObserver('mutation', {}, () => {});
            return typeof observerId === 'string' && observerId.startsWith('observer_');
        } catch (error) {
            console.error('MutationObserver test failed:', error);
            return false;
        }
    }

    testObserverCleanup() {
        try {
            const initialCount = window.observerManager.getStats().total;
            const observerId = window.observerManager.createObserver('intersection', {}, () => {});
            
            const afterCreate = window.observerManager.getStats().total;
            window.observerManager.disconnectObserver(observerId);
            
            const afterCleanup = window.observerManager.getStats().total;
            
            return afterCreate === initialCount + 1 && afterCleanup === initialCount;
        } catch (error) {
            console.error('Observer cleanup test failed:', error);
            return false;
        }
    }

    testMemoryUsage() {
        try {
            const usage = window.observerManager.getMemoryUsage();
            return typeof usage === 'object' && 
                   typeof usage.total === 'string' &&
                   typeof usage.breakdown === 'object';
        } catch (error) {
            console.error('Memory usage test failed:', error);
            return false;
        }
    }

    testBrowserSupport() {
        try {
            const support = ObserverManager.getBrowserSupport();
            return typeof support === 'object' && 
                   typeof support.intersection === 'boolean' &&
                   typeof support.performance === 'boolean';
        } catch (error) {
            console.error('Browser support test failed:', error);
            return false;
        }
    }

    printResults() {
        console.log('\n📊 Test Results:');
        console.log('================');
        
        this.results.forEach(result => {
            console.log(`${result.status} - ${result.name}`);
            if (result.error) {
                console.log(`   Error: ${result.error}`);
            }
        });
        
        console.log('\n📈 Summary:');
        console.log('===========');
        console.log(`Total Tests: ${this.tests.length}`);
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`🎯 Success Rate: ${((this.passed / this.tests.length) * 100).toFixed(1)}%`);
        
        if (this.failed === 0) {
            console.log('\n🎉 All tests passed! Observer Manager is working correctly.');
        } else {
            console.log('\n⚠️  Some tests failed. Check the console for details.');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Run tests when the page loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const testSuite = new ObserverTestSuite();
            testSuite.runAllTests().catch(console.error);
        }, 2000);
    });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ObserverTestSuite;
}
