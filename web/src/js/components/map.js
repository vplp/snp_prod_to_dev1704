'use strict';

export default class YaMap{
	constructor(){
        var hint_content = $('#map').data('hint'),
            baloon_content = $('#map').data('balloon');

		ymaps.ready(function () {
	    var myMap = new ymaps.Map('map', {
	        center: [
            	$('.map #map').data('mapdotx'),
            	$('.map #map').data('mapdoty'),
            ],
            zoom: 15
        }),

        MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="popover top">' +
                '<a class="close" href="#">&times;</a>' +
                '<div class="arrow"></div>' +
                '<div class="popover-inner">' +
                '$[[options.contentLayout observeSize minWidth=300 maxWidth=300]]' +
                '</div>' +
                '</div>', {

                build: function () {
                    this.constructor.superclass.build.call(this);

                    this._$element = $('.popover', this.getParentElement());

                    this.applyElementOffset();

                    this._$element.find('.close')
                        .on('click', $.proxy(this.onCloseClick, this));
                },

                clear: function () {
                    this._$element.find('.close')
                        .off('click');

                    this.constructor.superclass.clear.call(this);
                },

                onSublayoutSizeChange: function () {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                    if(!this._isElement(this._$element)) {
                        return;
                    }

                    this.applyElementOffset();

                    this.events.fire('shapechange');
                },

                applyElementOffset: function () {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2),
                        top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                    });
                },

                onCloseClick: function (e) {
                    e.preventDefault();

                    this.events.fire('userclose');
                },

                getShape: function () {
                    if(!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }

                    var position = this._$element.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
                        ]
                    ]));
                },

                _isElement: function (element) {
                    return element && element[0] && element.find('.arrow')[0];
                }
            }),

        MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<h3 class="popover-title">$[properties.balloonHeader]</h3>' +
                '<div class="popover-content">$[properties.balloonContent]</div>'
        ),

        myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            balloonHeader: hint_content,
            balloonContent: baloon_content,
            hintContent: hint_content
        },
        {
            balloonShadow: false,
            balloonLayout: MyBalloonLayout,
            balloonContentLayout: MyBalloonContentLayout,
            balloonPanelMaxMapArea: 0,
            hideIconOnBalloonOpen: false,
            balloonOffset: [-150, 12]
        },
        {
            iconLayout: 'default#image',
        });

	    myMap.geoObjects
		        .add(myPlacemark); 
		});
	}
}