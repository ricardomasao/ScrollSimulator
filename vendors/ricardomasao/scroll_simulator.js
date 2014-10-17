/*! ScrollSimulator - v1.0 - 2014-10-13
 *
 *
 * Copyright (c) 2014 Ricardo Masao Shigeoka;
 * Licensed under the MIT license */

(function(window, document, exportName, undefined) {

var TYPE_FUNCTION = 'function';
var SCROLL_SENSIBILITY = .5;
var NUM_PAGES = 0;
var scroll_guide = null;
var _this = null;
var enabled = null;

function ScrollSimulator(parent)
{

  _this = this;
  scroll_guide = document.createElement('div');
  scroll_guide.className = "scroll-guide";

  this.parent = parent;
  this.parent.appendChild(scroll_guide);

  this.main_scroll_percent = 0;
  this.section_percent = 0;
  this.current_page = 0;
  this.events = {}
}

ScrollSimulator.prototype.init = function (num_pages) {
  NUM_PAGES = num_pages;

  this.setup_style();
  this.resize();
}

ScrollSimulator.prototype.enable = function(){
  if(enabled) return;

  enabled = true;

  var el = window;
  if(el.addEventListener)
  {
    el.addEventListener('scroll', this.on_scroll_handler, false);
  } else if (el.attachEvent)
  {
    el.attachEvent('onscroll', this.on_scroll_handler);
  }
  scroll_guide.style.display = "block";
}

ScrollSimulator.prototype.disable = function(){
  if(enabled == false) return;

  enabled = false;

  var el = window;
  if(el.addEventListener)
  {
    el.removeEventListener('scroll', this.on_scroll_handler, false);
  } else if (el.attachEvent)
  {
    el.detachEvent('onscroll', this.on_scroll_handler);
  }
  scroll_guide.style.display = "none";
}

ScrollSimulator.prototype.on_scroll_handler = function(event){

  var doc = document.documentElement;
  var scroll_top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

  _this.main_scroll_percent = scroll_top / (scroll_guide.offsetHeight - window.innerHeight);
  _this.current_page = Math.round( scroll_top / ((scroll_guide.offsetHeight - window.innerHeight)/(NUM_PAGES-1)) );

  _this.section_percent = _this.get_section_percent(_this.current_page);

  _this.eventDispatcher('on_simulate_scroll',[{currentTarget:_this}]);
}

ScrollSimulator.prototype.get_section_percent = function(page){
  var doc = document.documentElement;
  var scroll_top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  var percentage_per_pages =  scroll_top / ((scroll_guide.offsetHeight - window.innerHeight)/NUM_PAGES);

  return percentage_per_pages - page
}

ScrollSimulator.prototype.resize = function(){
  var i,len,h;

  i = 0;
  len = NUM_PAGES;
  h = window.innerHeight;

  while(i < NUM_PAGES)
  {
    h += window.innerHeight*SCROLL_SENSIBILITY;
    i++;
  }

  scroll_guide.style.height = h+"px";
}

ScrollSimulator.prototype.setup_style = function(){
  var css = '.scroll-guide{position:relative;width:100%;pointer-events:none;-webkit-backface-visibility:hidden;}';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = style = document.createElement('style');

  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}

ScrollSimulator.prototype.addEventListener = function(eventName, callback){
  var events = this.events,
      callbacks = events[eventName] = events[eventName] || [];
  callbacks.push(callback);
}
ScrollSimulator.prototype.eventDispatcher = function(eventName, args){
  var callbacks = this.events[eventName];

  if(!callbacks) return;

  for (var i = 0, l = callbacks.length; i < l; i++) {
      callbacks[i].apply(null, args);
  }
}
ScrollSimulator.prototype.removeEventListener = function(eventName){
  delete this.events[eventName]
}

if (typeof define == TYPE_FUNCTION && define.amd) {
    define(function() {
        return ScrollSimulator;
    });
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = ScrollSimulator;
} else {
    window[exportName] = ScrollSimulator;
}

})(window, document, 'ScrollSimulator');
