/*
	The MIT License (MIT)

	Copyright (c) 2015 Fernando Bevilacqua

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Namespace for the asset finder plugin
var SoundCentral = SoundCentral || {};

// Namespace for panels
SoundCentral.Panel = SoundCentral.Panel || {};
/**
 * The main panel to be displayed when the user clicks the
 * sound central icon.
 */
SoundCentral.Panel.Main = function() {
    // Call constructor of base class
    Codebot.Panel.call(this, 'SFX and Music');

    this.mParameters = {
        g_envelope: {group: 'Envelope'},
        p_env_attack: {label: 'Attack time', unit: function (v) { return (v / 44100).toPrecision(4) + ' s' }, convert: function (v) { return v * v * 100000.0 }},
        p_env_sustain: {label: 'Sustain time', unit: function (v) { return (v / 44100).toPrecision(4) + ' s' }, convert: function (v) { return v * v * 100000.0 }},
        p_env_punch: {label: 'Sustain punch', unit: function (v) { return '+' + (v * 100).toPrecision(4) + '%'}, convert: function (v) { return v }},
        p_env_decay: {label: 'Decay time', unit: function (v) { return (v / 44100).toPrecision(4) + ' s' }, convert: function (v) { return v }},

        g_frequency: {group: 'Frequency'},
        p_base_freq: {label: 'Start', unit: 'Hz', convert: function (v) { return 8 * 44100 * (v * v + 0.001) / 100 }},
        p_freq_limit: {label: 'Min cutoff', unit: 'Hz', convert: function (v) { return 8 * 44100 * (v * v + 0.001) / 100 }},
        p_freq_ramp: {label: 'Slide', unit: function (v) { return (44100*Math.log(v)/Math.log(0.5)).toPrecision(4) + ' 8va/s'; }, convert: function (v) { return 1.0 - Math.pow(v, 3.0) * 0.01 }, signed: true},
        p_freq_dramp: {label: 'Delta slide', unit: function (v) { return (v*44100 / Math.pow(2, -44101./44100)).toPrecision(4) +' 8va/s&sup2;'; }, convert: function (v) { return -Math.pow(v, 3.0) * 0.000001 }, signed: true},

        g_vibrato: {group: 'Vibrato'},
        p_vib_strength: {label: 'Depth', unit: function (v) { return v === 0 ? 'OFF' : '&plusmn; ' + (v*100).toPrecision(4) + '%' }, convert: function (v) { return v * 0.5 }},
        p_vib_speed: {label: 'Speed', unit: function (v) { return v === 0 ? 'OFF' : (441000/64. * v).toPrecision(4) + ' Hz'}, convert: function (v) { return Math.pow(v, 2.0) * 0.01 }},

        g_arpeggiation: {group: 'Arpeggiation'},
        p_arp_mod: {label: 'Freq. mult', unit: function (v) { return ((v === 1) ? 'OFF' : 'x ' + (1./v).toPrecision(4)) }, convert: function (v) { return v >= 0 ? (1.0 - Math.pow(v, 2) * 0.9) : (1.0 + Math.pow(v, 2) * 10); }, signed: true},
        p_arp_speed: {label: 'Change speed', unit: function (v) { return (v === 0 ? 'OFF' : (v / 44100).toPrecision(4) +' s') }, convert: function (v) { return (v === 1.0) ? 0 : Math.floor(Math.pow(1.0 - v, 2.0) * 20000 +32)}},

        g_duty_cycle: {group: 'Duty Cycle'},
        p_duty: {label: 'Duty cycle', unit: function (v) { return (100 * v).toPrecision(4) + '%'; }, convert: function (v) { return 0.5 - v * 0.5; }},
        p_duty_ramp: {label: 'Sweep', unit: function (v) { return (8 * 44100 * v).toPrecision(4) +'%/s'}, convert: function (v) { return -v * 0.00005 }, signed: true},

        g_retrigger: {group: 'Retrigger'},
        p_repeat_speed: {label: 'Rate', unit: function (v) { return v === 0 ? 'OFF' : (44100/v).toPrecision(4) + ' Hz' }, convert: function (v) { return (v === 0) ? 0 : Math.floor(Math.pow(1-v, 2) * 20000) + 32 }},

        g_flanger: {group: 'Flanger'},
        p_pha_ramp: {label: 'Sweep', unit: function (v) { return v === 0 ? 'OFF' : (1000*v).toPrecision(4) + ' ms/s' }, convert: function (v) { return (v < 0 ? -1 : 1) * Math.pow(v,2) }},

        g_low_pass_filter: {group: 'Low-Pass Filter'},
        p_pha_offset: {label: 'Offset', unit: function (v) { return v === 0 ? 'OFF' : (1000*v/44100).toPrecision(4) + ' ms' } , convert: function (v) { return (v < 0 ? -1 : 1) * Math.pow(v,2)*1020 }, signed: true},
        p_lpf_freq: {label: 'Cutoff freq.', unit: function (v) { return (v === .1) ? 'OFF' : Math.round(8 * 44100 * v / (1-v)) + ' Hz'; }, convert: function (v) { return Math.pow(v, 3) * 0.1 }, signed: true},
        p_lpf_ramp: {label: 'Cutoff sweep', unit: function (v) {  if (v === 1) return 'OFF'; return Math.pow(v, 44100).toPrecision(4) + ' ^s'; }, convert: function (v) { return 1.0 + v * 0.0001 }, signed: true},
        p_lpf_resonance: {label: 'Resonance', unit: function (v) { return (100*(1-v*.11)).toPrecision(4)+'%';}, convert: function (v) { return 5.0 / (1.0 + Math.pow(v, 2) * 20) }},

        g_high_pass_filter: {group: 'High-Pass Filter'},
        p_hpf_freq: {label: 'Cutoff freq.', unit: function (v) { return (v === 0) ? 'OFF' : Math.round(8 * 44100 * v / (1-v)) + ' Hz'; }, convert: function (v) { return Math.pow(v, 2) * 0.1 }},
        p_hpf_ramp: {label: 'Cutoff sweep', unit: function (v) {  if (v === 1) return 'OFF'; return Math.pow(v, 44100).toPrecision(4) + ' ^sec'; }, convert: function (v) { return 1.0 + v * 0.0003 }, signed: true},

        g_volume: {group: 'Volume'},
        p_label: {label: 'Value', unit: function (v) { v = 10 * Math.log(v*v) / Math.log(10); var sign = v >= 0 ? '+' : ''; return sign + v.toPrecision(4) + ' dB'; }, convert: function (v) { return Math.exp(v) - 1; }}
    }
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
SoundCentral.Panel.Main.prototype = Object.create(Codebot.Panel.prototype);
SoundCentral.Panel.Main.prototype.constructor = SoundCentral.Panel.Main;

Params.prototype.query = function() {
  var result = "";
  var that = this;
  $.each(this, function (key,value) {
    if (that.hasOwnProperty(key))
      result += "&" + key + "=" + value;
  });
  return result.substring(1);
};

var PARAMS;
var SOUND;
var SOUND_VOL = 0.25;
var SAMPLE_RATE = 44100;
var SAMPLE_SIZE = 8;

SoundCentral.Panel.Main.prototype.gen = function(fx) {
  PARAMS = new Params();
  PARAMS.sound_vol = SOUND_VOL;
  PARAMS.sample_rate = SAMPLE_RATE;
  PARAMS.sample_size = SAMPLE_SIZE;
  PARAMS[fx]();
  $("#wav").text(fx + ".wav");
  this.updateUi();
  this.play();
};

SoundCentral.Panel.Main.prototype.mut = function() {
  PARAMS.mutate();
  this.updateUi();
  this.play();
};

SoundCentral.Panel.Main.prototype.play = function(noregen) {
  setTimeout(function () {
    var audio = new Audio();
    if (!noregen) {
      SOUND = new SoundEffect(PARAMS).generate();
      $("#file_size").text(Math.round(SOUND.wav.length / 1024) + "kB");
      $("#num_samples").text(SOUND.header.subChunk2Size /
                             (SOUND.header.bitsPerSample >> 3));
      $("#clipping").text(SOUND.clipping);
    }
    audio.src = SOUND.dataURI;
    $("#wav").attr("href", SOUND.dataURI);
    $("#sfx").attr("href", "sfx.wav?" + PARAMS.query());
    audio.play();
  }, 0);
}

SoundCentral.Panel.Main.prototype.disenable = function() {
  var duty = PARAMS.wave_type == SQUARE || PARAMS.wave_type == SAWTOOTH;
  //$("#p_duty").slider("option", "disabled", !duty);
  //$("#p_duty_ramp").slider("option", "disabled", !duty);
}

SoundCentral.Panel.Main.prototype.updateUi = function() {
  $.each(PARAMS, function (param, value) {
    if (param == "wave_type") {
      $("#shape input:radio[value=" + value + "]").
        prop('checked', true).button("refresh");
    } else if (param == "sample_rate") {
      $("#hz input:radio[value=" + value + "]").
        prop('checked', true).button("refresh");
    } else if (param == "sample_size") {
      $("#bits input:radio[value=" + value + "]").
        prop('checked', true).button("refresh");
    } else {
      var id = "#" + param;
      //$(id).slider("value", 1000 * value);
      //$(id).each(function(){this.convert(this, PARAMS[this.id]);});
    }
  });
  this.disenable();
};

SoundCentral.Panel.Main.prototype.initUI = function() {
    var aSelf = this;
  $("#shape").buttonset();
  $("#hz").buttonset();
  $("#bits").buttonset();
  $("#shape input:radio").change(function (event) {
    PARAMS.wave_type = parseInt(event.target.value);
    aSelf.disenable();
    aSelf.play();
  });
  $("#hz input:radio").change(function (event) {
    SAMPLE_RATE = PARAMS.sample_rate = parseInt(event.target.value);
    aSelf.play();
  });
  $("#bits input:radio").change(function (event) {
    SAMPLE_SIZE = PARAMS.sample_size = parseInt(event.target.value);
    aSelf.play();
  });
  $("button").button();
  $(".slider").slider({
    value: 1000,
    min: 0,
    max: 1000,
    slide: function (event, ui) {
      aSelf.convert(event.target, ui.value / 1000.0);
    },
    change: function(event, ui) {
      if (event.originalEvent) {
        PARAMS[event.target.id] = ui.value / 1000.0;
        aSelf.convert(event.target, PARAMS[event.target.id]);
        aSelf.play();
      }
    }
  });
  $(".slider").filter(".signed").
    slider("option", "min", -1000).
    slider("value", 0);
    $('.slider').each(function () {
      var is = this.id;
      if (!$('label[for="' + is + '"]').length)
        $(this).parent().parent().find('th').append($('<label>',
                                                      {for: is}));
    });

    $('input[type=range]').each(function (theIndex, theElement) {
        //$(theElement).parent().append($('<label for="' + this.id + '">test</label>'));

        $(theElement).on('input change', function(theEvent) {
            PARAMS[theEvent.target.id] = $(this).val() / 1000.0;
            aSelf.convert(theEvent.target, PARAMS[theEvent.target.id]);

            if(theEvent.type == 'change') {
                aSelf.play();
            }
        });
    });

  var UNITS = {
    p_env_attack:  function (v) { return (v / 44100).toPrecision(4) + ' sec' },
    p_env_sustain: function (v) { return (v / 44100).toPrecision(4) + ' sec' },
    p_env_punch:   function (v) { return '+' + (v * 100).toPrecision(4) + '%'},
    p_env_decay:   function (v) { return (v / 44100).toPrecision(4) + ' sec' },

    p_base_freq:  'Hz',
    p_freq_limit: 'Hz',
    p_freq_ramp:  function (v) {
      return (44100*Math.log(v)/Math.log(0.5)).toPrecision(4) + ' 8va/sec'; },
    p_freq_dramp: function (v) {
      return (v*44100 / Math.pow(2, -44101./44100)).toPrecision(4) +
        ' 8va/sec^2?'; },

    p_vib_speed:    function (v) { return v === 0 ? 'OFF' :
                                   (441000/64. * v).toPrecision(4) + ' Hz'},
    p_vib_strength: function (v) { return v === 0 ? 'OFF' :
                                   '&plusmn; ' + (v*100).toPrecision(4) + '%' },

    p_arp_mod:   function (v) { return ((v === 1) ? 'OFF' :
                                        'x ' + (1./v).toPrecision(4)) },
    p_arp_speed: function (v) { return (v === 0 ? 'OFF' :
                                        (v / 44100).toPrecision(4) +' sec') },

    p_duty:      function (v) { return (100 * v).toPrecision(4) + '%'; },
    p_duty_ramp: function (v) { return (8 * 44100 * v).toPrecision(4) +'%/sec'},

    p_repeat_speed: function (v) { return v === 0 ? 'OFF' :
                                   (44100/v).toPrecision(4) + ' Hz' },

    p_pha_offset: function (v) { return v === 0 ? 'OFF' :
                                 (1000*v/44100).toPrecision(4) + ' msec' },
    // Not so sure about this:
    p_pha_ramp:   function (v) { return v === 0 ? 'OFF' :
                 (1000*v).toPrecision(4) + ' msec/sec' },

    p_lpf_freq:   function (v) {
      return (v === .1) ? 'OFF' : Math.round(8 * 44100 * v / (1-v)) + ' Hz'; },
    p_lpf_ramp:  function (v) {  if (v === 1) return 'OFF';
      return Math.pow(v, 44100).toPrecision(4) + ' ^sec'; },
    p_lpf_resonance: function (v) { return (100*(1-v*.11)).toPrecision(4)+'%';},

    p_hpf_freq:   function (v) {
      return (v === 0) ? 'OFF' : Math.round(8 * 44100 * v / (1-v)) + ' Hz'; },
    p_hpf_ramp: function (v) {  if (v === 1) return 'OFF';
      return Math.pow(v, 44100).toPrecision(4) + ' ^sec'; },

    sound_vol: function (v) {
      v = 10 * Math.log(v*v) / Math.log(10);
      var sign = v >= 0 ? '+' : '';
      return sign + v.toPrecision(4) + ' dB';
    }
  };

  var CONVERSIONS = {
    p_env_attack:  function (v) { return v * v * 100000.0 },
    p_env_sustain: function (v) { return v * v * 100000.0 },
    p_env_punch:   function (v) { return v },
    p_env_decay:   function (v) { return v * v * 100000.0 },

    p_base_freq:  function (v) { return 8 * 44100 * (v * v + 0.001) / 100 },
    p_freq_limit: function (v) { return 8 * 44100 * (v * v + 0.001) / 100 },
    p_freq_ramp:  function (v) { return 1.0 - Math.pow(v, 3.0) * 0.01 },
    p_freq_dramp: function (v) { return -Math.pow(v, 3.0) * 0.000001 },

    p_vib_speed:    function (v) { return Math.pow(v, 2.0) * 0.01 },
    p_vib_strength: function (v) { return v * 0.5 },

    p_arp_mod:   function (v) {
      return v >= 0 ? 1.0 - Math.pow(v, 2) * 0.9 : 1.0 + Math.pow(v, 2) * 10; },
    p_arp_speed: function (v) { return (v === 1.0) ? 0 :
                                Math.floor(Math.pow(1.0 - v, 2.0) * 20000 +32)},

    p_duty:      function (v) { return 0.5 - v * 0.5; },
    p_duty_ramp: function (v) { return -v * 0.00005 },

    p_repeat_speed: function (v) { return (v === 0) ? 0 :
                                   Math.floor(Math.pow(1-v, 2) * 20000) + 32 },

    p_pha_offset: function (v) { return (v < 0 ? -1 : 1) * Math.pow(v,2)*1020 },
    p_pha_ramp:   function (v) { return (v < 0 ? -1 : 1) * Math.pow(v,2) },

    p_lpf_freq:   function (v) { return Math.pow(v, 3) * 0.1 },
    p_lpf_ramp:   function (v) { return 1.0 + v * 0.0001 },
    p_lpf_resonance: function (v) { return 5.0 / (1.0 + Math.pow(v, 2) * 20) }, // * (0.01 + fltw);

    p_hpf_freq: function (v) { return Math.pow(v, 2) * 0.1 },
    p_hpf_ramp: function (v) { return 1.0 + v * 0.0003 },

    sound_vol: function (v) { return Math.exp(v) - 1; }
  };
  for (var p in CONVERSIONS) {
    var control = $('#' + p)[0];
    control.convert = CONVERSIONS[p];
    control.units = UNITS[p];
  }

  this.gen("pickupCoin");

  $('#sound-central-generators button').click(function() {
        aSelf.gen($(this).data('generator'));
  });
};

SoundCentral.Panel.Main.prototype.convert = function(control, v) {
  if (control.convert) {
    v = control.convert(v);
    control.convertedValue = v;
    if (typeof control.units === 'function')
      v = control.units(v);
    else
      v = v.toPrecision(4) + ' ' + control.units;
    $('label[for="' + control.id + '"]').html(v);
  }
};

SoundCentral.Panel.Main.prototype.render = function() {
    var aSelf = this,
        aParam,
        aItem,
        aContent = '';

    Codebot.Panel.prototype.render.call(this);

    this.divider('Generators');
    this.row(
        '<div id="sound-central-generators">' +
            '<button class="square" data-generator="pickupCoin"><i class="fa fa-star"></i><label>Pickup</label></button>' +
            '<button class="square" data-generator="laserShoot"><i class="fa fa-fire"></i><label>Shoot</label></button>' +
            '<button class="square" data-generator="explosion"><i class="fa fa-bomb"></i><label>Explosion</label></button>' +
            '<button class="square" data-generator="powerUp"><i class="fa fa-bolt"></i><label>PowerUp</label></button>' +
            '<button class="square" data-generator="hitHurt"><i class="fa fa-legal"></i><label>Hit</label></button>' +
            '<button class="square" data-generator="jump"><i class="fa fa-level-up"></i><label>Jump</label></button>' +
            '<button class="square" data-generator="blipSelect"><i class="fa fa-bell"></i><label>Blip</label></button>' +
            '<button class="square" data-generator="random"><i class="fa fa-magic"></i><label>Random</label></button>' +
            '<button class="square" data-generator="tone"><i class="fa fa-phone"></i><label>Tone</label></button>' +
        '</div>'
    );

    this.divider('Sound', {icon: 'play-circle'});

    this.row(
    '<div>' +
      '<button onclick="play(true)">Play</button> <br/>' +

      '<a id="wav">sfx.wav</a> <br/>' +

      '<table id="stats">' +
      '<tr><th>File size:<td id="file_size">' +
      '<tr><th>Samples:<td id="num_samples">' +
      '<tr><th>Clipped:<td id="clipping">' +
      '</table>' +
      '</p>' +

    '<form>' +
      'Gain <label for="sound_vol"></label><br/>' +
      '<div class="slider" id="sound_vol"></div> <br/>' +
      '<br/>' +

      'Sample Rate (Hz) <br/>' +
      '<div id="hz">' +
        '<input type="radio" id="44100" value=44100 name="hz" checked="checked"/>' +
          '<label for="44100">44k</label>' +
        '<input type="radio" id="22050" value=22050 name="hz" />' +
          '<label for="22050">22k</label>' +
        '<input type="radio" id="11025" value=11025 name="hz" />' +
          '<label for="11025">11k</label>' +
        '<input type="radio" id="5512" value=5512 name="hz" />' +
          '<label for="5512">6k</label>' +
      '</div>' +

      '<br/>' +
      '<br/>' +
      'Sample size' +
      '<br/>' +
      '<div id="bits">' +
        '<input type="radio" id="16" value=16 name="bits"/>' +
          '<label for="16">16 bit</label>' +
        '<input type="radio" id="8" value=8 name="bits" checked="checked"/>' +
          '<label for="8">8 bit</label>' +
      '</div>' +
    '</form>' +
    '</div>');

    this.divider('Manual adjustments', {icon: 'sliders'});

    this.pair('Shape',
        '<select name="shape" id="shape">' +
            '<option id="square" value="0">Square</option>' +
            '<option id="sawtooth" value="1" selected="selected">Sawtooth</option>' +
            '<option id="sine" value="2">Sine</option>' +
            '<option id="noise" value="3">Noise</option>' +
        '</select>');

    for(aParam in this.mParameters) {
        aItem = this.mParameters[aParam];

        // If we find a group entry, add a new line
        if(aItem.group) {
            // If we already have content for the current group, render it now
            if(aContent != '') {
                this.row(aContent);
                aContent = '';
            }
            // Render the title of the next group
            this.row(aItem.group);

        } else {
            // Otherwise continue adding UI for the current group
            // TODO: remove in-line style?
            aContent +=
                '<ul>' +
                    '<li style="position: relative;">' +
                        '<p style="float: left; width: 35%;">' + aItem.label + '</p>' +
                        '<div style="float: left; width: 30%; margin: -10px 5px 0 5px;"><input type="range" id="' + aParam + '" min="0" max="1000" /></div>' +
                        '<label for="' + aParam + '" style="float: left; width: 30%; text-align: right;">0.000s</label>' +
                    '</li>' +
                '</ul>';
        }
    }

    // Render the group
    this.row(aContent);

    this.initUI();
};
