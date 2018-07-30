var AFRAME;

AFRAME.registerComponent ( 'viewpoint', {
  schema: {
    status: { type: 'string', default: 'disabled' }, // disabled, enabled, active
    neighbours: { type: 'array' }
  },

  init: function () {
    
    // create sphere
    let sphere = document.createElement('a-sphere');
    sphere.setAttribute ( 'radius', 0.1 );
    sphere.setAttribute ( 'color', "#ddd" );
    sphere.setAttribute ( 'material', 'emissive: white' );
    this.el.appendChild ( sphere );

    // adjust offset, so that the camera flies not above but into the sphere
    this.el.setAttribute ('checkpoint', 'offset: 0 -1.6 0');
    
    // add event listener: state added
    this.el.addEventListener ('stateadded', function (evt) {
            
      // enabled: show this viewpoint
      if (evt.detail.name === 'enabled') {
        this.el.setAttribute ( 'visible', true );
        this.el.setAttribute ( 'class', 'clickable' );
      }

      // active: hide this viewpoint but enable its neighbours
      if (evt.detail.name === 'active') {
        this.el.setAttribute ( 'visible', false );
        this.el.setAttribute ( 'class', 'non-clickable' );
        for (let neighbour of this.data.neighbours) {
          document.querySelector(neighbour).addState ('enabled');
        } 
          
      } 
    }); // end of addEventListener: state added
    
    // add event listener: state removed
    this.el.addEventListener ('stateremoved', function (evt) {

      // if the viewpoint was active, we have to disable its neighbours
      if (evt.detail.name === 'active') {
        for (let neighbour of this.data.neighbours) {
          document.querySelector(neighbour).removeState ('enabled');
        }
      }

      // if the viewpoint was enabled, we have to hide it
      if (evt.detail.name === 'enabled') {
        this.el.setAttribute ( 'visible', false );
        this.el.setAttribute ( 'class', 'non-clickable' );
      }
    }); // end of addEventListener: state removed
    
  }
  
});


