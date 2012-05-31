var socket, sid;
var master = false;

var bpm = 120;
var msec = timbre.utils.bpm2msec(bpm,16);
var freq = 440;
var vol = 0.6;

var syn = function(freq, vol){
  var tw1 = T("tween", "exponential.out", 300, 10000, 40).kr();
  var tw2 = T("tween", "exponential.out", 300, 0.9, 0.5).kr();

  var osc = T("+", T("tri",freq,0.4), T("saw",freq*2,0.2));
  var src = T("rHPF", tw1.bang(), tw2.bang(), osc);
  var env = T("perc",300);
  var s = T("*", src, env).play();
  env.mul = vol;
  env.addEventListener("~ended", function(){
    s.pause();
  }).bang();
};

var loop = T("interval", msec, function(i){
  if(master){
    socket.emit('don');
  }
  syn(freq, vol);
});

$(function(){
  socket = io.connect('http://localhost:12345');
  socket.on('hello',function(data){
    sid = data;
    $('title').text(sid);
  });

  socket.on('master', function(){
    master = true;
    console.log('あなたがドンカマです');
  });

  socket.on('message', function(){
    if(master===false){
      loop.off();
      loop.on();
    }
  });

	$("#start").click(function(){
    timbre.on();
    loop.on();
	});
	$("#stop").click(function(){
    loop.off();
    timbre.off();
	});

});