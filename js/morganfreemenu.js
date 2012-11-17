(function($, window, document, undefined) {
	//old timers with out object.create
	if (typeof Object.create !== 'function') {
		Object.create = function(o) {
			var F = function() {};
			F.prototype = o;
			return new F();
		}
	}

	var pluginName = 'morganfreemenu',
		defaults = {
			dir: 'up',
			openOn: 'click',
			angleoffset: 190,
			anglerange: 350,
			outerRadius: 100,
			innerRadius: 50,
			width: 200,
			height: 200,
			arcWidth: 50
		};

	var MorganFreemenu = {

		init: function(ele, options) {
			this._$ele = $(ele);
			this._$items = this._$ele.find('li:not(:first-child):not(.arc)');
			this._$arc = this._$ele.find('li.arc');
			this._$center = this._$ele.find('li:first-child');
			this._options = $.extend({}, defaults, options || {});
			this._state = 'closed';
			this.buildarc();
			this.hook();
		},

		hook: function() {
			var self = this;
			if (self._options.openOn === 'click') {
				self._$center.on('click', function(e) {
					e.preventDefault();
					if (self._state === 'open') {
						self.close();
					} else {
						self.open();
					}
				})
			} else if (self._options.openon === 'hover') {
				self._$center.on('mouseenter', function(e) {
					e.preventDefault();
					self.open();
				}).on('mouseleave', function(e) {
					e.preventDefault();
					self.close();
				});
			}
		},

		open: function() {
			var self = this;
			self._state = 'opening';
			self._$arc.css({display:'block',opacity:1});
			var from = self.getcoords(1);
			var to = self.getcoords(330);
			var anim = $('<animate />',{'xlink:href':'#arcmenu' , 'attributeName': 'd', 'attributeType':'XML', from: from, to: to, dur:'3s', fill:'freeze'});
			self._$arc.find('path').attr('d', from).end().find('svg').append(anim)
			self._state = 'open';
		},

		close: function() {
			var self = this;
			self._state = 'closing';
			for (var i = 300; i >= 1; i--) {
				self._$arc.find('svg path').attr('d', self.getcoords(i));
			}
			self._$arc.css({display:'hidden',opacity:0});
			self._state = 'closed';
		},
		buildarc: function() {
			var self = this,
				pos = this._$center.position();
			self._$arc.css({top: '-25px', left: '25px'});
		},

		getcoords: function(angle) {
		  var startAngle = this._options.angleoffset;
		  var outerRadius = this._options.outerRadius || this._options.width / 2;
		  var innerRadius = this._options.innerRadius || this._options.width / 2 - this._options.arcWidth;
		  var startAngleDegree = Math.PI * startAngle / 180;
		  var endAngleDegree = Math.PI * (startAngle + angle) / 180;
		  var center = this._options.width / 2;

		  var p1 = pointOnCircle(outerRadius, endAngleDegree);
		  var p2 = pointOnCircle(outerRadius, startAngleDegree);
		  var p3 = pointOnCircle(innerRadius, startAngleDegree);
		  var p4 = pointOnCircle(innerRadius, endAngleDegree);

		  var path = 'M' + p1.x + ',' + p1.y;
		  var largeArcFlag = ( angle < 180 ? 0 : 1);
		  path += ' A' + outerRadius + ',' + outerRadius + ' 0 ' + largeArcFlag + ' 0 ' + p2.x + ',' + p2.y;
		  path += 'L' + p3.x + ',' + p3.y;
		  path += ' A' + innerRadius + ',' + innerRadius + ' 0 ' + largeArcFlag + ' 1 ' + p4.x + ',' + p4.y;
		  path += 'L' + p1.x + ',' + p1.y;
		  return  path;

		  function pointOnCircle(radius, angle) {
		    return {
		      x: center + radius * Math.cos(angle),
		      y: center + radius * Math.sin(angle)
		    };
		  }
		}
	};


	$.fn[pluginName] = function(options) {
		return this.each(function() {
			var obj = Object.create(MorganFreemenu);
			obj.init(this, options);
			$(this).data('morganfreemenu', obj);
		});
	}
}(jQuery, window, document));


