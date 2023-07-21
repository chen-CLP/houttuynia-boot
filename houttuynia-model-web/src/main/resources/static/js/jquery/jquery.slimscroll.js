/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.8
 *
 */
(function(a){a.fn.extend({slimScroll:function(b){var c={width:"auto",height:"250px",size:"7px",color:"#000",position:"right",distance:"1px",start:"top",opacity:0.4,alwaysVisible:false,disableFadeOut:false,railVisible:false,railColor:"#333",railOpacity:0.2,railDraggable:true,railClass:"slimScrollRail",barClass:"slimScrollBar",wrapperClass:"slimScrollDiv",allowPageScroll:false,wheelStep:20,touchScrollStep:200,borderRadius:"7px",railBorderRadius:"7px"};var d=a.extend(c,b);this.each(function(){var z,s,l,q,C,u,p,k,m="<div></div>",w=30,r=false;var D=a(this);if(D.parent().hasClass(d.wrapperClass)){var i=D.scrollTop();x=D.siblings("."+d.barClass);e=D.siblings("."+d.railClass);E();if(a.isPlainObject(b)){if("height" in b&&b.height=="auto"){D.parent().css("height","auto");D.css("height","auto");var o=D.parent().parent().height();D.parent().css("height",o);D.css("height",o)}else{if("height" in b){var v=b.height;D.parent().css("height",v);D.css("height",v)}}if("scrollTo" in b){i=parseInt(d.scrollTo)}else{if("scrollBy" in b){i+=parseInt(d.scrollBy)}else{if("destroy" in b){x.remove();e.remove();D.unwrap();return}}}y(i,false,true)}return}else{if(a.isPlainObject(b)){if("destroy" in b){return}}}d.height=(d.height=="auto")?D.parent().height():d.height;var j=a(m).addClass(d.wrapperClass).css({position:"relative",overflow:"hidden",width:d.width,height:d.height});D.css({overflow:"hidden",width:d.width,height:d.height});var e=a(m).addClass(d.railClass).css({width:d.size,height:"100%",position:"absolute",top:0,display:(d.alwaysVisible&&d.railVisible)?"block":"none","border-radius":d.railBorderRadius,background:d.railColor,opacity:d.railOpacity,zIndex:90});var x=a(m).addClass(d.barClass).css({background:d.color,width:d.size,position:"absolute",top:0,opacity:d.opacity,display:d.alwaysVisible?"block":"none","border-radius":d.borderRadius,BorderRadius:d.borderRadius,MozBorderRadius:d.borderRadius,WebkitBorderRadius:d.borderRadius,zIndex:99});var f=(d.position=="right")?{right:d.distance}:{left:d.distance};e.css(f);x.css(f);D.wrap(j);D.parent().append(x);D.parent().append(e);if(d.railDraggable){x.bind("mousedown",function(h){var F=a(document);l=true;t=parseFloat(x.css("top"));pageY=h.pageY;F.bind("mousemove.slimscroll",function(G){currTop=t+G.pageY-pageY;x.css("top",currTop);y(0,x.position().top,false)});F.bind("mouseup.slimscroll",function(G){l=false;n();F.unbind(".slimscroll")});return false}).bind("selectstart.slimscroll",function(h){h.stopPropagation();h.preventDefault();return false})}e.hover(function(){g()},function(){n()});x.hover(function(){s=true},function(){s=false});D.hover(function(){z=true;g();n()},function(){z=false;n()});D.bind("touchstart",function(F,h){if(F.originalEvent.touches.length){C=F.originalEvent.touches[0].pageY}});D.bind("touchmove",function(F){if(!r){F.originalEvent.preventDefault()}if(F.originalEvent.touches.length){var h=(C-F.originalEvent.touches[0].pageY)/d.touchScrollStep;y(h,true);C=F.originalEvent.touches[0].pageY}});E();if(d.start==="bottom"){x.css({top:D.outerHeight()-x.outerHeight()});y(0,true)}else{if(d.start!=="top"){y(a(d.start).position().top,null,true);if(!d.alwaysVisible){x.hide()}}}A(this);function B(F){if(!z){return}var F=F||window.event;var G=0;if(F.wheelDelta){G=-F.wheelDelta/120}if(F.detail){G=F.detail/3}var h=F.target||F.srcTarget||F.srcElement;if(a(h).closest("."+d.wrapperClass).is(D.parent())){y(G,true)}if(F.preventDefault&&!r){F.preventDefault()}if(!r){F.returnValue=false}}function y(J,G,h){r=false;var I=J;var H=D.outerHeight()-x.outerHeight();if(G){I=parseInt(x.css("top"))+J*parseInt(d.wheelStep)/100*x.outerHeight();I=Math.min(Math.max(I,0),H);I=(J>0)?Math.ceil(I):Math.floor(I);x.css({top:I+"px"})}p=parseInt(x.css("top"))/(D.outerHeight()-x.outerHeight());I=p*(D[0].scrollHeight-D.outerHeight());if(h){I=J;var F=I/D[0].scrollHeight*D.outerHeight();F=Math.min(Math.max(F,0),H);x.css({top:F+"px"})}D.scrollTop(I);D.trigger("slimscrolling",~~I);g();n()}function A(h){if(window.addEventListener){h.addEventListener("DOMMouseScroll",B,false);h.addEventListener("mousewheel",B,false)}else{document.attachEvent("onmousewheel",B)}}function E(){u=Math.max((D.outerHeight()/D[0].scrollHeight)*D.outerHeight(),w);x.css({height:u+"px"});var h=u==D.outerHeight()?"none":"block";x.css({display:h})}function g(){E();clearTimeout(q);if(p==~~p){r=d.allowPageScroll;if(k!=p){var h=(~~p==0)?"top":"bottom";D.trigger("slimscroll",h)}}else{r=false}k=p;if(u>=D.outerHeight()){r=true;return}x.stop(true,true).fadeIn("fast");if(d.railVisible){e.stop(true,true).fadeIn("fast")}}function n(){if(!d.alwaysVisible){q=setTimeout(function(){if(!(d.disableFadeOut&&z)&&!s&&!l){x.fadeOut("slow");e.fadeOut("slow")}},1000)}}n()});return this}});a.fn.extend({slimscroll:a.fn.slimScroll})})(jQuery);