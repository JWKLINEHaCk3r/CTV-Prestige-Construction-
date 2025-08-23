# Observer Manager for CTV Prestige Construction

A comprehensive observer pattern management system that centralizes and optimizes all observer usage across the CTV Prestige Construction website.

## 📋 Overview

This manager provides a unified interface for creating, managing, and cleaning up all types of observers (IntersectionObserver, PerformanceObserver, ResizeObserver, MutationObserver) with proper lifecycle management and error handling.

## 🚀 Features

- **Centralized Management**: Single point of control for all observers
- **Automatic Cleanup**: Automatic disconnection on page unload
- **Memory Management**: Track and optimize observer memory usage
- **Error Handling**: Robust error handling with fallback mechanisms
- **Cross-browser Support**: Graceful degradation for unsupported browsers
- **Utility Functions**: Pre-built patterns for common use cases

## 📦 Installation

The observer manager is automatically included and initialized when the `observer-manager.js` file is loaded.

## 🎯 Usage

### Basic Observer Creation

```javascript
// Create an IntersectionObserver
const observerId = window.observerManager.createObserver('intersection', 
  { threshold: 0.1 }, 
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Handle intersection
      }
    });
  }
);

// Observe an element
window.observerManager.observeElement(observerId, document.getElementById('my-element'));
```

### Performance Monitoring

```javascript
// Monitor Core Web Vitals
const clsObserverId = window.observerManager.createObserver('performance', 
  { buffered: true },
  (entryList) => {
    // Handle CLS measurements
  }
);

window.observerManager.observeElement(clsObserverId, null, { type: 'layout-shift', buffered: true });
```

### Utility Functions

```javascript
// Responsive element observer
const responsiveObserver = window.observerManager.createResponsiveElementObserver(
  document.getElementById('responsive-element'),
  { mobile: 0, tablet: 768, desktop: 1024 },
  (width, breakpoint) => {
    console.log(`Element width: ${width}px, Breakpoint: ${breakpoint}`);
  }
);

// Lazy loading for images
const lazyLoadObserver = window.observerManager.createLazyLoadObserver();
document.querySelectorAll('img[data-src]').forEach(img => {
  window.observerManager.observeElement(lazyLoadObserver, img);
});
```

## 🔧 API Reference

### Core Methods

#### `createObserver(type, options, callback)`
Creates a new observer of the specified type.

- `type`: `'intersection' | 'performance' | 'resize' | 'mutation'`
- `options`: Observer-specific options
- `callback`: Callback function for observer events

#### `observeElement(observerId, element, options)`
Starts observing an element or performance entry type.

#### `disconnectObserver(observerId)`
Disconnects and removes an observer.

#### `cleanupAll()`
Disconnects all observers.

#### `getStats()`
Returns statistics about active observers.

#### `getMemoryUsage()`
Returns memory usage information.

### Utility Methods

#### `createScrollAnimationObserver(threshold, rootMargin)`
Creates an observer for scroll-triggered animations.

#### `createResponsiveElementObserver(element, breakpoints, callback)`
Creates a responsive element observer with breakpoint detection.

#### `createLazyLoadObserver(rootMargin, threshold)`
Creates an observer for lazy loading images.

#### `createDynamicContentObserver(targetNode, config, callback)`
Creates a mutation observer for dynamic content.

## 🛠️ Integration with Existing Code

### Before (Original)
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

observer.observe(element);
```

### After (With Manager)
```javascript
const observerId = window.observerManager.createObserver('intersection', 
  { threshold: 0.1 },
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        window.observerManager.unobserveElement(observerId, entry.target);
      }
    });
  }
);

window.observerManager.observeElement(observerId, element);
```

## 📊 Performance Benefits

- **Reduced Memory Leaks**: Automatic cleanup prevents memory leaks
- **Centralized Tracking**: Monitor all observers in one place
- **Optimized Performance**: Better management of observer resources
- **Error Resilience**: Graceful degradation for unsupported features

## 🧪 Testing

Run the test suite to verify functionality:

```javascript
// The test suite runs automatically on page load
// Or manually run:
const testSuite = new ObserverTestSuite();
testSuite.runAllTests();
```

## 🌐 Browser Support

The manager automatically detects browser support:

```javascript
const support = ObserverManager.getBrowserSupport();
console.log(support);
// {
//   intersection: true,
//   resize: true,
//   mutation: true,
//   performance: true
// }
```

## 🔍 Debugging

Enable debug logging by checking the console. The manager provides detailed logs for:

- Observer creation and destruction
- Memory usage statistics
- Error conditions and fallbacks
- Performance metrics

## 📝 Best Practices

1. **Always cleanup**: Use `disconnectObserver()` when done with observers
2. **Use utility functions**: Leverage pre-built patterns for common use cases
3. **Monitor memory**: Regularly check `getMemoryUsage()` for optimization
4. **Handle errors**: Implement fallbacks for unsupported observer types
5. **Test thoroughly**: Use the provided test suite to verify functionality

## 🚨 Error Handling

The manager includes comprehensive error handling:

- Graceful degradation for unsupported browsers
- Automatic cleanup on errors
- Detailed error logging
- Fallback mechanisms for critical functionality

## 🔄 Lifecycle Management

Observers are automatically cleaned up on:
- Page unload (`beforeunload` event)
- Page hide (`pagehide` event)
- Manual disconnection

## 📈 Monitoring

Use the built-in monitoring tools:

```javascript
// Get current statistics
const stats = window.observerManager.getStats();
console.log('Active observers:', stats);

// Monitor memory usage
const memory = window.observerManager.getMemoryUsage();
console.log('Memory usage:', memory);
```

## 🤝 Contributing

When adding new observer patterns:

1. Add support in the factory method
2. Implement proper cleanup procedures
3. Add utility functions for common patterns
4. Update documentation
5. Add test cases

## 📄 License

This observer manager is part of the CTV Prestige Construction website infrastructure.
