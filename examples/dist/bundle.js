require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _utilsStripDiacritics = require('./utils/stripDiacritics');

var _utilsStripDiacritics2 = _interopRequireDefault(_utilsStripDiacritics);

var requestId = 0;

function initCache(cache) {
	if (cache && typeof cache !== 'object') {
		cache = {};
	}
	return cache ? cache : null;
}

function updateCache(cache, input, data) {
	if (!cache) return;
	cache[input] = data;
}

function getFromCache(cache, input) {
	if (!cache) return;
	for (var i = input.length; i >= 0; --i) {
		var cacheKey = input.slice(0, i);
		if (cache[cacheKey] && (input === cacheKey || cache[cacheKey].complete)) {
			return cache[cacheKey];
		}
	}
}

function thenPromise(promise, callback) {
	if (!promise || typeof promise.then !== 'function') return;
	return promise.then(function (data) {
		callback(null, data);
	}, function (err) {
		callback(err);
	});
}

var stringOrNode = _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.node]);

var Async = _react2['default'].createClass({
	displayName: 'Async',

	propTypes: {
		cache: _react2['default'].PropTypes.any, // object to use to cache results, can be null to disable cache
		ignoreAccents: _react2['default'].PropTypes.bool, // whether to strip diacritics when filtering (shared with Select)
		ignoreCase: _react2['default'].PropTypes.bool, // whether to perform case-insensitive filtering (shared with Select)
		isLoading: _react2['default'].PropTypes.bool, // overrides the isLoading state when set to true
		loadOptions: _react2['default'].PropTypes.func.isRequired, // function to call to load options asynchronously
		loadingPlaceholder: _react2['default'].PropTypes.string, // replaces the placeholder while options are loading
		minimumInput: _react2['default'].PropTypes.number, // the minimum number of characters that trigger loadOptions
		noResultsText: _react2['default'].PropTypes.string, // placeholder displayed when there are no matching search results (shared with Select)
		placeholder: stringOrNode, // field placeholder, displayed when there's no value (shared with Select)
		searchPromptText: _react2['default'].PropTypes.string, // label to prompt for search input
		searchingText: _react2['default'].PropTypes.string },
	// message to display while options are loading
	getDefaultProps: function getDefaultProps() {
		return {
			cache: true,
			ignoreAccents: true,
			ignoreCase: true,
			loadingPlaceholder: 'Loading...',
			minimumInput: 0,
			searchingText: 'Searching...',
			searchPromptText: 'Type to search'
		};
	},
	getInitialState: function getInitialState() {
		return {
			cache: initCache(this.props.cache),
			isLoading: false,
			options: []
		};
	},
	componentWillMount: function componentWillMount() {
		this._lastInput = '';
	},
	componentDidMount: function componentDidMount() {
		this.loadOptions('');
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (nextProps.cache !== this.props.cache) {
			this.setState({
				cache: initCache(nextProps.cache)
			});
		}
	},
	focus: function focus() {
		this.refs.select.focus();
	},
	resetState: function resetState() {
		this._currentRequestId = -1;
		this.setState({
			isLoading: false,
			options: []
		});
	},
	getResponseHandler: function getResponseHandler(input) {
		var _this = this;

		var _requestId = this._currentRequestId = requestId++;
		return function (err, data) {
			if (err) throw err;
			if (!_this.isMounted()) return;
			updateCache(_this.state.cache, input, data);
			if (_requestId !== _this._currentRequestId) return;
			_this.setState({
				isLoading: false,
				options: data && data.options || []
			});
		};
	},
	loadOptions: function loadOptions(input) {
		if (this.props.ignoreAccents) input = (0, _utilsStripDiacritics2['default'])(input);
		if (this.props.ignoreCase) input = input.toLowerCase();
		this._lastInput = input;
		if (input.length < this.props.minimumInput) {
			return this.resetState();
		}
		var cacheResult = getFromCache(this.state.cache, input);
		if (cacheResult) {
			return this.setState({
				options: cacheResult.options
			});
		}
		this.setState({
			isLoading: true
		});
		var responseHandler = this.getResponseHandler(input);
		return thenPromise(this.props.loadOptions(input, responseHandler), responseHandler);
	},
	render: function render() {
		var noResultsText = this.props.noResultsText;
		var _state = this.state;
		var isLoading = _state.isLoading;
		var options = _state.options;

		if (this.props.isLoading) isLoading = true;
		var placeholder = isLoading ? this.props.loadingPlaceholder : this.props.placeholder;
		if (!options.length) {
			if (this._lastInput.length < this.props.minimumInput) noResultsText = this.props.searchPromptText;
			if (isLoading) noResultsText = this.props.searchingText;
		}
		return _react2['default'].createElement(_Select2['default'], _extends({}, this.props, {
			ref: 'select',
			isLoading: isLoading,
			noResultsText: noResultsText,
			onInputChange: this.loadOptions,
			options: options,
			placeholder: placeholder
		}));
	}
});

module.exports = Async;

},{"./Select":"react-select","./utils/stripDiacritics":4,"react":undefined}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Option = _react2['default'].createClass({
	displayName: 'Option',

	propTypes: {
		children: _react2['default'].PropTypes.node,
		className: _react2['default'].PropTypes.string, // className (based on mouse position)
		isDisabled: _react2['default'].PropTypes.bool, // the option is disabled
		isFocused: _react2['default'].PropTypes.bool, // the option is focused
		isSelected: _react2['default'].PropTypes.bool, // the option is selected
		onFocus: _react2['default'].PropTypes.func, // method to handle mouseEnter on option element
		onSelect: _react2['default'].PropTypes.func, // method to handle click on option element
		onUnfocus: _react2['default'].PropTypes.func, // method to handle mouseLeave on option element
		option: _react2['default'].PropTypes.object.isRequired },
	// object that is base for that option
	blockEvent: function blockEvent(event) {
		event.preventDefault();
		event.stopPropagation();
		if (event.target.tagName !== 'A' || !('href' in event.target)) {
			return;
		}
		if (event.target.target) {
			window.open(event.target.href, event.target.target);
		} else {
			window.location.href = event.target.href;
		}
	},

	handleMouseDown: function handleMouseDown(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
	},

	handleMouseEnter: function handleMouseEnter(event) {
		this.onFocus(event);
	},

	handleMouseMove: function handleMouseMove(event) {
		this.onFocus(event);
	},

	handleTouchEnd: function handleTouchEnd(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		this.handleMouseDown(event);
	},

	handleTouchMove: function handleTouchMove(event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart: function handleTouchStart(event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	onFocus: function onFocus(event) {
		if (!this.props.isFocused) {
			this.props.onFocus(this.props.option, event);
		}
	},
	render: function render() {
		var option = this.props.option;

		var className = (0, _classnames2['default'])(this.props.className, option.className);

		return option.disabled ? _react2['default'].createElement(
			'div',
			{ className: className,
				onMouseDown: this.blockEvent,
				onClick: this.blockEvent },
			this.props.children
		) : _react2['default'].createElement(
			'div',
			{ className: className,
				style: option.style,
				onMouseDown: this.handleMouseDown,
				onMouseEnter: this.handleMouseEnter,
				onMouseMove: this.handleMouseMove,
				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove,
				onTouchEnd: this.handleTouchEnd,
				title: option.title },
			this.props.children
		);
	}
});

module.exports = Option;

},{"classnames":undefined,"react":undefined}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Value = _react2['default'].createClass({

	displayName: 'Value',

	propTypes: {
		children: _react2['default'].PropTypes.node,
		disabled: _react2['default'].PropTypes.bool, // disabled prop passed to ReactSelect
		onClick: _react2['default'].PropTypes.func, // method to handle click on value label
		onRemove: _react2['default'].PropTypes.func, // method to handle removal of the value
		value: _react2['default'].PropTypes.object.isRequired },

	// the option object for this value
	handleMouseDown: function handleMouseDown(event) {
		if (event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		if (this.props.onClick) {
			event.stopPropagation();
			this.props.onClick(this.props.value, event);
			return;
		}
		if (this.props.value.href) {
			event.stopPropagation();
		}
	},

	onRemove: function onRemove(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onRemove(this.props.value);
	},

	handleTouchEndRemove: function handleTouchEndRemove(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		// Fire the mouse events
		this.onRemove(event);
	},

	handleTouchMove: function handleTouchMove(event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart: function handleTouchStart(event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	renderRemoveIcon: function renderRemoveIcon() {
		if (this.props.disabled || !this.props.onRemove) return;
		return _react2['default'].createElement(
			'span',
			{ className: 'Select-value-icon',
				onMouseDown: this.onRemove,
				onTouchEnd: this.handleTouchEndRemove,
				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove },
			'×'
		);
	},

	renderLabel: function renderLabel() {
		var className = 'Select-value-label';
		return this.props.onClick || this.props.value.href ? _react2['default'].createElement(
			'a',
			{ className: className, href: this.props.value.href, target: this.props.value.target, onMouseDown: this.handleMouseDown, onTouchEnd: this.handleMouseDown },
			this.props.children
		) : _react2['default'].createElement(
			'span',
			{ className: className },
			this.props.children
		);
	},

	render: function render() {
		return _react2['default'].createElement(
			'div',
			{ className: (0, _classnames2['default'])('Select-value', this.props.value.className),
				style: this.props.value.style,
				title: this.props.value.title
			},
			this.renderRemoveIcon(),
			this.renderLabel()
		);
	}

});

module.exports = Value;

},{"classnames":undefined,"react":undefined}],4:[function(require,module,exports){
'use strict';

var map = [{ 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g }, { 'base': 'AA', 'letters': /[\uA732]/g }, { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g }, { 'base': 'AO', 'letters': /[\uA734]/g }, { 'base': 'AU', 'letters': /[\uA736]/g }, { 'base': 'AV', 'letters': /[\uA738\uA73A]/g }, { 'base': 'AY', 'letters': /[\uA73C]/g }, { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g }, { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g }, { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g }, { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g }, { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g }, { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g }, { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g }, { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g }, { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g }, { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g }, { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g }, { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g }, { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g }, { 'base': 'LJ', 'letters': /[\u01C7]/g }, { 'base': 'Lj', 'letters': /[\u01C8]/g }, { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g }, { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g }, { 'base': 'NJ', 'letters': /[\u01CA]/g }, { 'base': 'Nj', 'letters': /[\u01CB]/g }, { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g }, { 'base': 'OI', 'letters': /[\u01A2]/g }, { 'base': 'OO', 'letters': /[\uA74E]/g }, { 'base': 'OU', 'letters': /[\u0222]/g }, { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g }, { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g }, { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g }, { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g }, { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g }, { 'base': 'TZ', 'letters': /[\uA728]/g }, { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g }, { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g }, { 'base': 'VY', 'letters': /[\uA760]/g }, { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g }, { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g }, { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g }, { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g }, { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g }, { 'base': 'aa', 'letters': /[\uA733]/g }, { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g }, { 'base': 'ao', 'letters': /[\uA735]/g }, { 'base': 'au', 'letters': /[\uA737]/g }, { 'base': 'av', 'letters': /[\uA739\uA73B]/g }, { 'base': 'ay', 'letters': /[\uA73D]/g }, { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g }, { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g }, { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g }, { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g }, { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g }, { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g }, { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g }, { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g }, { 'base': 'hv', 'letters': /[\u0195]/g }, { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g }, { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g }, { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g }, { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g }, { 'base': 'lj', 'letters': /[\u01C9]/g }, { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g }, { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g }, { 'base': 'nj', 'letters': /[\u01CC]/g }, { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g }, { 'base': 'oi', 'letters': /[\u01A3]/g }, { 'base': 'ou', 'letters': /[\u0223]/g }, { 'base': 'oo', 'letters': /[\uA74F]/g }, { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g }, { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g }, { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g }, { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g }, { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g }, { 'base': 'tz', 'letters': /[\uA729]/g }, { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g }, { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g }, { 'base': 'vy', 'letters': /[\uA761]/g }, { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g }, { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g }, { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g }, { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }];

module.exports = function stripDiacritics(str) {
	for (var i = 0; i < map.length; i++) {
		str = str.replace(map[i].letters, map[i].base);
	}
	return str;
};

},{}],"react-select":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactInputAutosize = require('react-input-autosize');

var _reactInputAutosize2 = _interopRequireDefault(_reactInputAutosize);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsStripDiacritics = require('./utils/stripDiacritics');

var _utilsStripDiacritics2 = _interopRequireDefault(_utilsStripDiacritics);

var _Async = require('./Async');

var _Async2 = _interopRequireDefault(_Async);

var _Option = require('./Option');

var _Option2 = _interopRequireDefault(_Option);

var _Value = require('./Value');

var _Value2 = _interopRequireDefault(_Value);

function stringifyValue(value) {
	if (typeof value === 'object') {
		return JSON.stringify(value);
	} else {
		return value;
	}
}

var stringOrNode = _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.node]);

var Select = _react2['default'].createClass({

	displayName: 'Select',

	propTypes: {
		addLabelText: _react2['default'].PropTypes.string, // placeholder displayed when you want to add a label on a multi-value input
		autosize: _react2['default'].PropTypes.bool, // whether to enable autosizing or not
		allowCreate: _react2['default'].PropTypes.bool, // whether to allow creation of new entries
		autoBlur: _react2['default'].PropTypes.bool,
		autofocus: _react2['default'].PropTypes.bool, // autofocus the component on mount
		backspaceRemoves: _react2['default'].PropTypes.bool, // whether backspace removes an item if there is no text input
		className: _react2['default'].PropTypes.string, // className for the outer element
		clearAllText: stringOrNode, // title for the "clear" control when multi: true
		clearValueText: stringOrNode, // title for the "clear" control
		clearable: _react2['default'].PropTypes.bool, // should it be possible to reset value
		delimiter: _react2['default'].PropTypes.string, // delimiter to use to join multiple values for the hidden field value
		disabled: _react2['default'].PropTypes.bool, // whether the Select is disabled or not
		escapeClearsValue: _react2['default'].PropTypes.bool, // whether escape clears the value when the menu is closed
		filterOption: _react2['default'].PropTypes.func, // method to filter a single option (option, filterString)
		filterOptions: _react2['default'].PropTypes.any, // boolean to enable default filtering or function to filter the options array ([options], filterString, [values])
		ignoreAccents: _react2['default'].PropTypes.bool, // whether to strip diacritics when filtering
		ignoreCase: _react2['default'].PropTypes.bool, // whether to perform case-insensitive filtering
		inputProps: _react2['default'].PropTypes.object, // custom attributes for the Input
		isLoading: _react2['default'].PropTypes.bool, // whether the Select is loading externally or not (such as options being loaded)
		joinValues: _react2['default'].PropTypes.bool, // joins multiple values into a single form field with the delimiter (legacy mode)
		labelKey: _react2['default'].PropTypes.string, // path of the label value in option objects
		matchPos: _react2['default'].PropTypes.string, // (any|start) match the start or entire string when filtering
		matchProp: _react2['default'].PropTypes.string, // (any|label|value) which option property to filter on
		menuBuffer: _react2['default'].PropTypes.number, // optional buffer (in px) between the bottom of the viewport and the bottom of the menu
		menuContainerStyle: _react2['default'].PropTypes.object, // optional style to apply to the menu container
		menuStyle: _react2['default'].PropTypes.object, // optional style to apply to the menu
		multi: _react2['default'].PropTypes.bool, // multi-value input
		name: _react2['default'].PropTypes.string, // generates a hidden <input /> tag with this field name for html forms
		newOptionCreator: _react2['default'].PropTypes.func, // factory to create new options when allowCreate set
		noResultsText: stringOrNode, // placeholder displayed when there are no matching search results
		onBlur: _react2['default'].PropTypes.func, // onBlur handler: function (event) {}
		onBlurResetsInput: _react2['default'].PropTypes.bool, // whether input is cleared on blur
		onChange: _react2['default'].PropTypes.func, // onChange handler: function (newValue) {}
		onClose: _react2['default'].PropTypes.func, // fires when the menu is closed
		onFocus: _react2['default'].PropTypes.func, // onFocus handler: function (event) {}
		onInputChange: _react2['default'].PropTypes.func, // onInputChange handler: function (inputValue) {}
		onMenuScrollToBottom: _react2['default'].PropTypes.func, // fires when the menu is scrolled to the bottom; can be used to paginate options
		onOpen: _react2['default'].PropTypes.func, // fires when the menu is opened
		onValueClick: _react2['default'].PropTypes.func, // onClick handler for value labels: function (value, event) {}
		optionComponent: _react2['default'].PropTypes.func, // option component to render in dropdown
		optionRenderer: _react2['default'].PropTypes.func, // optionRenderer: function (option) {}
		options: _react2['default'].PropTypes.array, // array of options
		placeholder: stringOrNode, // field placeholder, displayed when there's no value
		required: _react2['default'].PropTypes.bool, // applies HTML5 required attribute when needed
		scrollMenuIntoView: _react2['default'].PropTypes.bool, // boolean to enable the viewport to shift so that the full menu fully visible when engaged
		searchable: _react2['default'].PropTypes.bool, // whether to enable searching feature or not
		simpleValue: _react2['default'].PropTypes.bool, // pass the value to onChange as a simple value (legacy pre 1.0 mode), defaults to false
		style: _react2['default'].PropTypes.object, // optional style to apply to the control
		tabIndex: _react2['default'].PropTypes.string, // optional tab index of the control
		value: _react2['default'].PropTypes.any, // initial field value
		valueComponent: _react2['default'].PropTypes.func, // value component to render
		valueKey: _react2['default'].PropTypes.string, // path of the label value in option objects
		valueRenderer: _react2['default'].PropTypes.func, // valueRenderer: function (option) {}
		wrapperStyle: _react2['default'].PropTypes.object, // optional style to apply to the component wrapper
		displayAll: _react2['default'].PropTypes.bool, // Display all the contents in the dropdown, even after selecting few of the entries from it, this is applicable only when multi is true
		singleValue: _react2['default'].PropTypes.bool },

	// Send only a single value to the Custom Value Component
	statics: { Async: _Async2['default'] },

	getDefaultProps: function getDefaultProps() {
		return {
			addLabelText: 'Add "{label}"?',
			autosize: true,
			allowCreate: false,
			backspaceRemoves: true,
			clearable: true,
			clearAllText: 'Clear all',
			clearValueText: 'Clear value',
			delimiter: ',',
			disabled: false,
			escapeClearsValue: true,
			filterOptions: true,
			ignoreAccents: true,
			ignoreCase: true,
			inputProps: {},
			isLoading: false,
			joinValues: false,
			labelKey: 'label',
			matchPos: 'any',
			matchProp: 'any',
			menuBuffer: 0,
			multi: false,
			noResultsText: 'No results found',
			onBlurResetsInput: true,
			optionComponent: _Option2['default'],
			placeholder: 'Select...',
			required: false,
			scrollMenuIntoView: true,
			searchable: true,
			simpleValue: false,
			valueComponent: _Value2['default'],
			valueKey: 'value',
			displayAll: false
		};
	},

	getInitialState: function getInitialState() {
		return {
			inputValue: '',
			isFocused: false,
			isLoading: false,
			isOpen: false,
			isPseudoFocused: false,
			required: this.props.required && this.handleRequired(this.props.value, this.props.multi)
		};
	},

	componentDidMount: function componentDidMount() {
		if (this.props.autofocus) {
			this.focus();
		}
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (this.props.value !== nextProps.value && nextProps.required) {
			this.setState({
				required: this.handleRequired(nextProps.value, nextProps.multi)
			});
		}
	},

	componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
		if (nextState.isOpen !== this.state.isOpen) {
			var handler = nextState.isOpen ? nextProps.onOpen : nextProps.onClose;
			handler && handler();
		}
	},

	componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
		// focus to the selected option
		if (this.refs.menu && this.refs.focused && this.state.isOpen && !this.hasScrolledToOption) {
			var focusedOptionNode = _reactDom2['default'].findDOMNode(this.refs.focused);
			var menuNode = _reactDom2['default'].findDOMNode(this.refs.menu);
			menuNode.scrollTop = focusedOptionNode.offsetTop;
			this.hasScrolledToOption = true;
		} else if (!this.state.isOpen) {
			this.hasScrolledToOption = false;
		}

		if (prevState.inputValue !== this.state.inputValue && this.props.onInputChange) {
			this.props.onInputChange(this.state.inputValue);
		}
		if (this._scrollToFocusedOptionOnUpdate && this.refs.focused && this.refs.menu) {
			this._scrollToFocusedOptionOnUpdate = false;
			var focusedDOM = _reactDom2['default'].findDOMNode(this.refs.focused);
			var menuDOM = _reactDom2['default'].findDOMNode(this.refs.menu);
			var focusedRect = focusedDOM.getBoundingClientRect();
			var menuRect = menuDOM.getBoundingClientRect();
			if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
				menuDOM.scrollTop = focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight;
			}
		}
		if (this.props.scrollMenuIntoView && this.refs.menuContainer) {
			var menuContainerRect = this.refs.menuContainer.getBoundingClientRect();
			if (window.innerHeight < menuContainerRect.bottom + this.props.menuBuffer) {
				window.scrollTo(0, window.scrollY + menuContainerRect.bottom + this.props.menuBuffer - window.innerHeight);
			}
		}
		if (prevProps.disabled !== this.props.disabled) {
			this.setState({ isFocused: false }); // eslint-disable-line react/no-did-update-set-state
		}
	},

	focus: function focus() {
		if (!this.refs.input) return;
		this.refs.input.focus();
	},

	blurInput: function blurInput() {
		if (!this.refs.input) return;
		this.refs.input.blur();
	},

	handleTouchMove: function handleTouchMove(event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart: function handleTouchStart(event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	handleTouchEnd: function handleTouchEnd(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		// Fire the mouse events
		this.handleMouseDown(event);
	},

	handleTouchEndClearValue: function handleTouchEndClearValue(event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if (this.dragging) return;

		// Clear the value
		this.clearValue(event);
	},

	handleMouseDown: function handleMouseDown(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
			return;
		}

		// prevent default event handlers
		event.stopPropagation();
		event.preventDefault();

		// for the non-searchable select, toggle the menu
		if (!this.props.searchable) {
			this.focus();
			return this.setState({
				isOpen: !this.state.isOpen
			});
		}

		if (this.state.isFocused) {
			// if the input is focused, ensure the menu is open
			this.setState({
				isOpen: true,
				isPseudoFocused: false
			});
		} else {
			// otherwise, focus the input and open the menu
			this._openAfterFocus = true;
			this.focus();
		}
	},

	handleMouseDownOnArrow: function handleMouseDownOnArrow(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		// If the menu isn't open, let the event bubble to the main handleMouseDown
		if (!this.state.isOpen) {
			return;
		}
		// prevent default event handlers
		event.stopPropagation();
		event.preventDefault();
		// close the menu
		this.closeMenu();
	},

	handleMouseDownOnMenu: function handleMouseDownOnMenu(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();

		this._openAfterFocus = true;
		this.focus();
	},

	closeMenu: function closeMenu() {
		this.setState({
			isOpen: false,
			isPseudoFocused: this.state.isFocused && !this.props.multi,
			inputValue: ''
		});
		this.hasScrolledToOption = false;
	},

	handleInputFocus: function handleInputFocus(event) {
		var isOpen = this.state.isOpen || this._openAfterFocus;
		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
		this.setState({
			isFocused: true,
			isOpen: isOpen
		});
		this._openAfterFocus = false;
	},

	handleInputBlur: function handleInputBlur(event) {
		if (this.refs.menu && document.activeElement.isEqualNode(this.refs.menu)) {
			return;
		}

		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
		var onBlurredState = {
			isFocused: false,
			isOpen: false,
			isPseudoFocused: false
		};
		if (this.props.onBlurResetsInput) {
			onBlurredState.inputValue = '';
		}
		this.setState(onBlurredState);
	},

	handleInputChange: function handleInputChange(event) {
		this.setState({
			isOpen: true,
			isPseudoFocused: false,
			inputValue: event.target.value
		});
	},

	handleKeyDown: function handleKeyDown(event) {
		if (this.props.disabled) return;
		switch (event.keyCode) {
			case 8:
				// backspace
				if (!this.state.inputValue && this.props.backspaceRemoves) {
					event.preventDefault();
					this.popValue();
				}
				return;
			case 9:
				// tab
				if (event.shiftKey || !this.state.isOpen) {
					return;
				}
				this.selectFocusedOption();
				return;
			case 13:
				// enter
				if (!this.state.isOpen) return;
				event.stopPropagation();
				this.selectFocusedOption();
				break;
			case 27:
				// escape
				if (this.state.isOpen) {
					this.closeMenu();
				} else if (this.props.clearable && this.props.escapeClearsValue) {
					this.clearValue(event);
				}
				break;
			case 38:
				// up
				this.focusPreviousOption();
				break;
			case 40:
				// down
				this.focusNextOption();
				break;
			// case 188: // ,
			// 	if (this.props.allowCreate && this.props.multi) {
			// 		event.preventDefault();
			// 		event.stopPropagation();
			// 		this.selectFocusedOption();
			// 	} else {
			// 		return;
			// 	}
			// break;
			default:
				return;
		}
		event.preventDefault();
	},

	handleValueClick: function handleValueClick(option, event) {
		if (!this.props.onValueClick) return;
		this.props.onValueClick(option, event);
	},

	handleMenuScroll: function handleMenuScroll(event) {
		if (!this.props.onMenuScrollToBottom) return;
		var target = event.target;

		if (target.scrollHeight > target.offsetHeight && !(target.scrollHeight - target.offsetHeight - target.scrollTop)) {
			this.props.onMenuScrollToBottom();
		}
	},

	handleRequired: function handleRequired(value, multi) {
		if (!value) return true;
		return multi ? value.length === 0 : Object.keys(value).length === 0;
	},

	getOptionLabel: function getOptionLabel(op) {
		return op[this.props.labelKey];
	},

	getValueArray: function getValueArray() {
		var value = this.props.value;
		if (this.props.multi) {
			if (typeof value === 'string') value = value.split(this.props.delimiter);
			if (!Array.isArray(value)) {
				if (value === null || value === undefined) return [];
				value = [value];
			}
			return value.map(this.expandValue).filter(function (i) {
				return i;
			});
		}
		var expandedValue = this.expandValue(value);
		return expandedValue ? [expandedValue] : [];
	},

	expandValue: function expandValue(value) {
		if (typeof value !== 'string' && typeof value !== 'number') return value;
		var _props = this.props;
		var options = _props.options;
		var valueKey = _props.valueKey;

		if (!options) return;
		for (var i = 0; i < options.length; i++) {
			if (options[i][valueKey] === value) return options[i];
		}
	},

	setValue: function setValue(value) {
		var _this = this;

		if (this.props.autoBlur) {
			this.blurInput();
		}
		if (!this.props.onChange) return;
		if (this.props.required) {
			var required = this.handleRequired(value, this.props.multi);
			this.setState({ required: required });
		}
		if (this.props.simpleValue && value) {
			value = this.props.multi ? value.map(function (i) {
				return i[_this.props.valueKey];
			}).join(this.props.delimiter) : value[this.props.valueKey];
		}
		this.props.onChange(value);
	},

	selectValue: function selectValue(value) {
		this.hasScrolledToOption = false;
		if (this.props.multi) {
			this.addValue(value);
			this.setState({
				inputValue: ''
			});
		} else {
			this.setValue(value);
			this.setState({
				isOpen: false,
				inputValue: '',
				isPseudoFocused: this.state.isFocused
			});
		}
	},

	addValue: function addValue(value) {
		var valueArray = this.getValueArray();
		this.setValue(valueArray.concat(value));
	},

	popValue: function popValue() {
		var valueArray = this.getValueArray();
		if (!valueArray.length) return;
		if (valueArray[valueArray.length - 1].clearableValue === false) return;
		this.setValue(valueArray.slice(0, valueArray.length - 1));
	},

	removeValue: function removeValue(value) {
		var valueArray = this.getValueArray();
		this.setValue(valueArray.filter(function (i) {
			return i !== value;
		}));
		this.focus();
	},

	clearValue: function clearValue(event) {
		// if the event was triggered by a mousedown and not the primary
		// button, ignore it.
		if (event && event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
		this.setValue(null);
		this.setState({
			isOpen: false,
			inputValue: ''
		}, this.focus);
	},

	focusOption: function focusOption(option) {
		this.setState({
			focusedOption: option
		});
	},

	focusNextOption: function focusNextOption() {
		this.focusAdjacentOption('next');
	},

	focusPreviousOption: function focusPreviousOption() {
		this.focusAdjacentOption('previous');
	},

	focusAdjacentOption: function focusAdjacentOption(dir) {
		var options = this._visibleOptions.filter(function (i) {
			return !i.disabled;
		});
		this._scrollToFocusedOptionOnUpdate = true;
		if (!this.state.isOpen) {
			this.setState({
				isOpen: true,
				inputValue: '',
				focusedOption: this._focusedOption || options[dir === 'next' ? 0 : options.length - 1]
			});
			return;
		}
		if (!options.length) return;
		var focusedIndex = -1;
		for (var i = 0; i < options.length; i++) {
			if (this._focusedOption === options[i]) {
				focusedIndex = i;
				break;
			}
		}
		var focusedOption = options[0];
		if (dir === 'next' && focusedIndex > -1 && focusedIndex < options.length - 1) {
			focusedOption = options[focusedIndex + 1];
		} else if (dir === 'previous') {
			if (focusedIndex > 0) {
				focusedOption = options[focusedIndex - 1];
			} else {
				focusedOption = options[options.length - 1];
			}
		}
		this.setState({
			focusedOption: focusedOption
		});
	},

	selectFocusedOption: function selectFocusedOption() {
		// if (this.props.allowCreate && !this.state.focusedOption) {
		// 	return this.selectValue(this.state.inputValue);
		// }
		if (this._focusedOption) {
			return this.selectValue(this._focusedOption);
		}
	},

	renderLoading: function renderLoading() {
		if (!this.props.isLoading) return;
		return _react2['default'].createElement(
			'span',
			{ className: 'Select-loading-zone', 'aria-hidden': 'true' },
			_react2['default'].createElement('span', { className: 'Select-loading' })
		);
	},

	renderValue: function renderValue(valueArray, isOpen) {
		var _this2 = this;

		var renderLabel = this.props.valueRenderer || this.getOptionLabel;
		var ValueComponent = this.props.valueComponent;
		if (!valueArray.length) {
			return !this.state.inputValue ? _react2['default'].createElement(
				'div',
				{ className: 'Select-placeholder' },
				this.props.placeholder
			) : null;
		}
		var onClick = this.props.onValueClick ? this.handleValueClick : null;
		if (this.props.multi) {
			if (this.props.singleValue) {
				return _react2['default'].createElement(
					ValueComponent,
					{
						disabled: this.props.disabled,
						onClick: onClick,
						onRemove: this.removeValue,
						values: valueArray
					},
					valueArray.length
				);
			} else {
				return valueArray.map(function (value, i) {
					return _react2['default'].createElement(
						ValueComponent,
						{
							disabled: _this2.props.disabled || value.clearableValue === false,
							key: 'value-' + i + '-' + value[_this2.props.valueKey],
							onClick: onClick,
							onRemove: _this2.removeValue,
							value: value
						},
						renderLabel(value)
					);
				});
			}
		} else if (!this.state.inputValue) {
			if (isOpen) onClick = null;
			return _react2['default'].createElement(
				ValueComponent,
				{
					disabled: this.props.disabled,
					onClick: onClick,
					value: valueArray[0]
				},
				renderLabel(valueArray[0])
			);
		}
	},

	renderInput: function renderInput(valueArray) {
		var className = (0, _classnames2['default'])('Select-input', this.props.inputProps.className);
		if (this.props.disabled || !this.props.searchable) {
			return _react2['default'].createElement('div', _extends({}, this.props.inputProps, {
				className: className,
				tabIndex: this.props.tabIndex || 0,
				onBlur: this.handleInputBlur,
				onFocus: this.handleInputFocus,
				ref: 'input',
				style: { border: 0, width: 1, display: 'inline-block' } }));
		}
		if (this.props.autosize) {
			return _react2['default'].createElement(_reactInputAutosize2['default'], _extends({}, this.props.inputProps, {
				className: className,
				tabIndex: this.props.tabIndex,
				onBlur: this.handleInputBlur,
				onChange: this.handleInputChange,
				onFocus: this.handleInputFocus,
				minWidth: '5',
				ref: 'input',
				required: this.state.required,
				value: this.state.inputValue
			}));
		}
		return _react2['default'].createElement(
			'div',
			{ className: className },
			_react2['default'].createElement('input', _extends({}, this.props.inputProps, {
				tabIndex: this.props.tabIndex,
				onBlur: this.handleInputBlur,
				onChange: this.handleInputChange,
				onFocus: this.handleInputFocus,
				ref: 'input',
				required: this.state.required,
				value: this.state.inputValue
			}))
		);
	},

	renderClear: function renderClear() {
		if (!this.props.clearable || !this.props.value || this.props.multi && !this.props.value.length || this.props.disabled || this.props.isLoading) return;
		return _react2['default'].createElement(
			'span',
			{ className: 'Select-clear-zone', title: this.props.multi ? this.props.clearAllText : this.props.clearValueText,
				'aria-label': this.props.multi ? this.props.clearAllText : this.props.clearValueText,
				onMouseDown: this.clearValue,
				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove,
				onTouchEnd: this.handleTouchEndClearValue },
			_react2['default'].createElement('span', { className: 'Select-clear', dangerouslySetInnerHTML: { __html: '&times;' } })
		);
	},

	renderArrow: function renderArrow() {
		return _react2['default'].createElement(
			'span',
			{ className: 'Select-arrow-zone', onMouseDown: this.handleMouseDownOnArrow },
			_react2['default'].createElement('span', { className: 'Select-arrow', onMouseDown: this.handleMouseDownOnArrow })
		);
	},

	filterOptions: function filterOptions(excludeOptions) {
		var _this3 = this;

		var filterValue = this.state.inputValue;
		var options = this.props.options || [];
		if (typeof this.props.filterOptions === 'function') {
			return this.props.filterOptions.call(this, options, filterValue, excludeOptions);
		} else if (this.props.filterOptions) {
			if (this.props.ignoreAccents) {
				filterValue = (0, _utilsStripDiacritics2['default'])(filterValue);
			}
			if (this.props.ignoreCase) {
				filterValue = filterValue.toLowerCase();
			}
			if (excludeOptions) excludeOptions = excludeOptions.map(function (i) {
				return i[_this3.props.valueKey];
			});
			return options.filter(function (option) {
				if (excludeOptions && excludeOptions.indexOf(option[_this3.props.valueKey]) > -1) return false;
				if (_this3.props.filterOption) return _this3.props.filterOption.call(_this3, option, filterValue);
				if (!filterValue) return true;
				var valueTest = String(option[_this3.props.valueKey]);
				var labelTest = String(option[_this3.props.labelKey]);
				if (_this3.props.ignoreAccents) {
					if (_this3.props.matchProp !== 'label') valueTest = (0, _utilsStripDiacritics2['default'])(valueTest);
					if (_this3.props.matchProp !== 'value') labelTest = (0, _utilsStripDiacritics2['default'])(labelTest);
				}
				if (_this3.props.ignoreCase) {
					if (_this3.props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
					if (_this3.props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
				}
				return _this3.props.matchPos === 'start' ? _this3.props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue || _this3.props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue : _this3.props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0 || _this3.props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0;
			});
		} else {
			return options;
		}
	},

	renderMenu: function renderMenu(options, valueArray, focusedOption) {
		var _this4 = this;

		if (options && options.length) {
			var _ret = (function () {
				var Option = _this4.props.optionComponent;
				var renderLabel = _this4.props.optionRenderer || _this4.getOptionLabel;

				return {
					v: options.map(function (option, i) {
						var isSelected = valueArray && valueArray.indexOf(option) > -1;
						var isFocused = option === focusedOption;
						var optionRef = isFocused ? 'focused' : null;
						var optionClass = (0, _classnames2['default'])({
							'Select-option': true,
							'is-selected': isSelected,
							'is-focused': isFocused,
							'is-disabled': option.disabled
						});

						return _react2['default'].createElement(
							Option,
							{
								className: optionClass,
								isDisabled: option.disabled,
								isFocused: isFocused,
								key: 'option-' + i + '-' + option[_this4.props.valueKey],
								onSelect: _this4.selectValue,
								onFocus: _this4.focusOption,
								option: option,
								isSelected: isSelected,
								ref: optionRef
							},
							renderLabel(option)
						);
					})
				};
			})();

			if (typeof _ret === 'object') return _ret.v;
		} else if (this.props.noResultsText) {
			return _react2['default'].createElement(
				'div',
				{ className: 'Select-noresults' },
				this.props.noResultsText
			);
		} else {
			return null;
		}
	},

	renderHiddenField: function renderHiddenField(valueArray) {
		var _this5 = this;

		if (!this.props.name) return;
		if (this.props.joinValues) {
			var value = valueArray.map(function (i) {
				return stringifyValue(i[_this5.props.valueKey]);
			}).join(this.props.delimiter);
			return _react2['default'].createElement('input', {
				type: 'hidden',
				ref: 'value',
				name: this.props.name,
				value: value,
				disabled: this.props.disabled });
		}
		return valueArray.map(function (item, index) {
			return _react2['default'].createElement('input', { key: 'hidden.' + index,
				type: 'hidden',
				ref: 'value' + index,
				name: _this5.props.name,
				value: stringifyValue(item[_this5.props.valueKey]),
				disabled: _this5.props.disabled });
		});
	},

	getFocusableOption: function getFocusableOption(selectedOption) {
		var options = this._visibleOptions;
		if (!options.length) return;
		var focusedOption = this.state.focusedOption || selectedOption;
		if (focusedOption && options.indexOf(focusedOption) > -1) return focusedOption;
		for (var i = 0; i < options.length; i++) {
			if (!options[i].disabled) return options[i];
		}
	},

	render: function render() {
		var valueArray = this.getValueArray();
		var options = this._visibleOptions = this.filterOptions(this.props.multi && !this.props.displayAll ? valueArray : null);
		var isOpen = this.state.isOpen;
		if (this.props.multi && !this.props.displayAll && !options.length && valueArray.length && !this.state.inputValue) isOpen = false;
		var focusedOption = this._focusedOption = this.getFocusableOption(valueArray[0]);
		var className = (0, _classnames2['default'])('Select', this.props.className, {
			'Select--multi': this.props.multi,
			'is-disabled': this.props.disabled,
			'is-focused': this.state.isFocused,
			'is-loading': this.props.isLoading,
			'is-open': isOpen,
			'is-pseudo-focused': this.state.isPseudoFocused,
			'is-searchable': this.props.searchable,
			'has-value': valueArray.length
		});
		return _react2['default'].createElement(
			'div',
			{ ref: 'wrapper', className: className, style: this.props.wrapperStyle },
			this.renderHiddenField(valueArray),
			_react2['default'].createElement(
				'div',
				{ ref: 'control',
					className: 'Select-control',
					style: this.props.style,
					onKeyDown: this.handleKeyDown,
					onMouseDown: this.handleMouseDown,
					onTouchEnd: this.handleTouchEnd,
					onTouchStart: this.handleTouchStart,
					onTouchMove: this.handleTouchMove },
				this.renderValue(valueArray, isOpen),
				this.renderInput(valueArray),
				this.renderLoading(),
				this.renderClear(),
				this.renderArrow()
			),
			isOpen ? _react2['default'].createElement(
				'div',
				{ ref: 'menuContainer', className: 'Select-menu-outer', style: this.props.menuContainerStyle },
				_react2['default'].createElement(
					'div',
					{ ref: 'menu', className: 'Select-menu',
						style: this.props.menuStyle,
						onScroll: this.handleMenuScroll,
						onMouseDown: this.handleMouseDownOnMenu },
					this.renderMenu(options, !this.props.multi ? valueArray : null, focusedOption)
				)
			) : null
		);
	}

});

exports['default'] = Select;
module.exports = exports['default'];

},{"./Async":1,"./Option":2,"./Value":3,"./utils/stripDiacritics":4,"classnames":undefined,"react":undefined,"react-dom":undefined,"react-input-autosize":undefined}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW1hbm9oYXJhbi9Qcm9qZWN0cy9yZWFjdC1zZWxlY3Qvc3JjL0FzeW5jLmpzIiwiL1VzZXJzL21tYW5vaGFyYW4vUHJvamVjdHMvcmVhY3Qtc2VsZWN0L3NyYy9PcHRpb24uanMiLCIvVXNlcnMvbW1hbm9oYXJhbi9Qcm9qZWN0cy9yZWFjdC1zZWxlY3Qvc3JjL1ZhbHVlLmpzIiwiL1VzZXJzL21tYW5vaGFyYW4vUHJvamVjdHMvcmVhY3Qtc2VsZWN0L3NyYy91dGlscy9zdHJpcERpYWNyaXRpY3MuanMiLCIvVXNlcnMvbW1hbm9oYXJhbi9Qcm9qZWN0cy9yZWFjdC1zZWxlY3Qvc3JjL1NlbGVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztxQkNBa0IsT0FBTzs7OztzQkFFTixVQUFVOzs7O29DQUNELHlCQUF5Qjs7OztBQUVyRCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7O0FBRWxCLFNBQVMsU0FBUyxDQUFFLEtBQUssRUFBRTtBQUMxQixLQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDdkMsT0FBSyxHQUFHLEVBQUUsQ0FBQztFQUNYO0FBQ0QsUUFBTyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztDQUM1Qjs7QUFFRCxTQUFTLFdBQVcsQ0FBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUN6QyxLQUFJLENBQUMsS0FBSyxFQUFFLE9BQU87QUFDbkIsTUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztDQUNwQjs7QUFFRCxTQUFTLFlBQVksQ0FBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3BDLEtBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTztBQUNuQixNQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMs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QUFXLEVBQUUsSUFBSSxDQUFDLGVBQWUsQUFBQztJQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUM7SUFDcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7SUFDNUIsSUFBSSxDQUFDLGFBQWEsRUFBRTtJQUNwQixJQUFJLENBQUMsV0FBVyxFQUFFO0lBQ2xCLElBQUksQ0FBQyxXQUFXLEVBQUU7SUFDZDtHQUNMLE1BQU0sR0FDTjs7TUFBSyxHQUFHLEVBQUMsZUFBZSxFQUFDLFNBQVMsRUFBQyxtQkFBbUIsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQUFBQztJQUMzRjs7T0FBSyxHQUFHLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxhQUFhO0FBQ3BDLFdBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQUFBQztBQUM1QixjQUFRLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixBQUFDO0FBQ2hDLGlCQUFXLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixBQUFDO0tBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsVUFBVSxHQUFHLElBQUksRUFBRSxhQUFhLENBQUM7S0FDMUU7SUFDRCxHQUNILElBQUk7R0FDSCxDQUNMO0VBQ0Y7O0NBRUQsQ0FBQyxDQUFDOztxQkFFWSxNQUFNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBTZWxlY3QgZnJvbSAnLi9TZWxlY3QnO1xuaW1wb3J0IHN0cmlwRGlhY3JpdGljcyBmcm9tICcuL3V0aWxzL3N0cmlwRGlhY3JpdGljcyc7XG5cbmxldCByZXF1ZXN0SWQgPSAwO1xuXG5mdW5jdGlvbiBpbml0Q2FjaGUgKGNhY2hlKSB7XG5cdGlmIChjYWNoZSAmJiB0eXBlb2YgY2FjaGUgIT09ICdvYmplY3QnKSB7XG5cdFx0Y2FjaGUgPSB7fTtcblx0fVxuXHRyZXR1cm4gY2FjaGUgPyBjYWNoZSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNhY2hlIChjYWNoZSwgaW5wdXQsIGRhdGEpIHtcblx0aWYgKCFjYWNoZSkgcmV0dXJuO1xuXHRjYWNoZVtpbnB1dF0gPSBkYXRhO1xufVxuXG5mdW5jdGlvbiBnZXRGcm9tQ2FjaGUgKGNhY2hlLCBpbnB1dCkge1xuXHRpZiAoIWNhY2hlKSByZXR1cm47XG5cdGZvciAobGV0IGkgPSBpbnB1dC5sZW5ndGg7IGkgPj0gMDsgLS1pKSB7XG5cdFx0bGV0IGNhY2hlS2V5ID0gaW5wdXQuc2xpY2UoMCwgaSk7XG5cdFx0aWYgKGNhY2hlW2NhY2hlS2V5XSAmJiAoaW5wdXQgPT09IGNhY2hlS2V5IHx8IGNhY2hlW2NhY2hlS2V5XS5jb21wbGV0ZSkpIHtcblx0XHRcdHJldHVybiBjYWNoZVtjYWNoZUtleV07XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHRoZW5Qcm9taXNlIChwcm9taXNlLCBjYWxsYmFjaykge1xuXHRpZiAoIXByb21pc2UgfHwgdHlwZW9mIHByb21pc2UudGhlbiAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuXHRyZXR1cm4gcHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XG5cdFx0Y2FsbGJhY2sobnVsbCwgZGF0YSk7XG5cdH0sIChlcnIpID0+IHtcblx0XHRjYWxsYmFjayhlcnIpO1xuXHR9KTtcbn1cblxuY29uc3Qgc3RyaW5nT3JOb2RlID0gUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG5cdFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFJlYWN0LlByb3BUeXBlcy5ub2RlXG5dKTtcblxuY29uc3QgQXN5bmMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdHByb3BUeXBlczoge1xuXHRcdGNhY2hlOiBSZWFjdC5Qcm9wVHlwZXMuYW55LCAgICAgICAgICAgICAgICAgICAgIC8vIG9iamVjdCB0byB1c2UgdG8gY2FjaGUgcmVzdWx0cywgY2FuIGJlIG51bGwgdG8gZGlzYWJsZSBjYWNoZVxuXHRcdGlnbm9yZUFjY2VudHM6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgIC8vIHdoZXRoZXIgdG8gc3RyaXAgZGlhY3JpdGljcyB3aGVuIGZpbHRlcmluZyAoc2hhcmVkIHdpdGggU2VsZWN0KVxuXHRcdGlnbm9yZUNhc2U6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAgIC8vIHdoZXRoZXIgdG8gcGVyZm9ybSBjYXNlLWluc2Vuc2l0aXZlIGZpbHRlcmluZyAoc2hhcmVkIHdpdGggU2VsZWN0KVxuXHRcdGlzTG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgIC8vIG92ZXJyaWRlcyB0aGUgaXNMb2FkaW5nIHN0YXRlIHdoZW4gc2V0IHRvIHRydWVcblx0XHRsb2FkT3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCwgICAvLyBmdW5jdGlvbiB0byBjYWxsIHRvIGxvYWQgb3B0aW9ucyBhc3luY2hyb25vdXNseVxuXHRcdGxvYWRpbmdQbGFjZWhvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgIC8vIHJlcGxhY2VzIHRoZSBwbGFjZWhvbGRlciB3aGlsZSBvcHRpb25zIGFyZSBsb2FkaW5nXG5cdFx0bWluaW11bUlucHV0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAgICAgICAgICAgLy8gdGhlIG1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCB0cmlnZ2VyIGxvYWRPcHRpb25zXG5cdFx0bm9SZXN1bHRzVGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgLy8gcGxhY2Vob2xkZXIgZGlzcGxheWVkIHdoZW4gdGhlcmUgYXJlIG5vIG1hdGNoaW5nIHNlYXJjaCByZXN1bHRzIChzaGFyZWQgd2l0aCBTZWxlY3QpXG5cdFx0cGxhY2Vob2xkZXI6IHN0cmluZ09yTm9kZSwgICAgICAgICAgICAgICAgICAgICAgLy8gZmllbGQgcGxhY2Vob2xkZXIsIGRpc3BsYXllZCB3aGVuIHRoZXJlJ3Mgbm8gdmFsdWUgKHNoYXJlZCB3aXRoIFNlbGVjdClcblx0XHRzZWFyY2hQcm9tcHRUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAvLyBsYWJlbCB0byBwcm9tcHQgZm9yIHNlYXJjaCBpbnB1dFxuXHRcdHNlYXJjaGluZ1RleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgIC8vIG1lc3NhZ2UgdG8gZGlzcGxheSB3aGlsZSBvcHRpb25zIGFyZSBsb2FkaW5nXG5cdH0sXG5cdGdldERlZmF1bHRQcm9wcyAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNhY2hlOiB0cnVlLFxuXHRcdFx0aWdub3JlQWNjZW50czogdHJ1ZSxcblx0XHRcdGlnbm9yZUNhc2U6IHRydWUsXG5cdFx0XHRsb2FkaW5nUGxhY2Vob2xkZXI6ICdMb2FkaW5nLi4uJyxcblx0XHRcdG1pbmltdW1JbnB1dDogMCxcblx0XHRcdHNlYXJjaGluZ1RleHQ6ICdTZWFyY2hpbmcuLi4nLFxuXHRcdFx0c2VhcmNoUHJvbXB0VGV4dDogJ1R5cGUgdG8gc2VhcmNoJyxcblx0XHR9O1xuXHR9LFxuXHRnZXRJbml0aWFsU3RhdGUgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjYWNoZTogaW5pdENhY2hlKHRoaXMucHJvcHMuY2FjaGUpLFxuXHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcblx0XHRcdG9wdGlvbnM6IFtdLFxuXHRcdH07XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG5cdFx0dGhpcy5fbGFzdElucHV0ID0gJyc7XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50ICgpIHtcblx0XHR0aGlzLmxvYWRPcHRpb25zKCcnKTtcblx0fSxcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAobmV4dFByb3BzKSB7XG5cdFx0aWYgKG5leHRQcm9wcy5jYWNoZSAhPT0gdGhpcy5wcm9wcy5jYWNoZSkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGNhY2hlOiBpbml0Q2FjaGUobmV4dFByb3BzLmNhY2hlKSxcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblx0Zm9jdXMgKCkge1xuXHRcdHRoaXMucmVmcy5zZWxlY3QuZm9jdXMoKTtcblx0fSxcblx0cmVzZXRTdGF0ZSAoKSB7XG5cdFx0dGhpcy5fY3VycmVudFJlcXVlc3RJZCA9IC0xO1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcblx0XHRcdG9wdGlvbnM6IFtdLFxuXHRcdH0pO1xuXHR9LFxuXHRnZXRSZXNwb25zZUhhbmRsZXIgKGlucHV0KSB7XG5cdFx0bGV0IF9yZXF1ZXN0SWQgPSB0aGlzLl9jdXJyZW50UmVxdWVzdElkID0gcmVxdWVzdElkKys7XG5cdFx0cmV0dXJuIChlcnIsIGRhdGEpID0+IHtcblx0XHRcdGlmIChlcnIpIHRocm93IGVycjtcblx0XHRcdGlmICghdGhpcy5pc01vdW50ZWQoKSkgcmV0dXJuO1xuXHRcdFx0dXBkYXRlQ2FjaGUodGhpcy5zdGF0ZS5jYWNoZSwgaW5wdXQsIGRhdGEpO1xuXHRcdFx0aWYgKF9yZXF1ZXN0SWQgIT09IHRoaXMuX2N1cnJlbnRSZXF1ZXN0SWQpIHJldHVybjtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc0xvYWRpbmc6IGZhbHNlLFxuXHRcdFx0XHRvcHRpb25zOiBkYXRhICYmIGRhdGEub3B0aW9ucyB8fCBbXSxcblx0XHRcdH0pO1xuXHRcdH07XG5cdH0sXG5cdGxvYWRPcHRpb25zIChpbnB1dCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmlnbm9yZUFjY2VudHMpIGlucHV0ID0gc3RyaXBEaWFjcml0aWNzKGlucHV0KTtcblx0XHRpZiAodGhpcy5wcm9wcy5pZ25vcmVDYXNlKSBpbnB1dCA9IGlucHV0LnRvTG93ZXJDYXNlKCk7XG5cdFx0dGhpcy5fbGFzdElucHV0ID0gaW5wdXQ7XG5cdFx0aWYgKGlucHV0Lmxlbmd0aCA8IHRoaXMucHJvcHMubWluaW11bUlucHV0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXNldFN0YXRlKCk7XG5cdFx0fVxuXHRcdGxldCBjYWNoZVJlc3VsdCA9IGdldEZyb21DYWNoZSh0aGlzLnN0YXRlLmNhY2hlLCBpbnB1dCk7XG5cdFx0aWYgKGNhY2hlUmVzdWx0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdG9wdGlvbnM6IGNhY2hlUmVzdWx0Lm9wdGlvbnMsXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc0xvYWRpbmc6IHRydWUsXG5cdFx0fSk7XG5cdFx0bGV0IHJlc3BvbnNlSGFuZGxlciA9IHRoaXMuZ2V0UmVzcG9uc2VIYW5kbGVyKGlucHV0KTtcblx0XHRyZXR1cm4gdGhlblByb21pc2UodGhpcy5wcm9wcy5sb2FkT3B0aW9ucyhpbnB1dCwgcmVzcG9uc2VIYW5kbGVyKSwgcmVzcG9uc2VIYW5kbGVyKTtcblx0fSxcblx0cmVuZGVyICgpIHtcblx0XHRsZXQgeyBub1Jlc3VsdHNUZXh0IH0gPSB0aGlzLnByb3BzO1xuXHRcdGxldCB7IGlzTG9hZGluZywgb3B0aW9ucyB9ID0gdGhpcy5zdGF0ZTtcblx0XHRpZiAodGhpcy5wcm9wcy5pc0xvYWRpbmcpIGlzTG9hZGluZyA9IHRydWU7XG5cdFx0bGV0IHBsYWNlaG9sZGVyID0gaXNMb2FkaW5nID8gdGhpcy5wcm9wcy5sb2FkaW5nUGxhY2Vob2xkZXIgOiB0aGlzLnByb3BzLnBsYWNlaG9sZGVyO1xuXHRcdGlmICghb3B0aW9ucy5sZW5ndGgpIHtcblx0XHRcdGlmICh0aGlzLl9sYXN0SW5wdXQubGVuZ3RoIDwgdGhpcy5wcm9wcy5taW5pbXVtSW5wdXQpIG5vUmVzdWx0c1RleHQgPSB0aGlzLnByb3BzLnNlYXJjaFByb21wdFRleHQ7XG5cdFx0XHRpZiAoaXNMb2FkaW5nKSBub1Jlc3VsdHNUZXh0ID0gdGhpcy5wcm9wcy5zZWFyY2hpbmdUZXh0O1xuXHRcdH1cblx0XHRyZXR1cm4gKFxuXHRcdFx0PFNlbGVjdFxuXHRcdFx0XHR7Li4udGhpcy5wcm9wc31cblx0XHRcdFx0cmVmPVwic2VsZWN0XCJcblx0XHRcdFx0aXNMb2FkaW5nPXtpc0xvYWRpbmd9XG5cdFx0XHRcdG5vUmVzdWx0c1RleHQ9e25vUmVzdWx0c1RleHR9XG5cdFx0XHRcdG9uSW5wdXRDaGFuZ2U9e3RoaXMubG9hZE9wdGlvbnN9XG5cdFx0XHRcdG9wdGlvbnM9e29wdGlvbnN9XG5cdFx0XHRcdHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cblx0XHRcdFx0Lz5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3luYztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuY29uc3QgT3B0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAvLyBjbGFzc05hbWUgKGJhc2VkIG9uIG1vdXNlIHBvc2l0aW9uKVxuXHRcdGlzRGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAgLy8gdGhlIG9wdGlvbiBpcyBkaXNhYmxlZFxuXHRcdGlzRm9jdXNlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgLy8gdGhlIG9wdGlvbiBpcyBmb2N1c2VkXG5cdFx0aXNTZWxlY3RlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAvLyB0aGUgb3B0aW9uIGlzIHNlbGVjdGVkXG5cdFx0b25Gb2N1czogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgICAvLyBtZXRob2QgdG8gaGFuZGxlIG1vdXNlRW50ZXIgb24gb3B0aW9uIGVsZW1lbnRcblx0XHRvblNlbGVjdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgIC8vIG1ldGhvZCB0byBoYW5kbGUgY2xpY2sgb24gb3B0aW9uIGVsZW1lbnRcblx0XHRvblVuZm9jdXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAgIC8vIG1ldGhvZCB0byBoYW5kbGUgbW91c2VMZWF2ZSBvbiBvcHRpb24gZWxlbWVudFxuXHRcdG9wdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCAgICAgLy8gb2JqZWN0IHRoYXQgaXMgYmFzZSBmb3IgdGhhdCBvcHRpb25cblx0fSxcblx0YmxvY2tFdmVudCAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGlmICgoZXZlbnQudGFyZ2V0LnRhZ05hbWUgIT09ICdBJykgfHwgISgnaHJlZicgaW4gZXZlbnQudGFyZ2V0KSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoZXZlbnQudGFyZ2V0LnRhcmdldCkge1xuXHRcdFx0d2luZG93Lm9wZW4oZXZlbnQudGFyZ2V0LmhyZWYsIGV2ZW50LnRhcmdldC50YXJnZXQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGV2ZW50LnRhcmdldC5ocmVmO1xuXHRcdH1cblx0fSxcblxuXHRoYW5kbGVNb3VzZURvd24gKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR0aGlzLnByb3BzLm9uU2VsZWN0KHRoaXMucHJvcHMub3B0aW9uLCBldmVudCk7XG5cdH0sXG5cblx0aGFuZGxlTW91c2VFbnRlciAoZXZlbnQpIHtcblx0XHR0aGlzLm9uRm9jdXMoZXZlbnQpO1xuXHR9LFxuXG5cdGhhbmRsZU1vdXNlTW92ZSAoZXZlbnQpIHtcblx0XHR0aGlzLm9uRm9jdXMoZXZlbnQpO1xuXHR9LFxuXG5cdGhhbmRsZVRvdWNoRW5kKGV2ZW50KXtcblx0XHQvLyBDaGVjayBpZiB0aGUgdmlldyBpcyBiZWluZyBkcmFnZ2VkLCBJbiB0aGlzIGNhc2Vcblx0XHQvLyB3ZSBkb24ndCB3YW50IHRvIGZpcmUgdGhlIGNsaWNrIGV2ZW50IChiZWNhdXNlIHRoZSB1c2VyIG9ubHkgd2FudHMgdG8gc2Nyb2xsKVxuXHRcdGlmKHRoaXMuZHJhZ2dpbmcpIHJldHVybjtcblxuXHRcdHRoaXMuaGFuZGxlTW91c2VEb3duKGV2ZW50KTtcblx0fSxcblxuXHRoYW5kbGVUb3VjaE1vdmUgKGV2ZW50KSB7XG5cdFx0Ly8gU2V0IGEgZmxhZyB0aGF0IHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWRcblx0XHR0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcblx0fSxcblxuXHRoYW5kbGVUb3VjaFN0YXJ0IChldmVudCkge1xuXHRcdC8vIFNldCBhIGZsYWcgdGhhdCB0aGUgdmlldyBpcyBub3QgYmVpbmcgZHJhZ2dlZFxuXHRcdHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcblx0fSxcblxuXHRvbkZvY3VzIChldmVudCkge1xuXHRcdGlmICghdGhpcy5wcm9wcy5pc0ZvY3VzZWQpIHtcblx0XHRcdHRoaXMucHJvcHMub25Gb2N1cyh0aGlzLnByb3BzLm9wdGlvbiwgZXZlbnQpO1xuXHRcdH1cblx0fSxcblx0cmVuZGVyICgpIHtcblx0XHR2YXIgeyBvcHRpb24gfSA9IHRoaXMucHJvcHM7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXModGhpcy5wcm9wcy5jbGFzc05hbWUsIG9wdGlvbi5jbGFzc05hbWUpO1xuXG5cdFx0cmV0dXJuIG9wdGlvbi5kaXNhYmxlZCA/IChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG5cdFx0XHRcdG9uTW91c2VEb3duPXt0aGlzLmJsb2NrRXZlbnR9XG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMuYmxvY2tFdmVudH0+XG5cdFx0XHRcdHt0aGlzLnByb3BzLmNoaWxkcmVufVxuXHRcdFx0PC9kaXY+XG5cdFx0KSA6IChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG5cdFx0XHRcdHN0eWxlPXtvcHRpb24uc3R5bGV9XG5cdFx0XHRcdG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn1cblx0XHRcdFx0b25Nb3VzZUVudGVyPXt0aGlzLmhhbmRsZU1vdXNlRW50ZXJ9XG5cdFx0XHRcdG9uTW91c2VNb3ZlPXt0aGlzLmhhbmRsZU1vdXNlTW92ZX1cblx0XHRcdFx0b25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XG5cdFx0XHRcdG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZX1cblx0XHRcdFx0b25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZH1cblx0XHRcdFx0dGl0bGU9e29wdGlvbi50aXRsZX0+XG5cdFx0XHRcdHt0aGlzLnByb3BzLmNoaWxkcmVufVxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5jb25zdCBWYWx1ZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRkaXNwbGF5TmFtZTogJ1ZhbHVlJyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUsXG5cdFx0ZGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAgIC8vIGRpc2FibGVkIHByb3AgcGFzc2VkIHRvIFJlYWN0U2VsZWN0XG5cdFx0b25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgIC8vIG1ldGhvZCB0byBoYW5kbGUgY2xpY2sgb24gdmFsdWUgbGFiZWxcblx0XHRvblJlbW92ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgLy8gbWV0aG9kIHRvIGhhbmRsZSByZW1vdmFsIG9mIHRoZSB2YWx1ZVxuXHRcdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsICAgICAvLyB0aGUgb3B0aW9uIG9iamVjdCBmb3IgdGhpcyB2YWx1ZVxuXHR9LFxuXG5cdGhhbmRsZU1vdXNlRG93biAoZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICh0aGlzLnByb3BzLm9uQ2xpY2spIHtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0dGhpcy5wcm9wcy5vbkNsaWNrKHRoaXMucHJvcHMudmFsdWUsIGV2ZW50KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKHRoaXMucHJvcHMudmFsdWUuaHJlZikge1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXHR9LFxuXG5cdG9uUmVtb3ZlIChldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0dGhpcy5wcm9wcy5vblJlbW92ZSh0aGlzLnByb3BzLnZhbHVlKTtcblx0fSxcblxuXHRoYW5kbGVUb3VjaEVuZFJlbW92ZSAoZXZlbnQpe1xuXHRcdC8vIENoZWNrIGlmIHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWQsIEluIHRoaXMgY2FzZVxuXHRcdC8vIHdlIGRvbid0IHdhbnQgdG8gZmlyZSB0aGUgY2xpY2sgZXZlbnQgKGJlY2F1c2UgdGhlIHVzZXIgb25seSB3YW50cyB0byBzY3JvbGwpXG5cdFx0aWYodGhpcy5kcmFnZ2luZykgcmV0dXJuO1xuXG5cdFx0Ly8gRmlyZSB0aGUgbW91c2UgZXZlbnRzXG5cdFx0dGhpcy5vblJlbW92ZShldmVudCk7XG5cdH0sXG5cblx0aGFuZGxlVG91Y2hNb3ZlIChldmVudCkge1xuXHRcdC8vIFNldCBhIGZsYWcgdGhhdCB0aGUgdmlldyBpcyBiZWluZyBkcmFnZ2VkXG5cdFx0dGhpcy5kcmFnZ2luZyA9IHRydWU7XG5cdH0sXG5cblx0aGFuZGxlVG91Y2hTdGFydCAoZXZlbnQpIHtcblx0XHQvLyBTZXQgYSBmbGFnIHRoYXQgdGhlIHZpZXcgaXMgbm90IGJlaW5nIGRyYWdnZWRcblx0XHR0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG5cdH0sXG5cblx0cmVuZGVyUmVtb3ZlSWNvbiAoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgIXRoaXMucHJvcHMub25SZW1vdmUpIHJldHVybjtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LXZhbHVlLWljb25cIlxuXHRcdFx0XHRvbk1vdXNlRG93bj17dGhpcy5vblJlbW92ZX1cblx0XHRcdFx0b25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZFJlbW92ZX1cblx0XHRcdFx0b25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XG5cdFx0XHRcdG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZX0+XG5cdFx0XHRcdCZ0aW1lcztcblx0XHRcdDwvc3Bhbj5cblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlckxhYmVsICgpIHtcblx0XHRsZXQgY2xhc3NOYW1lID0gJ1NlbGVjdC12YWx1ZS1sYWJlbCc7XG5cdFx0cmV0dXJuIHRoaXMucHJvcHMub25DbGljayB8fCB0aGlzLnByb3BzLnZhbHVlLmhyZWYgPyAoXG5cdFx0XHQ8YSBjbGFzc05hbWU9e2NsYXNzTmFtZX0gaHJlZj17dGhpcy5wcm9wcy52YWx1ZS5ocmVmfSB0YXJnZXQ9e3RoaXMucHJvcHMudmFsdWUudGFyZ2V0fSBvbk1vdXNlRG93bj17dGhpcy5oYW5kbGVNb3VzZURvd259IG9uVG91Y2hFbmQ9e3RoaXMuaGFuZGxlTW91c2VEb3dufT5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L2E+XG5cdFx0KSA6IChcblx0XHRcdDxzcGFuIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L3NwYW4+XG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXIgKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lcygnU2VsZWN0LXZhbHVlJywgdGhpcy5wcm9wcy52YWx1ZS5jbGFzc05hbWUpfVxuXHRcdFx0XHRzdHlsZT17dGhpcy5wcm9wcy52YWx1ZS5zdHlsZX1cblx0XHRcdFx0dGl0bGU9e3RoaXMucHJvcHMudmFsdWUudGl0bGV9XG5cdFx0XHRcdD5cblx0XHRcdFx0e3RoaXMucmVuZGVyUmVtb3ZlSWNvbigpfVxuXHRcdFx0XHR7dGhpcy5yZW5kZXJMYWJlbCgpfVxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBWYWx1ZTtcbiIsInZhciBtYXAgPSBbXG5cdHsgJ2Jhc2UnOidBJywgJ2xldHRlcnMnOi9bXFx1MDA0MVxcdTI0QjZcXHVGRjIxXFx1MDBDMFxcdTAwQzFcXHUwMEMyXFx1MUVBNlxcdTFFQTRcXHUxRUFBXFx1MUVBOFxcdTAwQzNcXHUwMTAwXFx1MDEwMlxcdTFFQjBcXHUxRUFFXFx1MUVCNFxcdTFFQjJcXHUwMjI2XFx1MDFFMFxcdTAwQzRcXHUwMURFXFx1MUVBMlxcdTAwQzVcXHUwMUZBXFx1MDFDRFxcdTAyMDBcXHUwMjAyXFx1MUVBMFxcdTFFQUNcXHUxRUI2XFx1MUUwMFxcdTAxMDRcXHUwMjNBXFx1MkM2Rl0vZyB9LFxuXHR7ICdiYXNlJzonQUEnLCdsZXR0ZXJzJzovW1xcdUE3MzJdL2cgfSxcblx0eyAnYmFzZSc6J0FFJywnbGV0dGVycyc6L1tcXHUwMEM2XFx1MDFGQ1xcdTAxRTJdL2cgfSxcblx0eyAnYmFzZSc6J0FPJywnbGV0dGVycyc6L1tcXHVBNzM0XS9nIH0sXG5cdHsgJ2Jhc2UnOidBVScsJ2xldHRlcnMnOi9bXFx1QTczNl0vZyB9LFxuXHR7ICdiYXNlJzonQVYnLCdsZXR0ZXJzJzovW1xcdUE3MzhcXHVBNzNBXS9nIH0sXG5cdHsgJ2Jhc2UnOidBWScsJ2xldHRlcnMnOi9bXFx1QTczQ10vZyB9LFxuXHR7ICdiYXNlJzonQicsICdsZXR0ZXJzJzovW1xcdTAwNDJcXHUyNEI3XFx1RkYyMlxcdTFFMDJcXHUxRTA0XFx1MUUwNlxcdTAyNDNcXHUwMTgyXFx1MDE4MV0vZyB9LFxuXHR7ICdiYXNlJzonQycsICdsZXR0ZXJzJzovW1xcdTAwNDNcXHUyNEI4XFx1RkYyM1xcdTAxMDZcXHUwMTA4XFx1MDEwQVxcdTAxMENcXHUwMEM3XFx1MUUwOFxcdTAxODdcXHUwMjNCXFx1QTczRV0vZyB9LFxuXHR7ICdiYXNlJzonRCcsICdsZXR0ZXJzJzovW1xcdTAwNDRcXHUyNEI5XFx1RkYyNFxcdTFFMEFcXHUwMTBFXFx1MUUwQ1xcdTFFMTBcXHUxRTEyXFx1MUUwRVxcdTAxMTBcXHUwMThCXFx1MDE4QVxcdTAxODlcXHVBNzc5XS9nIH0sXG5cdHsgJ2Jhc2UnOidEWicsJ2xldHRlcnMnOi9bXFx1MDFGMVxcdTAxQzRdL2cgfSxcblx0eyAnYmFzZSc6J0R6JywnbGV0dGVycyc6L1tcXHUwMUYyXFx1MDFDNV0vZyB9LFxuXHR7ICdiYXNlJzonRScsICdsZXR0ZXJzJzovW1xcdTAwNDVcXHUyNEJBXFx1RkYyNVxcdTAwQzhcXHUwMEM5XFx1MDBDQVxcdTFFQzBcXHUxRUJFXFx1MUVDNFxcdTFFQzJcXHUxRUJDXFx1MDExMlxcdTFFMTRcXHUxRTE2XFx1MDExNFxcdTAxMTZcXHUwMENCXFx1MUVCQVxcdTAxMUFcXHUwMjA0XFx1MDIwNlxcdTFFQjhcXHUxRUM2XFx1MDIyOFxcdTFFMUNcXHUwMTE4XFx1MUUxOFxcdTFFMUFcXHUwMTkwXFx1MDE4RV0vZyB9LFxuXHR7ICdiYXNlJzonRicsICdsZXR0ZXJzJzovW1xcdTAwNDZcXHUyNEJCXFx1RkYyNlxcdTFFMUVcXHUwMTkxXFx1QTc3Ql0vZyB9LFxuXHR7ICdiYXNlJzonRycsICdsZXR0ZXJzJzovW1xcdTAwNDdcXHUyNEJDXFx1RkYyN1xcdTAxRjRcXHUwMTFDXFx1MUUyMFxcdTAxMUVcXHUwMTIwXFx1MDFFNlxcdTAxMjJcXHUwMUU0XFx1MDE5M1xcdUE3QTBcXHVBNzdEXFx1QTc3RV0vZyB9LFxuXHR7ICdiYXNlJzonSCcsICdsZXR0ZXJzJzovW1xcdTAwNDhcXHUyNEJEXFx1RkYyOFxcdTAxMjRcXHUxRTIyXFx1MUUyNlxcdTAyMUVcXHUxRTI0XFx1MUUyOFxcdTFFMkFcXHUwMTI2XFx1MkM2N1xcdTJDNzVcXHVBNzhEXS9nIH0sXG5cdHsgJ2Jhc2UnOidJJywgJ2xldHRlcnMnOi9bXFx1MDA0OVxcdTI0QkVcXHVGRjI5XFx1MDBDQ1xcdTAwQ0RcXHUwMENFXFx1MDEyOFxcdTAxMkFcXHUwMTJDXFx1MDEzMFxcdTAwQ0ZcXHUxRTJFXFx1MUVDOFxcdTAxQ0ZcXHUwMjA4XFx1MDIwQVxcdTFFQ0FcXHUwMTJFXFx1MUUyQ1xcdTAxOTddL2cgfSxcblx0eyAnYmFzZSc6J0onLCAnbGV0dGVycyc6L1tcXHUwMDRBXFx1MjRCRlxcdUZGMkFcXHUwMTM0XFx1MDI0OF0vZyB9LFxuXHR7ICdiYXNlJzonSycsICdsZXR0ZXJzJzovW1xcdTAwNEJcXHUyNEMwXFx1RkYyQlxcdTFFMzBcXHUwMUU4XFx1MUUzMlxcdTAxMzZcXHUxRTM0XFx1MDE5OFxcdTJDNjlcXHVBNzQwXFx1QTc0MlxcdUE3NDRcXHVBN0EyXS9nIH0sXG5cdHsgJ2Jhc2UnOidMJywgJ2xldHRlcnMnOi9bXFx1MDA0Q1xcdTI0QzFcXHVGRjJDXFx1MDEzRlxcdTAxMzlcXHUwMTNEXFx1MUUzNlxcdTFFMzhcXHUwMTNCXFx1MUUzQ1xcdTFFM0FcXHUwMTQxXFx1MDIzRFxcdTJDNjJcXHUyQzYwXFx1QTc0OFxcdUE3NDZcXHVBNzgwXS9nIH0sXG5cdHsgJ2Jhc2UnOidMSicsJ2xldHRlcnMnOi9bXFx1MDFDN10vZyB9LFxuXHR7ICdiYXNlJzonTGonLCdsZXR0ZXJzJzovW1xcdTAxQzhdL2cgfSxcblx0eyAnYmFzZSc6J00nLCAnbGV0dGVycyc6L1tcXHUwMDREXFx1MjRDMlxcdUZGMkRcXHUxRTNFXFx1MUU0MFxcdTFFNDJcXHUyQzZFXFx1MDE5Q10vZyB9LFxuXHR7ICdiYXNlJzonTicsICdsZXR0ZXJzJzovW1xcdTAwNEVcXHUyNEMzXFx1RkYyRVxcdTAxRjhcXHUwMTQzXFx1MDBEMVxcdTFFNDRcXHUwMTQ3XFx1MUU0NlxcdTAxNDVcXHUxRTRBXFx1MUU0OFxcdTAyMjBcXHUwMTlEXFx1QTc5MFxcdUE3QTRdL2cgfSxcblx0eyAnYmFzZSc6J05KJywnbGV0dGVycyc6L1tcXHUwMUNBXS9nIH0sXG5cdHsgJ2Jhc2UnOidOaicsJ2xldHRlcnMnOi9bXFx1MDFDQl0vZyB9LFxuXHR7ICdiYXNlJzonTycsICdsZXR0ZXJzJzovW1xcdTAwNEZcXHUyNEM0XFx1RkYyRlxcdTAwRDJcXHUwMEQzXFx1MDBENFxcdTFFRDJcXHUxRUQwXFx1MUVENlxcdTFFRDRcXHUwMEQ1XFx1MUU0Q1xcdTAyMkNcXHUxRTRFXFx1MDE0Q1xcdTFFNTBcXHUxRTUyXFx1MDE0RVxcdTAyMkVcXHUwMjMwXFx1MDBENlxcdTAyMkFcXHUxRUNFXFx1MDE1MFxcdTAxRDFcXHUwMjBDXFx1MDIwRVxcdTAxQTBcXHUxRURDXFx1MUVEQVxcdTFFRTBcXHUxRURFXFx1MUVFMlxcdTFFQ0NcXHUxRUQ4XFx1MDFFQVxcdTAxRUNcXHUwMEQ4XFx1MDFGRVxcdTAxODZcXHUwMTlGXFx1QTc0QVxcdUE3NENdL2cgfSxcblx0eyAnYmFzZSc6J09JJywnbGV0dGVycyc6L1tcXHUwMUEyXS9nIH0sXG5cdHsgJ2Jhc2UnOidPTycsJ2xldHRlcnMnOi9bXFx1QTc0RV0vZyB9LFxuXHR7ICdiYXNlJzonT1UnLCdsZXR0ZXJzJzovW1xcdTAyMjJdL2cgfSxcblx0eyAnYmFzZSc6J1AnLCAnbGV0dGVycyc6L1tcXHUwMDUwXFx1MjRDNVxcdUZGMzBcXHUxRTU0XFx1MUU1NlxcdTAxQTRcXHUyQzYzXFx1QTc1MFxcdUE3NTJcXHVBNzU0XS9nIH0sXG5cdHsgJ2Jhc2UnOidRJywgJ2xldHRlcnMnOi9bXFx1MDA1MVxcdTI0QzZcXHVGRjMxXFx1QTc1NlxcdUE3NThcXHUwMjRBXS9nIH0sXG5cdHsgJ2Jhc2UnOidSJywgJ2xldHRlcnMnOi9bXFx1MDA1MlxcdTI0QzdcXHVGRjMyXFx1MDE1NFxcdTFFNThcXHUwMTU4XFx1MDIxMFxcdTAyMTJcXHUxRTVBXFx1MUU1Q1xcdTAxNTZcXHUxRTVFXFx1MDI0Q1xcdTJDNjRcXHVBNzVBXFx1QTdBNlxcdUE3ODJdL2cgfSxcblx0eyAnYmFzZSc6J1MnLCAnbGV0dGVycyc6L1tcXHUwMDUzXFx1MjRDOFxcdUZGMzNcXHUxRTlFXFx1MDE1QVxcdTFFNjRcXHUwMTVDXFx1MUU2MFxcdTAxNjBcXHUxRTY2XFx1MUU2MlxcdTFFNjhcXHUwMjE4XFx1MDE1RVxcdTJDN0VcXHVBN0E4XFx1QTc4NF0vZyB9LFxuXHR7ICdiYXNlJzonVCcsICdsZXR0ZXJzJzovW1xcdTAwNTRcXHUyNEM5XFx1RkYzNFxcdTFFNkFcXHUwMTY0XFx1MUU2Q1xcdTAyMUFcXHUwMTYyXFx1MUU3MFxcdTFFNkVcXHUwMTY2XFx1MDFBQ1xcdTAxQUVcXHUwMjNFXFx1QTc4Nl0vZyB9LFxuXHR7ICdiYXNlJzonVFonLCdsZXR0ZXJzJzovW1xcdUE3MjhdL2cgfSxcblx0eyAnYmFzZSc6J1UnLCAnbGV0dGVycyc6L1tcXHUwMDU1XFx1MjRDQVxcdUZGMzVcXHUwMEQ5XFx1MDBEQVxcdTAwREJcXHUwMTY4XFx1MUU3OFxcdTAxNkFcXHUxRTdBXFx1MDE2Q1xcdTAwRENcXHUwMURCXFx1MDFEN1xcdTAxRDVcXHUwMUQ5XFx1MUVFNlxcdTAxNkVcXHUwMTcwXFx1MDFEM1xcdTAyMTRcXHUwMjE2XFx1MDFBRlxcdTFFRUFcXHUxRUU4XFx1MUVFRVxcdTFFRUNcXHUxRUYwXFx1MUVFNFxcdTFFNzJcXHUwMTcyXFx1MUU3NlxcdTFFNzRcXHUwMjQ0XS9nIH0sXG5cdHsgJ2Jhc2UnOidWJywgJ2xldHRlcnMnOi9bXFx1MDA1NlxcdTI0Q0JcXHVGRjM2XFx1MUU3Q1xcdTFFN0VcXHUwMUIyXFx1QTc1RVxcdTAyNDVdL2cgfSxcblx0eyAnYmFzZSc6J1ZZJywnbGV0dGVycyc6L1tcXHVBNzYwXS9nIH0sXG5cdHsgJ2Jhc2UnOidXJywgJ2xldHRlcnMnOi9bXFx1MDA1N1xcdTI0Q0NcXHVGRjM3XFx1MUU4MFxcdTFFODJcXHUwMTc0XFx1MUU4NlxcdTFFODRcXHUxRTg4XFx1MkM3Ml0vZyB9LFxuXHR7ICdiYXNlJzonWCcsICdsZXR0ZXJzJzovW1xcdTAwNThcXHUyNENEXFx1RkYzOFxcdTFFOEFcXHUxRThDXS9nIH0sXG5cdHsgJ2Jhc2UnOidZJywgJ2xldHRlcnMnOi9bXFx1MDA1OVxcdTI0Q0VcXHVGRjM5XFx1MUVGMlxcdTAwRERcXHUwMTc2XFx1MUVGOFxcdTAyMzJcXHUxRThFXFx1MDE3OFxcdTFFRjZcXHUxRUY0XFx1MDFCM1xcdTAyNEVcXHUxRUZFXS9nIH0sXG5cdHsgJ2Jhc2UnOidaJywgJ2xldHRlcnMnOi9bXFx1MDA1QVxcdTI0Q0ZcXHVGRjNBXFx1MDE3OVxcdTFFOTBcXHUwMTdCXFx1MDE3RFxcdTFFOTJcXHUxRTk0XFx1MDFCNVxcdTAyMjRcXHUyQzdGXFx1MkM2QlxcdUE3NjJdL2cgfSxcblx0eyAnYmFzZSc6J2EnLCAnbGV0dGVycyc6L1tcXHUwMDYxXFx1MjREMFxcdUZGNDFcXHUxRTlBXFx1MDBFMFxcdTAwRTFcXHUwMEUyXFx1MUVBN1xcdTFFQTVcXHUxRUFCXFx1MUVBOVxcdTAwRTNcXHUwMTAxXFx1MDEwM1xcdTFFQjFcXHUxRUFGXFx1MUVCNVxcdTFFQjNcXHUwMjI3XFx1MDFFMVxcdTAwRTRcXHUwMURGXFx1MUVBM1xcdTAwRTVcXHUwMUZCXFx1MDFDRVxcdTAyMDFcXHUwMjAzXFx1MUVBMVxcdTFFQURcXHUxRUI3XFx1MUUwMVxcdTAxMDVcXHUyQzY1XFx1MDI1MF0vZyB9LFxuXHR7ICdiYXNlJzonYWEnLCdsZXR0ZXJzJzovW1xcdUE3MzNdL2cgfSxcblx0eyAnYmFzZSc6J2FlJywnbGV0dGVycyc6L1tcXHUwMEU2XFx1MDFGRFxcdTAxRTNdL2cgfSxcblx0eyAnYmFzZSc6J2FvJywnbGV0dGVycyc6L1tcXHVBNzM1XS9nIH0sXG5cdHsgJ2Jhc2UnOidhdScsJ2xldHRlcnMnOi9bXFx1QTczN10vZyB9LFxuXHR7ICdiYXNlJzonYXYnLCdsZXR0ZXJzJzovW1xcdUE3MzlcXHVBNzNCXS9nIH0sXG5cdHsgJ2Jhc2UnOidheScsJ2xldHRlcnMnOi9bXFx1QTczRF0vZyB9LFxuXHR7ICdiYXNlJzonYicsICdsZXR0ZXJzJzovW1xcdTAwNjJcXHUyNEQxXFx1RkY0MlxcdTFFMDNcXHUxRTA1XFx1MUUwN1xcdTAxODBcXHUwMTgzXFx1MDI1M10vZyB9LFxuXHR7ICdiYXNlJzonYycsICdsZXR0ZXJzJzovW1xcdTAwNjNcXHUyNEQyXFx1RkY0M1xcdTAxMDdcXHUwMTA5XFx1MDEwQlxcdTAxMERcXHUwMEU3XFx1MUUwOVxcdTAxODhcXHUwMjNDXFx1QTczRlxcdTIxODRdL2cgfSxcblx0eyAnYmFzZSc6J2QnLCAnbGV0dGVycyc6L1tcXHUwMDY0XFx1MjREM1xcdUZGNDRcXHUxRTBCXFx1MDEwRlxcdTFFMERcXHUxRTExXFx1MUUxM1xcdTFFMEZcXHUwMTExXFx1MDE4Q1xcdTAyNTZcXHUwMjU3XFx1QTc3QV0vZyB9LFxuXHR7ICdiYXNlJzonZHonLCdsZXR0ZXJzJzovW1xcdTAxRjNcXHUwMUM2XS9nIH0sXG5cdHsgJ2Jhc2UnOidlJywgJ2xldHRlcnMnOi9bXFx1MDA2NVxcdTI0RDRcXHVGRjQ1XFx1MDBFOFxcdTAwRTlcXHUwMEVBXFx1MUVDMVxcdTFFQkZcXHUxRUM1XFx1MUVDM1xcdTFFQkRcXHUwMTEzXFx1MUUxNVxcdTFFMTdcXHUwMTE1XFx1MDExN1xcdTAwRUJcXHUxRUJCXFx1MDExQlxcdTAyMDVcXHUwMjA3XFx1MUVCOVxcdTFFQzdcXHUwMjI5XFx1MUUxRFxcdTAxMTlcXHUxRTE5XFx1MUUxQlxcdTAyNDdcXHUwMjVCXFx1MDFERF0vZyB9LFxuXHR7ICdiYXNlJzonZicsICdsZXR0ZXJzJzovW1xcdTAwNjZcXHUyNEQ1XFx1RkY0NlxcdTFFMUZcXHUwMTkyXFx1QTc3Q10vZyB9LFxuXHR7ICdiYXNlJzonZycsICdsZXR0ZXJzJzovW1xcdTAwNjdcXHUyNEQ2XFx1RkY0N1xcdTAxRjVcXHUwMTFEXFx1MUUyMVxcdTAxMUZcXHUwMTIxXFx1MDFFN1xcdTAxMjNcXHUwMUU1XFx1MDI2MFxcdUE3QTFcXHUxRDc5XFx1QTc3Rl0vZyB9LFxuXHR7ICdiYXNlJzonaCcsICdsZXR0ZXJzJzovW1xcdTAwNjhcXHUyNEQ3XFx1RkY0OFxcdTAxMjVcXHUxRTIzXFx1MUUyN1xcdTAyMUZcXHUxRTI1XFx1MUUyOVxcdTFFMkJcXHUxRTk2XFx1MDEyN1xcdTJDNjhcXHUyQzc2XFx1MDI2NV0vZyB9LFxuXHR7ICdiYXNlJzonaHYnLCdsZXR0ZXJzJzovW1xcdTAxOTVdL2cgfSxcblx0eyAnYmFzZSc6J2knLCAnbGV0dGVycyc6L1tcXHUwMDY5XFx1MjREOFxcdUZGNDlcXHUwMEVDXFx1MDBFRFxcdTAwRUVcXHUwMTI5XFx1MDEyQlxcdTAxMkRcXHUwMEVGXFx1MUUyRlxcdTFFQzlcXHUwMUQwXFx1MDIwOVxcdTAyMEJcXHUxRUNCXFx1MDEyRlxcdTFFMkRcXHUwMjY4XFx1MDEzMV0vZyB9LFxuXHR7ICdiYXNlJzonaicsICdsZXR0ZXJzJzovW1xcdTAwNkFcXHUyNEQ5XFx1RkY0QVxcdTAxMzVcXHUwMUYwXFx1MDI0OV0vZyB9LFxuXHR7ICdiYXNlJzonaycsICdsZXR0ZXJzJzovW1xcdTAwNkJcXHUyNERBXFx1RkY0QlxcdTFFMzFcXHUwMUU5XFx1MUUzM1xcdTAxMzdcXHUxRTM1XFx1MDE5OVxcdTJDNkFcXHVBNzQxXFx1QTc0M1xcdUE3NDVcXHVBN0EzXS9nIH0sXG5cdHsgJ2Jhc2UnOidsJywgJ2xldHRlcnMnOi9bXFx1MDA2Q1xcdTI0REJcXHVGRjRDXFx1MDE0MFxcdTAxM0FcXHUwMTNFXFx1MUUzN1xcdTFFMzlcXHUwMTNDXFx1MUUzRFxcdTFFM0JcXHUwMTdGXFx1MDE0MlxcdTAxOUFcXHUwMjZCXFx1MkM2MVxcdUE3NDlcXHVBNzgxXFx1QTc0N10vZyB9LFxuXHR7ICdiYXNlJzonbGonLCdsZXR0ZXJzJzovW1xcdTAxQzldL2cgfSxcblx0eyAnYmFzZSc6J20nLCAnbGV0dGVycyc6L1tcXHUwMDZEXFx1MjREQ1xcdUZGNERcXHUxRTNGXFx1MUU0MVxcdTFFNDNcXHUwMjcxXFx1MDI2Rl0vZyB9LFxuXHR7ICdiYXNlJzonbicsICdsZXR0ZXJzJzovW1xcdTAwNkVcXHUyNEREXFx1RkY0RVxcdTAxRjlcXHUwMTQ0XFx1MDBGMVxcdTFFNDVcXHUwMTQ4XFx1MUU0N1xcdTAxNDZcXHUxRTRCXFx1MUU0OVxcdTAxOUVcXHUwMjcyXFx1MDE0OVxcdUE3OTFcXHVBN0E1XS9nIH0sXG5cdHsgJ2Jhc2UnOiduaicsJ2xldHRlcnMnOi9bXFx1MDFDQ10vZyB9LFxuXHR7ICdiYXNlJzonbycsICdsZXR0ZXJzJzovW1xcdTAwNkZcXHUyNERFXFx1RkY0RlxcdTAwRjJcXHUwMEYzXFx1MDBGNFxcdTFFRDNcXHUxRUQxXFx1MUVEN1xcdTFFRDVcXHUwMEY1XFx1MUU0RFxcdTAyMkRcXHUxRTRGXFx1MDE0RFxcdTFFNTFcXHUxRTUzXFx1MDE0RlxcdTAyMkZcXHUwMjMxXFx1MDBGNlxcdTAyMkJcXHUxRUNGXFx1MDE1MVxcdTAxRDJcXHUwMjBEXFx1MDIwRlxcdTAxQTFcXHUxRUREXFx1MUVEQlxcdTFFRTFcXHUxRURGXFx1MUVFM1xcdTFFQ0RcXHUxRUQ5XFx1MDFFQlxcdTAxRURcXHUwMEY4XFx1MDFGRlxcdTAyNTRcXHVBNzRCXFx1QTc0RFxcdTAyNzVdL2cgfSxcblx0eyAnYmFzZSc6J29pJywnbGV0dGVycyc6L1tcXHUwMUEzXS9nIH0sXG5cdHsgJ2Jhc2UnOidvdScsJ2xldHRlcnMnOi9bXFx1MDIyM10vZyB9LFxuXHR7ICdiYXNlJzonb28nLCdsZXR0ZXJzJzovW1xcdUE3NEZdL2cgfSxcblx0eyAnYmFzZSc6J3AnLCAnbGV0dGVycyc6L1tcXHUwMDcwXFx1MjRERlxcdUZGNTBcXHUxRTU1XFx1MUU1N1xcdTAxQTVcXHUxRDdEXFx1QTc1MVxcdUE3NTNcXHVBNzU1XS9nIH0sXG5cdHsgJ2Jhc2UnOidxJywgJ2xldHRlcnMnOi9bXFx1MDA3MVxcdTI0RTBcXHVGRjUxXFx1MDI0QlxcdUE3NTdcXHVBNzU5XS9nIH0sXG5cdHsgJ2Jhc2UnOidyJywgJ2xldHRlcnMnOi9bXFx1MDA3MlxcdTI0RTFcXHVGRjUyXFx1MDE1NVxcdTFFNTlcXHUwMTU5XFx1MDIxMVxcdTAyMTNcXHUxRTVCXFx1MUU1RFxcdTAxNTdcXHUxRTVGXFx1MDI0RFxcdTAyN0RcXHVBNzVCXFx1QTdBN1xcdUE3ODNdL2cgfSxcblx0eyAnYmFzZSc6J3MnLCAnbGV0dGVycyc6L1tcXHUwMDczXFx1MjRFMlxcdUZGNTNcXHUwMERGXFx1MDE1QlxcdTFFNjVcXHUwMTVEXFx1MUU2MVxcdTAxNjFcXHUxRTY3XFx1MUU2M1xcdTFFNjlcXHUwMjE5XFx1MDE1RlxcdTAyM0ZcXHVBN0E5XFx1QTc4NVxcdTFFOUJdL2cgfSxcblx0eyAnYmFzZSc6J3QnLCAnbGV0dGVycyc6L1tcXHUwMDc0XFx1MjRFM1xcdUZGNTRcXHUxRTZCXFx1MUU5N1xcdTAxNjVcXHUxRTZEXFx1MDIxQlxcdTAxNjNcXHUxRTcxXFx1MUU2RlxcdTAxNjdcXHUwMUFEXFx1MDI4OFxcdTJDNjZcXHVBNzg3XS9nIH0sXG5cdHsgJ2Jhc2UnOid0eicsJ2xldHRlcnMnOi9bXFx1QTcyOV0vZyB9LFxuXHR7ICdiYXNlJzondScsICdsZXR0ZXJzJzovW1xcdTAwNzVcXHUyNEU0XFx1RkY1NVxcdTAwRjlcXHUwMEZBXFx1MDBGQlxcdTAxNjlcXHUxRTc5XFx1MDE2QlxcdTFFN0JcXHUwMTZEXFx1MDBGQ1xcdTAxRENcXHUwMUQ4XFx1MDFENlxcdTAxREFcXHUxRUU3XFx1MDE2RlxcdTAxNzFcXHUwMUQ0XFx1MDIxNVxcdTAyMTdcXHUwMUIwXFx1MUVFQlxcdTFFRTlcXHUxRUVGXFx1MUVFRFxcdTFFRjFcXHUxRUU1XFx1MUU3M1xcdTAxNzNcXHUxRTc3XFx1MUU3NVxcdTAyODldL2cgfSxcblx0eyAnYmFzZSc6J3YnLCAnbGV0dGVycyc6L1tcXHUwMDc2XFx1MjRFNVxcdUZGNTZcXHUxRTdEXFx1MUU3RlxcdTAyOEJcXHVBNzVGXFx1MDI4Q10vZyB9LFxuXHR7ICdiYXNlJzondnknLCdsZXR0ZXJzJzovW1xcdUE3NjFdL2cgfSxcblx0eyAnYmFzZSc6J3cnLCAnbGV0dGVycyc6L1tcXHUwMDc3XFx1MjRFNlxcdUZGNTdcXHUxRTgxXFx1MUU4M1xcdTAxNzVcXHUxRTg3XFx1MUU4NVxcdTFFOThcXHUxRTg5XFx1MkM3M10vZyB9LFxuXHR7ICdiYXNlJzoneCcsICdsZXR0ZXJzJzovW1xcdTAwNzhcXHUyNEU3XFx1RkY1OFxcdTFFOEJcXHUxRThEXS9nIH0sXG5cdHsgJ2Jhc2UnOid5JywgJ2xldHRlcnMnOi9bXFx1MDA3OVxcdTI0RThcXHVGRjU5XFx1MUVGM1xcdTAwRkRcXHUwMTc3XFx1MUVGOVxcdTAyMzNcXHUxRThGXFx1MDBGRlxcdTFFRjdcXHUxRTk5XFx1MUVGNVxcdTAxQjRcXHUwMjRGXFx1MUVGRl0vZyB9LFxuXHR7ICdiYXNlJzoneicsICdsZXR0ZXJzJzovW1xcdTAwN0FcXHUyNEU5XFx1RkY1QVxcdTAxN0FcXHUxRTkxXFx1MDE3Q1xcdTAxN0VcXHUxRTkzXFx1MUU5NVxcdTAxQjZcXHUwMjI1XFx1MDI0MFxcdTJDNkNcXHVBNzYzXS9nIH0sXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0cmlwRGlhY3JpdGljcyAoc3RyKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbWFwLmxlbmd0aDsgaSsrKSB7XG5cdFx0c3RyID0gc3RyLnJlcGxhY2UobWFwW2ldLmxldHRlcnMsIG1hcFtpXS5iYXNlKTtcblx0fVxuXHRyZXR1cm4gc3RyO1xufTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBJbnB1dCBmcm9tICdyZWFjdC1pbnB1dC1hdXRvc2l6ZSc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IHN0cmlwRGlhY3JpdGljcyBmcm9tICcuL3V0aWxzL3N0cmlwRGlhY3JpdGljcyc7XG5cbmltcG9ydCBBc3luYyBmcm9tICcuL0FzeW5jJztcbmltcG9ydCBPcHRpb24gZnJvbSAnLi9PcHRpb24nO1xuaW1wb3J0IFZhbHVlIGZyb20gJy4vVmFsdWUnO1xuXG5mdW5jdGlvbiBzdHJpbmdpZnlWYWx1ZSAodmFsdWUpIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxufVxuXG5jb25zdCBzdHJpbmdPck5vZGUgPSBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcblx0UmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0UmVhY3QuUHJvcFR5cGVzLm5vZGVcbl0pO1xuXG5jb25zdCBTZWxlY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0ZGlzcGxheU5hbWU6ICdTZWxlY3QnLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGFkZExhYmVsVGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgLy8gcGxhY2Vob2xkZXIgZGlzcGxheWVkIHdoZW4geW91IHdhbnQgdG8gYWRkIGEgbGFiZWwgb24gYSBtdWx0aS12YWx1ZSBpbnB1dFxuXHRcdGF1dG9zaXplOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcdFx0XHRcdFx0XHRcdC8vIHdoZXRoZXIgdG8gZW5hYmxlIGF1dG9zaXppbmcgb3Igbm90XG5cdFx0YWxsb3dDcmVhdGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAvLyB3aGV0aGVyIHRvIGFsbG93IGNyZWF0aW9uIG9mIG5ldyBlbnRyaWVzXG5cdFx0YXV0b0JsdXI6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdGF1dG9mb2N1czogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgLy8gYXV0b2ZvY3VzIHRoZSBjb21wb25lbnQgb24gbW91bnRcblx0XHRiYWNrc3BhY2VSZW1vdmVzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgIC8vIHdoZXRoZXIgYmFja3NwYWNlIHJlbW92ZXMgYW4gaXRlbSBpZiB0aGVyZSBpcyBubyB0ZXh0IGlucHV0XG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAvLyBjbGFzc05hbWUgZm9yIHRoZSBvdXRlciBlbGVtZW50XG5cdFx0Y2xlYXJBbGxUZXh0OiBzdHJpbmdPck5vZGUsICAgICAgICAgICAgICAgICAvLyB0aXRsZSBmb3IgdGhlIFwiY2xlYXJcIiBjb250cm9sIHdoZW4gbXVsdGk6IHRydWVcblx0XHRjbGVhclZhbHVlVGV4dDogc3RyaW5nT3JOb2RlLCAgICAgICAgICAgICAgIC8vIHRpdGxlIGZvciB0aGUgXCJjbGVhclwiIGNvbnRyb2xcblx0XHRjbGVhcmFibGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgIC8vIHNob3VsZCBpdCBiZSBwb3NzaWJsZSB0byByZXNldCB2YWx1ZVxuXHRcdGRlbGltaXRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgLy8gZGVsaW1pdGVyIHRvIHVzZSB0byBqb2luIG11bHRpcGxlIHZhbHVlcyBmb3IgdGhlIGhpZGRlbiBmaWVsZCB2YWx1ZVxuXHRcdGRpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgLy8gd2hldGhlciB0aGUgU2VsZWN0IGlzIGRpc2FibGVkIG9yIG5vdFxuXHRcdGVzY2FwZUNsZWFyc1ZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgLy8gd2hldGhlciBlc2NhcGUgY2xlYXJzIHRoZSB2YWx1ZSB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZFxuXHRcdGZpbHRlck9wdGlvbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgLy8gbWV0aG9kIHRvIGZpbHRlciBhIHNpbmdsZSBvcHRpb24gKG9wdGlvbiwgZmlsdGVyU3RyaW5nKVxuXHRcdGZpbHRlck9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hbnksICAgICAgICAgLy8gYm9vbGVhbiB0byBlbmFibGUgZGVmYXVsdCBmaWx0ZXJpbmcgb3IgZnVuY3Rpb24gdG8gZmlsdGVyIHRoZSBvcHRpb25zIGFycmF5IChbb3B0aW9uc10sIGZpbHRlclN0cmluZywgW3ZhbHVlc10pXG5cdFx0aWdub3JlQWNjZW50czogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAvLyB3aGV0aGVyIHRvIHN0cmlwIGRpYWNyaXRpY3Mgd2hlbiBmaWx0ZXJpbmdcblx0XHRpZ25vcmVDYXNlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgIC8vIHdoZXRoZXIgdG8gcGVyZm9ybSBjYXNlLWluc2Vuc2l0aXZlIGZpbHRlcmluZ1xuXHRcdGlucHV0UHJvcHM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsICAgICAgICAgLy8gY3VzdG9tIGF0dHJpYnV0ZXMgZm9yIHRoZSBJbnB1dFxuXHRcdGlzTG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgLy8gd2hldGhlciB0aGUgU2VsZWN0IGlzIGxvYWRpbmcgZXh0ZXJuYWxseSBvciBub3QgKHN1Y2ggYXMgb3B0aW9ucyBiZWluZyBsb2FkZWQpXG5cdFx0am9pblZhbHVlczogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAvLyBqb2lucyBtdWx0aXBsZSB2YWx1ZXMgaW50byBhIHNpbmdsZSBmb3JtIGZpZWxkIHdpdGggdGhlIGRlbGltaXRlciAobGVnYWN5IG1vZGUpXG5cdFx0bGFiZWxLZXk6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAvLyBwYXRoIG9mIHRoZSBsYWJlbCB2YWx1ZSBpbiBvcHRpb24gb2JqZWN0c1xuXHRcdG1hdGNoUG9zOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgLy8gKGFueXxzdGFydCkgbWF0Y2ggdGhlIHN0YXJ0IG9yIGVudGlyZSBzdHJpbmcgd2hlbiBmaWx0ZXJpbmdcblx0XHRtYXRjaFByb3A6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgIC8vIChhbnl8bGFiZWx8dmFsdWUpIHdoaWNoIG9wdGlvbiBwcm9wZXJ0eSB0byBmaWx0ZXIgb25cblx0XHRtZW51QnVmZmVyOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIG9wdGlvbmFsIGJ1ZmZlciAoaW4gcHgpIGJldHdlZW4gdGhlIGJvdHRvbSBvZiB0aGUgdmlld3BvcnQgYW5kIHRoZSBib3R0b20gb2YgdGhlIG1lbnVcblx0XHRtZW51Q29udGFpbmVyU3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsIC8vIG9wdGlvbmFsIHN0eWxlIHRvIGFwcGx5IHRvIHRoZSBtZW51IGNvbnRhaW5lclxuXHRcdG1lbnVTdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCwgICAgICAgICAgLy8gb3B0aW9uYWwgc3R5bGUgdG8gYXBwbHkgdG8gdGhlIG1lbnVcblx0XHRtdWx0aTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgIC8vIG11bHRpLXZhbHVlIGlucHV0XG5cdFx0bmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgICAgICAvLyBnZW5lcmF0ZXMgYSBoaWRkZW4gPGlucHV0IC8+IHRhZyB3aXRoIHRoaXMgZmllbGQgbmFtZSBmb3IgaHRtbCBmb3Jtc1xuXHRcdG5ld09wdGlvbkNyZWF0b3I6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgLy8gZmFjdG9yeSB0byBjcmVhdGUgbmV3IG9wdGlvbnMgd2hlbiBhbGxvd0NyZWF0ZSBzZXRcblx0XHRub1Jlc3VsdHNUZXh0OiBzdHJpbmdPck5vZGUsICAgICAgICAgICAgICAgIC8vIHBsYWNlaG9sZGVyIGRpc3BsYXllZCB3aGVuIHRoZXJlIGFyZSBubyBtYXRjaGluZyBzZWFyY2ggcmVzdWx0c1xuXHRcdG9uQmx1cjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgLy8gb25CbHVyIGhhbmRsZXI6IGZ1bmN0aW9uIChldmVudCkge31cblx0XHRvbkJsdXJSZXNldHNJbnB1dDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgIC8vIHdoZXRoZXIgaW5wdXQgaXMgY2xlYXJlZCBvbiBibHVyXG5cdFx0b25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAvLyBvbkNoYW5nZSBoYW5kbGVyOiBmdW5jdGlvbiAobmV3VmFsdWUpIHt9XG5cdFx0b25DbG9zZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAvLyBmaXJlcyB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZFxuXHRcdG9uRm9jdXM6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAgLy8gb25Gb2N1cyBoYW5kbGVyOiBmdW5jdGlvbiAoZXZlbnQpIHt9XG5cdFx0b25JbnB1dENoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAvLyBvbklucHV0Q2hhbmdlIGhhbmRsZXI6IGZ1bmN0aW9uIChpbnB1dFZhbHVlKSB7fVxuXHRcdG9uTWVudVNjcm9sbFRvQm90dG9tOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgLy8gZmlyZXMgd2hlbiB0aGUgbWVudSBpcyBzY3JvbGxlZCB0byB0aGUgYm90dG9tOyBjYW4gYmUgdXNlZCB0byBwYWdpbmF0ZSBvcHRpb25zXG5cdFx0b25PcGVuOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgICAvLyBmaXJlcyB3aGVuIHRoZSBtZW51IGlzIG9wZW5lZFxuXHRcdG9uVmFsdWVDbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgLy8gb25DbGljayBoYW5kbGVyIGZvciB2YWx1ZSBsYWJlbHM6IGZ1bmN0aW9uICh2YWx1ZSwgZXZlbnQpIHt9XG5cdFx0b3B0aW9uQ29tcG9uZW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAvLyBvcHRpb24gY29tcG9uZW50IHRvIHJlbmRlciBpbiBkcm9wZG93blxuXHRcdG9wdGlvblJlbmRlcmVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgLy8gb3B0aW9uUmVuZGVyZXI6IGZ1bmN0aW9uIChvcHRpb24pIHt9XG5cdFx0b3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LCAgICAgICAgICAgICAvLyBhcnJheSBvZiBvcHRpb25zXG5cdFx0cGxhY2Vob2xkZXI6IHN0cmluZ09yTm9kZSwgICAgICAgICAgICAgICAgICAvLyBmaWVsZCBwbGFjZWhvbGRlciwgZGlzcGxheWVkIHdoZW4gdGhlcmUncyBubyB2YWx1ZVxuXHRcdHJlcXVpcmVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgLy8gYXBwbGllcyBIVE1MNSByZXF1aXJlZCBhdHRyaWJ1dGUgd2hlbiBuZWVkZWRcblx0XHRzY3JvbGxNZW51SW50b1ZpZXc6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgIC8vIGJvb2xlYW4gdG8gZW5hYmxlIHRoZSB2aWV3cG9ydCB0byBzaGlmdCBzbyB0aGF0IHRoZSBmdWxsIG1lbnUgZnVsbHkgdmlzaWJsZSB3aGVuIGVuZ2FnZWRcblx0XHRzZWFyY2hhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgIC8vIHdoZXRoZXIgdG8gZW5hYmxlIHNlYXJjaGluZyBmZWF0dXJlIG9yIG5vdFxuXHRcdHNpbXBsZVZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgLy8gcGFzcyB0aGUgdmFsdWUgdG8gb25DaGFuZ2UgYXMgYSBzaW1wbGUgdmFsdWUgKGxlZ2FjeSBwcmUgMS4wIG1vZGUpLCBkZWZhdWx0cyB0byBmYWxzZVxuXHRcdHN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LCAgICAgICAgICAgICAgLy8gb3B0aW9uYWwgc3R5bGUgdG8gYXBwbHkgdG8gdGhlIGNvbnRyb2xcblx0XHR0YWJJbmRleDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgIC8vIG9wdGlvbmFsIHRhYiBpbmRleCBvZiB0aGUgY29udHJvbFxuXHRcdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYW55LCAgICAgICAgICAgICAgICAgLy8gaW5pdGlhbCBmaWVsZCB2YWx1ZVxuXHRcdHZhbHVlQ29tcG9uZW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgLy8gdmFsdWUgY29tcG9uZW50IHRvIHJlbmRlclxuXHRcdHZhbHVlS2V5OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgLy8gcGF0aCBvZiB0aGUgbGFiZWwgdmFsdWUgaW4gb3B0aW9uIG9iamVjdHNcblx0XHR2YWx1ZVJlbmRlcmVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIHZhbHVlUmVuZGVyZXI6IGZ1bmN0aW9uIChvcHRpb24pIHt9XG5cdFx0d3JhcHBlclN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LCAgICAgICAvLyBvcHRpb25hbCBzdHlsZSB0byBhcHBseSB0byB0aGUgY29tcG9uZW50IHdyYXBwZXJcblx0XHRkaXNwbGF5QWxsOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgIC8vIERpc3BsYXkgYWxsIHRoZSBjb250ZW50cyBpbiB0aGUgZHJvcGRvd24sIGV2ZW4gYWZ0ZXIgc2VsZWN0aW5nIGZldyBvZiB0aGUgZW50cmllcyBmcm9tIGl0LCB0aGlzIGlzIGFwcGxpY2FibGUgb25seSB3aGVuIG11bHRpIGlzIHRydWVcbiAgICBzaW5nbGVWYWx1ZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgIC8vIFNlbmQgb25seSBhIHNpbmdsZSB2YWx1ZSB0byB0aGUgQ3VzdG9tIFZhbHVlIENvbXBvbmVudFxuXHR9LFxuXG5cdHN0YXRpY3M6IHsgQXN5bmMgfSxcblxuXHRnZXREZWZhdWx0UHJvcHMgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRhZGRMYWJlbFRleHQ6ICdBZGQgXCJ7bGFiZWx9XCI/Jyxcblx0XHRcdGF1dG9zaXplOiB0cnVlLFxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlLFxuXHRcdFx0YmFja3NwYWNlUmVtb3ZlczogdHJ1ZSxcblx0XHRcdGNsZWFyYWJsZTogdHJ1ZSxcblx0XHRcdGNsZWFyQWxsVGV4dDogJ0NsZWFyIGFsbCcsXG5cdFx0XHRjbGVhclZhbHVlVGV4dDogJ0NsZWFyIHZhbHVlJyxcblx0XHRcdGRlbGltaXRlcjogJywnLFxuXHRcdFx0ZGlzYWJsZWQ6IGZhbHNlLFxuXHRcdFx0ZXNjYXBlQ2xlYXJzVmFsdWU6IHRydWUsXG5cdFx0XHRmaWx0ZXJPcHRpb25zOiB0cnVlLFxuXHRcdFx0aWdub3JlQWNjZW50czogdHJ1ZSxcblx0XHRcdGlnbm9yZUNhc2U6IHRydWUsXG5cdFx0XHRpbnB1dFByb3BzOiB7fSxcblx0XHRcdGlzTG9hZGluZzogZmFsc2UsXG5cdFx0XHRqb2luVmFsdWVzOiBmYWxzZSxcblx0XHRcdGxhYmVsS2V5OiAnbGFiZWwnLFxuXHRcdFx0bWF0Y2hQb3M6ICdhbnknLFxuXHRcdFx0bWF0Y2hQcm9wOiAnYW55Jyxcblx0XHRcdG1lbnVCdWZmZXI6IDAsXG5cdFx0XHRtdWx0aTogZmFsc2UsXG5cdFx0XHRub1Jlc3VsdHNUZXh0OiAnTm8gcmVzdWx0cyBmb3VuZCcsXG5cdFx0XHRvbkJsdXJSZXNldHNJbnB1dDogdHJ1ZSxcblx0XHRcdG9wdGlvbkNvbXBvbmVudDogT3B0aW9uLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICdTZWxlY3QuLi4nLFxuXHRcdFx0cmVxdWlyZWQ6IGZhbHNlLFxuXHRcdFx0c2Nyb2xsTWVudUludG9WaWV3OiB0cnVlLFxuXHRcdFx0c2VhcmNoYWJsZTogdHJ1ZSxcblx0XHRcdHNpbXBsZVZhbHVlOiBmYWxzZSxcblx0XHRcdHZhbHVlQ29tcG9uZW50OiBWYWx1ZSxcblx0XHRcdHZhbHVlS2V5OiAndmFsdWUnLFxuXHRcdFx0ZGlzcGxheUFsbDogZmFsc2UsXG5cdFx0fTtcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGUgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbnB1dFZhbHVlOiAnJyxcblx0XHRcdGlzRm9jdXNlZDogZmFsc2UsXG5cdFx0XHRpc0xvYWRpbmc6IGZhbHNlLFxuXHRcdFx0aXNPcGVuOiBmYWxzZSxcblx0XHRcdGlzUHNldWRvRm9jdXNlZDogZmFsc2UsXG5cdFx0XHRyZXF1aXJlZDogdGhpcy5wcm9wcy5yZXF1aXJlZCAmJiB0aGlzLmhhbmRsZVJlcXVpcmVkKHRoaXMucHJvcHMudmFsdWUsIHRoaXMucHJvcHMubXVsdGkpXG5cdFx0fTtcblx0fSxcblxuXHRjb21wb25lbnREaWRNb3VudCAoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuYXV0b2ZvY3VzKSB7XG5cdFx0XHR0aGlzLmZvY3VzKCk7XG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMudmFsdWUgIT09IG5leHRQcm9wcy52YWx1ZSAmJiBuZXh0UHJvcHMucmVxdWlyZWQpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRyZXF1aXJlZDogdGhpcy5oYW5kbGVSZXF1aXJlZChuZXh0UHJvcHMudmFsdWUsIG5leHRQcm9wcy5tdWx0aSksXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFVwZGF0ZSAobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcblx0XHRpZiAobmV4dFN0YXRlLmlzT3BlbiAhPT0gdGhpcy5zdGF0ZS5pc09wZW4pIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBuZXh0U3RhdGUuaXNPcGVuID8gbmV4dFByb3BzLm9uT3BlbiA6IG5leHRQcm9wcy5vbkNsb3NlO1xuXHRcdFx0aGFuZGxlciAmJiBoYW5kbGVyKCk7XG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudERpZFVwZGF0ZSAocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcblx0XHQvLyBmb2N1cyB0byB0aGUgc2VsZWN0ZWQgb3B0aW9uXG5cdFx0aWYgKHRoaXMucmVmcy5tZW51ICYmIHRoaXMucmVmcy5mb2N1c2VkICYmIHRoaXMuc3RhdGUuaXNPcGVuICYmICF0aGlzLmhhc1Njcm9sbGVkVG9PcHRpb24pIHtcblx0XHRcdGxldCBmb2N1c2VkT3B0aW9uTm9kZSA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy5mb2N1c2VkKTtcblx0XHRcdGxldCBtZW51Tm9kZSA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy5tZW51KTtcblx0XHRcdG1lbnVOb2RlLnNjcm9sbFRvcCA9IGZvY3VzZWRPcHRpb25Ob2RlLm9mZnNldFRvcDtcblx0XHRcdHRoaXMuaGFzU2Nyb2xsZWRUb09wdGlvbiA9IHRydWU7XG5cdFx0fSBlbHNlIGlmICghdGhpcy5zdGF0ZS5pc09wZW4pIHtcblx0XHRcdHRoaXMuaGFzU2Nyb2xsZWRUb09wdGlvbiA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmIChwcmV2U3RhdGUuaW5wdXRWYWx1ZSAhPT0gdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICYmIHRoaXMucHJvcHMub25JbnB1dENoYW5nZSkge1xuXHRcdFx0dGhpcy5wcm9wcy5vbklucHV0Q2hhbmdlKHRoaXMuc3RhdGUuaW5wdXRWYWx1ZSk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLl9zY3JvbGxUb0ZvY3VzZWRPcHRpb25PblVwZGF0ZSAmJiB0aGlzLnJlZnMuZm9jdXNlZCAmJiB0aGlzLnJlZnMubWVudSkge1xuXHRcdFx0dGhpcy5fc2Nyb2xsVG9Gb2N1c2VkT3B0aW9uT25VcGRhdGUgPSBmYWxzZTtcblx0XHRcdHZhciBmb2N1c2VkRE9NID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLmZvY3VzZWQpO1xuXHRcdFx0dmFyIG1lbnVET00gPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMubWVudSk7XG5cdFx0XHR2YXIgZm9jdXNlZFJlY3QgPSBmb2N1c2VkRE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0dmFyIG1lbnVSZWN0ID0gbWVudURPTS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdGlmIChmb2N1c2VkUmVjdC5ib3R0b20gPiBtZW51UmVjdC5ib3R0b20gfHwgZm9jdXNlZFJlY3QudG9wIDwgbWVudVJlY3QudG9wKSB7XG5cdFx0XHRcdG1lbnVET00uc2Nyb2xsVG9wID0gKGZvY3VzZWRET00ub2Zmc2V0VG9wICsgZm9jdXNlZERPTS5jbGllbnRIZWlnaHQgLSBtZW51RE9NLm9mZnNldEhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh0aGlzLnByb3BzLnNjcm9sbE1lbnVJbnRvVmlldyAmJiB0aGlzLnJlZnMubWVudUNvbnRhaW5lcikge1xuXHRcdFx0dmFyIG1lbnVDb250YWluZXJSZWN0ID0gdGhpcy5yZWZzLm1lbnVDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRpZiAod2luZG93LmlubmVySGVpZ2h0IDwgbWVudUNvbnRhaW5lclJlY3QuYm90dG9tICsgdGhpcy5wcm9wcy5tZW51QnVmZmVyKSB7XG5cdFx0XHRcdHdpbmRvdy5zY3JvbGxUbygwLCB3aW5kb3cuc2Nyb2xsWSArIG1lbnVDb250YWluZXJSZWN0LmJvdHRvbSArIHRoaXMucHJvcHMubWVudUJ1ZmZlciAtIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChwcmV2UHJvcHMuZGlzYWJsZWQgIT09IHRoaXMucHJvcHMuZGlzYWJsZWQpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyBpc0ZvY3VzZWQ6IGZhbHNlIH0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHJlYWN0L25vLWRpZC11cGRhdGUtc2V0LXN0YXRlXG5cdFx0fVxuXHR9LFxuXG5cdGZvY3VzICgpIHtcblx0XHRpZiAoIXRoaXMucmVmcy5pbnB1dCkgcmV0dXJuO1xuXHRcdHRoaXMucmVmcy5pbnB1dC5mb2N1cygpO1xuXHR9LFxuXG5cdGJsdXJJbnB1dCgpIHtcblx0XHRpZiAoIXRoaXMucmVmcy5pbnB1dCkgcmV0dXJuO1xuXHRcdHRoaXMucmVmcy5pbnB1dC5ibHVyKCk7XG5cdH0sXG5cblx0aGFuZGxlVG91Y2hNb3ZlIChldmVudCkge1xuXHRcdC8vIFNldCBhIGZsYWcgdGhhdCB0aGUgdmlldyBpcyBiZWluZyBkcmFnZ2VkXG5cdFx0dGhpcy5kcmFnZ2luZyA9IHRydWU7XG5cdH0sXG5cblx0aGFuZGxlVG91Y2hTdGFydCAoZXZlbnQpIHtcblx0XHQvLyBTZXQgYSBmbGFnIHRoYXQgdGhlIHZpZXcgaXMgbm90IGJlaW5nIGRyYWdnZWRcblx0XHR0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG5cdH0sXG5cblx0aGFuZGxlVG91Y2hFbmQgKGV2ZW50KSB7XG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIHZpZXcgaXMgYmVpbmcgZHJhZ2dlZCwgSW4gdGhpcyBjYXNlXG5cdFx0Ly8gd2UgZG9uJ3Qgd2FudCB0byBmaXJlIHRoZSBjbGljayBldmVudCAoYmVjYXVzZSB0aGUgdXNlciBvbmx5IHdhbnRzIHRvIHNjcm9sbClcblx0XHRpZih0aGlzLmRyYWdnaW5nKSByZXR1cm47XG5cblx0XHQvLyBGaXJlIHRoZSBtb3VzZSBldmVudHNcblx0XHR0aGlzLmhhbmRsZU1vdXNlRG93bihldmVudCk7XG5cdH0sXG5cblx0aGFuZGxlVG91Y2hFbmRDbGVhclZhbHVlIChldmVudCkge1xuXHRcdC8vIENoZWNrIGlmIHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWQsIEluIHRoaXMgY2FzZVxuXHRcdC8vIHdlIGRvbid0IHdhbnQgdG8gZmlyZSB0aGUgY2xpY2sgZXZlbnQgKGJlY2F1c2UgdGhlIHVzZXIgb25seSB3YW50cyB0byBzY3JvbGwpXG5cdFx0aWYodGhpcy5kcmFnZ2luZykgcmV0dXJuO1xuXG5cdFx0Ly8gQ2xlYXIgdGhlIHZhbHVlXG5cdFx0dGhpcy5jbGVhclZhbHVlKGV2ZW50KTtcblx0fSxcblxuXHRoYW5kbGVNb3VzZURvd24gKGV2ZW50KSB7XG5cdFx0Ly8gaWYgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgYSBtb3VzZWRvd24gYW5kIG5vdCB0aGUgcHJpbWFyeVxuXHRcdC8vIGJ1dHRvbiwgb3IgaWYgdGhlIGNvbXBvbmVudCBpcyBkaXNhYmxlZCwgaWdub3JlIGl0LlxuXHRcdGlmICh0aGlzLnByb3BzLmRpc2FibGVkIHx8IChldmVudC50eXBlID09PSAnbW91c2Vkb3duJyAmJiBldmVudC5idXR0b24gIT09IDApKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gcHJldmVudCBkZWZhdWx0IGV2ZW50IGhhbmRsZXJzXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdC8vIGZvciB0aGUgbm9uLXNlYXJjaGFibGUgc2VsZWN0LCB0b2dnbGUgdGhlIG1lbnVcblx0XHRpZiAoIXRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuXHRcdFx0dGhpcy5mb2N1cygpO1xuXHRcdFx0cmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46ICF0aGlzLnN0YXRlLmlzT3Blbixcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnN0YXRlLmlzRm9jdXNlZCkge1xuXHRcdFx0Ly8gaWYgdGhlIGlucHV0IGlzIGZvY3VzZWQsIGVuc3VyZSB0aGUgbWVudSBpcyBvcGVuXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiB0cnVlLFxuXHRcdFx0XHRpc1BzZXVkb0ZvY3VzZWQ6IGZhbHNlLFxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIG90aGVyd2lzZSwgZm9jdXMgdGhlIGlucHV0IGFuZCBvcGVuIHRoZSBtZW51XG5cdFx0XHR0aGlzLl9vcGVuQWZ0ZXJGb2N1cyA9IHRydWU7XG5cdFx0XHR0aGlzLmZvY3VzKCk7XG5cdFx0fVxuXHR9LFxuXG5cdGhhbmRsZU1vdXNlRG93bk9uQXJyb3cgKGV2ZW50KSB7XG5cdFx0Ly8gaWYgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgYSBtb3VzZWRvd24gYW5kIG5vdCB0aGUgcHJpbWFyeVxuXHRcdC8vIGJ1dHRvbiwgb3IgaWYgdGhlIGNvbXBvbmVudCBpcyBkaXNhYmxlZCwgaWdub3JlIGl0LlxuXHRcdGlmICh0aGlzLnByb3BzLmRpc2FibGVkIHx8IChldmVudC50eXBlID09PSAnbW91c2Vkb3duJyAmJiBldmVudC5idXR0b24gIT09IDApKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIElmIHRoZSBtZW51IGlzbid0IG9wZW4sIGxldCB0aGUgZXZlbnQgYnViYmxlIHRvIHRoZSBtYWluIGhhbmRsZU1vdXNlRG93blxuXHRcdGlmICghdGhpcy5zdGF0ZS5pc09wZW4pIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly8gcHJldmVudCBkZWZhdWx0IGV2ZW50IGhhbmRsZXJzXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQvLyBjbG9zZSB0aGUgbWVudVxuXHRcdHRoaXMuY2xvc2VNZW51KCk7XG5cdH0sXG5cblx0aGFuZGxlTW91c2VEb3duT25NZW51IChldmVudCkge1xuXHRcdC8vIGlmIHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IGEgbW91c2Vkb3duIGFuZCBub3QgdGhlIHByaW1hcnlcblx0XHQvLyBidXR0b24sIG9yIGlmIHRoZSBjb21wb25lbnQgaXMgZGlzYWJsZWQsIGlnbm9yZSBpdC5cbiBcdCAgaWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWRvd24nICYmIGV2ZW50LmJ1dHRvbiAhPT0gMCkpIHtcblx0XHQgIHJldHVybjtcblx0XHR9XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gdHJ1ZTtcblx0XHR0aGlzLmZvY3VzKCk7XG5cdH0sXG5cblx0Y2xvc2VNZW51ICgpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGlzT3BlbjogZmFsc2UsXG5cdFx0XHRpc1BzZXVkb0ZvY3VzZWQ6IHRoaXMuc3RhdGUuaXNGb2N1c2VkICYmICF0aGlzLnByb3BzLm11bHRpLFxuXHRcdFx0aW5wdXRWYWx1ZTogJycsXG5cdFx0fSk7XG5cdFx0dGhpcy5oYXNTY3JvbGxlZFRvT3B0aW9uID0gZmFsc2U7XG5cdH0sXG5cblx0aGFuZGxlSW5wdXRGb2N1cyAoZXZlbnQpIHtcblx0XHR2YXIgaXNPcGVuID0gdGhpcy5zdGF0ZS5pc09wZW4gfHwgdGhpcy5fb3BlbkFmdGVyRm9jdXM7XG5cdFx0aWYgKHRoaXMucHJvcHMub25Gb2N1cykge1xuXHRcdFx0dGhpcy5wcm9wcy5vbkZvY3VzKGV2ZW50KTtcblx0XHR9XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc0ZvY3VzZWQ6IHRydWUsXG5cdFx0XHRpc09wZW46IGlzT3BlblxuXHRcdH0pO1xuXHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gZmFsc2U7XG5cdH0sXG5cblx0aGFuZGxlSW5wdXRCbHVyIChldmVudCkge1xuIFx0XHRpZiAodGhpcy5yZWZzLm1lbnUgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5pc0VxdWFsTm9kZSh0aGlzLnJlZnMubWVudSkpIHtcbiBcdFx0XHRyZXR1cm47XG4gXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BzLm9uQmx1cikge1xuXHRcdFx0dGhpcy5wcm9wcy5vbkJsdXIoZXZlbnQpO1xuXHRcdH1cblx0XHR2YXIgb25CbHVycmVkU3RhdGUgPSB7XG5cdFx0XHRpc0ZvY3VzZWQ6IGZhbHNlLFxuXHRcdFx0aXNPcGVuOiBmYWxzZSxcblx0XHRcdGlzUHNldWRvRm9jdXNlZDogZmFsc2UsXG5cdFx0fTtcblx0XHRpZiAodGhpcy5wcm9wcy5vbkJsdXJSZXNldHNJbnB1dCkge1xuXHRcdFx0b25CbHVycmVkU3RhdGUuaW5wdXRWYWx1ZSA9ICcnO1xuXHRcdH1cblx0XHR0aGlzLnNldFN0YXRlKG9uQmx1cnJlZFN0YXRlKTtcblx0fSxcblxuXHRoYW5kbGVJbnB1dENoYW5nZSAoZXZlbnQpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGlzT3BlbjogdHJ1ZSxcblx0XHRcdGlzUHNldWRvRm9jdXNlZDogZmFsc2UsXG5cdFx0XHRpbnB1dFZhbHVlOiBldmVudC50YXJnZXQudmFsdWUsXG5cdFx0fSk7XG5cdH0sXG5cblx0aGFuZGxlS2V5RG93biAoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCkgcmV0dXJuO1xuXHRcdHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuXHRcdFx0Y2FzZSA4OiAvLyBiYWNrc3BhY2Vcblx0XHRcdFx0aWYgKCF0aGlzLnN0YXRlLmlucHV0VmFsdWUgJiYgdGhpcy5wcm9wcy5iYWNrc3BhY2VSZW1vdmVzKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR0aGlzLnBvcFZhbHVlKCk7XG5cdFx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHRcdGNhc2UgOTogLy8gdGFiXG5cdFx0XHRcdGlmIChldmVudC5zaGlmdEtleSB8fCAhdGhpcy5zdGF0ZS5pc09wZW4pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5zZWxlY3RGb2N1c2VkT3B0aW9uKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0XHRjYXNlIDEzOiAvLyBlbnRlclxuXHRcdFx0XHRpZiAoIXRoaXMuc3RhdGUuaXNPcGVuKSByZXR1cm47XG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHR0aGlzLnNlbGVjdEZvY3VzZWRPcHRpb24oKTtcblx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyNzogLy8gZXNjYXBlXG5cdFx0XHRcdGlmICh0aGlzLnN0YXRlLmlzT3Blbikge1xuXHRcdFx0XHRcdHRoaXMuY2xvc2VNZW51KCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5wcm9wcy5jbGVhcmFibGUgJiYgdGhpcy5wcm9wcy5lc2NhcGVDbGVhcnNWYWx1ZSkge1xuXHRcdFx0XHRcdHRoaXMuY2xlYXJWYWx1ZShldmVudCk7XG5cdFx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzODogLy8gdXBcblx0XHRcdFx0dGhpcy5mb2N1c1ByZXZpb3VzT3B0aW9uKCk7XG5cdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDA6IC8vIGRvd25cblx0XHRcdFx0dGhpcy5mb2N1c05leHRPcHRpb24oKTtcblx0XHRcdGJyZWFrO1xuXHRcdFx0Ly8gY2FzZSAxODg6IC8vICxcblx0XHRcdC8vIFx0aWYgKHRoaXMucHJvcHMuYWxsb3dDcmVhdGUgJiYgdGhpcy5wcm9wcy5tdWx0aSkge1xuXHRcdFx0Ly8gXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQvLyBcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHQvLyBcdFx0dGhpcy5zZWxlY3RGb2N1c2VkT3B0aW9uKCk7XG5cdFx0XHQvLyBcdH0gZWxzZSB7XG5cdFx0XHQvLyBcdFx0cmV0dXJuO1xuXHRcdFx0Ly8gXHR9XG5cdFx0XHQvLyBicmVhaztcblx0XHRcdGRlZmF1bHQ6IHJldHVybjtcblx0XHR9XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fSxcblxuXHRoYW5kbGVWYWx1ZUNsaWNrIChvcHRpb24sIGV2ZW50KSB7XG5cdFx0aWYgKCF0aGlzLnByb3BzLm9uVmFsdWVDbGljaykgcmV0dXJuO1xuXHRcdHRoaXMucHJvcHMub25WYWx1ZUNsaWNrKG9wdGlvbiwgZXZlbnQpO1xuXHR9LFxuXG5cdGhhbmRsZU1lbnVTY3JvbGwgKGV2ZW50KSB7XG5cdFx0aWYgKCF0aGlzLnByb3BzLm9uTWVudVNjcm9sbFRvQm90dG9tKSByZXR1cm47XG5cdFx0bGV0IHsgdGFyZ2V0IH0gPSBldmVudDtcblx0XHRpZiAodGFyZ2V0LnNjcm9sbEhlaWdodCA+IHRhcmdldC5vZmZzZXRIZWlnaHQgJiYgISh0YXJnZXQuc2Nyb2xsSGVpZ2h0IC0gdGFyZ2V0Lm9mZnNldEhlaWdodCAtIHRhcmdldC5zY3JvbGxUb3ApKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uTWVudVNjcm9sbFRvQm90dG9tKCk7XG5cdFx0fVxuXHR9LFxuXG5cdGhhbmRsZVJlcXVpcmVkICh2YWx1ZSwgbXVsdGkpIHtcblx0XHRpZiAoIXZhbHVlKSByZXR1cm4gdHJ1ZTtcblx0XHRyZXR1cm4gKG11bHRpID8gdmFsdWUubGVuZ3RoID09PSAwIDogT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMCk7XG5cdH0sXG5cblx0Z2V0T3B0aW9uTGFiZWwgKG9wKSB7XG5cdFx0cmV0dXJuIG9wW3RoaXMucHJvcHMubGFiZWxLZXldO1xuXHR9LFxuXG5cdGdldFZhbHVlQXJyYXkgKCkge1xuXHRcdGxldCB2YWx1ZSA9IHRoaXMucHJvcHMudmFsdWU7XG5cdFx0aWYgKHRoaXMucHJvcHMubXVsdGkpIHtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB2YWx1ZSA9IHZhbHVlLnNwbGl0KHRoaXMucHJvcHMuZGVsaW1pdGVyKTtcblx0XHRcdGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBbXTtcblx0XHRcdFx0dmFsdWUgPSBbdmFsdWVdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHZhbHVlLm1hcCh0aGlzLmV4cGFuZFZhbHVlKS5maWx0ZXIoaSA9PiBpKTtcblx0XHR9XG5cdFx0dmFyIGV4cGFuZGVkVmFsdWUgPSB0aGlzLmV4cGFuZFZhbHVlKHZhbHVlKTtcblx0XHRyZXR1cm4gZXhwYW5kZWRWYWx1ZSA/IFtleHBhbmRlZFZhbHVlXSA6IFtdO1xuXHR9LFxuXG5cdGV4cGFuZFZhbHVlICh2YWx1ZSkge1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHJldHVybiB2YWx1ZTtcblx0XHRsZXQgeyBvcHRpb25zLCB2YWx1ZUtleSB9ID0gdGhpcy5wcm9wcztcblx0XHRpZiAoIW9wdGlvbnMpIHJldHVybjtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChvcHRpb25zW2ldW3ZhbHVlS2V5XSA9PT0gdmFsdWUpIHJldHVybiBvcHRpb25zW2ldO1xuXHRcdH1cblx0fSxcblxuXHRzZXRWYWx1ZSAodmFsdWUpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5hdXRvQmx1cil7XG5cdFx0XHR0aGlzLmJsdXJJbnB1dCgpO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMucHJvcHMub25DaGFuZ2UpIHJldHVybjtcblx0XHRpZiAodGhpcy5wcm9wcy5yZXF1aXJlZCkge1xuXHRcdFx0Y29uc3QgcmVxdWlyZWQgPSB0aGlzLmhhbmRsZVJlcXVpcmVkKHZhbHVlLCB0aGlzLnByb3BzLm11bHRpKTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyByZXF1aXJlZCB9KTtcblx0XHR9XG5cdFx0aWYgKHRoaXMucHJvcHMuc2ltcGxlVmFsdWUgJiYgdmFsdWUpIHtcblx0XHRcdHZhbHVlID0gdGhpcy5wcm9wcy5tdWx0aSA/IHZhbHVlLm1hcChpID0+IGlbdGhpcy5wcm9wcy52YWx1ZUtleV0pLmpvaW4odGhpcy5wcm9wcy5kZWxpbWl0ZXIpIDogdmFsdWVbdGhpcy5wcm9wcy52YWx1ZUtleV07XG5cdFx0fVxuXHRcdHRoaXMucHJvcHMub25DaGFuZ2UodmFsdWUpO1xuXHR9LFxuXG5cdHNlbGVjdFZhbHVlICh2YWx1ZSkge1xuXHRcdHRoaXMuaGFzU2Nyb2xsZWRUb09wdGlvbiA9IGZhbHNlO1xuXHRcdGlmICh0aGlzLnByb3BzLm11bHRpKSB7XG5cdFx0XHR0aGlzLmFkZFZhbHVlKHZhbHVlKTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpbnB1dFZhbHVlOiAnJyxcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnNldFZhbHVlKHZhbHVlKTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46IGZhbHNlLFxuXHRcdFx0XHRpbnB1dFZhbHVlOiAnJyxcblx0XHRcdFx0aXNQc2V1ZG9Gb2N1c2VkOiB0aGlzLnN0YXRlLmlzRm9jdXNlZCxcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRhZGRWYWx1ZSAodmFsdWUpIHtcblx0XHR2YXIgdmFsdWVBcnJheSA9IHRoaXMuZ2V0VmFsdWVBcnJheSgpO1xuXHRcdHRoaXMuc2V0VmFsdWUodmFsdWVBcnJheS5jb25jYXQodmFsdWUpKTtcblx0fSxcblxuXHRwb3BWYWx1ZSAoKSB7XG5cdFx0dmFyIHZhbHVlQXJyYXkgPSB0aGlzLmdldFZhbHVlQXJyYXkoKTtcblx0XHRpZiAoIXZhbHVlQXJyYXkubGVuZ3RoKSByZXR1cm47XG5cdFx0aWYgKHZhbHVlQXJyYXlbdmFsdWVBcnJheS5sZW5ndGgtMV0uY2xlYXJhYmxlVmFsdWUgPT09IGZhbHNlKSByZXR1cm47XG5cdFx0dGhpcy5zZXRWYWx1ZSh2YWx1ZUFycmF5LnNsaWNlKDAsIHZhbHVlQXJyYXkubGVuZ3RoIC0gMSkpO1xuXHR9LFxuXG5cdHJlbW92ZVZhbHVlICh2YWx1ZSkge1xuXHRcdHZhciB2YWx1ZUFycmF5ID0gdGhpcy5nZXRWYWx1ZUFycmF5KCk7XG5cdFx0dGhpcy5zZXRWYWx1ZSh2YWx1ZUFycmF5LmZpbHRlcihpID0+IGkgIT09IHZhbHVlKSk7XG5cdFx0dGhpcy5mb2N1cygpO1xuXHR9LFxuXG5cdGNsZWFyVmFsdWUgKGV2ZW50KSB7XG5cdFx0Ly8gaWYgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgYSBtb3VzZWRvd24gYW5kIG5vdCB0aGUgcHJpbWFyeVxuXHRcdC8vIGJ1dHRvbiwgaWdub3JlIGl0LlxuXHRcdGlmIChldmVudCAmJiBldmVudC50eXBlID09PSAnbW91c2Vkb3duJyAmJiBldmVudC5idXR0b24gIT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLnNldFZhbHVlKG51bGwpO1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0aXNPcGVuOiBmYWxzZSxcblx0XHRcdGlucHV0VmFsdWU6ICcnLFxuXHRcdH0sIHRoaXMuZm9jdXMpO1xuXHR9LFxuXG5cdGZvY3VzT3B0aW9uIChvcHRpb24pIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGZvY3VzZWRPcHRpb246IG9wdGlvblxuXHRcdH0pO1xuXHR9LFxuXG5cdGZvY3VzTmV4dE9wdGlvbiAoKSB7XG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCduZXh0Jyk7XG5cdH0sXG5cblx0Zm9jdXNQcmV2aW91c09wdGlvbiAoKSB7XG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCdwcmV2aW91cycpO1xuXHR9LFxuXG5cdGZvY3VzQWRqYWNlbnRPcHRpb24gKGRpcikge1xuXHRcdHZhciBvcHRpb25zID0gdGhpcy5fdmlzaWJsZU9wdGlvbnMuZmlsdGVyKGkgPT4gIWkuZGlzYWJsZWQpO1xuXHRcdHRoaXMuX3Njcm9sbFRvRm9jdXNlZE9wdGlvbk9uVXBkYXRlID0gdHJ1ZTtcblx0XHRpZiAoIXRoaXMuc3RhdGUuaXNPcGVuKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNPcGVuOiB0cnVlLFxuXHRcdFx0XHRpbnB1dFZhbHVlOiAnJyxcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbjogdGhpcy5fZm9jdXNlZE9wdGlvbiB8fCBvcHRpb25zW2RpciA9PT0gJ25leHQnID8gMCA6IG9wdGlvbnMubGVuZ3RoIC0gMV1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoIW9wdGlvbnMubGVuZ3RoKSByZXR1cm47XG5cdFx0dmFyIGZvY3VzZWRJbmRleCA9IC0xO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHRoaXMuX2ZvY3VzZWRPcHRpb24gPT09IG9wdGlvbnNbaV0pIHtcblx0XHRcdFx0Zm9jdXNlZEluZGV4ID0gaTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBmb2N1c2VkT3B0aW9uID0gb3B0aW9uc1swXTtcblx0XHRpZiAoZGlyID09PSAnbmV4dCcgJiYgZm9jdXNlZEluZGV4ID4gLTEgJiYgZm9jdXNlZEluZGV4IDwgb3B0aW9ucy5sZW5ndGggLSAxKSB7XG5cdFx0XHRmb2N1c2VkT3B0aW9uID0gb3B0aW9uc1tmb2N1c2VkSW5kZXggKyAxXTtcblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3ByZXZpb3VzJykge1xuXHRcdFx0aWYgKGZvY3VzZWRJbmRleCA+IDApIHtcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbiA9IG9wdGlvbnNbZm9jdXNlZEluZGV4IC0gMV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb2N1c2VkT3B0aW9uID0gb3B0aW9uc1tvcHRpb25zLmxlbmd0aCAtIDFdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGZvY3VzZWRPcHRpb246IGZvY3VzZWRPcHRpb25cblx0XHR9KTtcblx0fSxcblxuXHRzZWxlY3RGb2N1c2VkT3B0aW9uICgpIHtcblx0XHQvLyBpZiAodGhpcy5wcm9wcy5hbGxvd0NyZWF0ZSAmJiAhdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uKSB7XG5cdFx0Ly8gXHRyZXR1cm4gdGhpcy5zZWxlY3RWYWx1ZSh0aGlzLnN0YXRlLmlucHV0VmFsdWUpO1xuXHRcdC8vIH1cblx0XHRpZiAodGhpcy5fZm9jdXNlZE9wdGlvbikge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2VsZWN0VmFsdWUodGhpcy5fZm9jdXNlZE9wdGlvbik7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlckxvYWRpbmcgKCkge1xuXHRcdGlmICghdGhpcy5wcm9wcy5pc0xvYWRpbmcpIHJldHVybjtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWxvYWRpbmctem9uZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJTZWxlY3QtbG9hZGluZ1wiIC8+XG5cdFx0XHQ8L3NwYW4+XG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJWYWx1ZSAodmFsdWVBcnJheSwgaXNPcGVuKSB7XG5cdFx0bGV0IHJlbmRlckxhYmVsID0gdGhpcy5wcm9wcy52YWx1ZVJlbmRlcmVyIHx8IHRoaXMuZ2V0T3B0aW9uTGFiZWw7XG5cdFx0bGV0IFZhbHVlQ29tcG9uZW50ID0gdGhpcy5wcm9wcy52YWx1ZUNvbXBvbmVudDtcblx0XHRpZiAoIXZhbHVlQXJyYXkubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gIXRoaXMuc3RhdGUuaW5wdXRWYWx1ZSA/IDxkaXYgY2xhc3NOYW1lPVwiU2VsZWN0LXBsYWNlaG9sZGVyXCI+e3RoaXMucHJvcHMucGxhY2Vob2xkZXJ9PC9kaXY+IDogbnVsbDtcblx0XHR9XG5cdFx0bGV0IG9uQ2xpY2sgPSB0aGlzLnByb3BzLm9uVmFsdWVDbGljayA/IHRoaXMuaGFuZGxlVmFsdWVDbGljayA6IG51bGw7XG5cdFx0aWYgKHRoaXMucHJvcHMubXVsdGkpIHtcblx0XHRcdGlmKHRoaXMucHJvcHMuc2luZ2xlVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8VmFsdWVDb21wb25lbnRcbiAgICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfVxuICAgICAgICAgICAgb25DbGljaz17b25DbGlja31cbiAgICAgICAgICAgIG9uUmVtb3ZlPXt0aGlzLnJlbW92ZVZhbHVlfVxuICAgICAgICAgICAgdmFsdWVzPXt2YWx1ZUFycmF5fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAge3ZhbHVlQXJyYXkubGVuZ3RofVxuICAgICAgICAgIDwvVmFsdWVDb21wb25lbnQ+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlQXJyYXkubWFwKCh2YWx1ZSwgaSkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHQ8VmFsdWVDb21wb25lbnRcblx0XHRcdFx0XHRcdFx0ZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWQgfHwgdmFsdWUuY2xlYXJhYmxlVmFsdWUgPT09IGZhbHNlfVxuXHRcdFx0XHRcdFx0XHRrZXk9e2B2YWx1ZS0ke2l9LSR7dmFsdWVbdGhpcy5wcm9wcy52YWx1ZUtleV19YH1cblx0XHRcdFx0XHRcdFx0b25DbGljaz17b25DbGlja31cblx0XHRcdFx0XHRcdFx0b25SZW1vdmU9e3RoaXMucmVtb3ZlVmFsdWV9XG5cdFx0XHRcdFx0XHRcdHZhbHVlPXt2YWx1ZX1cblx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHR7cmVuZGVyTGFiZWwodmFsdWUpfVxuXHRcdFx0XHRcdFx0PC9WYWx1ZUNvbXBvbmVudD5cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9KTtcbiAgICAgIH1cblx0XHR9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLmlucHV0VmFsdWUpIHtcblx0XHRcdGlmIChpc09wZW4pIG9uQ2xpY2sgPSBudWxsO1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PFZhbHVlQ29tcG9uZW50XG5cdFx0XHRcdFx0ZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWR9XG5cdFx0XHRcdFx0b25DbGljaz17b25DbGlja31cblx0XHRcdFx0XHR2YWx1ZT17dmFsdWVBcnJheVswXX1cblx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0e3JlbmRlckxhYmVsKHZhbHVlQXJyYXlbMF0pfVxuXHRcdFx0XHQ8L1ZhbHVlQ29tcG9uZW50PlxuXHRcdFx0KTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVySW5wdXQgKHZhbHVlQXJyYXkpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lcygnU2VsZWN0LWlucHV0JywgdGhpcy5wcm9wcy5pbnB1dFByb3BzLmNsYXNzTmFtZSk7XG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgIXRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PGRpdlxuXHRcdFx0XHRcdHsuLi50aGlzLnByb3BzLmlucHV0UHJvcHN9XG5cdFx0XHRcdFx0Y2xhc3NOYW1lPXtjbGFzc05hbWV9XG5cdFx0XHRcdFx0dGFiSW5kZXg9e3RoaXMucHJvcHMudGFiSW5kZXggfHwgMH1cblx0XHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlSW5wdXRCbHVyfVxuXHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlSW5wdXRGb2N1c31cblx0XHRcdFx0XHRyZWY9XCJpbnB1dFwiXG5cdFx0XHRcdFx0c3R5bGU9e3sgYm9yZGVyOiAwLCB3aWR0aDogMSwgZGlzcGxheTonaW5saW5lLWJsb2NrJyB9fS8+XG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5wcm9wcy5hdXRvc2l6ZSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PElucHV0XG5cdFx0XHRcdFx0ey4uLnRoaXMucHJvcHMuaW5wdXRQcm9wc31cblx0XHRcdFx0XHRjbGFzc05hbWU9e2NsYXNzTmFtZX1cblx0XHRcdFx0XHR0YWJJbmRleD17dGhpcy5wcm9wcy50YWJJbmRleH1cblx0XHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlSW5wdXRCbHVyfVxuXHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUlucHV0Q2hhbmdlfVxuXHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlSW5wdXRGb2N1c31cblx0XHRcdFx0XHRtaW5XaWR0aD1cIjVcIlxuXHRcdFx0XHRcdHJlZj1cImlucHV0XCJcblx0XHRcdFx0XHRyZXF1aXJlZD17dGhpcy5zdGF0ZS5yZXF1aXJlZH1cblx0XHRcdFx0XHR2YWx1ZT17dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfVxuXHRcdFx0XHQvPlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0+XG5cdFx0XHRcdDxpbnB1dFxuXHRcdFx0XHRcdHsuLi50aGlzLnByb3BzLmlucHV0UHJvcHN9XG5cdFx0XHRcdFx0dGFiSW5kZXg9e3RoaXMucHJvcHMudGFiSW5kZXh9XG5cdFx0XHRcdFx0b25CbHVyPXt0aGlzLmhhbmRsZUlucHV0Qmx1cn1cblx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5oYW5kbGVJbnB1dENoYW5nZX1cblx0XHRcdFx0XHRvbkZvY3VzPXt0aGlzLmhhbmRsZUlucHV0Rm9jdXN9XG5cdFx0XHRcdFx0cmVmPVwiaW5wdXRcIlxuXHRcdFx0XHRcdHJlcXVpcmVkPXt0aGlzLnN0YXRlLnJlcXVpcmVkfVxuXHRcdFx0XHRcdHZhbHVlPXt0aGlzLnN0YXRlLmlucHV0VmFsdWV9XG5cdFx0XHRcdC8+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlckNsZWFyICgpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMuY2xlYXJhYmxlIHx8ICF0aGlzLnByb3BzLnZhbHVlIHx8ICh0aGlzLnByb3BzLm11bHRpICYmICF0aGlzLnByb3BzLnZhbHVlLmxlbmd0aCkgfHwgdGhpcy5wcm9wcy5kaXNhYmxlZCB8fCB0aGlzLnByb3BzLmlzTG9hZGluZykgcmV0dXJuO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJTZWxlY3QtY2xlYXItem9uZVwiIHRpdGxlPXt0aGlzLnByb3BzLm11bHRpID8gdGhpcy5wcm9wcy5jbGVhckFsbFRleHQgOiB0aGlzLnByb3BzLmNsZWFyVmFsdWVUZXh0fVxuXHRcdFx0XHRcdFx0YXJpYS1sYWJlbD17dGhpcy5wcm9wcy5tdWx0aSA/IHRoaXMucHJvcHMuY2xlYXJBbGxUZXh0IDogdGhpcy5wcm9wcy5jbGVhclZhbHVlVGV4dH1cblx0XHRcdFx0XHRcdG9uTW91c2VEb3duPXt0aGlzLmNsZWFyVmFsdWV9XG5cdFx0XHRcdFx0XHRvblRvdWNoU3RhcnQ9e3RoaXMuaGFuZGxlVG91Y2hTdGFydH1cblx0XHRcdFx0XHRcdG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZX1cblx0XHRcdFx0XHRcdG9uVG91Y2hFbmQ9e3RoaXMuaGFuZGxlVG91Y2hFbmRDbGVhclZhbHVlfT5cblx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWNsZWFyXCIgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiAnJnRpbWVzOycgfX0gLz5cblx0XHRcdDwvc3Bhbj5cblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlckFycm93ICgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWFycm93LXpvbmVcIiBvbk1vdXNlRG93bj17dGhpcy5oYW5kbGVNb3VzZURvd25PbkFycm93fT5cblx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWFycm93XCIgb25Nb3VzZURvd249e3RoaXMuaGFuZGxlTW91c2VEb3duT25BcnJvd30gLz5cblx0XHRcdDwvc3Bhbj5cblx0XHQpO1xuXHR9LFxuXG5cdGZpbHRlck9wdGlvbnMgKGV4Y2x1ZGVPcHRpb25zKSB7XG5cdFx0dmFyIGZpbHRlclZhbHVlID0gdGhpcy5zdGF0ZS5pbnB1dFZhbHVlO1xuXHRcdHZhciBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zIHx8IFtdO1xuXHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5maWx0ZXJPcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9wcy5maWx0ZXJPcHRpb25zLmNhbGwodGhpcywgb3B0aW9ucywgZmlsdGVyVmFsdWUsIGV4Y2x1ZGVPcHRpb25zKTtcblx0XHR9IGVsc2UgaWYgKHRoaXMucHJvcHMuZmlsdGVyT3B0aW9ucykge1xuXHRcdFx0aWYgKHRoaXMucHJvcHMuaWdub3JlQWNjZW50cykge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IHN0cmlwRGlhY3JpdGljcyhmaWx0ZXJWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5wcm9wcy5pZ25vcmVDYXNlKSB7XG5cdFx0XHRcdGZpbHRlclZhbHVlID0gZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdH1cblx0XHRcdGlmIChleGNsdWRlT3B0aW9ucykgZXhjbHVkZU9wdGlvbnMgPSBleGNsdWRlT3B0aW9ucy5tYXAoaSA9PiBpW3RoaXMucHJvcHMudmFsdWVLZXldKTtcblx0XHRcdHJldHVybiBvcHRpb25zLmZpbHRlcihvcHRpb24gPT4ge1xuXHRcdFx0XHRpZiAoZXhjbHVkZU9wdGlvbnMgJiYgZXhjbHVkZU9wdGlvbnMuaW5kZXhPZihvcHRpb25bdGhpcy5wcm9wcy52YWx1ZUtleV0pID4gLTEpIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWYgKHRoaXMucHJvcHMuZmlsdGVyT3B0aW9uKSByZXR1cm4gdGhpcy5wcm9wcy5maWx0ZXJPcHRpb24uY2FsbCh0aGlzLCBvcHRpb24sIGZpbHRlclZhbHVlKTtcblx0XHRcdFx0aWYgKCFmaWx0ZXJWYWx1ZSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdHZhciB2YWx1ZVRlc3QgPSBTdHJpbmcob3B0aW9uW3RoaXMucHJvcHMudmFsdWVLZXldKTtcblx0XHRcdFx0dmFyIGxhYmVsVGVzdCA9IFN0cmluZyhvcHRpb25bdGhpcy5wcm9wcy5sYWJlbEtleV0pO1xuXHRcdFx0XHRpZiAodGhpcy5wcm9wcy5pZ25vcmVBY2NlbnRzKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMucHJvcHMubWF0Y2hQcm9wICE9PSAnbGFiZWwnKSB2YWx1ZVRlc3QgPSBzdHJpcERpYWNyaXRpY3ModmFsdWVUZXN0KTtcblx0XHRcdFx0XHRpZiAodGhpcy5wcm9wcy5tYXRjaFByb3AgIT09ICd2YWx1ZScpIGxhYmVsVGVzdCA9IHN0cmlwRGlhY3JpdGljcyhsYWJlbFRlc3QpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLnByb3BzLmlnbm9yZUNhc2UpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5wcm9wcy5tYXRjaFByb3AgIT09ICdsYWJlbCcpIHZhbHVlVGVzdCA9IHZhbHVlVGVzdC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdGlmICh0aGlzLnByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJykgbGFiZWxUZXN0ID0gbGFiZWxUZXN0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMucHJvcHMubWF0Y2hQb3MgPT09ICdzdGFydCcgPyAoXG5cdFx0XHRcdFx0KHRoaXMucHJvcHMubWF0Y2hQcm9wICE9PSAnbGFiZWwnICYmIHZhbHVlVGVzdC5zdWJzdHIoMCwgZmlsdGVyVmFsdWUubGVuZ3RoKSA9PT0gZmlsdGVyVmFsdWUpIHx8XG5cdFx0XHRcdFx0KHRoaXMucHJvcHMubWF0Y2hQcm9wICE9PSAndmFsdWUnICYmIGxhYmVsVGVzdC5zdWJzdHIoMCwgZmlsdGVyVmFsdWUubGVuZ3RoKSA9PT0gZmlsdGVyVmFsdWUpXG5cdFx0XHRcdCkgOiAoXG5cdFx0XHRcdFx0KHRoaXMucHJvcHMubWF0Y2hQcm9wICE9PSAnbGFiZWwnICYmIHZhbHVlVGVzdC5pbmRleE9mKGZpbHRlclZhbHVlKSA+PSAwKSB8fFxuXHRcdFx0XHRcdCh0aGlzLnByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJyAmJiBsYWJlbFRlc3QuaW5kZXhPZihmaWx0ZXJWYWx1ZSkgPj0gMClcblx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gb3B0aW9ucztcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyTWVudSAob3B0aW9ucywgdmFsdWVBcnJheSwgZm9jdXNlZE9wdGlvbikge1xuXHRcdGlmIChvcHRpb25zICYmIG9wdGlvbnMubGVuZ3RoKSB7XG5cdFx0XHRsZXQgT3B0aW9uID0gdGhpcy5wcm9wcy5vcHRpb25Db21wb25lbnQ7XG5cdFx0XHRsZXQgcmVuZGVyTGFiZWwgPSB0aGlzLnByb3BzLm9wdGlvblJlbmRlcmVyIHx8IHRoaXMuZ2V0T3B0aW9uTGFiZWw7XG5cblx0XHRcdHJldHVybiBvcHRpb25zLm1hcCgob3B0aW9uLCBpKSA9PiB7XG5cdFx0XHRcdGxldCBpc1NlbGVjdGVkID0gdmFsdWVBcnJheSAmJiB2YWx1ZUFycmF5LmluZGV4T2Yob3B0aW9uKSA+IC0xO1xuXHRcdFx0XHRsZXQgaXNGb2N1c2VkID0gb3B0aW9uID09PSBmb2N1c2VkT3B0aW9uO1xuXHRcdFx0XHRsZXQgb3B0aW9uUmVmID0gaXNGb2N1c2VkID8gJ2ZvY3VzZWQnIDogbnVsbDtcblx0XHRcdFx0bGV0IG9wdGlvbkNsYXNzID0gY2xhc3NOYW1lcyh7XG5cdFx0XHRcdFx0J1NlbGVjdC1vcHRpb24nOiB0cnVlLFxuXHRcdFx0XHRcdCdpcy1zZWxlY3RlZCc6IGlzU2VsZWN0ZWQsXG5cdFx0XHRcdFx0J2lzLWZvY3VzZWQnOiBpc0ZvY3VzZWQsXG5cdFx0XHRcdFx0J2lzLWRpc2FibGVkJzogb3B0aW9uLmRpc2FibGVkLFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdDxPcHRpb25cblx0XHRcdFx0XHRcdGNsYXNzTmFtZT17b3B0aW9uQ2xhc3N9XG5cdFx0XHRcdFx0XHRpc0Rpc2FibGVkPXtvcHRpb24uZGlzYWJsZWR9XG5cdFx0XHRcdFx0XHRpc0ZvY3VzZWQ9e2lzRm9jdXNlZH1cblx0XHRcdFx0XHRcdGtleT17YG9wdGlvbi0ke2l9LSR7b3B0aW9uW3RoaXMucHJvcHMudmFsdWVLZXldfWB9XG5cdFx0XHRcdFx0XHRvblNlbGVjdD17dGhpcy5zZWxlY3RWYWx1ZX1cblx0XHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuZm9jdXNPcHRpb259XG5cdFx0XHRcdFx0XHRvcHRpb249e29wdGlvbn1cblx0XHRcdFx0XHRcdGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9XG5cdFx0XHRcdFx0XHRyZWY9e29wdGlvblJlZn1cblx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdHtyZW5kZXJMYWJlbChvcHRpb24pfVxuXHRcdFx0XHRcdDwvT3B0aW9uPlxuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnByb3BzLm5vUmVzdWx0c1RleHQpIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiU2VsZWN0LW5vcmVzdWx0c1wiPlxuXHRcdFx0XHRcdHt0aGlzLnByb3BzLm5vUmVzdWx0c1RleHR9XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlckhpZGRlbkZpZWxkICh2YWx1ZUFycmF5KSB7XG5cdFx0aWYgKCF0aGlzLnByb3BzLm5hbWUpIHJldHVybjtcblx0XHRpZiAodGhpcy5wcm9wcy5qb2luVmFsdWVzKSB7XG5cdFx0XHRsZXQgdmFsdWUgPSB2YWx1ZUFycmF5Lm1hcChpID0+IHN0cmluZ2lmeVZhbHVlKGlbdGhpcy5wcm9wcy52YWx1ZUtleV0pKS5qb2luKHRoaXMucHJvcHMuZGVsaW1pdGVyKTtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxpbnB1dFxuXHRcdFx0XHRcdHR5cGU9XCJoaWRkZW5cIlxuXHRcdFx0XHRcdHJlZj1cInZhbHVlXCJcblx0XHRcdFx0XHRuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG5cdFx0XHRcdFx0dmFsdWU9e3ZhbHVlfVxuXHRcdFx0XHRcdGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfSAvPlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlQXJyYXkubWFwKChpdGVtLCBpbmRleCkgPT4gKFxuXHRcdFx0PGlucHV0IGtleT17J2hpZGRlbi4nICsgaW5kZXh9XG5cdFx0XHRcdHR5cGU9XCJoaWRkZW5cIlxuXHRcdFx0XHRyZWY9eyd2YWx1ZScgKyBpbmRleH1cblx0XHRcdFx0bmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuXHRcdFx0XHR2YWx1ZT17c3RyaW5naWZ5VmFsdWUoaXRlbVt0aGlzLnByb3BzLnZhbHVlS2V5XSl9XG5cdFx0XHRcdGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfSAvPlxuXHRcdCkpO1xuXHR9LFxuXG5cdGdldEZvY3VzYWJsZU9wdGlvbiAoc2VsZWN0ZWRPcHRpb24pIHtcblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMuX3Zpc2libGVPcHRpb25zO1xuXHRcdGlmICghb3B0aW9ucy5sZW5ndGgpIHJldHVybjtcblx0XHRsZXQgZm9jdXNlZE9wdGlvbiA9IHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiB8fCBzZWxlY3RlZE9wdGlvbjtcblx0XHRpZiAoZm9jdXNlZE9wdGlvbiAmJiBvcHRpb25zLmluZGV4T2YoZm9jdXNlZE9wdGlvbikgPiAtMSkgcmV0dXJuIGZvY3VzZWRPcHRpb247XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoIW9wdGlvbnNbaV0uZGlzYWJsZWQpIHJldHVybiBvcHRpb25zW2ldO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXIgKCkge1xuXHRcdGxldCB2YWx1ZUFycmF5ID0gdGhpcy5nZXRWYWx1ZUFycmF5KCk7XG5cdFx0bGV0IG9wdGlvbnMgPSB0aGlzLl92aXNpYmxlT3B0aW9ucyA9IHRoaXMuZmlsdGVyT3B0aW9ucyh0aGlzLnByb3BzLm11bHRpICYmICF0aGlzLnByb3BzLmRpc3BsYXlBbGwgPyB2YWx1ZUFycmF5IDogbnVsbCk7XG5cdFx0bGV0IGlzT3BlbiA9IHRoaXMuc3RhdGUuaXNPcGVuO1xuXHRcdGlmICh0aGlzLnByb3BzLm11bHRpICYmICF0aGlzLnByb3BzLmRpc3BsYXlBbGwgJiYgIW9wdGlvbnMubGVuZ3RoICYmIHZhbHVlQXJyYXkubGVuZ3RoICYmICF0aGlzLnN0YXRlLmlucHV0VmFsdWUpIGlzT3BlbiA9IGZhbHNlO1xuXHRcdGxldCBmb2N1c2VkT3B0aW9uID0gdGhpcy5fZm9jdXNlZE9wdGlvbiA9IHRoaXMuZ2V0Rm9jdXNhYmxlT3B0aW9uKHZhbHVlQXJyYXlbMF0pO1xuXHRcdGxldCBjbGFzc05hbWUgPSBjbGFzc05hbWVzKCdTZWxlY3QnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSwge1xuXHRcdFx0J1NlbGVjdC0tbXVsdGknOiB0aGlzLnByb3BzLm11bHRpLFxuXHRcdFx0J2lzLWRpc2FibGVkJzogdGhpcy5wcm9wcy5kaXNhYmxlZCxcblx0XHRcdCdpcy1mb2N1c2VkJzogdGhpcy5zdGF0ZS5pc0ZvY3VzZWQsXG5cdFx0XHQnaXMtbG9hZGluZyc6IHRoaXMucHJvcHMuaXNMb2FkaW5nLFxuXHRcdFx0J2lzLW9wZW4nOiBpc09wZW4sXG5cdFx0XHQnaXMtcHNldWRvLWZvY3VzZWQnOiB0aGlzLnN0YXRlLmlzUHNldWRvRm9jdXNlZCxcblx0XHRcdCdpcy1zZWFyY2hhYmxlJzogdGhpcy5wcm9wcy5zZWFyY2hhYmxlLFxuXHRcdFx0J2hhcy12YWx1ZSc6IHZhbHVlQXJyYXkubGVuZ3RoLFxuXHRcdH0pO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IHJlZj1cIndyYXBwZXJcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gc3R5bGU9e3RoaXMucHJvcHMud3JhcHBlclN0eWxlfT5cblx0XHRcdFx0e3RoaXMucmVuZGVySGlkZGVuRmllbGQodmFsdWVBcnJheSl9XG5cdFx0XHRcdDxkaXYgcmVmPVwiY29udHJvbFwiXG5cdFx0XHRcdFx0XHQgY2xhc3NOYW1lPVwiU2VsZWN0LWNvbnRyb2xcIlxuXHRcdFx0XHRcdFx0IHN0eWxlPXt0aGlzLnByb3BzLnN0eWxlfVxuXHRcdFx0XHRcdFx0IG9uS2V5RG93bj17dGhpcy5oYW5kbGVLZXlEb3dufVxuXHRcdFx0XHRcdFx0IG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn1cblx0XHRcdFx0XHRcdCBvblRvdWNoRW5kPXt0aGlzLmhhbmRsZVRvdWNoRW5kfVxuXHRcdFx0XHRcdFx0IG9uVG91Y2hTdGFydD17dGhpcy5oYW5kbGVUb3VjaFN0YXJ0fVxuXHRcdFx0XHRcdFx0IG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZX0+XG5cdFx0XHRcdFx0e3RoaXMucmVuZGVyVmFsdWUodmFsdWVBcnJheSwgaXNPcGVuKX1cblx0XHRcdFx0XHR7dGhpcy5yZW5kZXJJbnB1dCh2YWx1ZUFycmF5KX1cblx0XHRcdFx0XHR7dGhpcy5yZW5kZXJMb2FkaW5nKCl9XG5cdFx0XHRcdFx0e3RoaXMucmVuZGVyQ2xlYXIoKX1cblx0XHRcdFx0XHR7dGhpcy5yZW5kZXJBcnJvdygpfVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0e2lzT3BlbiA/IChcblx0XHRcdFx0XHQ8ZGl2IHJlZj1cIm1lbnVDb250YWluZXJcIiBjbGFzc05hbWU9XCJTZWxlY3QtbWVudS1vdXRlclwiIHN0eWxlPXt0aGlzLnByb3BzLm1lbnVDb250YWluZXJTdHlsZX0+XG5cdFx0XHRcdFx0XHQ8ZGl2IHJlZj1cIm1lbnVcIiBjbGFzc05hbWU9XCJTZWxlY3QtbWVudVwiXG5cdFx0XHRcdFx0XHRcdFx0IHN0eWxlPXt0aGlzLnByb3BzLm1lbnVTdHlsZX1cblx0XHRcdFx0XHRcdFx0XHQgb25TY3JvbGw9e3RoaXMuaGFuZGxlTWVudVNjcm9sbH1cblx0XHRcdFx0XHRcdFx0XHQgb25Nb3VzZURvd249e3RoaXMuaGFuZGxlTW91c2VEb3duT25NZW51fT5cblx0XHRcdFx0XHRcdFx0e3RoaXMucmVuZGVyTWVudShvcHRpb25zLCAhdGhpcy5wcm9wcy5tdWx0aSA/IHZhbHVlQXJyYXkgOiBudWxsLCBmb2N1c2VkT3B0aW9uKX1cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQpIDogbnVsbH1cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdDtcbiJdfQ==
