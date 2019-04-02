'use strict';

var TL_Lang = {
  current: 'en',
  en: {
    followers: 'Followers',
    night_mode: 'Switch To Night Mode',
    day_mode: 'Switch To Day Mode'
  }
};

'use strict';

var TL_Utils = {
  getLengthOfNumber: function(n) {
    return n.toString().length;
  },
  getMaxOfArray: function(arr) {
    return Math.max.apply(null, arr);
  },
  convertTime: function(timestamp) {
    var time = new Date(timestamp * 1000),
        months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
    return months[time.getMonth()] + ' ' + time.getDate();
  },
  convertTimeWithDay: function(timestamp) {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(timestamp * 1000).getDay()] + ', ' + this.convertTime(timestamp);
  },
  getCoords: function(e) {
    var box = e.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  },
  getTranslate: function(item) {
    var trans_arr = [];
    if (!window.getComputedStyle) return;
    var style = getComputedStyle(item);
    var transform = style.transform || style.webkitTransform || style.mozTransform || style.msTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) {
      return parseFloat(mat[1].split(', ')[13]);
    }
    mat = transform.match(/^matrix\((.+)\)$/);
    mat ? trans_arr.push(parseFloat(mat[1].split(', ')[4])) : trans_arr.push(0);
    mat ? trans_arr.push(parseFloat(mat[1].split(', ')[5])) : trans_arr.push(0);
    return trans_arr;
  },
  getPageXY: function(e){
    var out = {
      x: 0, y: 0
    };
    if (
      e.type == 'touchstart' || e.type == 'touchmove'
      || e.type == 'touchend' || e.type == 'touchcancel'
    ) {
      var touch = e.touches[0] || e.changedTouches[0];
      out.x = touch.pageX;
      out.y = touch.pageY;
    } else if (
      e.type == 'mousedown' || e.type == 'mouseup' ||
      e.type == 'mousemove' || e.type == 'mouseover'||
      e.type=='mouseout' || e.type =='mouseenter' ||
      e.type=='mouseleave'
    ) {
      out.x = e.pageX;
      out.y = e.pageY;
    }
    return out;
  },
  isPhone: function() {
    // Better to do it in a separate library
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Windows Phone|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    }
    return false;
  }
};

'use strict';

// Maybe jQuery?

// Maybe architecture?
// $, $ic, $_$c, $rc, $ac,
// $dc, $rn, $ia, $_c, $_cns, $a, $gj
// This will significantly reduce the output js size,
// but the code will be less readable.

var TL_Q = {
  svgns: 'http://www.w3.org/2000/svg',
  /**
    * Finding nodes in node
    * @param {Element^} e
    * @param {String} s
    * @return {NodeList}
    */
  $: function(e, s) {
    return e.querySelectorAll(s);
  },
  /**
    * Get index by class name
    * @param {Element^} e
    * @param {String} c_n
    * @return {Number}
    */
  getIndexByClassName: function(e, c_n) {
    var i = 0;
    while ((e = e.previousSibling) != null) {
      if (e.classList) {
        if (e.classList.contains(c_n)) {
          i++;
        }
      }
    }
    return i;
  },
  /**
    * Get parent by class name
    * @param {Element^} e
    * @param {String} c_n
    * @return {Element^}
    */
  getParentByClassName: function(e, c_n) {
    while (
      (e = e.parentNode) &&
      !e.classList.contains(c_n)
    );
    return e;
  },
  /**
    * Replace class name
    * @param {NodeList} re
    * @param {String} ncn
    */
  replaceClassName: function(re, ncn) {
    Array.from(re).forEach(function(e) {
      e.classList = ncn;
    });
  },
  /**
    * Add class name
    * @param {NodeList} re
    * @param {String} ncn
    */
  addClassName: function(re, ncn) {
    Array.from(re).forEach(function(e) {
      if (!e.classList.contains(ncn)) {
        e.classList += ' ' + ncn;
      }
    });
  },
  /**
    * Remove class name
    * @param {NodeList} re
    * @param {String} ncn
    */
  removeClassName: function(re, ncn) {
    Array.from(re).forEach(function(e) {
      e.classList.remove(ncn);
    });
  },
  /**
    * Remove node
    * @param {Element^} e
    */
  removeNode: function(e) {
    e.parentNode.removeChild(e);
  },
  /**
    * Insert after node
    * @param {Element^} e
    * @param {String} re
    */
  insertAfter: function(e, re) {
    return re.parentNode.insertBefore(e, re.nextSibling);
  },
  /**
    * Create node
    * @param {String} rn
    * @param {Object} attrs
    * @return {Element^}
    */
  create: function(rn, attrs) {
    var e = document.createElement(rn);
    if (attrs) {
      this.attrs(e, attrs);
    }
    return e;
  },
  /**
    * Create NS node
    * @param {String} rn
    * @param {Object} attrs
    * @return {Element^}
    */
  createNS: function(rn, attrs) {
    var e = document.createElementNS(this.svgns, rn);
    if (attrs) {
      this.attrs(e, attrs);
    }
    return e;
  },
  /**
    * Add attribute
    * @param {Element^} e
    * @param {Object} attrs
    */
  attrs: function(e, attrs) {
    for (var key in attrs) {
      e.setAttribute(key, attrs[key]);
    }
  },
  /**
    * Get json
    * @param {String} url
    * @return {XMLHttpRequest}
    */
  getJSON: function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    return xhr;
  }
};

'use strict';

var TL_Canvas = {
  /**
    * Clear context
    * @param {Element^} e - <canvas>
    * @return {CanvasRenderingContext2D}
    */
  clear(e) {
    var ctx = e.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, e.width, e.height);
    ctx.restore();
    return ctx;
  }
};

'use strict';

var TL_StoreTheme = {
  night_storage_name: 'tl_dc_',
  init: function(_that) {
    var id = TL_Q.getIndexByClassName(_that, 'tl_graphic_container');
    if (localStorage.getItem(this.night_storage_name + id)) {
      return true;
    }
    return false;
  },
  getColor: function(index) {
    if (
      localStorage.getItem(this.night_storage_name + index)
    ) {
      return TL_Graphic.fill_dark;
    }
    return TL_Graphic.fill;
  },
  setDark: function(
    tl_graphic_container
  ) {
    localStorage.setItem(
      this.night_storage_name + TL_Q.getIndexByClassName(
        tl_graphic_container, 'tl_graphic_container'
      ),
      true
    );
  },
  setDay: function(
    tl_graphic_container
  ) {
    localStorage.removeItem(
      this.night_storage_name + TL_Q.getIndexByClassName(
        tl_graphic_container, 'tl_graphic_container'
      )
    );
  }
};

'use strict';

var TL_StoreDisplay = {
  display_store_name: 'tl_v_graph_',
  getState: function(num_c, num_p) {
    return localStorage.getItem(
      this.display_store_name + num_c + num_p
    );
  },
  setInvisible: function(num_c, num_p) {
    localStorage.setItem(
      this.display_store_name + num_c + num_p,
      true
    );
  },
  setVisible: function(num_c, num_p) {
    localStorage.removeItem(
      this.display_store_name + num_c + num_p
    );
  }
};

'use strict';

var TL_Graphic = {
  xs: [],
  ys: [],
  max_y: 0,
  color: 'transparent',
  title: '',
  brush_width: 3,
  graphic: true,
  graphic_width: 0,
  graphic_height: 0,
  step_x: 0,
  step_y: 0,
  max_parts_x: 4,
  max_parts_y: 5,
  parts_x: [],
  parts_y: 5,
  part_y_height: function() {
    return this.compress_y + (this.max_parts_y - 1);
  },
  compress_x: 50,
  compress_y: 70,
  fill: '#fff',
  fill_dark: '#242f3e',
  minigraphic: true,
  minigraphic_width: 0,
  minigraphic_height: 0,
  minigraphic_resize_area: 10,
  graphic_buttons: true,
  night_mode: true,
  dark_theme: false,
  nameplate: true,
  types: ['line'],
  canvas: (location.hash == '#canvas' ? true: false),
  canvas_brush_width: 9,
  canvas_fill: '#fff',
  graphics_count: 0,
  cc_graphics_count: 0,
  /**
    * Drawing graphs
    */
  draw: function() {
    // Maybe TL_Q.getJSON('database/chart_data.json'); ?
    for (var i = 0; i < TL_Database.length; i++) {
      this.parts_x.push(this.max_parts_x);
      var tl_graphic_container = TL_Q.$(document, '#tl_graphic_container_' + i)[0];
      this.init(
        tl_graphic_container,
        TL_Database[i]
      );
    }
  },
  /**
    * Graphs initialization
    * @param {Element^} container - box for graphs
    * @param {<Array<Object[...]>>} params - graphs parameters
    */
  init: function(container, params) {
    var data = params['columns'].slice();
    this.container = container;
    this.xs = data[0].slice();
    this.xs.splice(0, 1);
    data.splice(0, 1);
    var _that = this;
    var lock = 1;
    data.forEach(
      function(element, index) {
        _that.ys = element.slice();
        _that.color = params['colors'][element[0]];
        _that.title = params['names'][element[0]];
        _that.type = params['types'][element[0]];
        _that.ys.splice(0, 1);
        if (lock) {
          _that.drawMarkup();
          lock = 0;
        }
        _that.drawGraphic();
        _that.drawMinigraphic();
      }
    );
    data.forEach(
      function(element, index) {
        _that.drawAxes(false);
      }
    );
    _that.initTheme(container);
    this.graphics_count++;
  },
  /**
    * Drawing axes
    * @param {Boolean} draw_x - drawing x
    * @param {Boolean} draw_y - drawing y
    */
  drawAxes: function(draw_x, draw_y) {
    this.max_y = TL_Utils.getMaxOfArray(this.ys);
    this.step_y = this.max_y / this.parts_y;
    var max_b = this.max_y;
    var max_b_b = max_b;
    var cc_graphic_coordinates = this.tl_graphic_coordinates;
    this.tl_graphic_coordinates = TL_Q.create('div', {
      'class': 'tl_graphic_coordinates'
    });
    if (cc_graphic_coordinates && this.cc_graphics_count == this.graphics_count) {
      TL_Q.addClassName(
        [this.tl_graphic_coordinates],
        'tl_graphic_coordinates_next'
      );
      this.tl_graphic_grid.insertBefore(this.tl_graphic_coordinates, cc_graphic_coordinates);
    } else {
      this.tl_graphic_grid.appendChild(this.tl_graphic_coordinates);
    }
    while (max_b >= 0) {
      this.tl_y_coordinate = TL_Q.create('div', {
        'class': 'tl_y_coordinate'
      });
      this.tl_graphic_coordinates.appendChild(this.tl_y_coordinate);
      this.tl_x_line = TL_Q.create('div', {
        'class': 'tl_x_line'
      });
      this.tl_x_line.innerText = max_b_b;
      this.tl_y_coordinate.appendChild(this.tl_x_line);
      if (
        max_b_b == 0 &&
        draw_x
      ) {
        this.tl_x_coordinate = TL_Q.create('div', {
          'class': 'tl_x_coordinate'
        });
        this.tl_y_coordinate.appendChild(this.tl_x_coordinate);
      }
      max_b -= this.step_y; // eg. 166.8 - 55.6
      max_b_b = Math.round(max_b);
    }
    this.cc_graphics_count = this.graphics_count;
  },
  /**
    * Drawing markup
    */
  drawMarkup: function() {
    this.tl_graphic_grid = TL_Q.create('div', {
      'class': 'tl_graphic_grid'
    });
    TL_Q.insertAfter(
      this.tl_graphic_grid,
      TL_Q.$(document, '.tl_graphic_head')[
        TL_Q.getIndexByClassName(this.container, 'tl_graphic_container')
      ]
    );
    this.drawAxes(true);
    if (this.graphic) {
      this.tl_graphic_main = TL_Q.createNS('svg');
      this.tl_graphic_grid.appendChild(this.tl_graphic_main);
      this.graphic_width = this.tl_graphic_coordinates.offsetWidth;
      this.graphic_height = this.tl_graphic_coordinates.offsetHeight - this.tl_x_coordinate.offsetHeight;
      TL_Q.attrs(this.tl_graphic_main, {
        'class': 'tl_graphic_main',
        'width': this.graphic_width,
        'height': this.graphic_height
      });
    }
    if (this.minigraphic) {
      this.tl_minigraphic_grid = TL_Q.create('div', {
        'class': 'tl_minigraphic_grid'
      });
      var tl_minigraphic_opacity = TL_Q.create('div', {
        'class': 'tl_minigraphic_opacity'
      });
      this.tl_minigraphic_grid.appendChild(tl_minigraphic_opacity);
      var tl_minigraphic_opacity_right = TL_Q.create('div', {
        'class': 'tl_minigraphic_opacity_right'
      });
      this.tl_minigraphic_grid.appendChild(tl_minigraphic_opacity_right);
      var tl_minigraphic_scroller = TL_Q.create('div', {
        'class': 'tl_minigraphic_scroller',
        'style': 'border-width:' + this.minigraphic_resize_area + 'px'
      });
      this.tl_minigraphic_grid.appendChild(tl_minigraphic_scroller);
      var tl_minigraphic_scroller_spinner = TL_Q.create('div', {
        'class': 'tl_minigraphic_scroller_spinner'
      });
      tl_minigraphic_scroller.appendChild(tl_minigraphic_scroller_spinner);
      var tl_minigraphic_scroller_transparent = TL_Q.create('div', {
        'class': 'tl_minigraphic_scroller_transparent'
      });
      this.tl_minigraphic_grid.appendChild(tl_minigraphic_scroller_transparent);
      this.tl_minigraphic_main = TL_Q.createNS('svg', {
        'class': 'tl_minigraphic_main'
      });
      this.tl_minigraphic_grid.appendChild(this.tl_minigraphic_main);
      this.container.appendChild(this.tl_minigraphic_grid);
      this.minigraphic_width = this.tl_minigraphic_grid.offsetWidth;
      this.minigraphic_height = this.tl_minigraphic_grid.offsetHeight;
      var _that_that = this;
      tl_minigraphic_scroller_transparent.onmousedown = down;
      tl_minigraphic_scroller_transparent.ontouchstart = down;
      function down(e) {
        var _that = this;
        var scroller = tl_minigraphic_scroller;
        var scroller_transparent = tl_minigraphic_scroller_transparent;
        var scroller_opacity = tl_minigraphic_opacity;
        var scroller_opacity_right = tl_minigraphic_opacity_right;
        var minigraphic_grid = TL_Q.getParentByClassName(this, 'tl_minigraphic_grid');
        var scroller_coords = TL_Utils.getCoords(scroller);
        var coords_in_block = TL_Utils.getPageXY(e);
        var shift_x = coords_in_block.x - scroller_coords.left;
        var minigraphic_grid_coords = TL_Utils.getCoords(minigraphic_grid);
        var flag_event = 0;
        if (
          coords_in_block.x < (scroller_coords.left + _that_that.minigraphic_resize_area) &&
          coords_in_block.x > scroller_coords.left
        ) {
          flag_event = -1;
        } else if (
          coords_in_block.x > (scroller_coords.left + scroller.offsetWidth - _that_that.minigraphic_resize_area) &&
          coords_in_block.x < (scroller_coords.left + scroller.offsetWidth)
        ) {
          flag_event = 1;
        }
        document.onmousemove = move;
        document.ontouchmove = move;
        function move(e) {
          var move_coords_in_block = TL_Utils.getPageXY(e);
          var index_tl_graphic_container = TL_Q.getIndexByClassName(
            TL_Q.getParentByClassName(minigraphic_grid, 'tl_graphic_container'),
            'tl_graphic_container'
          );
          var new_left = move_coords_in_block.x - shift_x;
          if (new_left < 0) {
            new_left = 0;
          }
          var new_right = minigraphic_grid.offsetWidth - move_coords_in_block.x;
          switch (flag_event) {
            case -1:
              scroller.style.left = new_left + 'px';
              scroller_transparent.style.left = scroller.style.left;
              scroller_opacity.style.width = scroller.style.left;
              scroller.style.width = (minigraphic_grid.offsetWidth - scroller_opacity.offsetWidth - scroller_opacity_right.offsetWidth) + 'px';
              scroller_transparent.style.width = scroller.style.width;
              _that_that.drawGraphicWithScale(
                index_tl_graphic_container,
                (minigraphic_grid.offsetWidth / scroller.offsetWidth)
              );
              _that_that.scrollGraphic(
                _that, minigraphic_grid, new_left, new_right,
                scroller, scroller_opacity, scroller_opacity_right,
                scroller_transparent, index_tl_graphic_container
              );
            break;
            case 1:
              // Feature (test)
              scroller_opacity_right.style.width = new_right + 'px';
              scroller.style.width = (minigraphic_grid.offsetWidth - scroller_opacity.offsetWidth - scroller_opacity_right.offsetWidth) + 'px';
              scroller_transparent.style.width = scroller.style.width;
              _that_that.drawGraphicWithScale(
                index_tl_graphic_container,
                (minigraphic_grid.offsetWidth / scroller.offsetWidth)
              );
              _that_that.scrollGraphic(
                _that, minigraphic_grid, new_left, new_right,
                scroller, scroller_opacity, scroller_opacity_right,
                scroller_transparent, index_tl_graphic_container
              );
            break;
            default:
              _that_that.scrollGraphic(
                _that, minigraphic_grid, new_left, new_right,
                scroller, scroller_opacity, scroller_opacity_right,
                scroller_transparent, index_tl_graphic_container
              );
          }
        }
        document.onmouseup = up;
        document.ontouchend = up;
        document.ontouchcancel = up;
        function up() {
          document.onmousemove = document.onmouseup = null;
          document.ontouchmove = document.ontouchup = null;
        };
        return false;
      };
      tl_minigraphic_scroller.ondragstart = function() {
        return false;
      };
    }
    if (this.graphic_buttons) {
      this.tl_graphic_buttons = TL_Q.create('div', {
        'class': 'tl_graphic_buttons'
      });
      this.tl_graphic_buttons_row = TL_Q.create('div', {
        'class': 'tl_graphic_buttons_row'
      });
      this.tl_graphic_buttons.appendChild(this.tl_graphic_buttons_row);
      this.container.appendChild(this.tl_graphic_buttons);
    }
    if (this.nameplate) {
      this.tl_graphic_container_nameplate = TL_Q.create('div', {
        'class': 'tl_graphic_container_nameplate tl_graphic_hide'
      });
      this.tl_graphic_grid.appendChild(this.tl_graphic_container_nameplate);
      this.tl_graphic_nameplate = TL_Q.create('div', {
        'class': 'tl_graphic_nameplate'
      });
      this.tl_graphic_container_nameplate.appendChild(this.tl_graphic_nameplate);
      this.tl_graphic_nameplate_x = TL_Q.create('div', {
        'class': 'tl_graphic_nameplate_x'
      });
      this.tl_graphic_nameplate.appendChild(this.tl_graphic_nameplate_x);
      this.tl_graphic_nameplate_y = TL_Q.create('div', {
        'class': 'tl_graphic_nameplate_y'
      });
      this.tl_graphic_nameplate.appendChild(this.tl_graphic_nameplate_y);
      this.tl_graphic_nameplate_line = TL_Q.create('div', {
        'class': 'tl_graphic_nameplate_line'
      });
      this.tl_graphic_container_nameplate.appendChild(this.tl_graphic_nameplate_line);
    }
    if (this.night_mode) {
      var tl_night_mode = TL_Q.create('div', {
        'class': 'tl_night_mode'
      });
        var tl_night_mode_span = TL_Q.create('span');
        tl_night_mode_span.innerHTML = TL_Lang[TL_Lang.current]['night_mode'];
        tl_night_mode.appendChild(tl_night_mode_span);
      this.container.appendChild(tl_night_mode);
      var _that = this;
      tl_night_mode_span.onclick = function() {
        if (!this.dark_theme) {
          _that.activeDarkTheme(this);
        } else {
          _that.activeDayTheme(this);
        }
        _that.drawGraphicWithScale(
          TL_Q.getIndexByClassName(
            TL_Q.getParentByClassName(this, 'tl_graphic_container'),
            'tl_graphic_container'
          ), _that.max_parts_x
        );
      };
    }
  },
  /**
    * Scroll graphic
    * TODO:: reduce the number of input data
    **/
  scrollGraphic: function(
    _that, minigraphic_grid, new_left, new_right,
    scroller, scroller_opacity, scroller_opacity_right,
    scroller_transparent, index_tl_graphic_container
  ) {
    var right_dge = minigraphic_grid.offsetWidth - scroller.offsetWidth;
    if (new_left > right_dge) {
      new_left = right_dge;
    }
    var new_right = minigraphic_grid.offsetWidth - (new_left + scroller.offsetWidth);
    scroller.style.left = new_left + 'px';
    scroller_transparent.style.left = scroller.style.left;
    scroller_opacity.style.width = scroller.style.left;
    scroller_opacity_right.style.width = new_right + 'px';
    var tl_graphic_container = TL_Q.getParentByClassName(_that, 'tl_graphic_container');
    var x_way = -(new_left * this.parts_x[index_tl_graphic_container]);
    var _that_that = this;
    Array.from(
      TL_Q.$(tl_graphic_container, '.tl_graphic_main')[0].children
    ).forEach(function(e) {
      if (e.tagName == 'polyline') {
        var transform = 'translate(' + x_way + ', ' + _that_that.graphic_height + ') scale(1, -1)';
      } else {
        var transform = 'translate(' + x_way + ', 0)';
      }
      TL_Q.attrs(e, {
        'transform': transform
      });
    });
    this.drawCanvasPoints(
      tl_graphic_container,
      x_way
    );
    var x = new_right * this.parts_x[index_tl_graphic_container];
    var tl_x_coordinate = TL_Q.$(tl_graphic_container, '.tl_x_coordinate')[0];
    tl_x_coordinate.style.transform = 'translate(' + x + 'px)';
  },
  /**
    * Get the maximum number of Y axes
    * @param {Number} id - markup id
    */
  getAxesMaxY: function(id) {
    var max_y = 0;
    var columns = TL_Database[id]['columns'];
    columns.slice(1, columns.length - 1).forEach(
      function(e) {
        var d = e.slice();
        d.splice(0, 1);
        var b_max_y = TL_Utils.getMaxOfArray(d);
        if (max_y < b_max_y) {
          max_y = b_max_y;
        }
      }
    );
    return max_y;
  },
  /**
    * Drawing graph
    */
  drawGraphic: function() {
    if (
      this.graphic &&
      this.type.indexOf(this.types) != -1
    ) {
      var index_tl_graphic_container = TL_Q.getIndexByClassName(
        this.container,
        'tl_graphic_container'
      );
      this.brush_width = 3;
      this.compress_x = (this.graphic_width / (this.xs.length - 1)) * this.parts_x[index_tl_graphic_container];
      this.compress_y = 70;
      this.drawPolyline(
        this.tl_graphic_main,
        this.graphic_height,
        true
      );
    }
  },
  /**
    * Drawing mini graph
    */
  drawMinigraphic: function() {
    if (
      this.minigraphic &&
      this.type.indexOf(this.types) != -1
    ) {
      this.brush_width = 2;
      this.compress_x = this.minigraphic_width / (this.xs.length - 1);
      this.compress_y = 19;
      this.drawPolyline(
        this.tl_minigraphic_main,
        this.minigraphic_height,
        false
      );
    }
    if (this.graphic_buttons) {
      this.drawButton();
    }
  },
  /**
    * Drawing graph with scale
    * @param {Number} id - graph area id
    * @param {Number} scale - graph scale
    */
  drawGraphicWithScale: function(id, scale) {
    // TODO::infinity scroll for data charts
    this.clearGraphic(id);
    this.parts_x[id] = scale;
    this.brush_width = 3;
    this.minigraphic = false;
    this.graphic_buttons = false;
    this.graphic_nameplate = false;
    this.night_mode = false;
    this.init(
      TL_Q.$(document, '.tl_graphic_container')[id],
      TL_Database[id]
    );
  },
  /**
    * Drawing polyline
    * @param {Element^} tl_graphic - box for graph
    * @param {Number} graphic_height - height of graph
    * @param {Number} graphic_type - type of graph
    */
  drawPolyline: function(tl_graphic, graphic_height, graphic_type) {
    var max_y_len = TL_Utils.getLengthOfNumber(this.max_y);
    var polyline = TL_Q.createNS('polyline');
    var x = 0, y = 0;
    var points = '';
    if (graphic_type) {
      var index_tl_graphic_container = TL_Q.getIndexByClassName(
        this.container,
        'tl_graphic_container'
      );
      var x_way = -((this.xs.length * this.compress_x) / this.parts_x[index_tl_graphic_container]) * (this.parts_x[index_tl_graphic_container] - 1);
      if (this.canvas) {
        var tl_graphic_points = TL_Q.create('canvas', {
          'class': 'tl_graphic_points',
          'width': this.graphic_width,
          'height': this.graphic_height
        });
        if (tl_graphic_points.getContext) {
          this.tl_graphic_grid.appendChild(tl_graphic_points);
        } else {
          this.canvas = false;
        }
      }
      if (this.canvas) {
        var ctx = tl_graphic_points.getContext('2d');
        ctx.transform(1, 0, 0, -1, 0, tl_graphic_points.offsetHeight);
        ctx.translate(x_way, 0);
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.canvas_brush_width;
        ctx.fillStyle = TL_StoreTheme.getColor(
          TL_Q.getIndexByClassName(
            TL_Q.getParentByClassName(
              tl_graphic,
              'tl_graphic_container'
            ),
            'tl_graphic_container'
          )
        );
      } else {
        var g_points = TL_Q.createNS('g', {
          'class': 'g_points'
        });
      }
    }
    var _that = this;
    var prev_y = 0;
    for (var i = 0; i < this.xs.length; i++) {
      y = this.ys[i] * (this.part_y_height() / this.step_y);
      points += (x + ',' + y + ' ');
      if (graphic_type) {
        if (this.canvas) {
          // Speed 4K [canvas points + vector svg]
          ctx.moveTo(x + 5, y);
          ctx.arc(x, y, 5, 0, Math.PI * 2, true);
        } else {
          // Brakes...;()
          var circle = TL_Q.createNS('circle', {
            'class': 'g_circle',
            'transform': 'translate(0, ' + graphic_height + ') scale(1, -1)',
            'cx': x, 'cy': y, 'r': 7,
            'style': 'stroke:' + this.color + ';stroke-width:' + (this.brush_width + 1)
          });
          circle.addEventListener('mouseover', function() {
            _that.showNameplate(this);
          });
          circle.addEventListener('mouseout', function() {
            _that.hideNameplate(this);
          });
          circle.addEventListener('touchstart', function() {
            _that.showNameplate(this);
          });
          circle.addEventListener('touchcancel', function() {
            _that.hideNameplate(this);
          });
          g_points.appendChild(circle);
        }
        if (this.tl_x_coordinate.children.length < this.xs.length) {
          var tl_y_line = TL_Q.create('div', {
            'class': 'tl_y_line'
          });
          tl_y_line.innerText = TL_Utils.convertTime(this.xs[this.xs.length - 1 - i]);
          this.tl_x_coordinate.appendChild(tl_y_line);
          tl_y_line.style.right = x + 'px';
          if ((x - prev_y) > 80 || x == 0) {
            prev_y = x;
          } else {
            TL_Q.addClassName(
              [tl_y_line],
              'tl_graphic_hide'
            );
          }
        }
      }
      x += this.compress_x;
    }
    TL_Q.attrs(polyline, {
      'points': points,
      'style': 'fill:none;stroke:' + this.color + ';stroke-width:' + this.brush_width
    });
    tl_graphic.appendChild(polyline);
    if (graphic_type) {
      TL_Q.attrs(polyline, {
        'transform': 'translate(' + x_way + ', ' + graphic_height + ') scale(1, -1)'
      });
      if (this.canvas) {
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      } else {
        TL_Q.attrs(g_points, {
          'transform': 'translate(' + x_way + ', 0)'
        });
        tl_graphic.appendChild(g_points);
      }
    } else {
      TL_Q.attrs(polyline, {
        'transform': 'translate(0, ' + graphic_height + ') scale(1, -1)'
      });
    }
  },
  /**
    * Drawing points in the raster
    * @param {Element^} tl_graphic_container - box for graph
    * @param {Number} x_way - x offset
    * @param {Array<Number>} ex - graphs exclusion
    */
  drawCanvasPoints: function(
    tl_graphic_container,
    x_way, ex
  ) {
    if (this.canvas) {
      var graphic_index = TL_Q.getIndexByClassName(tl_graphic_container, 'tl_graphic_container');
      this.max_y = this.getAxesMaxY(graphic_index);
      var _that = this;
      Array.from(
        TL_Q.$(tl_graphic_container, '.tl_graphic_points')
      ).forEach(
        function(e, index) {
          if (ex) {
            if (ex.find(index)) {
              return;
            }
          }
          index++;
          var ctx = TL_Canvas.clear(e);
          ctx.setTransform(1, 0, 0, -1, 0, e.height);
          ctx.translate(x_way, 0);
          ctx.beginPath();
          _that.xs = TL_Database[graphic_index]['columns'][0].slice();
          _that.xs.splice(0, 1);
          _that.compress_x = (_that.graphic_width / (_that.xs.length - 1)) * _that.parts_x[graphic_index];
          _that.compress_y = 70;
          _that.ys = TL_Database[graphic_index]['columns'][index].slice();
          ctx.strokeStyle = TL_Database[graphic_index]['colors'][_that.ys[0]];
          ctx.lineWidth = _that.canvas_brush_width;
          ctx.fillStyle = TL_StoreTheme.getColor(graphic_index);
          _that.ys.splice(0, 1);
          _that.step_y = _that.max_y / _that.max_parts_y;
          var x = 0, y = 0;
          for (var i = 0; i < _that.xs.length; i++) {
            y = _that.ys[i] * (_that.part_y_height() / _that.step_y);
            ctx.moveTo(x + 5, y);
            ctx.arc(x, y, 5, 0, Math.PI * 2, true);
            x += _that.compress_x;
          }
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        }
      );
    }
  },
  /**
    * Drawing button
    */
  drawButton: function() {
    var tl_graphic_buttons_cell = TL_Q.create('div', {
      'class': 'tl_graphic_buttons_cell'
    });
      var tl_graphic_button = TL_Q.create('div', {
        'class': 'tl_graphic_button'
      });
      tl_graphic_buttons_cell.appendChild(tl_graphic_button);
        var tl_checkbox_container = TL_Q.create('div', {
          'class': 'tl_checkbox_container',
          'style': 'border-color: ' + this.color + ';background: ' + this.color + ';'
        });
        tl_graphic_button.appendChild(tl_checkbox_container);
          var tl_scheckbox = TL_Q.createNS('svg', {
            'class': 'tl_scheckbox',
            'viewBox': '-295 358 78 78'
          });
          tl_checkbox_container.appendChild(tl_scheckbox);
            var tl_scheckbox_stroke = TL_Q.createNS('path', {
              'class': 'tl_scheckbox_stroke',
              'd': 'M-273.2,398.2l10,9.9 l22.4-22.3'
            });
            tl_scheckbox.appendChild(tl_scheckbox_stroke);
          var tl_checkbox = TL_Q.create('input', {
            'type': 'checkbox',
            'class': 'tl_checkbox',
            'checked': 'checked'
          });
          tl_checkbox_container.appendChild(tl_checkbox);
          var tl_graphic_title = TL_Q.create('span', {
            'class': 'tl_graphic_title'
          });
          tl_graphic_title.innerText = this.title;
          tl_graphic_button.appendChild(tl_graphic_title);
    this.tl_graphic_buttons_row.appendChild(tl_graphic_buttons_cell);
    this.initButton(tl_checkbox_container);
    var _that_that = this;
    tl_checkbox_container.onclick = function() {
      var _that = this;
      _that_that.buttonClick(_that);
    }
  },
  /**
    * Button click
    * @param {Element^} _that - tl_checkbox_container
    */
  buttonClick: function(_that) {
    var nums = this.getButtonNumbers(_that);
    TL_Q.removeClassName(
      [_that],
      'tl_checkbox_container--animation'
    );
    setTimeout(function() {
      TL_Q.addClassName(
        [_that],
        'tl_checkbox_container--animation'
      );
    });
    var tl_checkbox = _that.getElementsByClassName('tl_checkbox')[0];
    if (_that.style.backgroundColor == _that.style.borderColor) {
      _that.style.backgroundColor = 'transparent';
      tl_checkbox.checked = false;
      this.hidePolyline(
        nums[0], nums[1]
      );
    } else {
      _that.style.backgroundColor = _that.style.borderColor;
      tl_checkbox.checked = true;
      this.showPolyline(
        nums[0], nums[1]
      );
    }
  },
  /**
    * initialization button
    * @param {Element^} _that - tl_checkbox_container
    */
  initButton: function(_that) {
    var nums = this.getButtonNumbers(_that);
    if (TL_StoreDisplay.getState(nums[0], nums[1])) {
      this.buttonClick(_that);
    }
  },
  /**
    * Get button numbers pair
    * @param {Element^} _that - tl_checkbox_container
    * @return {Array}
    */
  getButtonNumbers: function(_that) {
    return [
      TL_Q.getIndexByClassName(
        TL_Q.getParentByClassName(_that, 'tl_graphic_container'),
        'tl_graphic_container'
      ), TL_Q.getIndexByClassName(
        TL_Q.getParentByClassName(_that, 'tl_graphic_buttons_cell'),
        'tl_graphic_buttons_cell'
      )
    ];
  },
  /**
    * Showing polyline
    * @param {Number} num_c - number of graph
    * @param {Number} num_p - number of polyline
    */
  showPolyline: function(num_c, num_p) {
    var minigraphic = TL_Q.$(document, '.tl_minigraphic_main')[num_c];
    TL_Q.removeClassName(
      [TL_Q.$(minigraphic, 'polyline')[num_p]],
      'tl_graphic_hide'
    );
    var graphic = TL_Q.$(document, '.tl_graphic_main')[num_c];
    TL_Q.removeClassName(
      [TL_Q.$(graphic, 'polyline')[num_p]],
      'tl_graphic_hide'
    );
    if (this.canvas) {
      //TODO:: Canvas-points reload
    } else {
      TL_Q.removeClassName(
        [TL_Q.$(graphic, '.g_points')[num_p]],
        'tl_graphic_hide'
      );
    }
    TL_StoreDisplay.setVisible(num_c, num_p);
  },
  /**
    * Hiding polyline
    * @param {Number} num_c - number of graph
    * @param {Number} num_p - number of polyline
    */
  hidePolyline: function(num_c, num_p) {
    var minigraphic = TL_Q.$(document, '.tl_minigraphic_main')[num_c];
    TL_Q.addClassName(
      [TL_Q.$(minigraphic, 'polyline')[num_p]],
      'tl_graphic_hide'
    );
    var graphic = TL_Q.$(document, '.tl_graphic_main')[num_c];
    TL_Q.addClassName(
      [TL_Q.$(graphic, 'polyline')[num_p]],
      'tl_graphic_hide'
    );
    if (this.canvas) {
      // TODO:: Canvas-points reload
    } else {
      TL_Q.addClassName(
        [TL_Q.$(graphic, '.g_points')[num_p]],
        'tl_graphic_hide'
      );
    }
    TL_StoreDisplay.setInvisible(num_c, num_p);
  },
  /**
    * Show nameplate
    * @param {Element^} _that - circle
    */
  showNameplate: function(_that) {
    var index_circle = TL_Q.getIndexByClassName(_that, 'g_circle');
    var tl_graphic_main = TL_Q.getParentByClassName(_that, 'tl_graphic_main');
    var arr_g_points = TL_Q.$(tl_graphic_main, '.g_points');
    Array.from(arr_g_points).forEach(
      function(e) {
        TL_Q.addClassName(
          [e.children[index_circle]],
          'g_circle_parallel'
        );
      }
    );
    var tl_graphic_grid = TL_Q.getParentByClassName(_that, 'tl_graphic_grid');
    var tl_graphic_container_nameplate = TL_Q.$(tl_graphic_grid, '.tl_graphic_container_nameplate')[0];
    TL_Q.removeClassName(
      [tl_graphic_container_nameplate],
      'tl_graphic_hide'
    );
    var num_c = TL_Q.getIndexByClassName(
      TL_Q.getParentByClassName(_that, 'tl_graphic_container'),
      'tl_graphic_container'
    );
    var tl_graphic_nameplate_x = TL_Q.$(tl_graphic_container_nameplate, '.tl_graphic_nameplate_x')[0];
    index_circle++;
    tl_graphic_nameplate_x.innerText = TL_Utils.convertTimeWithDay(TL_Database[num_c]['columns'][0][index_circle]);
    var tl_graphic_nameplate_y = TL_Q.$(tl_graphic_container_nameplate, '.tl_graphic_nameplate_y')[0];
    tl_graphic_nameplate_y.innerHTML = '';
    var data = TL_Database[num_c]['columns'].slice();
    data.splice(0, 1);
    data.forEach(
      function(element, index) {
        var tl_graphic_nameplate_y_c = TL_Q.create('div', {
          'class': 'tl_graphic_nameplate_y_c'
        });
        tl_graphic_nameplate_y_c.innerText = element[index_circle];
        tl_graphic_nameplate_y_c.style.color = TL_Database[num_c]['colors'][element[0]];
        tl_graphic_nameplate_y.appendChild(tl_graphic_nameplate_y_c);
        var tl_graphic_nameplate_y_name = TL_Q.create('div', {
          'class': 'tl_graphic_nameplate_y_name'
        });
        tl_graphic_nameplate_y_name.innerText = TL_Database[num_c]['names'][element[0]];
        tl_graphic_nameplate_y_c.appendChild(tl_graphic_nameplate_y_name);
      }
    );
    var shift = tl_graphic_container_nameplate.offsetWidth / 2 + 12;
    var g_circle_coords = TL_Utils.getCoords(_that);
    tl_graphic_container_nameplate.style.left = (g_circle_coords.left - shift) + 'px';
    var tl_graphic_container_nameplate_coords = TL_Utils.getCoords(tl_graphic_container_nameplate);
    var tl_graphic_nameplate = TL_Q.$(tl_graphic_container_nameplate, '.tl_graphic_nameplate')[0];
    var right = tl_graphic_main.getAttribute('width') - tl_graphic_nameplate.offsetWidth - tl_graphic_container_nameplate_coords.left;
    if (right < 0) {
      tl_graphic_nameplate.style.left = (right + 35) + 'px';
    } else if (tl_graphic_container_nameplate_coords.left < 0) {
      tl_graphic_nameplate.style.left = tl_graphic_container_nameplate_coords.left * (-1) + 'px';
    } else {
      tl_graphic_nameplate.style.left = '';
    }
  },
  /**
    * Hide nameplate
    * @param {Element^} _that - circle
    */
  hideNameplate: function(_that) {
    var index_circle = TL_Q.getIndexByClassName(_that, 'g_circle');
    var arr_g_points = TL_Q.$(TL_Q.getParentByClassName(_that, 'tl_graphic_main'), '.g_points');
    Array.from(arr_g_points).forEach(
      function(e) {
        TL_Q.removeClassName(
          [e.children[index_circle]],
          'g_circle_parallel'
        );
      }
    );
    var tl_graphic_grid = TL_Q.getParentByClassName(_that, 'tl_graphic_grid');
    var tl_graphic_container_nameplate = TL_Q.$(tl_graphic_grid, '.tl_graphic_container_nameplate')[0];
    TL_Q.addClassName(
      [tl_graphic_container_nameplate],
      'tl_graphic_hide'
    );
  },
  /**
    * Clear markup
    */
  clearMarkup: function() {
    Array.from(
      TL_Q.$(document, '.tl_graphic_container')
    ).forEach(function(element) {
      element.innerHTML = '';
      TL_Q.removeClassName(
        [element],
        'tl_graphic_container_dark'
      );
      var tl_graphic_head = TL_Q.create('div', {
        'class': 'tl_graphic_head'
      });
      tl_graphic_head.innerHTML = '<div>' + TL_Lang[TL_Lang.current]['followers'] + '</div>';
      element.appendChild(tl_graphic_head);
    });
    this.clear();
  },
  /**
    * Clear graphs grid
    * @param {Number} id - grid id
    */
  clearGraphic: function(id) {
    TL_Q.removeNode(
      TL_Q.$(document, '.tl_graphic_grid')[id]
    );
  },
  /**
    * Clear this
    */
  clear: function() {
    this.xs = []; this.ys = [];
    this.max_y = 0; this.color = 'transparent';
    this.title = ''; this.brush_width = 3; this.graphic = true;
    this.graphic_width = 0; this.graphic_height = 0;
    this.step_x = 0; this.step_y = 0; this.parts_x = []; this.parts_y = 5;
    this.compress_x = 50; this.compress_y = 70; this.minigraphic = true;
    this.minigraphic_width = 0; this.minigraphic_height = 0;
    this.graphic_buttons = true; this.night_mode = true;
    this.dark_theme = false; this.nameplate = true;
  },
  /**
    * Theme initialization
    * @param {Element^} _that - box for graph
    */
  initTheme: function(_that) {
    var tl_night_mode_span = TL_Q.$(_that, '.tl_night_mode span')[0];
    if (TL_StoreTheme.init(_that)) {
      this.activeDarkTheme(
        tl_night_mode_span
      );
    } else {
      this.activeDayTheme(
        tl_night_mode_span
      );
    }
  },
  /**
    * Dark theme activation
    * @param {Element^} _that - box for graph
    */
  activeDarkTheme: function(_that) {
    _that.innerHTML = TL_Lang[TL_Lang.current]['day_mode'];
    var tl_graphic_container = TL_Q.getParentByClassName(_that, 'tl_graphic_container');
    TL_Q.addClassName(
      [tl_graphic_container],
      'tl_graphic_container_dark'
    );
    TL_Q.addClassName(
      [TL_Q.$(tl_graphic_container, '.tl_graphic_head')[0]],
      'tl_graphic_head_dark'
    );
    TL_Q.replaceClassName(
      TL_Q.$(tl_graphic_container, '.tl_x_line'),
      'tl_x_line_dark'
    );
    TL_Q.addClassName(
      TL_Q.$(tl_graphic_container, '.tl_y_line'),
      'tl_y_line_dark'
    );
    TL_Q.addClassName(
      TL_Q.$(tl_graphic_container, '.tl_graphic_button'),
      'tl_graphic_button_dark'
    );
    TL_Q.addClassName(
      TL_Q.$(tl_graphic_container, '.tl_graphic_title'),
      'tl_graphic_title_dark'
    );
    TL_Q.addClassName(
      TL_Q.$(tl_graphic_container, '.g_circle'),
      'g_circle_dark'
    );
    TL_Q.addClassName(
      TL_Q.$(tl_graphic_container, '.tl_graphic_nameplate_line'),
      'tl_graphic_nameplate_line_dark'
    );
    TL_Q.addClassName(
      TL_Q.$(tl_graphic_container, '.tl_graphic_nameplate'),
      'tl_graphic_nameplate_dark'
    );
    TL_Q.addClassName(
      TL_Q.$(tl_graphic_container, '.tl_minigraphic_opacity'),
      'tl_minigraphic_opacity_dark'
    );
    TL_Q.addClassName(
      TL_Q.$(tl_graphic_container, '.tl_minigraphic_opacity_right'),
      'tl_minigraphic_opacity_right_dark'
    );
    TL_Q.addClassName(
      TL_Q.$(tl_graphic_container, '.tl_minigraphic_scroller'),
      'tl_minigraphic_scroller_dark'
    );
    TL_Q.addClassName(
      TL_Q.$(tl_graphic_container, '.tl_minigraphic_scroller_spinner'),
      'tl_minigraphic_scroller_spinner_dark'
    );
    TL_StoreTheme.setDark(tl_graphic_container);
    _that.dark_theme = true;
  },
  /**
    * Day theme activation
    * @param {Element^} _that - box for graph
    */
  activeDayTheme: function(_that) {
    _that.innerHTML = TL_Lang[TL_Lang.current]['night_mode'];
    var tl_graphic_container = TL_Q.getParentByClassName(_that, 'tl_graphic_container');
    TL_Q.removeClassName(
      [tl_graphic_container],
      'tl_graphic_container_dark'
    );
    TL_Q.removeClassName(
      [TL_Q.$(tl_graphic_container, '.tl_graphic_head')[0]],
      'tl_graphic_head_dark'
    );
    TL_Q.replaceClassName(
      TL_Q.$(tl_graphic_container, '.tl_x_line_dark'),
      'tl_x_line'
    );
    TL_Q.removeClassName(
      TL_Q.$(tl_graphic_container, '.tl_y_line'),
      'tl_y_line_dark'
    );
    TL_Q.replaceClassName(
      TL_Q.$(tl_graphic_container, '.tl_graphic_button_dark'),
      'tl_graphic_button'
    );
    TL_Q.replaceClassName(
      TL_Q.$(tl_graphic_container, '.tl_graphic_title_dark'),
      'tl_graphic_title'
    );
    TL_Q.replaceClassName(
      TL_Q.$(tl_graphic_container, '.g_circle_dark'),
      'g_circle'
    );
    TL_Q.replaceClassName(
      TL_Q.$(tl_graphic_container, '.tl_graphic_nameplate_line_dark'),
      'tl_graphic_nameplate_line'
    );
    TL_Q.replaceClassName(
      TL_Q.$(tl_graphic_container, '.tl_graphic_nameplate_dark'),
      'tl_graphic_nameplate'
    );
    TL_Q.replaceClassName(
      TL_Q.$(tl_graphic_container, '.tl_minigraphic_opacity_dark'),
      'tl_minigraphic_opacity'
    );
    TL_Q.replaceClassName(
      TL_Q.$(tl_graphic_container, '.tl_minigraphic_opacity_right_dark'),
      'tl_minigraphic_opacity_right'
    );
    TL_Q.replaceClassName(
      TL_Q.$(tl_graphic_container, '.tl_minigraphic_scroller_dark'),
      'tl_minigraphic_scroller'
    );
    TL_Q.replaceClassName(
      TL_Q.$(tl_graphic_container, '.tl_minigraphic_scroller_spinner_dark'),
      'tl_minigraphic_scroller_spinner'
    );
    TL_StoreTheme.setDay(tl_graphic_container);
    _that.dark_theme = false;
  }
};
window.onload = function() {
  TL_Graphic.draw();
};
(function() {
  var throttle = function(type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function() {
      if (running) { return; }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };
  throttle("resize", "optimizedResize");
})();
window.addEventListener("optimizedResize", function() {
  if (!TL_Utils.isPhone()) {
    location.reload();
  }
});
window.addEventListener("orientationchange", function() {
  location.reload();
});
