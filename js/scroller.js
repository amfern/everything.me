(function() { // TODO: generate the requerd wrappers and styles for scrolling
  var Scroller = this.Scroller = function() {
    return this._init.apply(this, arguments);
  },
  p = Scroller.prototype;
  
  p._init = function(el) {
    this.$el = $(el);
    
    this.lastCurY = this.prevY = this.curY = 0;
    this.$el.on('mousedown touchstart', this._start.bind(this));
    this.$el.on('touchmove mousemove', this._move.bind(this));
    $(window).on('mouseup touchend touchcancel', this._end.bind(this)); // stop scrolling if mouse lifted outside of the window
    
    return this.$el;
  }
  
  p._start = function(e) {
    this.mouseClick = true;
    this.prevY = this._getPositionY(e);
    this.lastCurY = this.curY;
    this.$el.trigger('scroll:start');
    e.preventDefault();
  }
  
  p._move = function(e) {
    if((!e.touches || !e.touches.length) && !this.mouseClick)
      return;
        
    // mobile doesn't have start event
    if(!this.prevY)
      this._start(e);
        
    this._updateCurY(e); 
    
    // TODO: do this whithin requestAnimationFrame or even better my game loop, hmm maybe browser handling the transform request internaly and u dont need requestAnimationFrame 
    this.$el.css('-webkit-transform', 'translateY(' + this.curY + 'px)');
    this.$el.css('-moz-transform', 'translateY(' + this.curY + 'px)');
    
    this.$el.trigger('scroll:move');
  }
  
  p._end = p._cancel = function(e) {
    if(!this.mouseClick && !this.prevY)
      return;
      
    this.$el.trigger('scroll:end');
    
    // trigger click only when mouse moved less then 1 px
    if(Math.abs(this.lastCurY - this.curY) < 1)
      this.$el.trigger('scroll:click', e);
        
    this.mouseClick = false;
    this.prevY = null;
  }
  
  p._updateCurY = function(e) {
    this.y = this._getPositionY(e);
    this.curY += this.y - this.prevY; 
    this.viewPortY = this.$el.height() - $(window).height();
    
    // make sure we stay in the boundaries of the device
    this.curY = this.curY > 0 ? 0 : (this.curY < -this.viewPortY ? -this.viewPortY : this.curY);  
    this.prevY = this.y;
  }
  
  p._getPositionY = function(e) {
    return e.screenY || e.touches[0].screenY;
  }
})();
