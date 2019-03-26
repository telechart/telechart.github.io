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
  setClassStyle: function(class_name, css) {
    var style_sheet = document.getElementsByName('tl_graphic_addon')[0];
    if (!style_sheet) {
      style_sheet = document.createElement('style');
      style_sheet.setAttribute('type', 'text/css');
      style_sheet.setAttribute('name', 'tl_graphic_addon');
      var head = document.getElementsByTagName('head')[0];
      if (head) {
        head.appendChild(style_sheet);
      }
    }
    if (style_sheet) {
      var cstr = '.' + class_name + ' {' + css + '}';
      var rules = document.createTextNode(cstr);
      if (style_sheet.styleSheet) {
        style_sheet.styleSheet.cssText = rules.nodeValue;
      } else {
        style_sheet.appendChild(rules);
      }
    }
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

var TL_Q = {
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
  getParentByClassName: function(e, c_n) {
    while (
      (e = e.parentNode) &&
      !e.classList.contains(c_n)
    );
    return e;
  },
  replaceClassName: function(re, ncn) {
    Array.from(re).forEach(function(e) {
      e.classList = ncn;
    });
  },
  addClassName: function(re, ncn) {
    Array.from(re).forEach(function(e) {
      e.classList += ' ' + ncn;
    });
  },
  removeClassName: function(re, ncn) {
    Array.from(re).forEach(function(e) {
      e.classList.remove(ncn);
    });
  },
  removeNode: function(e) {
    e.parentNode.removeChild(e);
  },
  insertAfter: function(e, re) {
    return re.parentNode.insertBefore(e, re.nextSibling);
  },
  attrs: function(e, attrs) {
    for (var key in attrs) {
      e.setAttribute(key, attrs[key]);
    }
  },
  getJSON: function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    return xhr;
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
  parts_x: 4,
  parts_y: 5,
  compress_x: 50,
  compress_y: 70,
  minigraphic: true,
  minigraphic_width: 0,
  minigraphic_height: 0,
  graphic_buttons: true,
  night_mode: true,
  dark_theme: false,
  nameplate: true,
  types: ['line'],
  part_y_height: function() {
    return this.compress_y + (this.parts_y - 1);
  },
  graphics_count: 0,
  cc_graphics_count: 0,
  svgns: 'http://www.w3.org/2000/svg',
  draw: function() {
    // Maybe TL_Q.getJSON('database/chart_data.json'); ?
    for (var i = 0; i < TL_Database.length; i++) {
      var tl_graphic_container = document.getElementById('tl_graphic_container_' + i);
      TL_Graphic.init(
        tl_graphic_container,
        TL_Database[i]
      );
    }
  },
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
        _that.drawAxis(false);
      }
    );
    this.graphics_count++;
  },
  drawAxis: function(draw_x) {
    this.max_y = TL_Utils.getMaxOfArray(this.ys);
    this.step_y = this.max_y / this.parts_y;
    var max_b = this.max_y;
    var max_b_b = max_b;
    var cc_graphic_coordinates = this.tl_graphic_coordinates;
    this.tl_graphic_coordinates = document.createElement('div');
    this.tl_graphic_coordinates.setAttribute('class', 'tl_graphic_coordinates');
    if (cc_graphic_coordinates && this.cc_graphics_count == this.graphics_count) {
      this.tl_graphic_coordinates.classList.add('tl_graphic_coordinates_next');
      this.tl_graphic_grid.insertBefore(this.tl_graphic_coordinates, cc_graphic_coordinates);
    } else {
      this.tl_graphic_grid.appendChild(this.tl_graphic_coordinates);
    }
    while (max_b >= 0) {
      this.tl_y_coordinate = document.createElement('div');
      this.tl_y_coordinate.setAttribute('class', 'tl_y_coordinate');
      this.tl_graphic_coordinates.appendChild(this.tl_y_coordinate);
      this.tl_x_line = document.createElement('div');
      this.tl_x_line.setAttribute('class', 'tl_x_line');
      this.tl_x_line.innerText = max_b_b;
      this.tl_y_coordinate.appendChild(this.tl_x_line);
      if (
        max_b_b == 0 &&
        draw_x
      ) {
        this.tl_x_coordinate = document.createElement('div');
        this.tl_x_coordinate.setAttribute('class', 'tl_x_coordinate');
        this.tl_y_coordinate.appendChild(this.tl_x_coordinate);
      }
      max_b -= this.step_y; // eg. 166.8 - 55.6
      max_b_b = Math.round(max_b);
    }
    this.cc_graphics_count = this.graphics_count;
  },
  drawMarkup: function() {
    this.tl_graphic_grid = document.createElement('div');
    this.tl_graphic_grid.setAttribute('class', 'tl_graphic_grid');
    TL_Q.insertAfter(
      this.tl_graphic_grid,
      document.getElementsByClassName('tl_graphic_head')[
        TL_Q.getIndexByClassName(this.container, 'tl_graphic_container')
      ]
    );
    this.drawAxis(true);
    if (this.graphic) {
      this.tl_graphic_main = document.createElementNS(this.svgns, 'svg');
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
      this.tl_minigraphic_grid = document.createElement('div');
      this.tl_minigraphic_grid.setAttribute('class', 'tl_minigraphic_grid');
      var tl_minigraphic_opacity = document.createElement('div');
      tl_minigraphic_opacity.setAttribute('class', 'tl_minigraphic_opacity');
      this.tl_minigraphic_grid.appendChild(tl_minigraphic_opacity);
      var tl_minigraphic_opacity_right = document.createElement('div');
      tl_minigraphic_opacity_right.setAttribute('class', 'tl_minigraphic_opacity_right');
      this.tl_minigraphic_grid.appendChild(tl_minigraphic_opacity_right);
      var tl_minigraphic_scroller = document.createElement('div');
      tl_minigraphic_scroller.setAttribute('class', 'tl_minigraphic_scroller');
      this.tl_minigraphic_grid.appendChild(tl_minigraphic_scroller);
      var tl_minigraphic_scroller_spinner = document.createElement('div');
      tl_minigraphic_scroller_spinner.setAttribute('class', 'tl_minigraphic_scroller_spinner');
      tl_minigraphic_scroller.appendChild(tl_minigraphic_scroller_spinner);
      var tl_minigraphic_scroller_transparent = document.createElement('div');
      tl_minigraphic_scroller_transparent.setAttribute('class', 'tl_minigraphic_scroller_transparent');
      this.tl_minigraphic_grid.appendChild(tl_minigraphic_scroller_transparent);
      this.tl_minigraphic_main = document.createElementNS(this.svgns, 'svg');
      TL_Q.attrs(this.tl_minigraphic_main, {
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
        var resize_area = 20;
        var shift_x = coords_in_block.x - scroller_coords.left;
        var minigraphic_grid_coords = TL_Utils.getCoords(minigraphic_grid);
        var flag_event = 0;
        if (
          coords_in_block.x < (scroller_coords.left + resize_area) &&
          coords_in_block.x > scroller_coords.left
        ) {
          flag_event = -1;
        } else if (
          coords_in_block.x > (scroller_coords.left + scroller.offsetWidth - resize_area) &&
          coords_in_block.x < (scroller_coords.left + scroller.offsetWidth)
        ) {
          flag_event = 1;
        }
        document.onmousemove = move;
        document.ontouchmove = move;
        function move(e) {
          var move_coords_in_block = TL_Utils.getPageXY(e);
          var new_left = move_coords_in_block.x - shift_x - minigraphic_grid_coords.left;
          if (new_left < 0) {
            new_left = 0;
          }
          switch (flag_event) {
            case -1:
              scroller.style.left = new_left + 'px';
              scroller_transparent.style.left = scroller.style.left;
              scroller_opacity.style.width = scroller.style.left;
              scroller.style.width = (minigraphic_grid.offsetWidth - scroller_opacity.offsetWidth - scroller_opacity_right.offsetWidth) + 'px';
              scroller_transparent.style.width = scroller.style.width;
              var m = (Math.pow(_that_that.max_parts_x, 2) - _that_that.max_parts_x) / (
                (minigraphic_grid.offsetWidth / scroller.offsetWidth) * _that_that.max_parts_x
              );
              _that_that.drawGraphicWithScale(
                TL_Q.getIndexByClassName(
                  TL_Q.getParentByClassName(minigraphic_grid, 'tl_graphic_container'),
                  'tl_graphic_container'
                ), (_that_that.max_parts_x - m)
              );
            break;
            case 1:
              // TODO::anything
              var new_right = minigraphic_grid.offsetWidth - move_coords_in_block.x;
              scroller_opacity_right.style.width = new_right + 'px';
              scroller.style.width = (minigraphic_grid.offsetWidth - scroller_opacity.offsetWidth - scroller_opacity_right.offsetWidth) + 'px';
              scroller_transparent.style.width = scroller.style.width;
            break;
            default:
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
              Array.from(
                tl_graphic_container.getElementsByClassName('tl_graphic_main')[0].children
              ).forEach(function(e) {
                var x = -(new_left * _that_that.parts_x);
                if (e.tagName == 'polyline') {
                  var transform = 'translate(' + x + ', ' + _that_that.graphic_height + ') scale(1, -1)';
                } else {
                  var transform = 'translate(' + x + ', 0)';
                }
                TL_Q.attrs(e, {
                  'transform': transform
                });
              });
              var x = new_right * _that_that.parts_x;
              var tl_x_coordinate = tl_graphic_container.getElementsByClassName('tl_x_coordinate')[0];
              tl_x_coordinate.style.transform = 'translate(' + x + 'px)';
          }
        }
        document.onmouseup = up;
        document.ontouchend = up;
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
      this.tl_graphic_buttons = document.createElement('div');
      this.tl_graphic_buttons.setAttribute('class', 'tl_graphic_buttons');
      this.tl_graphic_buttons_row = document.createElement('div');
      this.tl_graphic_buttons_row.setAttribute('class', 'tl_graphic_buttons_row');
      this.tl_graphic_buttons.appendChild(this.tl_graphic_buttons_row);
      this.container.appendChild(this.tl_graphic_buttons);
    }
    if (this.nameplate) {
      this.tl_graphic_container_nameplate = document.createElement('div');
      TL_Q.attrs(this.tl_graphic_container_nameplate, {
        'class': 'tl_graphic_container_nameplate tl_graphic_hide'
      });
      this.tl_graphic_grid.appendChild(this.tl_graphic_container_nameplate);
      this.tl_graphic_nameplate = document.createElement('div');
      TL_Q.attrs(this.tl_graphic_nameplate, {
        'class': 'tl_graphic_nameplate'
      });
      this.tl_graphic_container_nameplate.appendChild(this.tl_graphic_nameplate);
      this.tl_graphic_nameplate_x = document.createElement('div');
      TL_Q.attrs(this.tl_graphic_nameplate_x, {
        'class': 'tl_graphic_nameplate_x'
      });
      this.tl_graphic_nameplate.appendChild(this.tl_graphic_nameplate_x);
      this.tl_graphic_nameplate_y = document.createElement('div');
      TL_Q.attrs(this.tl_graphic_nameplate_y, {
        'class': 'tl_graphic_nameplate_y'
      });
      this.tl_graphic_nameplate.appendChild(this.tl_graphic_nameplate_y);
      this.tl_graphic_nameplate_line = document.createElement('div');
      TL_Q.attrs(this.tl_graphic_nameplate_line, {
        'class': 'tl_graphic_nameplate_line'
      });
      this.tl_graphic_container_nameplate.appendChild(this.tl_graphic_nameplate_line);
    }
    if (this.night_mode) {
      var tl_night_mode = document.createElement('div');
      tl_night_mode.setAttribute('class', 'tl_night_mode');
        var tl_night_mode_span = document.createElement('span');
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
      };
    }
  },
  drawGraphic: function() {
    if (
      this.graphic &&
      this.type.indexOf(this.types) != -1
    ) {
      this.brush_width = 3;
      this.compress_x = (this.graphic_width / (this.xs.length - 1)) * this.parts_x;
      this.compress_y = 70;
      this.drawPolyline(
        this.tl_graphic_main,
        this.graphic_height,
        true
      );
      if (this.graphic_buttons) {
        this.drawButton();
      }
    }
  },
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
  },
  drawGraphicWithScale: function(id, scale) {
    // TODO::infinity scroll for data charts
    this.clearGraphic(id);
    this.parts_x = scale;
    this.brush_width = 3;
    this.minigraphic = false;
    this.graphic_buttons = false;
    this.graphic_nameplate = false;
    this.night_mode = false;
    this.init(
      document.getElementsByClassName('tl_graphic_container')[id],
      TL_Database[id]
    );
  },
  drawPolyline: function(tl_graphic, graphic_height, graphic_type) {
    var max_y_len = TL_Utils.getLengthOfNumber(this.max_y);
    var polyline = document.createElementNS(this.svgns, 'polyline');
    var x = 0, y = 0;
    var points = '';
    if (graphic_type) {
      var g_points = document.createElementNS(this.svgns, 'g');
      TL_Q.attrs(g_points, {
        'class': 'g_points'
      });
    }
    var _that = this;
    var prev_y = 0;
    for (var i = 0; i < this.xs.length; i++) {
      y = this.ys[i] * (this.part_y_height() / this.step_y);
      points += (x + ',' + y + ' ');
      if (graphic_type) {
        var circle = document.createElementNS(this.svgns, 'circle');
        TL_Q.attrs(circle, {
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
        g_points.appendChild(circle);
        if (this.tl_x_coordinate.children.length < this.xs.length) {
          var tl_y_line = document.createElement('div');
          tl_y_line.setAttribute('class', 'tl_y_line');
          tl_y_line.innerText = TL_Utils.convertTime(this.xs[this.xs.length - 1 - i]);
          this.tl_x_coordinate.appendChild(tl_y_line);
          tl_y_line.style.right = x + 'px';
          if ((x - prev_y) > 80 || x == 0) {
            prev_y = x;
          } else {
            tl_y_line.classList.add('tl_graphic_hide');
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
      var x = -(x / this.parts_x) * (this.parts_x - 1);
      TL_Q.attrs(polyline, {
        'transform': 'translate(' + x + ', ' + graphic_height + ') scale(1, -1)'
      });
      TL_Q.attrs(g_points, {
        'transform': 'translate(' + x + ', 0)'
      });
      tl_graphic.appendChild(g_points);
    } else {
      TL_Q.attrs(polyline, {
        'transform': 'translate(0, ' + graphic_height + ') scale(1, -1)'
      });
    }
  },
  drawButton: function() {
    var tl_graphic_buttons_cell = document.createElement('div');
    tl_graphic_buttons_cell.setAttribute('class', 'tl_graphic_buttons_cell');
      var tl_graphic_button = document.createElement('div');
      tl_graphic_button.setAttribute('class', 'tl_graphic_button');
      tl_graphic_buttons_cell.appendChild(tl_graphic_button);
        var tl_checkbox_container = document.createElement('div');
        TL_Q.attrs(tl_checkbox_container, {
          'class': 'tl_checkbox_container',
          'style': 'border-color: ' + this.color + ';background: ' + this.color + ';'
        });
        tl_graphic_button.appendChild(tl_checkbox_container);
          var tl_scheckbox = document.createElementNS(this.svgns, 'svg');
          TL_Q.attrs(tl_scheckbox, {
            'class': 'tl_scheckbox',
            'viewBox': '-295 358 78 78'
          });
          tl_checkbox_container.appendChild(tl_scheckbox);
            var tl_scheckbox_stroke = document.createElementNS(this.svgns, 'path');
            TL_Q.attrs(tl_scheckbox_stroke, {
              'class': 'tl_scheckbox_stroke',
              'd': 'M-273.2,398.2l10,9.9 l22.4-22.3'
            });
            tl_scheckbox.appendChild(tl_scheckbox_stroke);
          var tl_checkbox = document.createElement('input');
          TL_Q.attrs(tl_checkbox, {
            'type': 'checkbox',
            'class': 'tl_checkbox',
            'checked': 'checked'
          });
          tl_checkbox_container.appendChild(tl_checkbox);
          var tl_graphic_title = document.createElement('span');
          tl_graphic_title.setAttribute('class', 'tl_graphic_title');
          tl_graphic_title.innerText = this.title;
          tl_graphic_button.appendChild(tl_graphic_title);
    this.tl_graphic_buttons_row.appendChild(tl_graphic_buttons_cell);
    var _that = this;
    tl_checkbox_container.onclick = function() {
      this.classList.remove('tl_checkbox_container--animation');
      // Maybe void?
      var _that_that = this;
      setTimeout(function() {
        _that_that.classList.add('tl_checkbox_container--animation');
      });
      var num_c = TL_Q.getIndexByClassName(
        TL_Q.getParentByClassName(this, 'tl_graphic_container'),
        'tl_graphic_container'
      );
      var num_p = TL_Q.getIndexByClassName(
        TL_Q.getParentByClassName(this, 'tl_graphic_buttons_cell'),
        'tl_graphic_buttons_cell'
      );
      if (this.style.backgroundColor == this.style.borderColor) {
        this.style.backgroundColor = 'transparent';
        tl_checkbox.checked = false;
        _that.hidePolyline(
          num_c, num_p
        );
      } else {
        this.style.backgroundColor = this.style.borderColor;
        tl_checkbox.checked = true;
        _that.showPolyline(
          num_c, num_p
        );
      }
    }
  },
  showPolyline: function(num_c, num_p) {
    var minigraphic = document.getElementsByClassName('tl_minigraphic_main')[num_c];
    minigraphic.getElementsByTagName('polyline')[num_p].classList.remove('tl_graphic_hide');
    var graphic = document.getElementsByClassName('tl_graphic_main')[num_c];
    graphic.getElementsByTagName('polyline')[num_p].classList.remove('tl_graphic_hide');
    graphic.getElementsByClassName('g_points')[num_p].classList.remove('tl_graphic_hide');
  },
  hidePolyline: function(num_c, num_p) {
    var minigraphic = document.getElementsByClassName('tl_minigraphic_main')[num_c];
    minigraphic.getElementsByTagName('polyline')[num_p].classList.add('tl_graphic_hide');
    var graphic = document.getElementsByClassName('tl_graphic_main')[num_c];
    graphic.getElementsByTagName('polyline')[num_p].classList.add('tl_graphic_hide');
    graphic.getElementsByClassName('g_points')[num_p].classList.add('tl_graphic_hide');
  },
  showNameplate: function(_that) {
    var index_circle = TL_Q.getIndexByClassName(_that, 'g_circle');
    var tl_graphic_main = TL_Q.getParentByClassName(_that, 'tl_graphic_main');
    var arr_g_points = tl_graphic_main.getElementsByClassName('g_points');
    Array.from(arr_g_points).forEach(
      function(e) {
        e.children[index_circle].classList.add('g_circle_parallel');
      }
    );
    var tl_graphic_grid = TL_Q.getParentByClassName(_that, 'tl_graphic_grid');
    var tl_graphic_container_nameplate = tl_graphic_grid.getElementsByClassName('tl_graphic_container_nameplate')[0];
    tl_graphic_container_nameplate.classList.remove('tl_graphic_hide');
    // nameplate data
    var num_c = TL_Q.getIndexByClassName(
      TL_Q.getParentByClassName(_that, 'tl_graphic_container'),
      'tl_graphic_container'
    );
    var tl_graphic_nameplate_x = tl_graphic_container_nameplate.getElementsByClassName('tl_graphic_nameplate_x')[0];
    index_circle++;
    tl_graphic_nameplate_x.innerText = TL_Utils.convertTimeWithDay(TL_Database[num_c]['columns'][0][index_circle]);
    var tl_graphic_nameplate_y = tl_graphic_container_nameplate.getElementsByClassName('tl_graphic_nameplate_y')[0];
    tl_graphic_nameplate_y.innerHTML = '';
    var data = TL_Database[num_c]['columns'].slice();
    data.splice(0, 1);
    data.forEach(
      function(element, index) {
        var tl_graphic_nameplate_y_c = document.createElement('div');
        TL_Q.attrs(tl_graphic_nameplate_y_c, {
          'class': 'tl_graphic_nameplate_y_c'
        });
        tl_graphic_nameplate_y_c.innerText = element[index_circle];
        tl_graphic_nameplate_y_c.style.color = TL_Database[num_c]['colors'][element[0]];
        tl_graphic_nameplate_y.appendChild(tl_graphic_nameplate_y_c);
        var tl_graphic_nameplate_y_name = document.createElement('div');
        TL_Q.attrs(tl_graphic_nameplate_y_name, {
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
    var tl_graphic_nameplate = tl_graphic_container_nameplate.getElementsByClassName('tl_graphic_nameplate')[0];
    var right = tl_graphic_main.getAttribute('width') - tl_graphic_nameplate.offsetWidth - tl_graphic_container_nameplate_coords.left;
    if (right < 0) {
      tl_graphic_nameplate.style.left = (right + 35) + 'px';
    } else if (tl_graphic_container_nameplate_coords.left < 0) {
      tl_graphic_nameplate.style.left = tl_graphic_container_nameplate_coords.left * (-1) + 'px';
    } else {
      tl_graphic_nameplate.style.left = '';
    }
    // end nameplate data
  },
  hideNameplate: function(_that) {
    var index_circle = TL_Q.getIndexByClassName(_that, 'g_circle');
    var arr_g_points = TL_Q.getParentByClassName(_that, 'tl_graphic_main')
    .getElementsByClassName('g_points');
    Array.from(arr_g_points).forEach(
      function(e) {
        e.children[index_circle].classList.remove('g_circle_parallel');
      }
    );
    var tl_graphic_grid = TL_Q.getParentByClassName(_that, 'tl_graphic_grid');
    var tl_graphic_container_nameplate = tl_graphic_grid.getElementsByClassName('tl_graphic_container_nameplate')[0];
    tl_graphic_container_nameplate.classList.add('tl_graphic_hide');
  },
  clearAll: function() {
    Array.from(
      document.getElementsByClassName('tl_graphic_container')
    ).forEach(function(element) {
      element.innerHTML = '';
      // You can use a stack to store the current boxing theme
      element.classList.remove('tl_graphic_container_dark');
      var tl_graphic_head = document.createElement('div');
      tl_graphic_head.setAttribute('class', 'tl_graphic_head');
      tl_graphic_head.innerHTML = '<div>' + TL_Lang[TL_Lang.current]['followers'] + '</div>';
      element.appendChild(tl_graphic_head);
    });
    this.clear();
  },
  clearGraphic: function(id) {
    TL_Q.removeNode(
      document.getElementsByClassName('tl_graphic_grid')[id]
    );
  },
  clear: function() {
    this.xs = []; this.ys = [];
    this.max_y = 0; this.color = 'transparent';
    this.title = ''; this.brush_width = 3; this.graphic = true;
    this.graphic_width = 0; this.graphic_height = 0;
    this.step_x = 0; this.step_y = 0; this.parts_x = 5; this.parts_y = 5;
    this.compress_x = 50; this.compress_y = 70; this.minigraphic = true;
    this.minigraphic_width = 0; this.minigraphic_height = 0;
    this.graphic_buttons = true; this.night_mode = true;
    this.dark_theme = false; this.nameplate = true;
  },
  activeDarkTheme: function(_that) {
    _that.innerHTML = TL_Lang[TL_Lang.current]['day_mode'];
    var tl_graphic_container = TL_Q.getParentByClassName(_that, 'tl_graphic_container');
    tl_graphic_container.classList += ' tl_graphic_container_dark';
    tl_graphic_container.getElementsByClassName('tl_graphic_head')[0].classList.add('tl_graphic_head_dark');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_x_line'), 'tl_x_line_dark');
    TL_Q.addClassName(tl_graphic_container.getElementsByClassName('tl_y_line'), 'tl_y_line_dark');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_graphic_button'), 'tl_graphic_button_dark');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_graphic_title'), 'tl_graphic_title_dark');
    TL_Q.addClassName(tl_graphic_container.getElementsByClassName('g_circle'), 'g_circle_dark');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_graphic_nameplate_line'), 'tl_graphic_nameplate_line_dark');
    TL_Q.addClassName(tl_graphic_container.getElementsByClassName('tl_graphic_nameplate'), 'tl_graphic_nameplate_dark');
    TL_Q.addClassName(tl_graphic_container.getElementsByClassName('tl_minigraphic_opacity'), 'tl_minigraphic_opacity_dark');
    TL_Q.addClassName(tl_graphic_container.getElementsByClassName('tl_minigraphic_opacity_right'), 'tl_minigraphic_opacity_right_dark');
    TL_Q.addClassName(tl_graphic_container.getElementsByClassName('tl_minigraphic_scroller'), 'tl_minigraphic_scroller_dark');
    TL_Q.addClassName(tl_graphic_container.getElementsByClassName('tl_minigraphic_scroller_spinner'), 'tl_minigraphic_scroller_spinner_dark');
    _that.dark_theme = true;
  },
  activeDayTheme: function(_that) {
    _that.innerHTML = TL_Lang[TL_Lang.current]['night_mode'];
    var tl_graphic_container = TL_Q.getParentByClassName(_that, 'tl_graphic_container');
    tl_graphic_container.classList.remove('tl_graphic_container_dark');
    tl_graphic_container.getElementsByClassName('tl_graphic_head')[0].classList.remove('tl_graphic_head_dark');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_x_line_dark'), 'tl_x_line');
    TL_Q.removeClassName(tl_graphic_container.getElementsByClassName('tl_y_line'), 'tl_y_line_dark');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_graphic_button_dark'), 'tl_graphic_button');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_graphic_title_dark'), 'tl_graphic_title');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('g_circle_dark'), 'g_circle');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_graphic_nameplate_line_dark'), 'tl_graphic_nameplate_line');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_graphic_nameplate_dark'), 'tl_graphic_nameplate');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_minigraphic_opacity_dark'), 'tl_minigraphic_opacity');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_minigraphic_opacity_right_dark'), 'tl_minigraphic_opacity_right');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_minigraphic_scroller_dark'), 'tl_minigraphic_scroller');
    TL_Q.replaceClassName(tl_graphic_container.getElementsByClassName('tl_minigraphic_scroller_spinner_dark'), 'tl_minigraphic_scroller_spinner');
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
