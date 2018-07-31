var AFRAME;

// global variables
var sceneEl;
var targetEl;

/**
 * viewpoint component
 * - geometry: small white emitting sphere
 * - list of neighbour viewpoints that should be enabled when this viewpoint is visited
 * - wraps around a checkpoint component as its attribute
 */
AFRAME.registerComponent ( 'viewpoint', {
  schema: {
    enabled: { type: 'boolean', default: false },
    neighbours: { type: 'array' },
    offset: { type: 'string', default: '0 -1.6 0' } // real type is vec3, but we don't check and just pass the value
  },
  
  init: function () {

    // init global variables
    sceneEl = document.querySelector('a-scene');
    targetEl = sceneEl.querySelector('[checkpoint-controls]');
    
    // get reference to the checkpoint-controls component
    // and check that it exists
    if (!targetEl) {
      throw new Error('No `checkpoint-controls` component found.');
    }
    
    // create sphere
    let sphere = document.createElement('a-sphere');
    sphere.setAttribute ( 'radius', 0.1 );
    sphere.setAttribute ( 'color', "#ddd" );
    sphere.setAttribute ( 'material', 'emissive: white' );
    this.el.appendChild ( sphere );

    // adjust offset, so that the camera flies not above but into the sphere
    this.el.setAttribute ('checkpoint', 'offset: ' + this.data.offset );
    
    // initially enable or disable viewpoint
    this.setEnabled(this.data.enabled);
  },
  
  // enables or disables this viewpoint
  setEnabled : function (status) {
    
    // enable this viewpoint and get notified when it was clicked
    if (status) {
      this.el.setAttribute ( 'visible', true );
      this.el.setAttribute ( 'class', 'clickable' );
      targetEl.addEventListener('navigation-start', this);
    }
    
    // disable this viewpoint and stop listening
    else {
      this.el.setAttribute ( 'visible', false );
      this.el.setAttribute ( 'class', 'non-clickable' );
      targetEl.removeEventListener('navigation-start', this);
    }
  },
  
  // handle events when a viewpoint was clicked
  handleEvent : function (event) {

    // navigation-start: disable all viewpoints and register the clicked one for navigation-end
    if (event.type == 'navigation-start') {
      this.setEnabled(false);
      if (event.detail.checkpoint.id === this.el.id) {
        targetEl.addEventListener('navigation-end', this);
      }
    }
    
    // navigation-end    
    if (event.type == 'navigation-end') {

      // assert that this viewpoint was clicked
      if (event.detail.checkpoint.id != this.el.id) {
        console.log("navigation-end received at viewpoint " + this.el.id + " but clicked viewpoint was " + event.detail.checkpoint.id);
        return;
      }

      // enable neighbours
      for (let neighbour of this.data.neighbours) {
        let n = sceneEl.querySelector(neighbour);
        n.components.viewpoint.setEnabled (true);
      }
      
      // stop listening to navigation-end events
      targetEl.removeEventListener('navigation-end', this);
    }
  }
});
