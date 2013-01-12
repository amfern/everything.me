(function() {
  var Swiper = this.Swiper = function(elem) {
    return this._init.call(this, elem);
  },
  p = Swiper.prototype;
  
  p._init = function(el) {
    this.$el = $(el);
    
    this.touchX = null;
    this.$el.on('mousedown touchstart', this._start.bind(this));
    this.$el.on('touchmove mousemove', this._move.bind(this));
    $(window).on('mouseup touchend touchcancel', this._end.bind(this));
    
    return this.$el;
  }
  
  p._start = function(e) {
    this.mouseClick = true;
    this.lastX = this.touchX = this._getPositionX(e);
  }
  
  p._move = function(e) {
    if((!e.touches || !e.touches.length) && !this.mouseClick)
      return;
    
    this.lastX = this._getPositionX(e);
          
    // mobile doesn't have start event
    if(!this.touchX)
      this._start(e);
  }
  
  p._end = p._cancel = function(e) {
    this.distanceX = this.lastX - this.touchX;
    if(this.touchX && Math.abs(this.distanceX) > ($(window).width() / 25))
      this.$el.trigger('swiper:swipe', [e, this.distanceX > 0 ? 1 : -1]);
        
    this.mouseClick = false;
    this.touchX = undefined;
  }
  
  p._getPositionX = function(e) {
    return e.screenX || e.touches[0].screenX;
  }
})();
