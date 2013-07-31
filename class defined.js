<!DOCTYPE html>
<html>
<head>
<title>beat number</title>
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript">
;!function (window, $, undefined) {
  var Cla = (function () {
		var a = 1;

		function Cla(bindDom, options) {
			this.$this = bindDom;
			this.setOptions(options);
			this.render();
		}

		Cla.prototype.defaultOpts = {
			width: 200,
			height: 300
		};

		Cla.prototype.setOptions = function (options) {
			this.opts = $.extend({}, this.defaultOpts, options);
		};

		Cla.prototype.render = function () {
			console.log(this.$this.html())
		};

		Cla.prototype.getInfo = function () {
			console.log(this.opts.width);
			console.log(this.opts.height);
		};

		return Cla;
	})();
	// window.Cla = $.Cla = Cla;
	$.fn.Cla = function (opts) {
		var $this = $(this),
			data = $this.data();

		if (data.Cla) {
			delete data.Cla;
		}
		if (opts !== false) {
			data.Cla = new Cla($this, opts);
		}
		return data.Cla;
	};
}(this, jQuery);

// second method
;!function (window, $, undefined) {
	var Clas = function (options) {
		return Clas.list[options.id] ? Clas.list[options.id] : new Clas.fn._init(options);
	};

	Clas.fn = Clas.prototype = {
		constructor: Clas,
		opts: {},

		_init: function (options) {
			this.opts = $.extend({}, Clas.defaults, options || {}), _self = this;

			console.log(_self.opts.id)

		},

		getInfo: function (newNum) {
			console.log(this.opts.width);
			console.log(this.opts.height);
		}
	};
	Clas.fn._init.prototype = Clas.fn;

	Clas.defaults = {
		width: 100,
		height: 200
	};
	Clas.list = {};

	//扩展到jQuery工具集
	window.Clas = $.Clas = Clas;

	//扩展到jQuery包装集
	$.fn.Clas = function (opts) {
		var $this = $(this),
			data = $this.data();

		if (data.Clas) {
			delete data.Clas;
		}
		if (opts !== false) {
			opts.id = $this.attr('id');
			data.Clas = new Clas(opts);
		}
		return data.Clas;
	};
}(this, jQuery);


$(function () {
	var _cla1 = $('#A').Cla({
		width: 300
	});

	_cla1.getInfo();

	var _cla2 = $('#B').Cla({
		width: 400,
		height: 500
	});

	_cla2.getInfo();

	// case
	var _clas1 = $('#A').Clas({
		width: 300
	});

	_clas1.getInfo();

	var _clas2 = $('#B').Clas({
		width: 400,
		height: 500
	});

	_clas2.getInfo();
})
</script>
</head>
<body>
	<div id="A">aaaa</div>
	<div id="B">bbbb</div>
</body>

</html>
