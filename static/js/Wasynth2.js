/*! jQuery v2.0.3 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-2.0.3.min.map
*/
(function(e,undefined){var t,n,r=typeof undefined,i=e.location,o=e.document,s=o.documentElement,a=e.jQuery,u=e.$,l={},c=[],p="2.0.3",f=c.concat,h=c.push,d=c.slice,g=c.indexOf,m=l.toString,y=l.hasOwnProperty,v=p.trim,x=function(e,n){return new x.fn.init(e,n,t)},b=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,w=/\S+/g,T=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,k=/^-ms-/,N=/-([\da-z])/gi,E=function(e,t){return t.toUpperCase()},S=function(){o.removeEventListener("DOMContentLoaded",S,!1),e.removeEventListener("load",S,!1),x.ready()};x.fn=x.prototype={jquery:p,constructor:x,init:function(e,t,n){var r,i;if(!e)return this;if("string"==typeof e){if(r="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:T.exec(e),!r||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof x?t[0]:t,x.merge(this,x.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:o,!0)),C.test(r[1])&&x.isPlainObject(t))for(r in t)x.isFunction(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return i=o.getElementById(r[2]),i&&i.parentNode&&(this.length=1,this[0]=i),this.context=o,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?n.ready(e):(e.selector!==undefined&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return d.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,t,n,r,i,o,s=arguments[0]||{},a=1,u=arguments.length,l=!1;for("boolean"==typeof s&&(l=s,s=arguments[1]||{},a=2),"object"==typeof s||x.isFunction(s)||(s={}),u===a&&(s=this,--a);u>a;a++)if(null!=(e=arguments[a]))for(t in e)n=s[t],r=e[t],s!==r&&(l&&r&&(x.isPlainObject(r)||(i=x.isArray(r)))?(i?(i=!1,o=n&&x.isArray(n)?n:[]):o=n&&x.isPlainObject(n)?n:{},s[t]=x.extend(l,o,r)):r!==undefined&&(s[t]=r));return s},x.extend({expando:"jQuery"+(p+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=a),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){(e===!0?--x.readyWait:x.isReady)||(x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(o,[x]),x.fn.trigger&&x(o).trigger("ready").off("ready")))},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray,isWindow:function(e){return null!=e&&e===e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[m.call(e)]||"object":typeof e},isPlainObject:function(e){if("object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!y.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(t){return!1}return!0},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||o;var r=C.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:JSON.parse,parseXML:function(e){var t,n;if(!e||"string"!=typeof e)return null;try{n=new DOMParser,t=n.parseFromString(e,"text/xml")}catch(r){t=undefined}return(!t||t.getElementsByTagName("parsererror").length)&&x.error("Invalid XML: "+e),t},noop:function(){},globalEval:function(e){var t,n=eval;e=x.trim(e),e&&(1===e.indexOf("use strict")?(t=o.createElement("script"),t.text=e,o.head.appendChild(t).parentNode.removeChild(t)):n(e))},camelCase:function(e){return e.replace(k,"ms-").replace(N,E)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,s=j(e);if(n){if(s){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(s){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:function(e){return null==e?"":v.call(e)},makeArray:function(e,t){var n=t||[];return null!=e&&(j(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:g.call(t,e,n)},merge:function(e,t){var n=t.length,r=e.length,i=0;if("number"==typeof n)for(;n>i;i++)e[r++]=t[i];else while(t[i]!==undefined)e[r++]=t[i++];return e.length=r,e},grep:function(e,t,n){var r,i=[],o=0,s=e.length;for(n=!!n;s>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,s=j(e),a=[];if(s)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(a[a.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(a[a.length]=r);return f.apply([],a)},guid:1,proxy:function(e,t){var n,r,i;return"string"==typeof t&&(n=e[t],t=e,e=n),x.isFunction(e)?(r=d.call(arguments,2),i=function(){return e.apply(t||this,r.concat(d.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):undefined},access:function(e,t,n,r,i,o,s){var a=0,u=e.length,l=null==n;if("object"===x.type(n)){i=!0;for(a in n)x.access(e,t,a,n[a],!0,o,s)}else if(r!==undefined&&(i=!0,x.isFunction(r)||(s=!0),l&&(s?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(x(e),n)})),t))for(;u>a;a++)t(e[a],n,s?r:r.call(e[a],a,t(e[a],n)));return i?e:l?t.call(e):u?t(e[0],n):o},now:Date.now,swap:function(e,t,n,r){var i,o,s={};for(o in t)s[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=s[o];return i}}),x.ready.promise=function(t){return n||(n=x.Deferred(),"complete"===o.readyState?setTimeout(x.ready):(o.addEventListener("DOMContentLoaded",S,!1),e.addEventListener("load",S,!1))),n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function j(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}t=x(o),function(e,undefined){var t,n,r,i,o,s,a,u,l,c,p,f,h,d,g,m,y,v="sizzle"+-new Date,b=e.document,w=0,T=0,C=st(),k=st(),N=st(),E=!1,S=function(e,t){return e===t?(E=!0,0):0},j=typeof undefined,D=1<<31,A={}.hasOwnProperty,L=[],q=L.pop,H=L.push,O=L.push,F=L.slice,P=L.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",W="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",$=W.replace("w","w#"),B="\\["+M+"*("+W+")"+M+"*(?:([*^$|!~]?=)"+M+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+$+")|)|)"+M+"*\\]",I=":("+W+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+B.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=RegExp("^"+M+"*,"+M+"*"),X=RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=RegExp(M+"*[+~]"),Y=RegExp("="+M+"*([^\\]'\"]*)"+M+"*\\]","g"),V=RegExp(I),G=RegExp("^"+$+"$"),J={ID:RegExp("^#("+W+")"),CLASS:RegExp("^\\.("+W+")"),TAG:RegExp("^("+W.replace("w","w*")+")"),ATTR:RegExp("^"+B),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:RegExp("^(?:"+R+")$","i"),needsContext:RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Q=/^[^{]+\{\s*\[native \w/,K=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,Z=/^(?:input|select|textarea|button)$/i,et=/^h\d$/i,tt=/'|\\/g,nt=RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),rt=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{O.apply(L=F.call(b.childNodes),b.childNodes),L[b.childNodes.length].nodeType}catch(it){O={apply:L.length?function(e,t){H.apply(e,F.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function ot(e,t,r,i){var o,s,a,u,l,f,g,m,x,w;if((t?t.ownerDocument||t:b)!==p&&c(t),t=t||p,r=r||[],!e||"string"!=typeof e)return r;if(1!==(u=t.nodeType)&&9!==u)return[];if(h&&!i){if(o=K.exec(e))if(a=o[1]){if(9===u){if(s=t.getElementById(a),!s||!s.parentNode)return r;if(s.id===a)return r.push(s),r}else if(t.ownerDocument&&(s=t.ownerDocument.getElementById(a))&&y(t,s)&&s.id===a)return r.push(s),r}else{if(o[2])return O.apply(r,t.getElementsByTagName(e)),r;if((a=o[3])&&n.getElementsByClassName&&t.getElementsByClassName)return O.apply(r,t.getElementsByClassName(a)),r}if(n.qsa&&(!d||!d.test(e))){if(m=g=v,x=t,w=9===u&&e,1===u&&"object"!==t.nodeName.toLowerCase()){f=gt(e),(g=t.getAttribute("id"))?m=g.replace(tt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",l=f.length;while(l--)f[l]=m+mt(f[l]);x=U.test(e)&&t.parentNode||t,w=f.join(",")}if(w)try{return O.apply(r,x.querySelectorAll(w)),r}catch(T){}finally{g||t.removeAttribute("id")}}}return kt(e.replace(z,"$1"),t,r,i)}function st(){var e=[];function t(n,r){return e.push(n+=" ")>i.cacheLength&&delete t[e.shift()],t[n]=r}return t}function at(e){return e[v]=!0,e}function ut(e){var t=p.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function lt(e,t){var n=e.split("|"),r=e.length;while(r--)i.attrHandle[n[r]]=t}function ct(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function pt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function ft(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ht(e){return at(function(t){return t=+t,at(function(n,r){var i,o=e([],n.length,t),s=o.length;while(s--)n[i=o[s]]&&(n[i]=!(r[i]=n[i]))})})}s=ot.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},n=ot.support={},c=ot.setDocument=function(e){var t=e?e.ownerDocument||e:b,r=t.defaultView;return t!==p&&9===t.nodeType&&t.documentElement?(p=t,f=t.documentElement,h=!s(t),r&&r.attachEvent&&r!==r.top&&r.attachEvent("onbeforeunload",function(){c()}),n.attributes=ut(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ut(function(e){return e.appendChild(t.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=ut(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),n.getById=ut(function(e){return f.appendChild(e).id=v,!t.getElementsByName||!t.getElementsByName(v).length}),n.getById?(i.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},i.filter.ID=function(e){var t=e.replace(nt,rt);return function(e){return e.getAttribute("id")===t}}):(delete i.find.ID,i.filter.ID=function(e){var t=e.replace(nt,rt);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),i.find.TAG=n.getElementsByTagName?function(e,t){return typeof t.getElementsByTagName!==j?t.getElementsByTagName(e):undefined}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},i.find.CLASS=n.getElementsByClassName&&function(e,t){return typeof t.getElementsByClassName!==j&&h?t.getElementsByClassName(e):undefined},g=[],d=[],(n.qsa=Q.test(t.querySelectorAll))&&(ut(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||d.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll(":checked").length||d.push(":checked")}),ut(function(e){var n=t.createElement("input");n.setAttribute("type","hidden"),e.appendChild(n).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&d.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||d.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),d.push(",.*:")})),(n.matchesSelector=Q.test(m=f.webkitMatchesSelector||f.mozMatchesSelector||f.oMatchesSelector||f.msMatchesSelector))&&ut(function(e){n.disconnectedMatch=m.call(e,"div"),m.call(e,"[s!='']:x"),g.push("!=",I)}),d=d.length&&RegExp(d.join("|")),g=g.length&&RegExp(g.join("|")),y=Q.test(f.contains)||f.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},S=f.compareDocumentPosition?function(e,r){if(e===r)return E=!0,0;var i=r.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(r);return i?1&i||!n.sortDetached&&r.compareDocumentPosition(e)===i?e===t||y(b,e)?-1:r===t||y(b,r)?1:l?P.call(l,e)-P.call(l,r):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,n){var r,i=0,o=e.parentNode,s=n.parentNode,a=[e],u=[n];if(e===n)return E=!0,0;if(!o||!s)return e===t?-1:n===t?1:o?-1:s?1:l?P.call(l,e)-P.call(l,n):0;if(o===s)return ct(e,n);r=e;while(r=r.parentNode)a.unshift(r);r=n;while(r=r.parentNode)u.unshift(r);while(a[i]===u[i])i++;return i?ct(a[i],u[i]):a[i]===b?-1:u[i]===b?1:0},t):p},ot.matches=function(e,t){return ot(e,null,null,t)},ot.matchesSelector=function(e,t){if((e.ownerDocument||e)!==p&&c(e),t=t.replace(Y,"='$1']"),!(!n.matchesSelector||!h||g&&g.test(t)||d&&d.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(i){}return ot(t,p,null,[e]).length>0},ot.contains=function(e,t){return(e.ownerDocument||e)!==p&&c(e),y(e,t)},ot.attr=function(e,t){(e.ownerDocument||e)!==p&&c(e);var r=i.attrHandle[t.toLowerCase()],o=r&&A.call(i.attrHandle,t.toLowerCase())?r(e,t,!h):undefined;return o===undefined?n.attributes||!h?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null:o},ot.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},ot.uniqueSort=function(e){var t,r=[],i=0,o=0;if(E=!n.detectDuplicates,l=!n.sortStable&&e.slice(0),e.sort(S),E){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return e},o=ot.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=o(t);return n},i=ot.selectors={cacheLength:50,createPseudo:at,match:J,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(nt,rt),e[3]=(e[4]||e[5]||"").replace(nt,rt),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||ot.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&ot.error(e[0]),e},PSEUDO:function(e){var t,n=!e[5]&&e[2];return J.CHILD.test(e[0])?null:(e[3]&&e[4]!==undefined?e[2]=e[4]:n&&V.test(n)&&(t=gt(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(nt,rt).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=C[e+" "];return t||(t=RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&C(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=ot.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),s="last"!==e.slice(-4),a="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,p,f,h,d,g=o!==s?"nextSibling":"previousSibling",m=t.parentNode,y=a&&t.nodeName.toLowerCase(),x=!u&&!a;if(m){if(o){while(g){p=t;while(p=p[g])if(a?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;d=g="only"===e&&!d&&"nextSibling"}return!0}if(d=[s?m.firstChild:m.lastChild],s&&x){c=m[v]||(m[v]={}),l=c[e]||[],h=l[0]===w&&l[1],f=l[0]===w&&l[2],p=h&&m.childNodes[h];while(p=++h&&p&&p[g]||(f=h=0)||d.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[w,h,f];break}}else if(x&&(l=(t[v]||(t[v]={}))[e])&&l[0]===w)f=l[1];else while(p=++h&&p&&p[g]||(f=h=0)||d.pop())if((a?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(x&&((p[v]||(p[v]={}))[e]=[w,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||ot.error("unsupported pseudo: "+e);return r[v]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?at(function(e,n){var i,o=r(e,t),s=o.length;while(s--)i=P.call(e,o[s]),e[i]=!(n[i]=o[s])}):function(e){return r(e,0,n)}):r}},pseudos:{not:at(function(e){var t=[],n=[],r=a(e.replace(z,"$1"));return r[v]?at(function(e,t,n,i){var o,s=r(e,null,i,[]),a=e.length;while(a--)(o=s[a])&&(e[a]=!(t[a]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:at(function(e){return function(t){return ot(e,t).length>0}}),contains:at(function(e){return function(t){return(t.textContent||t.innerText||o(t)).indexOf(e)>-1}}),lang:at(function(e){return G.test(e||"")||ot.error("unsupported lang: "+e),e=e.replace(nt,rt).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===f},focus:function(e){return e===p.activeElement&&(!p.hasFocus||p.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!i.pseudos.empty(e)},header:function(e){return et.test(e.nodeName)},input:function(e){return Z.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:ht(function(){return[0]}),last:ht(function(e,t){return[t-1]}),eq:ht(function(e,t,n){return[0>n?n+t:n]}),even:ht(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:ht(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:ht(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:ht(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}},i.pseudos.nth=i.pseudos.eq;for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})i.pseudos[t]=pt(t);for(t in{submit:!0,reset:!0})i.pseudos[t]=ft(t);function dt(){}dt.prototype=i.filters=i.pseudos,i.setFilters=new dt;function gt(e,t){var n,r,o,s,a,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);a=e,u=[],l=i.preFilter;while(a){(!n||(r=_.exec(a)))&&(r&&(a=a.slice(r[0].length)||a),u.push(o=[])),n=!1,(r=X.exec(a))&&(n=r.shift(),o.push({value:n,type:r[0].replace(z," ")}),a=a.slice(n.length));for(s in i.filter)!(r=J[s].exec(a))||l[s]&&!(r=l[s](r))||(n=r.shift(),o.push({value:n,type:s,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?ot.error(e):k(e,u).slice(0)}function mt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function yt(e,t,n){var i=t.dir,o=n&&"parentNode"===i,s=T++;return t.first?function(t,n,r){while(t=t[i])if(1===t.nodeType||o)return e(t,n,r)}:function(t,n,a){var u,l,c,p=w+" "+s;if(a){while(t=t[i])if((1===t.nodeType||o)&&e(t,n,a))return!0}else while(t=t[i])if(1===t.nodeType||o)if(c=t[v]||(t[v]={}),(l=c[i])&&l[0]===p){if((u=l[1])===!0||u===r)return u===!0}else if(l=c[i]=[p],l[1]=e(t,n,a)||r,l[1]===!0)return!0}}function vt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,s=[],a=0,u=e.length,l=null!=t;for(;u>a;a++)(o=e[a])&&(!n||n(o,r,i))&&(s.push(o),l&&t.push(a));return s}function bt(e,t,n,r,i,o){return r&&!r[v]&&(r=bt(r)),i&&!i[v]&&(i=bt(i,o)),at(function(o,s,a,u){var l,c,p,f=[],h=[],d=s.length,g=o||Ct(t||"*",a.nodeType?[a]:a,[]),m=!e||!o&&t?g:xt(g,f,e,a,u),y=n?i||(o?e:d||r)?[]:s:m;if(n&&n(m,y,a,u),r){l=xt(y,h),r(l,[],a,u),c=l.length;while(c--)(p=l[c])&&(y[h[c]]=!(m[h[c]]=p))}if(o){if(i||e){if(i){l=[],c=y.length;while(c--)(p=y[c])&&l.push(m[c]=p);i(null,y=[],l,u)}c=y.length;while(c--)(p=y[c])&&(l=i?P.call(o,p):f[c])>-1&&(o[l]=!(s[l]=p))}}else y=xt(y===s?y.splice(d,y.length):y),i?i(null,s,y,u):O.apply(s,y)})}function wt(e){var t,n,r,o=e.length,s=i.relative[e[0].type],a=s||i.relative[" "],l=s?1:0,c=yt(function(e){return e===t},a,!0),p=yt(function(e){return P.call(t,e)>-1},a,!0),f=[function(e,n,r){return!s&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;o>l;l++)if(n=i.relative[e[l].type])f=[yt(vt(f),n)];else{if(n=i.filter[e[l].type].apply(null,e[l].matches),n[v]){for(r=++l;o>r;r++)if(i.relative[e[r].type])break;return bt(l>1&&vt(f),l>1&&mt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&wt(e.slice(l,r)),o>r&&wt(e=e.slice(r)),o>r&&mt(e))}f.push(n)}return vt(f)}function Tt(e,t){var n=0,o=t.length>0,s=e.length>0,a=function(a,l,c,f,h){var d,g,m,y=[],v=0,x="0",b=a&&[],T=null!=h,C=u,k=a||s&&i.find.TAG("*",h&&l.parentNode||l),N=w+=null==C?1:Math.random()||.1;for(T&&(u=l!==p&&l,r=n);null!=(d=k[x]);x++){if(s&&d){g=0;while(m=e[g++])if(m(d,l,c)){f.push(d);break}T&&(w=N,r=++n)}o&&((d=!m&&d)&&v--,a&&b.push(d))}if(v+=x,o&&x!==v){g=0;while(m=t[g++])m(b,y,l,c);if(a){if(v>0)while(x--)b[x]||y[x]||(y[x]=q.call(f));y=xt(y)}O.apply(f,y),T&&!a&&y.length>0&&v+t.length>1&&ot.uniqueSort(f)}return T&&(w=N,u=C),b};return o?at(a):a}a=ot.compile=function(e,t){var n,r=[],i=[],o=N[e+" "];if(!o){t||(t=gt(e)),n=t.length;while(n--)o=wt(t[n]),o[v]?r.push(o):i.push(o);o=N(e,Tt(i,r))}return o};function Ct(e,t,n){var r=0,i=t.length;for(;i>r;r++)ot(e,t[r],n);return n}function kt(e,t,r,o){var s,u,l,c,p,f=gt(e);if(!o&&1===f.length){if(u=f[0]=f[0].slice(0),u.length>2&&"ID"===(l=u[0]).type&&n.getById&&9===t.nodeType&&h&&i.relative[u[1].type]){if(t=(i.find.ID(l.matches[0].replace(nt,rt),t)||[])[0],!t)return r;e=e.slice(u.shift().value.length)}s=J.needsContext.test(e)?0:u.length;while(s--){if(l=u[s],i.relative[c=l.type])break;if((p=i.find[c])&&(o=p(l.matches[0].replace(nt,rt),U.test(u[0].type)&&t.parentNode||t))){if(u.splice(s,1),e=o.length&&mt(u),!e)return O.apply(r,o),r;break}}}return a(e,f)(o,t,!h,r,U.test(e)),r}n.sortStable=v.split("").sort(S).join("")===v,n.detectDuplicates=E,c(),n.sortDetached=ut(function(e){return 1&e.compareDocumentPosition(p.createElement("div"))}),ut(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||lt("type|href|height|width",function(e,t,n){return n?undefined:e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ut(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||lt("value",function(e,t,n){return n||"input"!==e.nodeName.toLowerCase()?undefined:e.defaultValue}),ut(function(e){return null==e.getAttribute("disabled")})||lt(R,function(e,t,n){var r;return n?undefined:(r=e.getAttributeNode(t))&&r.specified?r.value:e[t]===!0?t.toLowerCase():null}),x.find=ot,x.expr=ot.selectors,x.expr[":"]=x.expr.pseudos,x.unique=ot.uniqueSort,x.text=ot.getText,x.isXMLDoc=ot.isXML,x.contains=ot.contains}(e);var D={};function A(e){var t=D[e]={};return x.each(e.match(w)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?D[e]||A(e):x.extend({},e);var t,n,r,i,o,s,a=[],u=!e.once&&[],l=function(p){for(t=e.memory&&p,n=!0,s=i||0,i=0,o=a.length,r=!0;a&&o>s;s++)if(a[s].apply(p[0],p[1])===!1&&e.stopOnFalse){t=!1;break}r=!1,a&&(u?u.length&&l(u.shift()):t?a=[]:c.disable())},c={add:function(){if(a){var n=a.length;(function s(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&c.has(n)||a.push(n):n&&n.length&&"string"!==r&&s(n)})})(arguments),r?o=a.length:t&&(i=n,l(t))}return this},remove:function(){return a&&x.each(arguments,function(e,t){var n;while((n=x.inArray(t,a,n))>-1)a.splice(n,1),r&&(o>=n&&o--,s>=n&&s--)}),this},has:function(e){return e?x.inArray(e,a)>-1:!(!a||!a.length)},empty:function(){return a=[],o=0,this},disable:function(){return a=u=t=undefined,this},disabled:function(){return!a},lock:function(){return u=undefined,t||c.disable(),this},locked:function(){return!u},fireWith:function(e,t){return!a||n&&!u||(t=t||[],t=[e,t.slice?t.slice():t],r?u.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!n}};return c},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var s=o[0],a=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=a&&a.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===r?n.promise():this,a?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var s=o[2],a=o[3];r[o[1]]=s.add,a&&s.add(function(){n=a},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=s.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=d.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),s=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?d.call(arguments):r,n===a?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},a,u,l;if(r>1)for(a=Array(r),u=Array(r),l=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(s(t,l,n)).fail(o.reject).progress(s(t,u,a)):--i;return i||o.resolveWith(l,n),o.promise()}}),x.support=function(t){var n=o.createElement("input"),r=o.createDocumentFragment(),i=o.createElement("div"),s=o.createElement("select"),a=s.appendChild(o.createElement("option"));return n.type?(n.type="checkbox",t.checkOn=""!==n.value,t.optSelected=a.selected,t.reliableMarginRight=!0,t.boxSizingReliable=!0,t.pixelPosition=!1,n.checked=!0,t.noCloneChecked=n.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!a.disabled,n=o.createElement("input"),n.value="t",n.type="radio",t.radioValue="t"===n.value,n.setAttribute("checked","t"),n.setAttribute("name","t"),r.appendChild(n),t.checkClone=r.cloneNode(!0).cloneNode(!0).lastChild.checked,t.focusinBubbles="onfocusin"in e,i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===i.style.backgroundClip,x(function(){var n,r,s="padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",a=o.getElementsByTagName("body")[0];a&&(n=o.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",a.appendChild(n).appendChild(i),i.innerHTML="",i.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%",x.swap(a,null!=a.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===i.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(i,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(i,null)||{width:"4px"}).width,r=i.appendChild(o.createElement("div")),r.style.cssText=i.style.cssText=s,r.style.marginRight=r.style.width="0",i.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),a.removeChild(n))}),t):t}({});var L,q,H=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,O=/([A-Z])/g;function F(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=x.expando+Math.random()}F.uid=1,F.accepts=function(e){return e.nodeType?1===e.nodeType||9===e.nodeType:!0},F.prototype={key:function(e){if(!F.accepts(e))return 0;var t={},n=e[this.expando];if(!n){n=F.uid++;try{t[this.expando]={value:n},Object.defineProperties(e,t)}catch(r){t[this.expando]=n,x.extend(e,t)}}return this.cache[n]||(this.cache[n]={}),n},set:function(e,t,n){var r,i=this.key(e),o=this.cache[i];if("string"==typeof t)o[t]=n;else if(x.isEmptyObject(o))x.extend(this.cache[i],t);else for(r in t)o[r]=t[r];return o},get:function(e,t){var n=this.cache[this.key(e)];return t===undefined?n:n[t]},access:function(e,t,n){var r;return t===undefined||t&&"string"==typeof t&&n===undefined?(r=this.get(e,t),r!==undefined?r:this.get(e,x.camelCase(t))):(this.set(e,t,n),n!==undefined?n:t)},remove:function(e,t){var n,r,i,o=this.key(e),s=this.cache[o];if(t===undefined)this.cache[o]={};else{x.isArray(t)?r=t.concat(t.map(x.camelCase)):(i=x.camelCase(t),t in s?r=[t,i]:(r=i,r=r in s?[r]:r.match(w)||[])),n=r.length;while(n--)delete s[r[n]]}},hasData:function(e){return!x.isEmptyObject(this.cache[e[this.expando]]||{})},discard:function(e){e[this.expando]&&delete this.cache[e[this.expando]]}},L=new F,q=new F,x.extend({acceptData:F.accepts,hasData:function(e){return L.hasData(e)||q.hasData(e)},data:function(e,t,n){return L.access(e,t,n)},removeData:function(e,t){L.remove(e,t)},_data:function(e,t,n){return q.access(e,t,n)},_removeData:function(e,t){q.remove(e,t)}}),x.fn.extend({data:function(e,t){var n,r,i=this[0],o=0,s=null;if(e===undefined){if(this.length&&(s=L.get(i),1===i.nodeType&&!q.get(i,"hasDataAttrs"))){for(n=i.attributes;n.length>o;o++)r=n[o].name,0===r.indexOf("data-")&&(r=x.camelCase(r.slice(5)),P(i,r,s[r]));q.set(i,"hasDataAttrs",!0)}return s}return"object"==typeof e?this.each(function(){L.set(this,e)}):x.access(this,function(t){var n,r=x.camelCase(e);if(i&&t===undefined){if(n=L.get(i,e),n!==undefined)return n;if(n=L.get(i,r),n!==undefined)return n;if(n=P(i,r,undefined),n!==undefined)return n}else this.each(function(){var n=L.get(this,r);L.set(this,r,t),-1!==e.indexOf("-")&&n!==undefined&&L.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){L.remove(this,e)})}});function P(e,t,n){var r;if(n===undefined&&1===e.nodeType)if(r="data-"+t.replace(O,"-$1").toLowerCase(),n=e.getAttribute(r),"string"==typeof n){try{n="true"===n?!0:"false"===n?!1:"null"===n?null:+n+""===n?+n:H.test(n)?JSON.parse(n):n}catch(i){}L.set(e,t,n)}else n=undefined;return n}x.extend({queue:function(e,t,n){var r;return e?(t=(t||"fx")+"queue",r=q.get(e,t),n&&(!r||x.isArray(n)?r=q.access(e,t,x.makeArray(n)):r.push(n)),r||[]):undefined},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),s=function(){x.dequeue(e,t)
};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,s,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return q.get(e,n)||q.access(e,n,{empty:x.Callbacks("once memory").add(function(){q.remove(e,[t+"queue",n])})})}}),x.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),n>arguments.length?x.queue(this[0],e):t===undefined?this:this.each(function(){var n=x.queue(this,e,t);x._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=x.Deferred(),o=this,s=this.length,a=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=undefined),e=e||"fx";while(s--)n=q.get(o[s],e+"queueHooks"),n&&n.empty&&(r++,n.empty.add(a));return a(),i.promise(t)}});var R,M,W=/[\t\r\n\f]/g,$=/\r/g,B=/^(?:input|select|textarea|button)$/i;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[x.propFix[e]||e]})},addClass:function(e){var t,n,r,i,o,s=0,a=this.length,u="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];a>s;s++)if(n=this[s],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(W," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,s=0,a=this.length,u=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];a>s;s++)if(n=this[s],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(W," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var t,i=0,o=x(this),s=e.match(w)||[];while(t=s[i++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else(n===r||"boolean"===n)&&(this.className&&q.set(this,"__className__",this.className),this.className=this.className||e===!1?"":q.get(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(W," ").indexOf(t)>=0)return!0;return!1},val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=x.isFunction(e),this.each(function(n){var i;1===this.nodeType&&(i=r?e.call(this,n,x(this).val()):e,null==i?i="":"number"==typeof i?i+="":x.isArray(i)&&(i=x.map(i,function(e){return null==e?"":e+""})),t=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],t&&"set"in t&&t.set(this,i,"value")!==undefined||(this.value=i))});if(i)return t=x.valHooks[i.type]||x.valHooks[i.nodeName.toLowerCase()],t&&"get"in t&&(n=t.get(i,"value"))!==undefined?n:(n=i.value,"string"==typeof n?n.replace($,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,s=o?null:[],a=o?i+1:r.length,u=0>i?a:o?i:0;for(;a>u;u++)if(n=r[u],!(!n.selected&&u!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),s=i.length;while(s--)r=i[s],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,t,n){var i,o,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===r?x.prop(e,t,n):(1===s&&x.isXMLDoc(e)||(t=t.toLowerCase(),i=x.attrHooks[t]||(x.expr.match.bool.test(t)?M:R)),n===undefined?i&&"get"in i&&null!==(o=i.get(e,t))?o:(o=x.find.attr(e,t),null==o?undefined:o):null!==n?i&&"set"in i&&(o=i.set(e,n,t))!==undefined?o:(e.setAttribute(t,n+""),n):(x.removeAttr(e,t),undefined))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(w);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)&&(e[r]=!1),e.removeAttribute(n)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,t,n){var r,i,o,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return o=1!==s||!x.isXMLDoc(e),o&&(t=x.propFix[t]||t,i=x.propHooks[t]),n!==undefined?i&&"set"in i&&(r=i.set(e,n,t))!==undefined?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){return e.hasAttribute("tabindex")||B.test(e.nodeName)||e.href?e.tabIndex:-1}}}}),M={set:function(e,t,n){return t===!1?x.removeAttr(e,n):e.setAttribute(n,n),n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,t){var n=x.expr.attrHandle[t]||x.find.attr;x.expr.attrHandle[t]=function(e,t,r){var i=x.expr.attrHandle[t],o=r?undefined:(x.expr.attrHandle[t]=undefined)!=n(e,t,r)?t.toLowerCase():null;return x.expr.attrHandle[t]=i,o}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,t){return x.isArray(t)?e.checked=x.inArray(x(e).val(),t)>=0:undefined}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var I=/^key/,z=/^(?:mouse|contextmenu)|click/,_=/^(?:focusinfocus|focusoutblur)$/,X=/^([^.]*)(?:\.(.+)|)$/;function U(){return!0}function Y(){return!1}function V(){try{return o.activeElement}catch(e){}}x.event={global:{},add:function(e,t,n,i,o){var s,a,u,l,c,p,f,h,d,g,m,y=q.get(e);if(y){n.handler&&(s=n,n=s.handler,o=s.selector),n.guid||(n.guid=x.guid++),(l=y.events)||(l=y.events={}),(a=y.handle)||(a=y.handle=function(e){return typeof x===r||e&&x.event.triggered===e.type?undefined:x.event.dispatch.apply(a.elem,arguments)},a.elem=e),t=(t||"").match(w)||[""],c=t.length;while(c--)u=X.exec(t[c])||[],d=m=u[1],g=(u[2]||"").split(".").sort(),d&&(f=x.event.special[d]||{},d=(o?f.delegateType:f.bindType)||d,f=x.event.special[d]||{},p=x.extend({type:d,origType:m,data:i,handler:n,guid:n.guid,selector:o,needsContext:o&&x.expr.match.needsContext.test(o),namespace:g.join(".")},s),(h=l[d])||(h=l[d]=[],h.delegateCount=0,f.setup&&f.setup.call(e,i,g,a)!==!1||e.addEventListener&&e.addEventListener(d,a,!1)),f.add&&(f.add.call(e,p),p.handler.guid||(p.handler.guid=n.guid)),o?h.splice(h.delegateCount++,0,p):h.push(p),x.event.global[d]=!0);e=null}},remove:function(e,t,n,r,i){var o,s,a,u,l,c,p,f,h,d,g,m=q.hasData(e)&&q.get(e);if(m&&(u=m.events)){t=(t||"").match(w)||[""],l=t.length;while(l--)if(a=X.exec(t[l])||[],h=g=a[1],d=(a[2]||"").split(".").sort(),h){p=x.event.special[h]||{},h=(r?p.delegateType:p.bindType)||h,f=u[h]||[],a=a[2]&&RegExp("(^|\\.)"+d.join("\\.(?:.*\\.|)")+"(\\.|$)"),s=o=f.length;while(o--)c=f[o],!i&&g!==c.origType||n&&n.guid!==c.guid||a&&!a.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(f.splice(o,1),c.selector&&f.delegateCount--,p.remove&&p.remove.call(e,c));s&&!f.length&&(p.teardown&&p.teardown.call(e,d,m.handle)!==!1||x.removeEvent(e,h,m.handle),delete u[h])}else for(h in u)x.event.remove(e,h+t[l],n,r,!0);x.isEmptyObject(u)&&(delete m.handle,q.remove(e,"events"))}},trigger:function(t,n,r,i){var s,a,u,l,c,p,f,h=[r||o],d=y.call(t,"type")?t.type:t,g=y.call(t,"namespace")?t.namespace.split("."):[];if(a=u=r=r||o,3!==r.nodeType&&8!==r.nodeType&&!_.test(d+x.event.triggered)&&(d.indexOf(".")>=0&&(g=d.split("."),d=g.shift(),g.sort()),c=0>d.indexOf(":")&&"on"+d,t=t[x.expando]?t:new x.Event(d,"object"==typeof t&&t),t.isTrigger=i?2:3,t.namespace=g.join("."),t.namespace_re=t.namespace?RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=undefined,t.target||(t.target=r),n=null==n?[t]:x.makeArray(n,[t]),f=x.event.special[d]||{},i||!f.trigger||f.trigger.apply(r,n)!==!1)){if(!i&&!f.noBubble&&!x.isWindow(r)){for(l=f.delegateType||d,_.test(l+d)||(a=a.parentNode);a;a=a.parentNode)h.push(a),u=a;u===(r.ownerDocument||o)&&h.push(u.defaultView||u.parentWindow||e)}s=0;while((a=h[s++])&&!t.isPropagationStopped())t.type=s>1?l:f.bindType||d,p=(q.get(a,"events")||{})[t.type]&&q.get(a,"handle"),p&&p.apply(a,n),p=c&&a[c],p&&x.acceptData(a)&&p.apply&&p.apply(a,n)===!1&&t.preventDefault();return t.type=d,i||t.isDefaultPrevented()||f._default&&f._default.apply(h.pop(),n)!==!1||!x.acceptData(r)||c&&x.isFunction(r[d])&&!x.isWindow(r)&&(u=r[c],u&&(r[c]=null),x.event.triggered=d,r[d](),x.event.triggered=undefined,u&&(r[c]=u)),t.result}},dispatch:function(e){e=x.event.fix(e);var t,n,r,i,o,s=[],a=d.call(arguments),u=(q.get(this,"events")||{})[e.type]||[],l=x.event.special[e.type]||{};if(a[0]=e,e.delegateTarget=this,!l.preDispatch||l.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),t=0;while((i=s[t++])&&!e.isPropagationStopped()){e.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(o.namespace))&&(e.handleObj=o,e.data=o.data,r=((x.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,a),r!==undefined&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return l.postDispatch&&l.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,r,i,o,s=[],a=t.delegateCount,u=e.target;if(a&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!==this;u=u.parentNode||this)if(u.disabled!==!0||"click"!==e.type){for(r=[],n=0;a>n;n++)o=t[n],i=o.selector+" ",r[i]===undefined&&(r[i]=o.needsContext?x(i,this).index(u)>=0:x.find(i,this,null,[u]).length),r[i]&&r.push(o);r.length&&s.push({elem:u,handlers:r})}return t.length>a&&s.push({elem:this,handlers:t.slice(a)}),s},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,r,i,s=t.button;return null==e.pageX&&null!=t.clientX&&(n=e.target.ownerDocument||o,r=n.documentElement,i=n.body,e.pageX=t.clientX+(r&&r.scrollLeft||i&&i.scrollLeft||0)-(r&&r.clientLeft||i&&i.clientLeft||0),e.pageY=t.clientY+(r&&r.scrollTop||i&&i.scrollTop||0)-(r&&r.clientTop||i&&i.clientTop||0)),e.which||s===undefined||(e.which=1&s?1:2&s?3:4&s?2:0),e}},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,s=e,a=this.fixHooks[i];a||(this.fixHooks[i]=a=z.test(i)?this.mouseHooks:I.test(i)?this.keyHooks:{}),r=a.props?this.props.concat(a.props):this.props,e=new x.Event(s),t=r.length;while(t--)n=r[t],e[n]=s[n];return e.target||(e.target=o),3===e.target.nodeType&&(e.target=e.target.parentNode),a.filter?a.filter(e,s):e},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==V()&&this.focus?(this.focus(),!1):undefined},delegateType:"focusin"},blur:{trigger:function(){return this===V()&&this.blur?(this.blur(),!1):undefined},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&x.nodeName(this,"input")?(this.click(),!1):undefined},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==undefined&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)},x.Event=function(e,t){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.getPreventDefault&&e.getPreventDefault()?U:Y):this.type=e,t&&x.extend(this,t),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,undefined):new x.Event(e,t)},x.Event.prototype={isDefaultPrevented:Y,isPropagationStopped:Y,isImmediatePropagationStopped:Y,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=U,e&&e.preventDefault&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=U,e&&e.stopPropagation&&e.stopPropagation()},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=U,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&o.addEventListener(e,r,!0)},teardown:function(){0===--n&&o.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,t,n,r,i){var o,s;if("object"==typeof e){"string"!=typeof t&&(n=n||t,t=undefined);for(s in e)this.on(s,t,n,e[s],i);return this}if(null==n&&null==r?(r=t,n=t=undefined):null==r&&("string"==typeof t?(r=n,n=undefined):(r=n,n=t,t=undefined)),r===!1)r=Y;else if(!r)return this;return 1===i&&(o=r,r=function(e){return x().off(e),o.apply(this,arguments)},r.guid=o.guid||(o.guid=x.guid++)),this.each(function(){x.event.add(this,e,r,n,t)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,x(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return(t===!1||"function"==typeof t)&&(n=t,t=undefined),n===!1&&(n=Y),this.each(function(){x.event.remove(this,e,n,t)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];return n?x.event.trigger(e,t,n,!0):undefined}});var G=/^.[^:#\[\.,]*$/,J=/^(?:parents|prev(?:Until|All))/,Q=x.expr.match.needsContext,K={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t=x(e,this),n=t.length;return this.filter(function(){var e=0;for(;n>e;e++)if(x.contains(this,t[e]))return!0})},not:function(e){return this.pushStack(et(this,e||[],!0))},filter:function(e){return this.pushStack(et(this,e||[],!1))},is:function(e){return!!et(this,"string"==typeof e&&Q.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],s=Q.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(s?s.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?g.call(x(e),this[0]):g.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function Z(e,t){while((e=e[t])&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return Z(e,"nextSibling")},prev:function(e){return Z(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return e.contentDocument||x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(K[e]||x.unique(i),J.test(e)&&i.reverse()),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,t,n){var r=[],i=n!==undefined;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&x(e).is(n))break;r.push(e)}return r},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function et(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(G.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return g.call(t,e)>=0!==n})}var tt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,nt=/<([\w:]+)/,rt=/<|&#?\w+;/,it=/<(?:script|style|link)/i,ot=/^(?:checkbox|radio)$/i,st=/checked\s*(?:[^=]|=\s*.checked.)/i,at=/^$|\/(?:java|ecma)script/i,ut=/^true\/(.*)/,lt=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ct={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ct.optgroup=ct.option,ct.tbody=ct.tfoot=ct.colgroup=ct.caption=ct.thead,ct.th=ct.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===undefined?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||o).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=pt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=pt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(mt(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&dt(mt(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++)1===e.nodeType&&(x.cleanData(mt(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var t=this[0]||{},n=0,r=this.length;if(e===undefined&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!it.test(e)&&!ct[(nt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(tt,"<$1></$2>");try{for(;r>n;n++)t=this[n]||{},1===t.nodeType&&(x.cleanData(mt(t,!1)),t.innerHTML=e);t=0}catch(i){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=f.apply([],e);var r,i,o,s,a,u,l=0,c=this.length,p=this,h=c-1,d=e[0],g=x.isFunction(d);if(g||!(1>=c||"string"!=typeof d||x.support.checkClone)&&st.test(d))return this.each(function(r){var i=p.eq(r);g&&(e[0]=d.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(r=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),i=r.firstChild,1===r.childNodes.length&&(r=i),i)){for(o=x.map(mt(r,"script"),ft),s=o.length;c>l;l++)a=r,l!==h&&(a=x.clone(a,!0,!0),s&&x.merge(o,mt(a,"script"))),t.call(this[l],a,l);if(s)for(u=o[o.length-1].ownerDocument,x.map(o,ht),l=0;s>l;l++)a=o[l],at.test(a.type||"")&&!q.access(a,"globalEval")&&x.contains(u,a)&&(a.src?x._evalUrl(a.src):x.globalEval(a.textContent.replace(lt,"")))}return this}}),x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=[],i=x(e),o=i.length-1,s=0;for(;o>=s;s++)n=s===o?this:this.clone(!0),x(i[s])[t](n),h.apply(r,n.get());return this.pushStack(r)}}),x.extend({clone:function(e,t,n){var r,i,o,s,a=e.cloneNode(!0),u=x.contains(e.ownerDocument,e);if(!(x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(s=mt(a),o=mt(e),r=0,i=o.length;i>r;r++)yt(o[r],s[r]);if(t)if(n)for(o=o||mt(e),s=s||mt(a),r=0,i=o.length;i>r;r++)gt(o[r],s[r]);else gt(e,a);return s=mt(a,"script"),s.length>0&&dt(s,!u&&mt(e,"script")),a},buildFragment:function(e,t,n,r){var i,o,s,a,u,l,c=0,p=e.length,f=t.createDocumentFragment(),h=[];for(;p>c;c++)if(i=e[c],i||0===i)if("object"===x.type(i))x.merge(h,i.nodeType?[i]:i);else if(rt.test(i)){o=o||f.appendChild(t.createElement("div")),s=(nt.exec(i)||["",""])[1].toLowerCase(),a=ct[s]||ct._default,o.innerHTML=a[1]+i.replace(tt,"<$1></$2>")+a[2],l=a[0];while(l--)o=o.lastChild;x.merge(h,o.childNodes),o=f.firstChild,o.textContent=""}else h.push(t.createTextNode(i));f.textContent="",c=0;while(i=h[c++])if((!r||-1===x.inArray(i,r))&&(u=x.contains(i.ownerDocument,i),o=mt(f.appendChild(i),"script"),u&&dt(o),n)){l=0;while(i=o[l++])at.test(i.type||"")&&n.push(i)}return f},cleanData:function(e){var t,n,r,i,o,s,a=x.event.special,u=0;for(;(n=e[u])!==undefined;u++){if(F.accepts(n)&&(o=n[q.expando],o&&(t=q.cache[o]))){if(r=Object.keys(t.events||{}),r.length)for(s=0;(i=r[s])!==undefined;s++)a[i]?x.event.remove(n,i):x.removeEvent(n,i,t.handle);q.cache[o]&&delete q.cache[o]}delete L.cache[n[L.expando]]}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}});function pt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function ft(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function ht(e){var t=ut.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function dt(e,t){var n=e.length,r=0;for(;n>r;r++)q.set(e[r],"globalEval",!t||q.get(t[r],"globalEval"))}function gt(e,t){var n,r,i,o,s,a,u,l;if(1===t.nodeType){if(q.hasData(e)&&(o=q.access(e),s=q.set(t,o),l=o.events)){delete s.handle,s.events={};for(i in l)for(n=0,r=l[i].length;r>n;n++)x.event.add(t,i,l[i][n])}L.hasData(e)&&(a=L.access(e),u=x.extend({},a),L.set(t,u))}}function mt(e,t){var n=e.getElementsByTagName?e.getElementsByTagName(t||"*"):e.querySelectorAll?e.querySelectorAll(t||"*"):[];return t===undefined||t&&x.nodeName(e,t)?x.merge([e],n):n}function yt(e,t){var n=t.nodeName.toLowerCase();"input"===n&&ot.test(e.type)?t.checked=e.checked:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}x.fn.extend({wrapAll:function(e){var t;return x.isFunction(e)?this.each(function(t){x(this).wrapAll(e.call(this,t))}):(this[0]&&(t=x(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this)},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var vt,xt,bt=/^(none|table(?!-c[ea]).+)/,wt=/^margin/,Tt=RegExp("^("+b+")(.*)$","i"),Ct=RegExp("^("+b+")(?!px)[a-z%]+$","i"),kt=RegExp("^([+-])=("+b+")","i"),Nt={BODY:"block"},Et={position:"absolute",visibility:"hidden",display:"block"},St={letterSpacing:0,fontWeight:400},jt=["Top","Right","Bottom","Left"],Dt=["Webkit","O","Moz","ms"];function At(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Dt.length;while(i--)if(t=Dt[i]+n,t in e)return t;return r}function Lt(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function qt(t){return e.getComputedStyle(t,null)}function Ht(e,t){var n,r,i,o=[],s=0,a=e.length;for(;a>s;s++)r=e[s],r.style&&(o[s]=q.get(r,"olddisplay"),n=r.style.display,t?(o[s]||"none"!==n||(r.style.display=""),""===r.style.display&&Lt(r)&&(o[s]=q.access(r,"olddisplay",Rt(r.nodeName)))):o[s]||(i=Lt(r),(n&&"none"!==n||!i)&&q.set(r,"olddisplay",i?n:x.css(r,"display"))));for(s=0;a>s;s++)r=e[s],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[s]||"":"none"));return e}x.fn.extend({css:function(e,t){return x.access(this,function(e,t,n){var r,i,o={},s=0;if(x.isArray(t)){for(r=qt(e),i=t.length;i>s;s++)o[t[s]]=x.css(e,t[s],!1,r);return o}return n!==undefined?x.style(e,t,n):x.css(e,t)},e,t,arguments.length>1)},show:function(){return Ht(this,!0)},hide:function(){return Ht(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){Lt(this)?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=vt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,s,a=x.camelCase(t),u=e.style;return t=x.cssProps[a]||(x.cssProps[a]=At(u,a)),s=x.cssHooks[t]||x.cssHooks[a],n===undefined?s&&"get"in s&&(i=s.get(e,!1,r))!==undefined?i:u[t]:(o=typeof n,"string"===o&&(i=kt.exec(n))&&(n=(i[1]+1)*i[2]+parseFloat(x.css(e,t)),o="number"),null==n||"number"===o&&isNaN(n)||("number"!==o||x.cssNumber[a]||(n+="px"),x.support.clearCloneStyle||""!==n||0!==t.indexOf("background")||(u[t]="inherit"),s&&"set"in s&&(n=s.set(e,n,r))===undefined||(u[t]=n)),undefined)}},css:function(e,t,n,r){var i,o,s,a=x.camelCase(t);return t=x.cssProps[a]||(x.cssProps[a]=At(e.style,a)),s=x.cssHooks[t]||x.cssHooks[a],s&&"get"in s&&(i=s.get(e,!0,n)),i===undefined&&(i=vt(e,t,r)),"normal"===i&&t in St&&(i=St[t]),""===n||n?(o=parseFloat(i),n===!0||x.isNumeric(o)?o||0:i):i}}),vt=function(e,t,n){var r,i,o,s=n||qt(e),a=s?s.getPropertyValue(t)||s[t]:undefined,u=e.style;return s&&(""!==a||x.contains(e.ownerDocument,e)||(a=x.style(e,t)),Ct.test(a)&&wt.test(t)&&(r=u.width,i=u.minWidth,o=u.maxWidth,u.minWidth=u.maxWidth=u.width=a,a=s.width,u.width=r,u.minWidth=i,u.maxWidth=o)),a};function Ot(e,t,n){var r=Tt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function Ft(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,s=0;for(;4>o;o+=2)"margin"===n&&(s+=x.css(e,n+jt[o],!0,i)),r?("content"===n&&(s-=x.css(e,"padding"+jt[o],!0,i)),"margin"!==n&&(s-=x.css(e,"border"+jt[o]+"Width",!0,i))):(s+=x.css(e,"padding"+jt[o],!0,i),"padding"!==n&&(s+=x.css(e,"border"+jt[o]+"Width",!0,i)));return s}function Pt(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=qt(e),s=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=vt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Ct.test(i))return i;r=s&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+Ft(e,t,n||(s?"border":"content"),r,o)+"px"}function Rt(e){var t=o,n=Nt[e];return n||(n=Mt(e,t),"none"!==n&&n||(xt=(xt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(xt[0].contentWindow||xt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=Mt(e,t),xt.detach()),Nt[e]=n),n}function Mt(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,t){x.cssHooks[t]={get:function(e,n,r){return n?0===e.offsetWidth&&bt.test(x.css(e,"display"))?x.swap(e,Et,function(){return Pt(e,t,r)}):Pt(e,t,r):undefined},set:function(e,n,r){var i=r&&qt(e);return Ot(e,n,r?Ft(e,t,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,t){return t?x.swap(e,{display:"inline-block"},vt,[e,"marginRight"]):undefined}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,t){x.cssHooks[t]={get:function(e,n){return n?(n=vt(e,t),Ct.test(n)?x(e).position()[t]+"px":n):undefined}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+jt[r]+t]=o[r]||o[r-2]||o[0];return i}},wt.test(e)||(x.cssHooks[e+t].set=Ot)});var Wt=/%20/g,$t=/\[\]$/,Bt=/\r?\n/g,It=/^(?:submit|button|image|reset|file)$/i,zt=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&zt.test(this.nodeName)&&!It.test(e)&&(this.checked||!ot.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(Bt,"\r\n")}}):{name:t.name,value:n.replace(Bt,"\r\n")}}).get()}}),x.param=function(e,t){var n,r=[],i=function(e,t){t=x.isFunction(t)?t():null==t?"":t,r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(t===undefined&&(t=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){i(this.name,this.value)});else for(n in e)_t(n,e[n],t,i);return r.join("&").replace(Wt,"+")};function _t(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||$t.test(e)?r(e,i):_t(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)_t(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)
},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var Xt,Ut,Yt=x.now(),Vt=/\?/,Gt=/#.*$/,Jt=/([?&])_=[^&]*/,Qt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Kt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Zt=/^(?:GET|HEAD)$/,en=/^\/\//,tn=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,nn=x.fn.load,rn={},on={},sn="*/".concat("*");try{Ut=i.href}catch(an){Ut=o.createElement("a"),Ut.href="",Ut=Ut.href}Xt=tn.exec(Ut.toLowerCase())||[];function un(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(w)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function ln(e,t,n,r){var i={},o=e===on;function s(a){var u;return i[a]=!0,x.each(e[a]||[],function(e,a){var l=a(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):undefined:(t.dataTypes.unshift(l),s(l),!1)}),u}return s(t.dataTypes[0])||!i["*"]&&s("*")}function cn(e,t){var n,r,i=x.ajaxSettings.flatOptions||{};for(n in t)t[n]!==undefined&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,t,n){if("string"!=typeof e&&nn)return nn.apply(this,arguments);var r,i,o,s=this,a=e.indexOf(" ");return a>=0&&(r=e.slice(a),e=e.slice(0,a)),x.isFunction(t)?(n=t,t=undefined):t&&"object"==typeof t&&(i="POST"),s.length>0&&x.ajax({url:e,type:i,dataType:"html",data:t}).done(function(e){o=arguments,s.html(r?x("<div>").append(x.parseHTML(e)).find(r):e)}).complete(n&&function(e,t){s.each(n,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ut,type:"GET",isLocal:Kt.test(Xt[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":sn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?cn(cn(e,x.ajaxSettings),t):cn(x.ajaxSettings,e)},ajaxPrefilter:un(rn),ajaxTransport:un(on),ajax:function(e,t){"object"==typeof e&&(t=e,e=undefined),t=t||{};var n,r,i,o,s,a,u,l,c=x.ajaxSetup({},t),p=c.context||c,f=c.context&&(p.nodeType||p.jquery)?x(p):x.event,h=x.Deferred(),d=x.Callbacks("once memory"),g=c.statusCode||{},m={},y={},v=0,b="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(2===v){if(!o){o={};while(t=Qt.exec(i))o[t[1].toLowerCase()]=t[2]}t=o[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===v?i:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return v||(e=y[n]=y[n]||e,m[e]=t),this},overrideMimeType:function(e){return v||(c.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>v)for(t in e)g[t]=[g[t],e[t]];else T.always(e[T.status]);return this},abort:function(e){var t=e||b;return n&&n.abort(t),k(0,t),this}};if(h.promise(T).complete=d.add,T.success=T.done,T.error=T.fail,c.url=((e||c.url||Ut)+"").replace(Gt,"").replace(en,Xt[1]+"//"),c.type=t.method||t.type||c.method||c.type,c.dataTypes=x.trim(c.dataType||"*").toLowerCase().match(w)||[""],null==c.crossDomain&&(a=tn.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===Xt[1]&&a[2]===Xt[2]&&(a[3]||("http:"===a[1]?"80":"443"))===(Xt[3]||("http:"===Xt[1]?"80":"443")))),c.data&&c.processData&&"string"!=typeof c.data&&(c.data=x.param(c.data,c.traditional)),ln(rn,c,t,T),2===v)return T;u=c.global,u&&0===x.active++&&x.event.trigger("ajaxStart"),c.type=c.type.toUpperCase(),c.hasContent=!Zt.test(c.type),r=c.url,c.hasContent||(c.data&&(r=c.url+=(Vt.test(r)?"&":"?")+c.data,delete c.data),c.cache===!1&&(c.url=Jt.test(r)?r.replace(Jt,"$1_="+Yt++):r+(Vt.test(r)?"&":"?")+"_="+Yt++)),c.ifModified&&(x.lastModified[r]&&T.setRequestHeader("If-Modified-Since",x.lastModified[r]),x.etag[r]&&T.setRequestHeader("If-None-Match",x.etag[r])),(c.data&&c.hasContent&&c.contentType!==!1||t.contentType)&&T.setRequestHeader("Content-Type",c.contentType),T.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+("*"!==c.dataTypes[0]?", "+sn+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)T.setRequestHeader(l,c.headers[l]);if(c.beforeSend&&(c.beforeSend.call(p,T,c)===!1||2===v))return T.abort();b="abort";for(l in{success:1,error:1,complete:1})T[l](c[l]);if(n=ln(on,c,t,T)){T.readyState=1,u&&f.trigger("ajaxSend",[T,c]),c.async&&c.timeout>0&&(s=setTimeout(function(){T.abort("timeout")},c.timeout));try{v=1,n.send(m,k)}catch(C){if(!(2>v))throw C;k(-1,C)}}else k(-1,"No Transport");function k(e,t,o,a){var l,m,y,b,w,C=t;2!==v&&(v=2,s&&clearTimeout(s),n=undefined,i=a||"",T.readyState=e>0?4:0,l=e>=200&&300>e||304===e,o&&(b=pn(c,T,o)),b=fn(c,b,T,l),l?(c.ifModified&&(w=T.getResponseHeader("Last-Modified"),w&&(x.lastModified[r]=w),w=T.getResponseHeader("etag"),w&&(x.etag[r]=w)),204===e||"HEAD"===c.type?C="nocontent":304===e?C="notmodified":(C=b.state,m=b.data,y=b.error,l=!y)):(y=C,(e||!C)&&(C="error",0>e&&(e=0))),T.status=e,T.statusText=(t||C)+"",l?h.resolveWith(p,[m,C,T]):h.rejectWith(p,[T,C,y]),T.statusCode(g),g=undefined,u&&f.trigger(l?"ajaxSuccess":"ajaxError",[T,c,l?m:y]),d.fireWith(p,[T,C]),u&&(f.trigger("ajaxComplete",[T,c]),--x.active||x.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,t){return x.get(e,undefined,t,"script")}}),x.each(["get","post"],function(e,t){x[t]=function(e,n,r,i){return x.isFunction(n)&&(i=i||r,r=n,n=undefined),x.ajax({url:e,type:t,dataType:i,data:n,success:r})}});function pn(e,t,n){var r,i,o,s,a=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),r===undefined&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in a)if(a[i]&&a[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}s||(s=i)}o=o||s}return o?(o!==u[0]&&u.unshift(o),n[o]):undefined}function fn(e,t,n,r){var i,o,s,a,u,l={},c=e.dataTypes.slice();if(c[1])for(s in e.converters)l[s.toLowerCase()]=e.converters[s];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(s=l[u+" "+o]||l["* "+o],!s)for(i in l)if(a=i.split(" "),a[1]===o&&(s=l[u+" "+a[0]]||l["* "+a[0]])){s===!0?s=l[i]:l[i]!==!0&&(o=a[0],c.unshift(a[1]));break}if(s!==!0)if(s&&e["throws"])t=s(t);else try{t=s(t)}catch(p){return{state:"parsererror",error:s?p:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===undefined&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),x.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(r,i){t=x("<script>").prop({async:!0,charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&i("error"===e.type?404:200,e.type)}),o.head.appendChild(t[0])},abort:function(){n&&n()}}}});var hn=[],dn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=hn.pop()||x.expando+"_"+Yt++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,s,a=t.jsonp!==!1&&(dn.test(t.url)?"url":"string"==typeof t.data&&!(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&dn.test(t.data)&&"data");return a||"jsonp"===t.dataTypes[0]?(i=t.jsonpCallback=x.isFunction(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,a?t[a]=t[a].replace(dn,"$1"+i):t.jsonp!==!1&&(t.url+=(Vt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return s||x.error(i+" was not called"),s[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){s=arguments},r.always(function(){e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,hn.push(i)),s&&x.isFunction(o)&&o(s[0]),s=o=undefined}),"script"):undefined}),x.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(e){}};var gn=x.ajaxSettings.xhr(),mn={0:200,1223:204},yn=0,vn={};e.ActiveXObject&&x(e).on("unload",function(){for(var e in vn)vn[e]();vn=undefined}),x.support.cors=!!gn&&"withCredentials"in gn,x.support.ajax=gn=!!gn,x.ajaxTransport(function(e){var t;return x.support.cors||gn&&!e.crossDomain?{send:function(n,r){var i,o,s=e.xhr();if(s.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(i in e.xhrFields)s[i]=e.xhrFields[i];e.mimeType&&s.overrideMimeType&&s.overrideMimeType(e.mimeType),e.crossDomain||n["X-Requested-With"]||(n["X-Requested-With"]="XMLHttpRequest");for(i in n)s.setRequestHeader(i,n[i]);t=function(e){return function(){t&&(delete vn[o],t=s.onload=s.onerror=null,"abort"===e?s.abort():"error"===e?r(s.status||404,s.statusText):r(mn[s.status]||s.status,s.statusText,"string"==typeof s.responseText?{text:s.responseText}:undefined,s.getAllResponseHeaders()))}},s.onload=t(),s.onerror=t("error"),t=vn[o=yn++]=t("abort"),s.send(e.hasContent&&e.data||null)},abort:function(){t&&t()}}:undefined});var xn,bn,wn=/^(?:toggle|show|hide)$/,Tn=RegExp("^(?:([+-])=|)("+b+")([a-z%]*)$","i"),Cn=/queueHooks$/,kn=[An],Nn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Tn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),s=(x.cssNumber[e]||"px"!==o&&+r)&&Tn.exec(x.css(n.elem,e)),a=1,u=20;if(s&&s[3]!==o){o=o||s[3],i=i||[],s=+r||1;do a=a||".5",s/=a,x.style(n.elem,e,s+o);while(a!==(a=n.cur()/r)&&1!==a&&--u)}return i&&(s=n.start=+s||+r||0,n.unit=o,n.end=i[1]?s+(i[1]+1)*i[2]:+i[2]),n}]};function En(){return setTimeout(function(){xn=undefined}),xn=x.now()}function Sn(e,t,n){var r,i=(Nn[t]||[]).concat(Nn["*"]),o=0,s=i.length;for(;s>o;o++)if(r=i[o].call(n,t,e))return r}function jn(e,t,n){var r,i,o=0,s=kn.length,a=x.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;var t=xn||En(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,s=0,u=l.tweens.length;for(;u>s;s++)l.tweens[s].run(o);return a.notifyWith(e,[l,o,n]),1>o&&u?n:(a.resolveWith(e,[l]),!1)},l=a.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:xn||En(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)l.tweens[n].run(1);return t?a.resolveWith(e,[l,t]):a.rejectWith(e,[l,t]),this}}),c=l.props;for(Dn(c,l.opts.specialEasing);s>o;o++)if(r=kn[o].call(l,e,c,l.opts))return r;return x.map(c,Sn,l),x.isFunction(l.opts.start)&&l.opts.start.call(e,l),x.fx.timer(x.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function Dn(e,t){var n,r,i,o,s;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),s=x.cssHooks[r],s&&"expand"in s){o=s.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(jn,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Nn[n]=Nn[n]||[],Nn[n].unshift(t)},prefilter:function(e,t){t?kn.unshift(e):kn.push(e)}});function An(e,t,n){var r,i,o,s,a,u,l=this,c={},p=e.style,f=e.nodeType&&Lt(e),h=q.get(e,"fxshow");n.queue||(a=x._queueHooks(e,"fx"),null==a.unqueued&&(a.unqueued=0,u=a.empty.fire,a.empty.fire=function(){a.unqueued||u()}),a.unqueued++,l.always(function(){l.always(function(){a.unqueued--,x.queue(e,"fx").length||a.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(p.display="inline-block")),n.overflow&&(p.overflow="hidden",l.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],wn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show")){if("show"!==i||!h||h[r]===undefined)continue;f=!0}c[r]=h&&h[r]||x.style(e,r)}if(!x.isEmptyObject(c)){h?"hidden"in h&&(f=h.hidden):h=q.access(e,"fxshow",{}),o&&(h.hidden=!f),f?x(e).show():l.done(function(){x(e).hide()}),l.done(function(){var t;q.remove(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)s=Sn(f?h[r]:0,r,l),r in h||(h[r]=s.start,f&&(s.end=s.start,s.start="width"===r||"height"===r?1:0))}}function Ln(e,t,n,r,i){return new Ln.prototype.init(e,t,n,r,i)}x.Tween=Ln,Ln.prototype={constructor:Ln,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=Ln.propHooks[this.prop];return e&&e.get?e.get(this):Ln.propHooks._default.get(this)},run:function(e){var t,n=Ln.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Ln.propHooks._default.set(this),this}},Ln.prototype.init.prototype=Ln.prototype,Ln.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},Ln.propHooks.scrollTop=Ln.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(qn(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Lt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),s=function(){var t=jn(this,x.extend({},e),o);(i||q.get(this,"finish"))&&t.stop(!0)};return s.finish=s,i||o.queue===!1?this.each(s):this.queue(o.queue,s)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=undefined),t&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=x.timers,s=q.get(this);if(i)s[i]&&s[i].stop&&r(s[i]);else for(i in s)s[i]&&s[i].stop&&Cn.test(i)&&r(s[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));(t||!n)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=q.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,s=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;s>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function qn(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=jt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:qn("show"),slideUp:qn("hide"),slideToggle:qn("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=Ln.prototype.init,x.fx.tick=function(){var e,t=x.timers,n=0;for(xn=x.now();t.length>n;n++)e=t[n],e()||t[n]!==e||t.splice(n--,1);t.length||x.fx.stop(),xn=undefined},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){bn||(bn=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(bn),bn=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===undefined?this:this.each(function(t){x.offset.setOffset(this,e,t)});var t,n,i=this[0],o={top:0,left:0},s=i&&i.ownerDocument;if(s)return t=s.documentElement,x.contains(t,i)?(typeof i.getBoundingClientRect!==r&&(o=i.getBoundingClientRect()),n=Hn(s),{top:o.top+n.pageYOffset-t.clientTop,left:o.left+n.pageXOffset-t.clientLeft}):o},x.offset={setOffset:function(e,t,n){var r,i,o,s,a,u,l,c=x.css(e,"position"),p=x(e),f={};"static"===c&&(e.style.position="relative"),a=p.offset(),o=x.css(e,"top"),u=x.css(e,"left"),l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1,l?(r=p.position(),s=r.top,i=r.left):(s=parseFloat(o)||0,i=parseFloat(u)||0),x.isFunction(t)&&(t=t.call(e,n,a)),null!=t.top&&(f.top=t.top-a.top+s),null!=t.left&&(f.left=t.left-a.left+i),"using"in t?t.using.call(e,f):p.css(f)}},x.fn.extend({position:function(){if(this[0]){var e,t,n=this[0],r={top:0,left:0};return"fixed"===x.css(n,"position")?t=n.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(r=e.offset()),r.top+=x.css(e[0],"borderTopWidth",!0),r.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-r.top-x.css(n,"marginTop",!0),left:t.left-r.left-x.css(n,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,n){var r="pageYOffset"===n;x.fn[t]=function(i){return x.access(this,function(t,i,o){var s=Hn(t);return o===undefined?s?s[n]:t[i]:(s?s.scrollTo(r?e.pageXOffset:o,r?o:e.pageYOffset):t[i]=o,undefined)},t,i,arguments.length,null)}});function Hn(e){return x.isWindow(e)?e:9===e.nodeType&&e.defaultView}x.each({Height:"height",Width:"width"},function(e,t){x.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){x.fn[r]=function(r,i){var o=arguments.length&&(n||"boolean"!=typeof r),s=n||(r===!0||i===!0?"margin":"border");return x.access(this,function(t,n,r){var i;return x.isWindow(t)?t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):r===undefined?x.css(t,n,s):x.style(t,n,r,s)},t,o?r:undefined,o,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}),"object"==typeof e&&"object"==typeof e.document&&(e.jQuery=e.$=x)})(window);
;(function(e){function u(q,a,g,k){var i=a.button||g.button,n=a.url||g.url,o=a.provider_name||g.provider_name,p=a.suggest_notebook||g.suggest_notebook,r=a.content_id||g.content_id,s=a.code||g.code,t=a.title||g.title,m=a.suggest_tags||g.suggest_tags,a=a.styling||g.styling;if("article-clipper"==i||"article-clipper-remember"==i||"article-clipper-jp"==i||"article-clipper-rus"==i||"article-clipper-fr"==i||"article-clipper-es"==i||"article-clipper-de"==i||"article-clipper-vert"==i||"site-mem-32"==i||"site-mem-36"==
i||"site-mem-22"==i||"site-mem-16"==i)i="http://static.evernote.com/"+i+".png";var d={url:n,providerName:o,suggestNotebook:p,contentId:r,code:s,title:t,suggestTags:m,styling:a};0==k&&e("body").append('<script type="text/javascript" src="http://static.evernote.com/noteit.js"><\/script>');k=e(document.createElement("a")).attr({href:"#"}).click(function(){Evernote&&Evernote.doClip(d);return!1}).append('<img src="'+i+'" alt="Clip to Evernote" style="border: none" />');e(q).html(k)}function n(e){var a=
"",g;for(g in e)""!=e[g]&&(a+=" "+g+'="'+e[g]+'"');return a}function p(e){var a="",g;for(g in e)""!=e[g]&&(a+=""!=a?"&amp;":"",a+=g+"="+e[g]+"");return a}function k(e){var a=[[/&/g,"&amp;"],[/</g,"&lt;"],[/>/g,"&gt;"],[/"/g,"&quot;"],[/'/g,"&#039;"]],g;for(g in a)e=e.replace(a[g][0],a[g][1]);return e}function o(e){return encodeURIComponent(e).replace(/[!*'()]/g,function(a){return"%"+a.charCodeAt(0).toString(16)})}e.fn.socialbutton=function(q,a){var a=a||{},g=document.URL,v=document.URL,i=document.URL,
w={type0_16:58,type0_20:70,type0_23:76,type1_16:58,type1_20:73,type1_23:78,type2_16:58,type2_20:73,type2_23:78,type3_16:49,type3_20:61,type3_23:64,type4_16:16,type4_22:21,type4_32:32},x={button:"article-clipper",url:"",provider_name:"",suggest_notebook:"",content_id:"",code:"",title:"",suggest_tags:"",styling:""},y=document.URL,r=document.title,s=document.URL,t=document.URL,m=this.size()-1;return this.each(function(d){switch(q){case "mixi_check":var b=a.key||"",h=a.button||"button-1",c=a.url||"";
""!=b&&(b='<a href="http://mixi.jp/share.pl" class="mixi-check-button"'+n({"data-key":b,"data-url":k(c),"data-button":h})+">Check</a>",e(this).html(b),d==m&&e("body").append('<script type="text/javascript" src="http://static.mixi.jp/js/share.js"><\/script>'));break;case "mixi_like":var c=a.key||"",f=a.url||g,d=void 0!=a.width?a.width:0,b=void 0!=a.height?a.height:0,l=void 0!=a.show_faces?a.show_faces:!0,h=a.style||"";""!=c&&(a.url&&(f=decodeURIComponent(f)),f=o(f),0==d&&(d=l?450:140),0==b?b=l?80:
20:l&&80>b?b=80:!l&&20>b&&(b=20),c=p({href:f,service_key:c,width:d,show_faces:l?"true":"false"}),d="<iframe"+n({src:"http://plugins.mixi.jp/favorite.pl?"+c,scrolling:"no",frameborder:"0",allowTransparency:"true",style:"border:0; overflow:hidden; width:"+d+"px; height:"+b+"px; "+h})+"></iframe>",e(this).html(d));break;case "facebook_like":var d=a.layout||a.button||"standard",b=a.url||v,h=void 0!=a.show_faces?a.show_faces:!0,c=void 0!=a.width?a.width:0,f=void 0!=a.height?a.height:0,l=a.action||"like",
j=a.locale||"",z=a.font||"",A=a.colorscheme||"light";a.url&&(b=decodeURIComponent(b));b=o(b);switch(d){case "standard":0==c?c=450:225>c&&(c=225);0==f?f=h?80:35:35>f&&(f=35);break;case "button_count":0==c?c=120:90>c&&(c=90);0==f?f=25:25>f&&(f=25);break;case "box_count":0==c?c=80:55>c&&(c=55),0==f?f=70:70>f&&(f=70)}d='<iframe src="http://www.facebook.com/plugins/like.php?'+p({href:b,layout:d,show_faces:h?"true":"false",width:c,action:l,locale:j,font:z,colorscheme:A,height:f})+'" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:'+
c+"px; height:"+f+'px;" allowTransparency="true"></iframe>';e(this).html(d);break;case "facebook_share":b=a.text||"";b='<a name="fb_share"'+n({type:a.type||a.button||"button_count",share_url:k(a.url||"")})+">"+b+"</a>";0==d&&(b+='<script type="text/javascript" src="http://static.ak.fbcdn.net/connect.php/js/FB.Share"><\/script>');e(this).html(b);break;case "twitter":b=a.text||"";h=a.lang||"ja";c=a.via||"";f=a.related||"";b='<a href="http://twitter.com/share" class="twitter-share-button"'+n({"data-count":a.count||
a.button||"vertical","data-url":k(a.url||""),"data-text":b,"data-lang":h,"data-via":c,"data-related":f})+">Tweet</a>";e(this).html(b);d==m&&e("body").append('<script type="text/javascript" src="http://platform.twitter.com/widgets.js"><\/script>');break;case "gree_sf":d=a.type||a.button||0;b=a.url||i;h=void 0!=a.width?a.width:0;c=void 0!=a.height?a.height:20;a.url&&(b=decodeURIComponent(b));b=o(b);switch(d){case 0:case 1:case 2:case 3:16!=c&&(20!=c&&23!=c)&&(c=20);break;case 4:16!=c&&(22!=c&&32!=c)&&
(c=22);break;default:h=d=0,c=20}0==h&&(h=w["type"+d+"_"+c]);d='<iframe src="http://share.gree.jp/share?'+p({url:b,type:""+d,height:c})+'" scrolling="no" frameborder="0" marginwidth="0" marginheight="0" style="border:none; overflow:hidden; width:'+h+"px; height:"+c+'px;" allowTransparency="true"></iframe>';e(this).html(d);break;case "evernote":u(this,a,x,d,m);break;case "hatena":d=a.layout||a.button||"standard";b=a.url||y;h=a.title||r;b=k(b);h=k(h);d="<a"+n({href:"http://b.hatena.ne.jp/entry/"+b,"class":"hatena-bookmark-button",
"data-hatena-bookmark-title":h,"data-hatena-bookmark-layout":d,title:"\u3053\u306e\u30a8\u30f3\u30c8\u30ea\u30fc\u3092\u306f\u3066\u306a\u30d6\u30c3\u30af\u30de\u30fc\u30af\u306b\u8ffd\u52a0"})+'><img src="http://b.st-hatena.com/images/entry-button/button-only.gif" alt="\u3053\u306e\u30a8\u30f3\u30c8\u30ea\u30fc\u3092\u306f\u3066\u306a\u30d6\u30c3\u30af\u30de\u30fc\u30af\u306b\u8ffd\u52a0" width="20" height="20" style="border: none;" /></a><script type="text/javascript" src="http://b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async="async"><\/script>';
e(this).html(d);break;case "hatena_oldstyle":d=a.button||"http://d.hatena.ne.jp/images/b_append.gif";b=a.url||s;h=void 0!=a.height?a.height:13;c=void 0!=a.padding?a.padding:7;b=k(b);e(this).html('<span style="font-size: '+h+'px; line-height: 100%; "><span style="padding-right: '+c+'px"><a href="http://b.hatena.ne.jp/entry/add/'+b+'" target="_blank"><img src="'+d+'" style="border: none; vertical-align: text-bottom" /></a></span><a href="http://b.hatena.ne.jp/entry/'+b+'" target="_blank"><img src="http://b.hatena.ne.jp/entry/image/'+
b+'" style="border: none; vertical-align: text-bottom" /></a></span>');break;case "google_plusone":j=a;if(!(e.browser.msie&&8>parseInt(e.browser.version,10))){c=j.size||j.button||"";f=j.href||j.url||"";b=j.lang||"";h=j.parsetags||"";l=j.callback||"";j=void 0!=j.count?j.count:!0;switch(c){case "small":case "standard":case "medium":break;case "tall":j=!0;break;default:c="standard",j=!0}c=e("<div>").attr({"data-callback":l,"data-count":j?"true":"false","data-href":f,"data-size":c}).addClass("g-plusone");
e(this).append(c);d==m&&(d="",""!=b&&(d+='lang: "'+k(b)+'"'),""!=h&&(d=d+(""!=d?",":"")+('parsetags: "'+k(h)+"'")),""!=d&&(d="{"+d+"}"),"undefined"===typeof gapi||"undefined"===typeof gapi.plusone?e("body").append('<script type="text/javascript" src="https://apis.google.com/js/plusone.js">'+d+"<\/script>"):gapi.plusone.go())}break;case "pinterest":b=a.url||t,h=a.button||"horizontal",c=void 0!=a.media?a.media:"",f=void 0!=a.description?a.description:"",b=o(decodeURIComponent(b)),c=o(decodeURIComponent(c)),
f=decodeURIComponent(f),b='<a href="http://pinterest.com/pin/create/button/?'+p({url:b,media:c,description:f})+'" class="pin-it-button" count-layout="'+h+'"><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>',e(this).html(b),d==m&&e("body").append('<script type="text/javascript" src="//assets.pinterest.com/js/pinit.js"><\/script>')}return!0})}})(jQuery);;(function() {
  var IR_LOADED, IR_URL,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.FX = (function() {
    function FX(ctx) {
      this.ctx = ctx;
      this["in"] = this.ctx.createGain();
      this["in"].gain.value = 1.0;
      this.dry = this.ctx.createGain();
      this.dry.gain.value = 1.0;
      this.wet = this.ctx.createGain();
      this.wet.gain.value = 1.0;
      this.out = this.ctx.createGain();
      this.out.gain.value = 1.0;
    }

    FX.prototype.connect = function(dst) {
      return this.out.connect(dst);
    };

    FX.prototype.disconnect = function() {
      return this.out.disconnect();
    };

    FX.prototype.setInput = function(d) {
      return this["in"].gain.value = d;
    };

    FX.prototype.setOutput = function(d) {
      return this.out.gain.value = d;
    };

    FX.prototype.setDry = function(d) {
      return this.dry.gain.value = d;
    };

    FX.prototype.setWet = function(d) {
      return this.wet.gain.value = d;
    };

    FX.prototype.appendTo = function(dst) {
      $(dst).append(this.view.dom);
      return this.view.initEvent();
    };

    FX.prototype.remove = function() {
      return this.source.removeEffect(this);
    };

    FX.prototype.setSource = function(source) {
      this.source = source;
    };

    return FX;

  })();

  this.Delay = (function(_super) {
    __extends(Delay, _super);

    function Delay(ctx) {
      this.ctx = ctx;
      Delay.__super__.constructor.call(this, this.ctx);
      this.delay = this.ctx.createDelay();
      this.delay.delayTime.value = 0.23;
      this.lofi = this.ctx.createBiquadFilter();
      this.lofi.type = "peaking";
      this.lofi.frequency.value = 1200;
      this.lofi.Q.value = 0.0;
      this.lofi.gain.value = 1.0;
      this.feedback = this.ctx.createGain();
      this.feedback.gain.value = 0.2;
      this["in"].connect(this.lofi);
      this.lofi.connect(this.delay);
      this.delay.connect(this.wet);
      this.delay.connect(this.feedback);
      this.feedback.connect(this.lofi);
      this.wet.connect(this.out);
      this["in"].connect(this.out);
      this.view = new DelayView(this);
    }

    Delay.prototype.setDelay = function(d) {
      return this.delay.delayTime.value = d;
    };

    Delay.prototype.setFeedback = function(d) {
      return this.feedback.gain.value = d;
    };

    Delay.prototype.setLofi = function(d) {
      return this.lofi.Q.value = d;
    };

    Delay.prototype.setParam = function(p) {
      if (p.delay != null) {
        this.setDelay(p.delay);
      }
      if (p.feedback != null) {
        this.setFeedback(p.feedback);
      }
      if (p.lofi != null) {
        this.setLofi(p.lofi);
      }
      if (p.wet != null) {
        this.setWet(p.wet);
      }
      return this.view.setParam(p);
    };

    Delay.prototype.getParam = function(p) {
      return {
        effect: 'Delay',
        delay: this.delay.delayTime.value,
        feedback: this.feedback.gain.value,
        lofi: this.lofi.Q.value,
        wet: this.wet.gain.value
      };
    };

    return Delay;

  })(this.FX);

  this.Reverb = (function(_super) {
    __extends(Reverb, _super);

    function Reverb(ctx) {
      this.ctx = ctx;
      Reverb.__super__.constructor.call(this, this.ctx);
      this.reverb = this.ctx.createConvolver();
      this["in"].connect(this.reverb);
      this.reverb.connect(this.wet);
      this.wet.connect(this.out);
      this["in"].connect(this.out);
      this.setIR('BIG_SNARE');
      this.view = new ReverbView(this);
    }

    Reverb.prototype.setIR = function(name) {
      var req, url,
        _this = this;
      this.name = name;
      if (IR_LOADED[name] != null) {
        this.reverb.buffer = IR_LOADED[name];
        return;
      }
      url = IR_URL[name];
      if (url == null) {
        return;
      }
      req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.responseType = "arraybuffer";
      req.onload = function() {
        return _this.ctx.decodeAudioData(req.response, (function(buffer) {
          _this.reverb.buffer = buffer;
          return IR_LOADED[name] = buffer;
        }), function(err) {
          console.log('ajax error');
          return console.log(err);
        });
      };
      return req.send();
    };

    Reverb.prototype.setParam = function(p) {
      if (p.name != null) {
        this.setIR(p.name);
      }
      if (p.wet != null) {
        this.setWet(p.wet);
      }
      return this.view.setParam(p);
    };

    Reverb.prototype.getParam = function(p) {
      return {
        effect: 'Reverb',
        name: this.name,
        wet: this.wet.gain.value
      };
    };

    return Reverb;

  })(this.FX);

  this.Compressor = (function(_super) {
    __extends(Compressor, _super);

    function Compressor(ctx) {
      this.ctx = ctx;
      Compressor.__super__.constructor.call(this, this.ctx);
      this.comp = this.ctx.createDynamicsCompressor();
      this["in"].connect(this.comp);
      this.comp.connect(this.out);
      this["in"].gain.value = 1.0;
      this.out.gain.value = 1.0;
      this.view = new CompressorView(this);
    }

    Compressor.prototype.setAttack = function(d) {
      return this.comp.attack.value = d;
    };

    Compressor.prototype.setRelease = function(d) {
      return this.comp.release.value = d;
    };

    Compressor.prototype.setThreshold = function(d) {
      return this.comp.threshold.value = d;
    };

    Compressor.prototype.setRatio = function(d) {
      return this.comp.ratio.value = d;
    };

    Compressor.prototype.setKnee = function(d) {
      return this.comp.knee.value = d;
    };

    Compressor.prototype.setParam = function(p) {
      if (p.attack != null) {
        this.setAttack(p.attack);
      }
      if (p.release != null) {
        this.setRelease(p.release);
      }
      if (p.threshold != null) {
        this.setThreshold(p.threshold);
      }
      if (p.ratio != null) {
        this.setRatio(p.ratio);
      }
      if (p.knee != null) {
        this.setKnee(p.knee);
      }
      if (p.input != null) {
        this.setInput(p.input);
      }
      if (p.output != null) {
        this.setOutput(p.output);
      }
      return this.view.setParam(p);
    };

    Compressor.prototype.getParam = function(p) {
      return {
        effect: 'Compressor',
        attack: this.comp.attack.value,
        release: this.comp.release.value,
        threshold: this.comp.threshold.value,
        ratio: this.comp.ratio.value,
        knee: this.comp.knee.value,
        input: this["in"].gain.value,
        output: this.out.gain.value
      };
    };

    return Compressor;

  })(this.FX);

  this.Limiter = (function() {
    function Limiter(ctx) {
      this.ctx = ctx;
      this["in"] = this.ctx.createDynamicsCompressor();
      this.out = this.ctx.createDynamicsCompressor();
      this["in"].connect(this.out);
      this["in"].threshold.value = -6;
      this.out.threshold.value = -10;
      this.out.ratio.value = 20;
    }

    Limiter.prototype.connect = function(dst) {
      return this.out.connect(dst);
    };

    return Limiter;

  })();

  this.Fuzz = (function(_super) {
    __extends(Fuzz, _super);

    function Fuzz(ctx) {
      this.ctx = ctx;
      Fuzz.__super__.constructor.call(this, this.ctx);
      this.fuzz = this.ctx.createWaveShaper();
      this["in"].connect(this.fuzz);
      this.fuzz.connect(this.out);
      this["in"].gain.value = 1.0;
      this.out.gain.value = 1.0;
      this.type = 'Sigmoid';
      this.samples = 2048;
      this.fuzz.curve = new Float32Array(this.samples);
      this.setGain(0.08);
      this.view = new FuzzView(this);
    }

    Fuzz.prototype.setType = function(type) {
      this.type = type;
    };

    Fuzz.prototype.setGain = function(gain) {
      var i, ratio, sigmax, sigmoid, x, _i, _j, _ref, _ref1, _results, _results1;
      this.gain = gain;
      sigmax = 2.0 / (1 + Math.exp(-this.gain * 1.0)) - 1.0;
      ratio = 1.0 / sigmax;
      if (this.type === 'Sigmoid') {
        _results = [];
        for (i = _i = 0, _ref = this.samples; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          x = i * 2.0 / this.samples - 1.0;
          sigmoid = 2.0 / (1 + Math.exp(-Math.pow(this.gain, 3) * 1000 * x)) - 1.0;
          _results.push(this.fuzz.curve[i] = sigmoid * ratio);
        }
        return _results;
      } else if (this.type === 'Octavia') {
        _results1 = [];
        for (i = _j = 0, _ref1 = this.samples; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          x = i * 2.0 / this.samples - 1.0;
          sigmoid = 2.0 / (1 + Math.exp(-Math.pow(this.gain, 2) * 10 * x)) - 1.0;
          _results1.push(this.fuzz.curve[i] = Math.abs(sigmoid * ratio) * 2.0 - 1.0);
        }
        return _results1;
      }
    };

    Fuzz.prototype.setParam = function(p) {
      if (p.type != null) {
        this.setType(p.type);
      }
      if (p.gain != null) {
        this.setGain(p.gain);
      }
      if (p.input != null) {
        this.setInput(p.input);
      }
      if (p.output != null) {
        this.setOutput(p.output);
      }
      return this.view.setParam(p);
    };

    Fuzz.prototype.getParam = function(p) {
      return {
        effect: 'Fuzz',
        type: this.type,
        gain: this.gain,
        input: this["in"].gain.value,
        output: this.out.gain.value
      };
    };

    return Fuzz;

  })(this.FX);

  this.Double = (function(_super) {
    __extends(Double, _super);

    function Double(ctx) {
      this.ctx = ctx;
      Double.__super__.constructor.call(this, this.ctx);
      this.delay = this.ctx.createDelay();
      this.delay.delayTime.value = 0.03;
      this.pan_l = new Panner(this.ctx);
      this.pan_r = new Panner(this.ctx);
      this.setWidth([0, 0, -1]);
      this["in"].connect(this.pan_l["in"]);
      this["in"].connect(this.delay);
      this.delay.connect(this.pan_r["in"]);
      this.pan_l.connect(this.out);
      this.pan_r.connect(this.out);
      this.out.gain.value = 0.6;
      this.view = new DoubleView(this);
    }

    Double.prototype.setDelay = function(d) {
      return this.delay.delayTime.value = d;
    };

    Double.prototype.setWidth = function(pos) {
      this.pos = pos;
      this.pan_l.setPosition(this.pos);
      return this.pan_r.setPosition(-this.pos);
    };

    Double.prototype.setParam = function(p) {
      if (p.delay != null) {
        this.setDelay(p.delay);
      }
      if (p.width != null) {
        this.setWidth(p.width);
      }
      return this.view.setParam(p);
    };

    Double.prototype.getParam = function(p) {
      return {
        effect: 'Double',
        delay: this.delay.delayTime.value,
        width: this.pos
      };
    };

    return Double;

  })(this.FX);

  IR_URL = {
    'BIG_SNARE': 'static/IR/H3000/206_BIG_SNARE.wav',
    'Sweep_Reverb': 'static/IR/H3000/106_Sweep_Reverb.wav',
    'Reverb_Factory': 'static/IR/H3000/107_Reverb_Factory.wav',
    'Dense_Room': 'static/IR/H3000/114_Dense_Room.wav',
    '8_SEC_REVERB': 'static/IR/H3000/154_8_SEC_REVERB.wav',
    'GUITAR_ROOM': 'static/IR/H3000/178_GUITAR_ROOM.wav',
    'HUNTER_DELAY': 'static/IR/H3000/181_HUNTER_DELAY.wav',
    'JERRY_RACE_CAR': 'static/IR/H3000/182_JERRY_RACE_CAR.wav',
    'ResoVibroEee': 'static/IR/H3000/192_ResoVibroEee.wav',
    'ROOM_OF_DOOM': 'static/IR/H3000/193_ROOM_OF_DOOM.wav',
    'RHYTHM_&_REVERB': 'static/IR/H3000/194_RHYTHM_&_REVERB.wav',
    'BIG_SNARE': 'static/IR/H3000/206_BIG_SNARE.wav',
    'BIG_SWEEP': 'static/IR/H3000/207_BIG_SWEEP.wav',
    'BRIGHT_ROOM': 'static/IR/H3000/209_BRIGHT_ROOM.wav',
    'CANYON': 'static/IR/H3000/211_CANYON.wav',
    'DARK_ROOM': 'static/IR/H3000/213_DARK_ROOM.wav',
    'DISCRETE-VERB': 'static/IR/H3000/215_DISCRETE-VERB.wav',
    "EXPLODING_'VERB": "static/IR/H3000/219_EXPLODING_'VERB.wav",
    'GATED_REVERB': 'static/IR/H3000/223_GATED_REVERB.wav',
    'LOCKER_ROOM': 'static/IR/H3000/230_LOCKER_ROOM.wav',
    'RANDOM_GATE': 'static/IR/H3000/240_RANDOM_GATE.wav',
    'REVERSE_GATE': 'static/IR/H3000/241_REVERSE_GATE.wav',
    'RICH_PLATE': 'static/IR/H3000/243_RICH_PLATE.wav',
    'SHIMMERISH': 'static/IR/H3000/246_SHIMMERISH.wav',
    'SMALL_ROOM': 'static/IR/H3000/248_SMALL_ROOM.wav',
    'TONAL_ROOM': 'static/IR/H3000/254_TONAL_ROOM.wav',
    'WARM_HALL': 'static/IR/H3000/257_WARM_HALL.wav',
    'THRAX-VERB': 'static/IR/H3000/261_THRAX-VERB.wav',
    'TWIRLING_ROOM': 'static/IR/H3000/262_TWIRLING_ROOM.wav',
    'USEFUL_VERB': 'static/IR/H3000/265_USEFUL_VERB.wav',
    'FLUTTEROUS_ROOM': 'static/IR/H3000/278_FLUTTEROUS_ROOM.wav',
    'MARKS_MED_DARK': 'static/IR/H3000/282_MARKS_MED_DARK.wav',
    'LG_GUITAR_ROOM': 'static/IR/H3000/283_LG_GUITAR_ROOM.wav',
    'ACCURATE_ROOM': 'static/IR/H3000/368_ACCURATE_ROOM.wav',
    'BASS_SPACE': 'static/IR/H3000/371_BASS_SPACE.wav',
    'BriteBrassPlate': 'static/IR/H3000/372_BriteBrassPlate.wav',
    'CLOSE_MIKED': 'static/IR/H3000/377_CLOSE_MIKED.wav',
    'COMB_SPACE_1': 'static/IR/H3000/378_COMB_SPACE_1.wav',
    'COMPRESSED_AIR': 'static/IR/H3000/379_COMPRESSED_AIR.wav',
    'DOUBLE_SPACE_DENSE_ROOM': 'static/IR/H3000/381_DOUBLE_SPACE_DENSE_ROOM.wav',
    'DENSE_HALL_2': 'static/IR/H3000/382_DENSE_HALL_2.wav',
    'DELAY_W__ROOM': 'static/IR/H3000/383_DELAY_W__ROOM.wav',
    'DRAGON_BREATH': 'static/IR/H3000/385_DRAGON_BREATH.wav',
    'DRUM_AMBIENCE': 'static/IR/H3000/387_DRUM_AMBIENCE.wav',
    'GATED_FENCE': 'static/IR/H3000/390_GATED_FENCE.wav',
    'GATED_ROOM_2': 'static/IR/H3000/391_GATED_ROOM_2.wav',
    'GENERIC_HALL': 'static/IR/H3000/392_GENERIC_HALL.wav',
    'GREAT_DRUMSPACE': 'static/IR/H3000/393_GREAT_DRUMSPACE.wav',
    '5SEC_HANG_VERB': 'static/IR/H3000/394_5SEC_HANG_VERB.wav',
    'HUGE_DENSE_HALL': 'static/IR/H3000/395_HUGE_DENSE_HALL.wav',
    'HUGE_SYNTHSPACE': 'static/IR/H3000/396_HUGE_SYNTHSPACE.wav',
    'MANY_REFLECTIONS': 'static/IR/H3000/516_MANY_REFLECTIONS.wav',
    'AMBIENCE': 'static/IR/H3000/555_AMBIENCE.wav',
    'AMBIENT_BOOTH': 'static/IR/H3000/556_AMBIENT_BOOTH.wav',
    'BATHROOM': 'static/IR/H3000/557_BATHROOM.wav',
    'CRASS_ROOM': 'static/IR/H3000/559_CRASS_ROOM.wav',
    "DREW'S_CHAMBER": "static/IR/H3000/561_DREW'S_CHAMBER.wav",
    'DRUM_AMBIENCE': 'static/IR/H3000/562_DRUM_AMBIENCE.wav',
    'EMPTY_CLOSET': 'static/IR/H3000/563_EMPTY_CLOSET.wav',
    'EMPTY_ROOM': 'static/IR/H3000/564_EMPTY_ROOM.wav',
    'MEDIUM_SPACE': 'static/IR/H3000/565_MEDIUM_SPACE.wav',
    'NEW_HOUSE': 'static/IR/H3000/566_NEW_HOUSE.wav',
    'PRCSVHORN_PLATE': 'static/IR/H3000/567_PRCSVHORN_PLATE.wav',
    'REAL_ROOM': 'static/IR/H3000/568_REAL_ROOM.wav',
    'SMALL_ROOM': 'static/IR/H3000/569_SMALL_ROOM.wav',
    'SMLSTEREOSPACE': 'static/IR/H3000/570_SMLSTEREOSPACE.wav',
    'SMALLVOCAL_ROOM': 'static/IR/H3000/571_SMALLVOCAL_ROOM.wav',
    'TIGHT_ROOM': 'static/IR/H3000/572_TIGHT_ROOM.wav',
    'TIGHT_&_BRIGHT': 'static/IR/H3000/573_TIGHT_&_BRIGHT.wav',
    'VOCAL_BOOTH': 'static/IR/H3000/574_VOCAL_BOOTH.wav',
    'ALIVE_CHAMBER': 'static/IR/H3000/575_ALIVE_CHAMBER.wav',
    'BIG_SWEEP': 'static/IR/H3000/577_BIG_SWEEP.wav',
    "BOB'S_ROOM": "static/IR/H3000/578_BOB'S_ROOM.wav",
    'BREATHING_CANYON': 'static/IR/H3000/579_BREATHING_CANYON.wav',
    'BRIGHT_ROOM': 'static/IR/H3000/580_BRIGHT_ROOM.wav',
    'CANYON': 'static/IR/H3000/581_CANYON.wav',
    'CONCERT_HALL': 'static/IR/H3000/582_CONCERT_HALL.wav',
    'DARK_ROOM': 'static/IR/H3000/583_DARK_ROOM.wav',
    'DISCRETE-VERB': 'static/IR/H3000/584_DISCRETE-VERB.wav',
    'NORTHWEST_HALL': 'static/IR/H3000/585_NORTHWEST_HALL.wav',
    'RICH_PLATE': 'static/IR/H3000/586_RICH_PLATE.wav',
    'SLAPVERB': 'static/IR/H3000/587_SLAPVERB.wav',
    'SMOOTH_PLATE': 'static/IR/H3000/588_SMOOTH_PLATE.wav',
    'WARM_HALL': 'static/IR/H3000/589_WARM_HALL.wav',
    'ECHO-VERB': 'static/IR/H3000/591_ECHO-VERB.wav',
    "EXPLODING_'vERB": "static/IR/H3000/592_EXPLODING_'vERB.wav",
    'GATED_REVERB': 'static/IR/H3000/593_GATED_REVERB.wav',
    'GATED_ROOM': 'static/IR/H3000/594_GATED_ROOM.wav',
    'GATE_ROOM': 'static/IR/H3000/595_GATE_ROOM.wav',
    'HUMP-VERB': 'static/IR/H3000/596_HUMP-VERB.wav',
    'METALVERB': 'static/IR/H3000/597_METALVERB.wav',
    'RANDOM_GATE': 'static/IR/H3000/598_RANDOM_GATE.wav',
    'REVERSE_GATE': 'static/IR/H3000/600_REVERSE_GATE.wav',
    'REVERB_RAMP': 'static/IR/H3000/601_REVERB_RAMP.wav',
    'SHIMMERISH': 'static/IR/H3000/602_SHIMMERISH.wav',
    'TONAL_ROOM': 'static/IR/H3000/603_TONAL_ROOM.wav',
    'DRUM_PROCESSOR': 'static/IR/H3000/643_DRUM_PROCESSOR.wav',
    'LIQUID_REVERB': 'static/IR/H3000/646_LIQUID_REVERB.wav',
    'REVERSERB': 'static/IR/H3000/655_REVERSERB.wav',
    'BOUNCE_VERB': 'static/IR/H3000/712_BOUNCE_VERB.wav',
    'DEATHLESS_ROOM': 'static/IR/H3000/716_DEATHLESS_ROOM.wav',
    'ENDLESS_CAVE': 'static/IR/H3000/719_ENDLESS_CAVE.wav',
    'REVERB-a-BOUND': 'static/IR/H3000/736_REVERB-a-BOUND.wav',
    'SMALL_DARK_ROOM': 'static/IR/H3000/739_SMALL_DARK_ROOM.wav',
    'CLONEVERB': 'static/IR/H3000/793_CLONEVERB.wav',
    'LONG_&_SMOOTH': 'static/IR/H3000/795_LONG_&_SMOOTH.wav',
    'MEAT_LOCKER': 'static/IR/H3000/796_MEAT_LOCKER.wav',
    'ethereal': 'static/IR/H3000/833_ethereal.wav',
    'rewzNooRoom': 'static/IR/H3000/86_DrewzNooRoom.wav',
    'swell_reverb': 'static/IR/H3000/884_swell_reverb.wav',
    'PAPER_PLATE': 'static/IR/H3000/980_PAPER_PLATE.wav',
    'USEFUL_VERB_2': 'static/IR/H3000/985_USEFUL_VERB_2.wav',
    'ROBO_DRUM': 'static/IR/H3000/990_ROBO_DRUM.wav',
    'AIR_SHAMIR': 'static/IR/H3000/991_AIR_SHAMIR.wav',
    'SMALL_&_LIVE_VERB': 'static/IR/H3000/995_SMALL_&_LIVE_VERB.wav'
  };

  IR_LOADED = {};

}).call(this);
;(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.FXView = (function() {
    function FXView(model, dom_side) {
      this.model = model;
      this.dom_side = dom_side;
      this.minus_side = this.dom_side.find('.sidebar-effect-minus');
    }

    FXView.prototype.initEvent = function() {
      var _this = this;
      return this.minus_side.on('click', function() {
        _this.model.remove();
        return $(_this.dom_side).remove();
      });
    };

    return FXView;

  })();

  this.ReverbView = (function(_super) {
    __extends(ReverbView, _super);

    function ReverbView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_reverb').clone();
      this.dom.removeAttr('id');
      ReverbView.__super__.constructor.call(this, this.model, this.dom);
      this.name = this.dom.find('[name=name]');
      this.wet = this.dom.find('[name=wet]');
      this.initEvent();
    }

    ReverbView.prototype.initEvent = function() {
      var _this = this;
      ReverbView.__super__.initEvent.call(this);
      this.name.on('change', function() {
        _this.name_synth.val(_this.name.val());
        return _this.model.setIR(_this.name.val());
      });
      return this.wet.on('change', function() {
        return _this.model.setParam({
          wet: parseFloat(_this.wet.val()) / 100.0
        });
      });
    };

    ReverbView.prototype.setParam = function(p) {
      if (p.name != null) {
        this.name.val(p.name);
      }
      if (p.wet != null) {
        return this.wet.val(p.wet * 100);
      }
    };

    return ReverbView;

  })(this.FXView);

  this.DelayView = (function(_super) {
    __extends(DelayView, _super);

    function DelayView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_delay').clone();
      this.dom.removeAttr('id');
      DelayView.__super__.constructor.call(this, this.model, this.dom);
      this.delay = this.dom.find('[name=delay]');
      this.feedback = this.dom.find('[name=feedback]');
      this.lofi = this.dom.find('[name=lofi]');
      this.wet = this.dom.find('[name=wet]');
      this.initEvent();
    }

    DelayView.prototype.initEvent = function() {
      var _this = this;
      DelayView.__super__.initEvent.call(this);
      this.wet.on('change', function() {
        return _this.model.setParam({
          wet: parseFloat(_this.wet.val()) / 100.0
        });
      });
      this.delay.on('change', function() {
        return _this.model.setParam({
          delay: parseFloat(_this.delay.val()) / 1000.0
        });
      });
      this.feedback.on('change', function() {
        return _this.model.setParam({
          feedback: parseFloat(_this.feedback.val()) / 100.0
        });
      });
      return this.lofi.on('change', function() {
        return _this.model.setParam({
          lofi: parseFloat(_this.lofi.val()) * 5.0 / 100.0
        });
      });
    };

    DelayView.prototype.setParam = function(p) {
      if (p.delays != null) {
        this.delay.val(p.delay * 1000);
      }
      if (p.feedback != null) {
        this.feedback.val(p.feedback * 100);
      }
      if (p.lofi != null) {
        this.lofi.val(p.lofi * 20);
      }
      if (p.wet != null) {
        return this.wet.val(p.wet * 100);
      }
    };

    return DelayView;

  })(this.FXView);

  this.CompressorView = (function(_super) {
    __extends(CompressorView, _super);

    function CompressorView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_compressor').clone();
      this.dom.removeAttr('id');
      CompressorView.__super__.constructor.call(this, this.model, this.dom);
      this.attack = this.dom.find('[name=attack]');
      this.release = this.dom.find('[name=release]');
      this.threshold = this.dom.find('[name=threshold]');
      this.ratio = this.dom.find('[name=ratio]');
      this.knee = this.dom.find('[name=knee]');
      this.input = this.dom.find('[name=input]');
      this.output = this.dom.find('[name=output]');
      this.initEvent();
    }

    CompressorView.prototype.initEvent = function() {
      var _this = this;
      CompressorView.__super__.initEvent.call(this);
      this.input.on('change', function() {
        return _this.model.setParam({
          input: parseFloat(_this.input.val()) / 100.0
        });
      });
      this.output.on('change', function() {
        return _this.model.setParam({
          output: parseFloat(_this.output.val()) / 100.0
        });
      });
      this.attack.on('change', function() {
        return _this.model.setParam({
          attack: parseFloat(_this.attack.val()) / 1000.0
        });
      });
      this.release.on('change', function() {
        return _this.model.setParam({
          release: parseFloat(_this.release.val()) / 1000.0
        });
      });
      this.threshold.on('change', function() {
        return _this.model.setParam({
          threshold: parseFloat(_this.threshold.val()) / -10.0
        });
      });
      this.ratio.on('change', function() {
        return _this.model.setParam({
          ratio: parseInt(_this.ratio.val())
        });
      });
      return this.knee.on('change', function() {
        return _this.model.setParam({
          knee: parseFloat(_this.knee.val()) / 1000.0
        });
      });
    };

    CompressorView.prototype.setParam = function(p) {
      if (p.input != null) {
        this.input.val(p.input * 100);
      }
      if (p.output != null) {
        this.output.val(p.output * 100);
      }
      if (p.attacks != null) {
        this.attack.val(p.attack * 1000);
      }
      if (p.release != null) {
        this.release.val(p.release * 1000);
      }
      if (p.threshold != null) {
        this.threshold.val(p.threshold * -10);
      }
      if (p.ratio != null) {
        this.ratio.val(p.ratio);
      }
      if (p.knee != null) {
        return this.knee.val(p.knee * 1000);
      }
    };

    return CompressorView;

  })(this.FXView);

  this.FuzzView = (function(_super) {
    __extends(FuzzView, _super);

    function FuzzView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_fuzz').clone();
      this.dom.removeAttr('id');
      FuzzView.__super__.constructor.call(this, this.model, this.dom);
      this.type = this.dom.find('[name=type]');
      this.gain = this.dom.find('[name=gain]');
      this.input = this.dom.find('[name=input]');
      this.output = this.dom.find('[name=output]');
      this.initEvent();
    }

    FuzzView.prototype.initEvent = function() {
      var _this = this;
      FuzzView.__super__.initEvent.call(this);
      this.input.on('change', function() {
        return _this.model.setParam({
          input: parseFloat(_this.input.val()) / 100.0
        });
      });
      this.output.on('change', function() {
        return _this.model.setParam({
          output: parseFloat(_this.output.val()) / 100.0
        });
      });
      this.type.on('change', function() {
        return _this.model.setParam({
          type: _this.type.val()
        });
      });
      return this.gain.on('change', function() {
        return _this.model.setParam({
          gain: parseFloat(_this.gain.val()) / 100.0
        });
      });
    };

    FuzzView.prototype.setParam = function(p) {
      if (p.input != null) {
        this.input.val(p.input * 100);
      }
      if (p.output != null) {
        this.output.val(p.output * 100);
      }
      if (p.type != null) {
        this.type.val(p.type);
      }
      if (p.gain != null) {
        return this.gain.val(p.gain * 100);
      }
    };

    return FuzzView;

  })(this.FXView);

  this.DoubleView = (function(_super) {
    __extends(DoubleView, _super);

    function DoubleView(model) {
      this.model = model;
      this.dom = $('#tmpl_fx_double').clone();
      this.dom.removeAttr('id');
      DoubleView.__super__.constructor.call(this, this.model, this.dom);
      this.delay = this.dom.find('[name=delay]');
      this.width = this.dom.find('[name=width]');
      this.initEvent();
    }

    DoubleView.prototype.initEvent = function() {
      var _this = this;
      DoubleView.__super__.initEvent.call(this);
      this.delay.on('change', function() {
        return _this.model.setParam({
          delay: parseFloat(_this.delay.val()) / 1000.0
        });
      });
      return this.width.on('change', function() {
        return _this.model.setParam({
          width: parseFloat(_this.width.val()) / 200.0 + 0.5
        });
      });
    };

    DoubleView.prototype.setParam = function(p) {
      if (p.delay != null) {
        this.delay.val(p.delay * 1000);
      }
      if (p.width != null) {
        return this.width.val((p.width - 0.5) * 200);
      }
    };

    return DoubleView;

  })(this.FXView);

}).call(this);
;(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.KEYCODE_TO_NOTE = {
    90: 1,
    88: 2,
    67: 3,
    86: 4,
    66: 5,
    78: 6,
    77: 7,
    65: 8,
    83: 9,
    68: 10,
    188: 8,
    190: 9,
    192: 10,
    70: 11,
    71: 12,
    72: 13,
    74: 14,
    75: 15,
    76: 16,
    187: 17,
    81: 15,
    87: 16,
    69: 17,
    82: 18,
    84: 19,
    89: 20,
    85: 21,
    73: 22,
    79: 23,
    80: 24,
    49: 22,
    50: 23,
    51: 24,
    52: 25,
    53: 26,
    54: 27,
    55: 28,
    56: 29,
    57: 30,
    48: 31
  };

  this.KEYCODE_TO_NUM = {
    49: 1,
    50: 2,
    51: 3,
    52: 4,
    53: 5,
    54: 6,
    55: 7,
    56: 8,
    57: 9,
    48: 0
  };

  this.Keyboard = (function() {
    function Keyboard(player) {
      this.player = player;
      this.mode = 'SYNTH';
      this.is_writing = false;
      this.is_pressed = false;
      this.last_key = 0;
      this.solos = [];
      this.initEvent();
    }

    Keyboard.prototype.initEvent = function() {
      var _this = this;
      $(window).keydown(function(e) {
        if (_this.is_writing) {
          return;
        }
        if (_this.is_pressed === false) {
          _this.is_pressed = true;
        }
        return _this.on(e);
      });
      return $(window).keyup(function(e) {
        _this.is_pressed = false;
        return _this.off(e);
      });
    };

    Keyboard.prototype.beginInput = function() {
      return this.is_writing = true;
    };

    Keyboard.prototype.endInput = function() {
      return this.is_writing = false;
    };

    Keyboard.prototype.setMode = function(mode) {
      this.mode = mode;
    };

    Keyboard.prototype.on = function(e) {
      if (e.keyCode === this.last_key) {
        return;
      }
      switch (e.keyCode) {
        case 37:
          this.player.view.moveLeft();
          break;
        case 38:
          this.player.view.moveTop();
          break;
        case 39:
          this.player.view.moveRight();
          break;
        case 40:
          this.player.view.moveBottom();
          break;
        case 32:
          this.player.view.viewPlay();
          break;
        case 13:
          this.player.view.viewPlay();
          break;
        default:
          if (this.mode === 'SYNTH') {
            this.onPlayer(e);
          }
          if (this.mode === 'MIXER') {
            this.onMixer(e);
          }
      }
      return this.last_key = e.keyCode;
    };

    Keyboard.prototype.onPlayer = function(e) {
      var n;
      if (this.player.isPlaying()) {
        this.player.noteOff(true);
      }
      n = KEYCODE_TO_NOTE[e.keyCode];
      if (n != null) {
        return this.player.noteOn(n, true);
      }
    };

    Keyboard.prototype.onMixer = function(e) {
      var num;
      if (e.keyCode === 8 || e.keyCode === 46) {
        this.player.session.deleteCell();
      }
      num = KEYCODE_TO_NUM[e.keyCode];
      if ((num != null) && num < 10) {
        if (__indexOf.call(this.solos, num) < 0) {
          this.solos.push(num);
        }
        return this.player.solo(this.solos);
      }
    };

    Keyboard.prototype.off = function(e) {
      if (this.mode === 'SYNTH') {
        this.offPlayer(e);
      }
      if (this.mode === 'MIXER') {
        this.offMixer(e);
      }
      return this.last_key = 0;
    };

    Keyboard.prototype.offPlayer = function(e) {
      return this.player.noteOff(true);
    };

    Keyboard.prototype.offMixer = function(e) {
      var num;
      num = KEYCODE_TO_NUM[e.keyCode];
      if ((num != null) && num < 10) {
        this.solos = this.solos.filter(function(n) {
          return n !== num;
        });
        return this.player.solo(this.solos);
      }
    };

    return Keyboard;

  })();

}).call(this);
;(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Mixer = (function() {
    function Mixer(ctx, player) {
      var i, s, _i, _len, _ref,
        _this = this;
      this.ctx = ctx;
      this.player = player;
      this.addMasterEffect = __bind(this.addMasterEffect, this);
      this.gain_master = 1.0;
      this.gain_tracks = (function() {
        var _i, _len, _ref, _results;
        _ref = this.player.synth;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          _results.push(s.getGain());
        }
        return _results;
      }).call(this);
      this.out = this.ctx.createGain();
      this.out.gain.value = this.gain_master;
      this.send = this.ctx.createGain();
      this.send.gain.value = 1.0;
      this["return"] = this.ctx.createGain();
      this["return"].gain.value = 1.0;
      this.panners = [];
      this.analysers = [];
      this.splitter_master = this.ctx.createChannelSplitter(2);
      this.analyser_master = [this.ctx.createAnalyser(), this.ctx.createAnalyser()];
      this.out.connect(this.splitter_master);
      _ref = [0, 1];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        this.splitter_master.connect(this.analyser_master[i], i);
        this.analyser_master[i].fftSize = 1024;
        this.analyser_master[i].minDecibels = -100.0;
        this.analyser_master[i].maxDecibels = 0.0;
        this.analyser_master[i].smoothingTimeConstant = 0.0;
      }
      this.limiter = new Limiter(this.ctx);
      this.send.connect(this["return"]);
      this["return"].connect(this.limiter["in"]);
      this.limiter.connect(this.out);
      this.effects_master = [];
      this.out.connect(this.ctx.destination);
      this.view = new MixerView(this);
      setInterval((function() {
        return _this.drawGains();
      }), 30);
    }

    Mixer.prototype.drawGains = function() {
      var data, data_l, data_r, i, _i, _ref;
      for (i = _i = 0, _ref = this.analysers.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        data = new Uint8Array(this.analysers[i].frequencyBinCount);
        this.analysers[i].getByteTimeDomainData(data);
        this.view.drawGainTracks(i, data);
      }
      data_l = new Uint8Array(this.analyser_master[0].frequencyBinCount);
      data_r = new Uint8Array(this.analyser_master[1].frequencyBinCount);
      this.analyser_master[0].getByteTimeDomainData(data_l);
      this.analyser_master[1].getByteTimeDomainData(data_r);
      return this.view.drawGainMaster(data_l, data_r);
    };

    Mixer.prototype.empty = function() {
      this.gain_tracks = [];
      this.panners = [];
      this.analysers = [];
      return this.view.empty();
    };

    Mixer.prototype.addSynth = function(synth) {
      var a, p;
      p = new Panner(this.ctx);
      synth.connect(p["in"]);
      p.connect(this.send);
      this.panners.push(p);
      a = this.ctx.createAnalyser();
      synth.connect(a);
      this.analysers.push(a);
      return this.view.addSynth(synth);
    };

    Mixer.prototype.removeSynth = function(i) {
      return this.panners.splice(i);
    };

    Mixer.prototype.setGains = function(gain_tracks, gain_master) {
      var i, _i, _ref;
      this.gain_tracks = gain_tracks;
      this.gain_master = gain_master;
      for (i = _i = 0, _ref = this.gain_tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.player.synth[i].setGain(this.gain_tracks[i]);
      }
      return this.out.gain.value = this.gain_master;
    };

    Mixer.prototype.setPans = function(pan_tracks, pan_master) {
      var i, _i, _ref, _results;
      this.pan_tracks = pan_tracks;
      this.pan_master = pan_master;
      _results = [];
      for (i = _i = 0, _ref = this.pan_tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.panners[i].setPosition(this.pan_tracks[i]));
      }
      return _results;
    };

    Mixer.prototype.readGains = function(gain_tracks, gain_master) {
      this.gain_tracks = gain_tracks;
      this.gain_master = gain_master;
      this.setGains(this.gain_tracks, this.gain_master);
      return this.view.readGains(this.gain_tracks, this.gain_master);
    };

    Mixer.prototype.readPans = function(pan_tracks, pan_master) {
      this.pan_tracks = pan_tracks;
      this.pan_master = pan_master;
      this.setPans(this.pan_tracks, this.pan_master);
      return this.view.readPans(this.pan_tracks, this.pan_master);
    };

    Mixer.prototype.getParam = function() {
      return {
        gain_tracks: this.gain_tracks,
        gain_master: this.gain_master,
        pan_tracks: this.pan_tracks,
        pan_master: this.pan_master
      };
    };

    Mixer.prototype.readParam = function(p) {
      if (p == null) {
        return;
      }
      this.readGains(p.gain_tracks, p.gain_master);
      return this.readPans(p.pan_tracks, p.pan_master);
    };

    Mixer.prototype.changeSynth = function(id, synth) {
      synth.connect(this.panners[id]["in"]);
      return synth.connect(this.analysers[id]);
    };

    Mixer.prototype.addMasterEffect = function(name) {
      var fx, pos;
      if (name === 'Fuzz') {
        fx = new Fuzz(this.ctx);
      } else if (name === 'Delay') {
        fx = new Delay(this.ctx);
      } else if (name === 'Reverb') {
        fx = new Reverb(this.ctx);
      } else if (name === 'Comp') {
        fx = new Compressor(this.ctx);
      } else if (name === 'Double') {
        fx = new Double(this.ctx);
      }
      pos = this.effects_master.length;
      if (pos === 0) {
        this.send.disconnect();
        this.send.connect(fx["in"]);
      } else {
        this.effects_master[pos - 1].disconnect();
        this.effects_master[pos - 1].connect(fx["in"]);
      }
      fx.connect(this["return"]);
      fx.setSource(this);
      this.effects_master.push(fx);
      return fx;
    };

    Mixer.prototype.addTracksEffect = function(x, name) {
      var fx;
      if (name === 'Fuzz') {
        fx = new Fuzz(this.ctx);
      } else if (name === 'Delay') {
        fx = new Delay(this.ctx);
      } else if (name === 'Reverb') {
        fx = new Reverb(this.ctx);
      } else if (name === 'Comp') {
        fx = new Compressor(this.ctx);
      } else if (name === 'Double') {
        fx = new Double(this.ctx);
      }
      this.player.synth[x].insertEffect(fx);
      return fx;
    };

    Mixer.prototype.removeEffect = function(fx) {
      var i, prev;
      i = this.effects_master.indexOf(fx);
      if (i === -1) {
        return;
      }
      if (i === 0) {
        prev = this.send;
      } else {
        prev = this.effects_master[i - 1];
      }
      prev.disconnect();
      if (this.effects_master[i + 1] != null) {
        prev.connect(this.effects_master[i + 1]);
      } else {
        prev.connect(this["return"]);
        fx.disconnect();
      }
      return this.effects_master.splice(i, 1);
    };

    return Mixer;

  })();

}).call(this);
;(function() {
  this.MixerView = (function() {
    function MixerView(model) {
      var c, d, _i, _len, _ref, _ref1;
      this.model = model;
      this.dom = $('#mixer');
      this.tracks = $('#mixer-tracks');
      this.master = $('#mixer-master');
      this.console_tracks = this.tracks.find('#console-tracks');
      this.console_master = this.master.find('#console-master');
      this.gains = this.tracks.find('.console-track > .gain-slider');
      this.gain_master = this.master.find('.console-track > .gain-slider');
      this.pans_label = this.tracks.find('.console-track > .pan-label');
      this.pans = this.tracks.find('.console-track > .pan-slider');
      this.pan_master = this.master.find('.console-track > .pan-slider');
      this.canvas_tracks_dom = this.tracks.find('.vu-meter');
      this.canvas_tracks = (function() {
        var _i, _len, _ref, _results;
        _ref = this.canvas_tracks_dom;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          d = _ref[_i];
          _results.push(d[0]);
        }
        return _results;
      }).call(this);
      this.ctx_tracks = (function() {
        var _i, _len, _ref, _results;
        _ref = this.canvas_tracks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push(c.getContext('2d'));
        }
        return _results;
      }).call(this);
      _ref = this.canvas_tracks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _ref1 = [10, 100], c.width = _ref1[0], c.height = _ref1[1];
      }
      this.canvas_master_dom = this.master.find('.vu-meter');
      this.canvas_master = this.canvas_master_dom[0];
      this.ctx_master = this.canvas_master.getContext('2d');
      this.canvas_master.width = 70;
      this.canvas_master.height = 130;
      this.ctx_master.fillStyle = '#fff';
      this.ctx_master.fillRect(10, 0, 50, 130);
      this.track_dom = $('#templates > .console-track');
      this.initEvent();
    }

    MixerView.prototype.initEvent = function() {
      var _this = this;
      this.console_tracks.on('change', function() {
        return _this.setParams();
      });
      return this.console_master.on('change', function() {
        return _this.setParams();
      });
    };

    MixerView.prototype.drawGainTracks = function(i, data) {
      var h, v;
      v = Math.max.apply(null, data);
      h = (v - 128) / 128 * 100;
      this.ctx_tracks[i].clearRect(0, 0, 10, 100);
      this.ctx_tracks[i].fillStyle = '#0df';
      return this.ctx_tracks[i].fillRect(0, 100 - h, 10, h);
    };

    MixerView.prototype.drawGainMaster = function(data_l, data_r) {
      var h_l, h_r, v_l, v_r;
      v_l = Math.max.apply(null, data_l);
      v_r = Math.max.apply(null, data_r);
      h_l = (v_l - 128) / 128 * 130;
      h_r = (v_r - 128) / 128 * 130;
      this.ctx_master.clearRect(0, 0, 10, 130);
      this.ctx_master.clearRect(60, 0, 10, 130);
      this.ctx_master.fillStyle = '#0df';
      this.ctx_master.fillRect(0, 130 - h_l, 10, h_l);
      return this.ctx_master.fillRect(60, 130 - h_r, 10, h_r);
    };

    MixerView.prototype.addSynth = function(synth) {
      var d, dom, _ref,
        _this = this;
      dom = this.track_dom.clone();
      this.console_tracks.append(dom);
      this.pans.push(dom.find('.pan-slider'));
      this.gains.push(dom.find('.gain-slider'));
      this.pans_label.push(dom.find('.pan-label'));
      d = dom.find('.vu-meter');
      this.canvas_tracks_dom.push(d);
      this.canvas_tracks.push(d[0]);
      this.ctx_tracks.push(d[0].getContext('2d'));
      _ref = [10, 100], d[0].width = _ref[0], d[0].height = _ref[1];
      this.console_tracks.css({
        width: (this.gains.length * 80 + 2) + 'px'
      });
      this.console_tracks.on('change', function() {
        return _this.setGains();
      });
      return this.setParams();
    };

    MixerView.prototype.setGains = function() {
      var g, g_master, _g;
      g = (function() {
        var _i, _len, _ref, _results;
        _ref = this.gains;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _g = _ref[_i];
          _results.push(parseFloat(_g.val()) / 100.0);
        }
        return _results;
      }).call(this);
      g_master = parseFloat(this.gain_master.val() / 100.0);
      return this.model.setGains(g, g_master);
    };

    MixerView.prototype.setPans = function() {
      var i, l, p, p_master, t, _i, _p, _ref, _results;
      p = (function() {
        var _i, _len, _ref, _results;
        _ref = this.pans;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _p = _ref[_i];
          _results.push(1.0 - parseFloat(_p.val()) / 200.0);
        }
        return _results;
      }).call(this);
      p_master = 1.0 - parseFloat(this.pan_master.val()) / 200.0;
      this.model.setPans(p, p_master);
      _results = [];
      for (i = _i = 0, _ref = this.pans.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        l = parseInt(this.pans[i].val()) - 100;
        t = l === 0 ? 'C' : (l < 0 ? (-l) + '% L' : l + '% R');
        _results.push(this.pans_label[i].text(t));
      }
      return _results;
    };

    MixerView.prototype.readGains = function(g, g_master) {
      var i, _i, _ref;
      for (i = _i = 0, _ref = g.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.gains[i].val(g[i] * 100.0);
      }
      return this.gain_master.val(g_master * 100.0);
    };

    MixerView.prototype.readPans = function(p, p_master) {
      var i, l, t, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = p.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.pans[i].val((1.0 - p[i]) * 200);
        l = (p[i] * 200 - 100) * -1;
        t = l === 0 ? 'C' : (l < 0 ? (-l) + '% L' : l + '% R');
        _results.push(this.pans_label[i].text(t));
      }
      return _results;
    };

    MixerView.prototype.setParams = function() {
      this.setGains();
      return this.setPans();
    };

    MixerView.prototype.displayGains = function(gains) {};

    MixerView.prototype.pan2pos = function(v) {
      var theta;
      theta = v * Math.PI;
      return [Math.cos(theta), 0, -Math.sin(theta)];
    };

    MixerView.prototype.pos2pan = function(v) {
      return Math.acos(v[0]) / Math.PI;
    };

    MixerView.prototype.empty = function() {
      this.console_tracks.empty();
      this.canvas_tracks_dom = [];
      this.canvas_tracks = [];
      this.ctx_tracks = [];
      this.pans = [];
      this.gains = [];
      return this.pans_label = [];
    };

    return MixerView;

  })();

}).call(this);
;(function() {
  'use strict';
  var MutekiTimer, SOURCE, TIMER_PATH, clearTimeout, e, pool, setTimeout, tid, _clearTimeout, _ref, _ref1, _setTimeout,
    _this = this;

  setTimeout = this.setTimeout;

  clearTimeout = this.clearTimeout;

  SOURCE = 'var t = 0;\nonmessage = function(e) {\n    if (t) {\n        t = clearTimeout(t), 0;\n    }\n    if (typeof e.data === "number" && e.data > 0) {\n        t = setTimeout(function() {\n            postMessage(0);\n        }, e.data);\n    }\n};';

  TIMER_PATH = (_ref = (_ref1 = this.URL) != null ? _ref1 : this.webkitURL) != null ? _ref.createObjectURL((function() {
    try {
      return new Blob([SOURCE], {
        type: 'text/javascript'
      });
    } catch (_error) {
      e = _error;
      return null;
    }
  })()) : void 0;

  MutekiTimer = (function() {
    function MutekiTimer() {
      if (TIMER_PATH) {
        this.timer = new Worker(TIMER_PATH);
      } else {
        this.timer = 0;
      }
    }

    MutekiTimer.prototype.setTimeout = function(func, interval) {
      if (interval == null) {
        interval = 100;
      }
      if (typeof this.timer === 'number') {
        return this.timer = setTimeout(func, interval);
      } else {
        this.timer.onmessage = func;
        return this.timer.postMessage(interval);
      }
    };

    MutekiTimer.prototype.clearTimeout = function() {
      if (typeof this.timer === 'number') {
        return clearTimeout(this.timer);
      } else {
        return this.timer.postMessage(0);
      }
    };

    return MutekiTimer;

  })();

  tid = +new Date();

  pool = {};

  _setTimeout = function(func, interval) {
    var t;
    t = new MutekiTimer();
    t.setTimeout(func, interval);
    pool[++tid] = t;
    return tid;
  };

  _clearTimeout = function(id) {
    var _ref2;
    if ((_ref2 = pool[id]) != null) {
      _ref2.clearTimeout();
    }
    return void 0;
  };

  MutekiTimer.use = function() {
    _this.setTimeout = _setTimeout;
    return _this.clearTimeout = _clearTimeout;
  };

  MutekiTimer.unuse = function() {
    _this.setTimeout = setTimeout;
    return _this.clearTimeout = clearTimeout;
  };

  MutekiTimer.isEnabled = function() {
    return !!TIMER_PATH;
  };

  this.MutekiTimer = MutekiTimer;

}).call(this);
;(function() {
  this.Panner = (function() {
    function Panner(ctx) {
      this.ctx = ctx;
      this["in"] = this.ctx.createChannelSplitter(2);
      this.out = this.ctx.createChannelMerger(2);
      this.l = this.ctx.createGain();
      this.r = this.ctx.createGain();
      this["in"].connect(this.l, 0);
      this["in"].connect(this.r, 1);
      this.l.connect(this.out, 0, 0);
      this.r.connect(this.out, 0, 1);
      this.setPosition(0.5);
    }

    Panner.prototype.connect = function(dst) {
      return this.out.connect(dst);
    };

    Panner.prototype.setPosition = function(pos) {
      this.pos = pos;
      this.l.gain.value = this.pos;
      return this.r.gain.value = 1.0 - this.pos;
    };

    return Panner;

  })();

}).call(this);
;(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.Player = (function() {
    function Player() {
      this.bpm = 120;
      this.duration = 500;
      this.key = 'A';
      this.scale = 'Major';
      this.is_playing = false;
      this.time = 0;
      this.scene = {
        bpm: this.bpm,
        key: this.key,
        scale: this.scale
      };
      this.num_id = 0;
      this.context = CONTEXT;
      this.synth = [];
      this.mixer = new Mixer(this.context, this);
      this.session = new Session(this.context, this);
      this.sidebar = new Sidebar(this.context, this, this.session, this.mixer);
      this.addSynth(0);
      this.synth_now = this.synth[0];
      this.synth_pos = 0;
      this.scene_length = 32;
      this.view = new PlayerView(this);
    }

    Player.prototype.setBPM = function(bpm) {
      var s, _i, _len, _ref;
      this.bpm = bpm;
      this.scene.bpm = this.bpm;
      this.duration = 7500.0 / this.bpm;
      _ref = this.synth;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.setDuration(this.duration);
      }
      return this.sidebar.setBPM(this.bpm);
    };

    Player.prototype.setKey = function(key) {
      var s, _i, _len, _ref;
      this.key = key;
      this.scene.key = this.key;
      _ref = this.synth;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.setKey(this.key);
      }
      return this.sidebar.setKey(this.key);
    };

    Player.prototype.setScale = function(scale) {
      var s, _i, _len, _ref;
      this.scale = scale;
      this.scene.scale = this.scale;
      _ref = this.synth;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.setScale(this.scale);
      }
      return this.sidebar.setScale(this.scale);
    };

    Player.prototype.isPlaying = function() {
      return this.is_playing;
    };

    Player.prototype.play = function() {
      var _this = this;
      this.is_playing = true;
      this.session.play();
      return T.setTimeout((function() {
        return _this.playNext();
      }), 150);
    };

    Player.prototype.stop = function() {
      var s, _i, _len, _ref;
      _ref = this.synth;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.stop();
      }
      this.is_playing = false;
      this.view.viewStop();
      return this.time = 0;
    };

    Player.prototype.pause = function() {
      var s, _i, _len, _ref;
      _ref = this.synth;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.pause(this.time);
      }
      return this.is_playing = false;
    };

    Player.prototype.forward = function() {
      if ((this.time + 32) > this.scene_length) {
        this.session.nextMeasure(this.synth);
      }
      this.time = (this.time + 32) % this.scene_length;
      return this.synth_now.redraw(this.time);
    };

    Player.prototype.backward = function(force) {
      if (force) {
        if (this.time >= 32) {
          this.time = (this.time - 32) % this.scene_length;
        }
      } else {
        if (this.time % 32 < 3 && this.time >= 32) {
          this.time = (this.time - 32 - (this.time % 32)) % this.scene_length;
        } else {
          this.time = this.time - (this.time % 32);
        }
      }
      return this.synth_now.redraw(this.time);
    };

    Player.prototype.toggleLoop = function() {
      return this.session.toggleLoop();
    };

    Player.prototype.noteOn = function(note, force) {
      return this.synth_now.noteOn(note, force);
    };

    Player.prototype.noteOff = function(force) {
      return this.synth_now.noteOff(force);
    };

    Player.prototype.playNext = function() {
      var s, _i, _len, _ref,
        _this = this;
      if (this.is_playing) {
        if (this.time >= this.scene_length) {
          this.time = 0;
        }
        _ref = this.synth;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          s.playAt(this.time);
        }
        if (this.time % 32 === 31 && this.time + 32 > this.scene_length) {
          this.session.nextMeasure(this.synth);
        }
        if (this.time % 8 === 0) {
          this.session.beat();
        }
        this.time++;
        return T.setTimeout((function() {
          return _this.playNext();
        }), this.duration);
      } else {
        return this.stop();
      }
    };

    Player.prototype.addSynth = function(scene_pos, name) {
      var s;
      s = new Synth(this.context, this.num_id++, this, name);
      s.setScale(this.scene.scale);
      s.setKey(this.scene.key);
      this.synth.push(s);
      this.mixer.addSynth(s);
      return this.session.addSynth(s, scene_pos);
    };

    Player.prototype.addSampler = function(scene_pos, name) {
      var s;
      s = new Sampler(this.context, this.num_id++, this, name);
      this.synth.push(s);
      this.mixer.addSynth(s);
      return this.session.addSynth(s, scene_pos);
    };

    Player.prototype.changeSynth = function(id, type) {
      var s_new, s_old;
      s_old = this.synth[id];
      if (type === 'REZ') {
        s_new = new Synth(this.context, id, this, s_old.name);
        s_new.setScale(this.scene.scale);
        s_new.setKey(this.scene.key);
      } else if (type === 'SAMPLER') {
        s_new = new Sampler(this.context, id, this, s_old.name);
      }
      this.synth_now = this.synth[id] = s_new;
      this.synth_now = s_new;
      this.mixer.changeSynth(id, s_new);
      this.session.changeSynth(id, type, s_new);
      this.view.changeSynth(id, type);
      return s_new;
    };

    Player.prototype.moveRight = function(next_idx) {
      if (next_idx === this.synth.length) {
        this.addSynth();
        this.session.play();
      }
      this.synth[next_idx - 1].inactivate();
      this.synth_now = this.synth[next_idx];
      this.synth_now.activate(next_idx);
      this.synth_pos++;
      return window.keyboard.setMode('SYNTH');
    };

    Player.prototype.moveLeft = function(next_idx) {
      this.synth[next_idx + 1].inactivate();
      this.synth_now = this.synth[next_idx];
      this.synth_now.activate(next_idx);
      this.synth_pos--;
      return window.keyboard.setMode('SYNTH');
    };

    Player.prototype.moveTop = function() {
      return window.keyboard.setMode('MIXER');
    };

    Player.prototype.moveBottom = function() {
      return window.keyboard.setMode('SYNTH');
    };

    Player.prototype.moveTo = function(synth_num) {
      var _results, _results1;
      this.view.moveBottom();
      if (synth_num < this.synth_pos) {
        _results = [];
        while (synth_num !== this.synth_pos) {
          _results.push(this.view.moveLeft());
        }
        return _results;
      } else {
        _results1 = [];
        while (synth_num !== this.synth_pos) {
          _results1.push(this.view.moveRight());
        }
        return _results1;
      }
    };

    Player.prototype.solo = function(solos) {
      var s, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
      if (solos.length === 0) {
        _ref = this.synth;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          s.demute();
        }
        return;
      }
      _ref1 = this.synth;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        s = _ref1[_j];
        if (_ref2 = s.id + 1, __indexOf.call(solos, _ref2) >= 0) {
          _results.push(s.demute());
        } else {
          _results.push(s.mute());
        }
      }
      return _results;
    };

    Player.prototype.readSong = function(song) {
      var i, _i, _j, _ref, _ref1;
      this.song = song;
      this.synth = [];
      this.num_id = 0;
      this.mixer.empty();
      this.session.empty();
      this.view.empty();
      for (i = _i = 0, _ref = this.song.tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if ((this.song.tracks[i].type == null) || this.song.tracks[i].type === 'REZ') {
          this.addSynth(0, this.song.tracks[i].name);
        }
        if (this.song.tracks[i].type === 'SAMPLER') {
          this.addSampler(0, this.song.tracks[i].name);
        }
      }
      this.synth_now = this.synth[0];
      this.readScene(this.song.master[0]);
      this.setSceneLength(this.song.master.length);
      for (i = _j = 0, _ref1 = this.song.tracks.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        this.synth[i].setParam(this.song.tracks[i]);
      }
      this.session.setSynth(this.synth);
      this.session.readSong(this.song);
      this.mixer.readParam(this.song.mixer);
      this.view.setSynthNum(this.synth.length, this.synth_pos);
      return this.resetSceneLength();
    };

    Player.prototype.clearSong = function() {
      this.synth = [];
      return this.num_id = 0;
    };

    Player.prototype.readScene = function(scene) {
      if (scene.bpm != null) {
        this.setBPM(scene.bpm);
        this.view.setBPM(scene.bpm);
      }
      if (scene.key != null) {
        this.setKey(scene.key);
        this.view.setKey(scene.key);
      }
      if (scene.scale != null) {
        this.setScale(scene.scale);
        this.view.setScale(scene.scale);
      }
      return this.view.setParam(scene.bpm, scene.key, scene.scale);
    };

    Player.prototype.getScene = function() {
      return this.scene;
    };

    Player.prototype.setSceneLength = function(scene_length) {
      this.scene_length = scene_length;
    };

    Player.prototype.resetSceneLength = function(l) {
      var s, _i, _len, _ref, _results;
      this.scene_length = 0;
      _ref = this.synth;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(this.scene_length = Math.max(this.scene_length, s.pattern.length));
      }
      return _results;
    };

    Player.prototype.showSuccess = function(url) {
      console.log("success!");
      return console.log(url);
    };

    Player.prototype.showError = function(error) {
      return console.log(error);
    };

    return Player;

  })();

}).call(this);
;(function() {
  this.PlayerView = (function() {
    function PlayerView(model) {
      this.model = model;
      this.dom = $("#control");
      this.bpm = this.dom.find("[name=bpm]");
      this.key = this.dom.find("[name=key]");
      this.scale = this.dom.find("[name=mode]");
      this.footer = $('footer');
      this.play = $('#control-play');
      this.stop = $('#control-stop');
      this.forward = $('#control-forward');
      this.backward = $('#control-backward');
      this.loop = $('#control-loop');
      this.wrapper = $('#wrapper');
      this.instruments = $('#instruments');
      this.mixer = $('#mixer');
      this.is_mixer = false;
      this.btn_left = $('#btn-left');
      this.btn_right = $('#btn-right');
      this.btn_top = $('#btn-top');
      this.btn_bottom = $('#btn-bottom');
      this.synth_now = 0;
      this.synth_total = 1;
      this.initEvent();
      this.resize();
    }

    PlayerView.prototype.initEvent = function() {
      var _this = this;
      this.dom.on("change", function() {
        _this.model.setBPM(parseInt(_this.bpm.val()));
        _this.model.setKey(_this.key.val());
        return _this.model.setScale(_this.scale.val());
      });
      this.bpm.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      }));
      this.key.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      }));
      this.scale.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      }));
      this.play.on('mousedown', function() {
        return _this.viewPlay();
      });
      this.stop.on('mousedown', function() {
        return _this.viewStop(_this.model);
      });
      this.forward.on('mousedown', function() {
        return _this.model.forward();
      });
      this.backward.on('mousedown', function() {
        return _this.model.backward();
      });
      this.loop.on('mousedown', function() {
        if (_this.model.toggleLoop()) {
          return _this.loop.removeClass('control-off').addClass('control-on');
        } else {
          return _this.loop.removeClass('control-on').addClass('control-off');
        }
      });
      this.btn_left.on('mousedown', function() {
        return _this.moveLeft();
      });
      this.btn_right.on('mousedown', function() {
        return _this.moveRight();
      });
      this.btn_top.on('mousedown', function() {
        return _this.moveTop();
      });
      this.btn_bottom.on('mousedown', function() {
        return _this.moveBottom();
      });
      return $(window).on('resize', function() {
        return _this.resize();
      });
    };

    PlayerView.prototype.viewPlay = function() {
      if (this.model.isPlaying()) {
        this.model.pause();
        return this.play.removeClass("fa-pause").addClass("fa-play");
      } else {
        this.model.play();
        return this.play.removeClass("fa-play").addClass("fa-pause");
      }
    };

    PlayerView.prototype.viewStop = function(receiver) {
      if (receiver != null) {
        receiver.stop();
      }
      return this.play.removeClass("fa-pause").addClass("fa-play");
    };

    PlayerView.prototype.setBPM = function(bpm) {
      return this.bpm.val(bpm);
    };

    PlayerView.prototype.setScale = function(scale) {
      return this.scale.val(scale);
    };

    PlayerView.prototype.setKey = function(key) {
      var k, v, _results;
      _results = [];
      for (k in KEY_LIST) {
        v = KEY_LIST[k];
        if (v = key) {
          this.key.val(k);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    PlayerView.prototype.setParam = function(bpm, key, scale) {
      this.setBPM(bpm);
      this.setKey(key);
      return this.setScale(scale);
    };

    PlayerView.prototype.moveRight = function() {
      if (this.is_mixer) {
        return;
      }
      this.synth_now++;
      this.model.moveRight(this.synth_now);
      this.synth_total = this.model.synth.length;
      this.instruments.css('-webkit-transform', 'translate3d(' + (-1110 * this.synth_now) + 'px, 0px, 0px)');
      this.btn_left.show();
      if (this.synth_now === (this.synth_total - 1)) {
        return this.btn_right.attr('data-line1', 'new');
      }
    };

    PlayerView.prototype.moveLeft = function() {
      if (this.is_mixer) {
        return;
      }
      this.synth_total = this.model.synth.length;
      this.btn_right.attr('data-line1', 'next');
      if (this.synth_now !== 0) {
        this.synth_now--;
        this.instruments.css('-webkit-transform', 'translate3d(' + (-1110 * this.synth_now) + 'px, 0px, 0px)');
        this.model.moveLeft(this.synth_now);
      }
      if (this.synth_now === 0) {
        return this.btn_left.hide();
      }
    };

    PlayerView.prototype.moveTop = function() {
      this.is_mixer = true;
      this.btn_left.hide();
      this.btn_right.hide();
      this.btn_top.hide();
      this.btn_bottom.show();
      this.wrapper.css('-webkit-transform', 'translate3d(0px, 700px, 0px)');
      return this.model.moveTop();
    };

    PlayerView.prototype.moveBottom = function() {
      this.is_mixer = false;
      if (this.synth_now !== 0) {
        this.btn_left.show();
      }
      this.btn_right.show();
      this.btn_top.show();
      this.btn_bottom.hide();
      this.wrapper.css('-webkit-transform', 'translate3d(0px, 0px, 0px)');
      return this.model.moveBottom();
    };

    PlayerView.prototype.setSynthNum = function(total, now) {
      this.synth_total = total;
      if (now < total - 1) {
        return this.btn_right.attr('data-line1', 'next');
      }
    };

    PlayerView.prototype.resize = function() {
      var h, ph, pw, space_h, space_w, w;
      w = $(window).width();
      h = $(window).height();
      space_w = (w - 910) / 2;
      space_h = (h - 600) / 2;
      pw = space_w / 2 - 50;
      ph = space_h / 2 - 50;
      this.btn_left.css({
        width: space_w + 'px',
        padding: '250px ' + 25 + 'px'
      });
      this.btn_right.css({
        width: space_w + 'px',
        padding: '250px ' + 35 + 'px'
      });
      this.btn_top.css({
        height: space_h + 'px'
      });
      this.btn_bottom.css({
        bottom: space_h + 'px',
        height: 100 + 'px'
      });
      return this.footer.css({
        height: space_h + 'px'
      });
    };

    PlayerView.prototype.changeSynth = function() {
      if (this.synth_now === 0) {
        this.btn_left.hide();
      }
      if (this.synth_now === (this.synth_total - 1)) {
        return this.btn_right.attr('data-line1', 'new');
      }
    };

    PlayerView.prototype.empty = function() {
      return this.instruments.empty();
    };

    return PlayerView;

  })();

}).call(this);
;(function() {
  var SAMPLES_DEFAULT;

  this.SampleNode = (function() {
    function SampleNode(ctx, id, parent) {
      var eq1, eq2, eq3, _ref, _ref1, _ref2, _ref3, _ref4;
      this.ctx = ctx;
      this.id = id;
      this.parent = parent;
      this.out = this.ctx.createGain();
      this.out.gain.value = 1.0;
      this.name = SAMPLES_DEFAULT[this.id];
      this.setSample(this.name);
      this.head = 0.0;
      this.tail = 1.0;
      this.speed = 1.0;
      this.merger = this.ctx.createChannelMerger(2);
      this.node_buf = this.ctx.createGain();
      this.node_buf.gain.value = 1.0;
      this.eq_gains = [0.0, 0.0, 0.0];
      _ref = [this.ctx.createBiquadFilter(), this.ctx.createBiquadFilter(), this.ctx.createBiquadFilter()], eq1 = _ref[0], eq2 = _ref[1], eq3 = _ref[2];
      _ref1 = ['lowshelf', 'peaking', 'highshelf'], eq1.type = _ref1[0], eq2.type = _ref1[1], eq3.type = _ref1[2];
      _ref2 = [0.6, 0.6, 0.6], eq1.Q.value = _ref2[0], eq2.Q.value = _ref2[1], eq3.Q.value = _ref2[2];
      _ref3 = [350, 2000, 4000], eq1.frequency.value = _ref3[0], eq2.frequency.value = _ref3[1], eq3.frequency.value = _ref3[2];
      _ref4 = this.eq_gains, eq1.gain.value = _ref4[0], eq2.gain.value = _ref4[1], eq3.gain.value = _ref4[2];
      this.eq_nodes = [eq1, eq2, eq3];
      this.panner = new Panner(this.ctx);
      this.pan_value = 0.5;
      this.node_buf.connect(eq1);
      eq1.connect(eq2);
      eq2.connect(eq3);
      eq3.connect(this.panner["in"]);
      this.panner.connect(this.out);
    }

    SampleNode.prototype.setSample = function(name) {
      var req, sample,
        _this = this;
      this.name = name;
      sample = SAMPLES[this.name];
      if (sample == null) {
        return;
      }
      this.sample = sample;
      if (sample.data != null) {
        return this.buffer = sample.data;
      } else {
        req = new XMLHttpRequest();
        req.open('GET', sample.url, true);
        req.responseType = "arraybuffer";
        req.onload = function() {
          _this.ctx.decodeAudioData(req.response, (function(buffer) {
            _this.buffer = buffer;
            _this.buffer_duration = _this.buffer.length / window.SAMPLE_RATE;
            return _this.parent.sampleLoaded(_this.id);
          }), function(err) {
            console.log('ajax error');
            return console.log(err);
          });
          return sample.data = _this.buffer;
        };
        return req.send();
      }
    };

    SampleNode.prototype.connect = function(dst) {
      this.dst = dst;
      return this.out.connect(this.dst);
    };

    SampleNode.prototype.noteOn = function(gain, time) {
      var head_time, source, tail_time;
      if (this.buffer == null) {
        return;
      }
      if (this.source_old != null) {
        this.source_old.stop(time);
      }
      source = this.ctx.createBufferSource();
      source.buffer = this.buffer;
      source.connect(this.merger, 0, 0);
      source.connect(this.merger, 0, 1);
      this.merger.connect(this.node_buf);
      head_time = time + this.buffer_duration * this.head;
      tail_time = time + this.buffer_duration * this.tail;
      source.playbackRate.value = this.speed;
      source.start(0);
      this.node_buf.gain.value = gain;
      return this.source_old = source;
    };

    SampleNode.prototype.setTimeParam = function(head, tail, speed) {
      this.head = head;
      this.tail = tail;
      this.speed = speed;
    };

    SampleNode.prototype.getTimeParam = function() {
      return [this.head, this.tail, this.speed];
    };

    SampleNode.prototype.setEQParam = function(eq_gains) {
      var g, _ref;
      this.eq_gains = eq_gains;
      return _ref = (function() {
        var _i, _len, _ref, _results;
        _ref = this.eq_gains;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          g = _ref[_i];
          _results.push(g * 0.2);
        }
        return _results;
      }).call(this), this.eq_nodes[0].gain.value = _ref[0], this.eq_nodes[1].gain.value = _ref[1], this.eq_nodes[2].gain.value = _ref[2], _ref;
    };

    SampleNode.prototype.getEQParam = function() {
      return this.eq_gains;
    };

    SampleNode.prototype.setOutputParam = function(pan_value, gain) {
      this.pan_value = pan_value;
      this.panner.setPosition(this.pan_value);
      return this.out.gain.value = gain;
    };

    SampleNode.prototype.getOutputParam = function() {
      return [this.pan_value, this.out.gain.value];
    };

    SampleNode.prototype.getData = function() {
      return this.buffer;
    };

    SampleNode.prototype.getParam = function() {
      return {
        wave: this.name,
        time: this.getTimeParam(),
        gains: this.eq_gains,
        output: this.getOutputParam()
      };
    };

    SampleNode.prototype.setParam = function(p) {
      if (p.wave != null) {
        this.setSample(p.wave);
      }
      if (p.time != null) {
        this.setTimeParam(p.time[0], p.time[1], p.time[2]);
      }
      if (p.gains != null) {
        this.setEQParam(p.gains);
      }
      if (p.output != null) {
        return this.setOutputParam(p.output[0], p.output[1]);
      }
    };

    return SampleNode;

  })();

  this.SamplerCore = (function() {
    function SamplerCore(parent, ctx, id) {
      var i, _i;
      this.parent = parent;
      this.ctx = ctx;
      this.id = id;
      this.node = this.ctx.createGain();
      this.node.gain.value = 1.0;
      this.gain = 1.0;
      this.is_mute = false;
      this.samples = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 10; i = ++_i) {
          _results.push(new SampleNode(this.ctx, i, this));
        }
        return _results;
      }).call(this);
      for (i = _i = 0; _i < 10; i = ++_i) {
        this.samples[i].connect(this.node);
      }
      this.view = new SamplerCoreView(this, id, this.parent.view.dom.find('.sampler-core'));
    }

    SamplerCore.prototype.noteOn = function(notes) {
      var n, time, _i, _len, _results;
      if (this.is_mute) {
        return;
      }
      time = this.ctx.currentTime;
      if (Array.isArray(notes)) {
        _results = [];
        for (_i = 0, _len = notes.length; _i < _len; _i++) {
          n = notes[_i];
          _results.push(this.samples[n[0] - 1].noteOn(n[1], time));
        }
        return _results;
      }
    };

    SamplerCore.prototype.noteOff = function() {
      var t0;
      return t0 = this.ctx.currentTime;
    };

    SamplerCore.prototype.connect = function(dst) {
      return this.node.connect(dst);
    };

    SamplerCore.prototype.setSample = function(i, name) {
      return this.samples[i].setSample(name);
    };

    SamplerCore.prototype.setSampleTimeParam = function(i, head, tail, speed) {
      return this.samples[i].setTimeParam(head, tail, speed);
    };

    SamplerCore.prototype.setSampleEQParam = function(i, lo, mid, hi) {
      return this.samples[i].setEQParam([lo, mid, hi]);
    };

    SamplerCore.prototype.setSampleOutputParam = function(i, pan, gain) {
      return this.samples[i].setOutputParam(pan, gain);
    };

    SamplerCore.prototype.setGain = function(gain) {
      this.gain = gain;
      return this.node.gain.value = this.gain;
    };

    SamplerCore.prototype.getSampleTimeParam = function(i) {
      return this.samples[i].getTimeParam();
    };

    SamplerCore.prototype.getSampleData = function(i) {
      return this.samples[i].getData();
    };

    SamplerCore.prototype.getSampleEQParam = function(i) {
      return this.samples[i].getEQParam();
    };

    SamplerCore.prototype.getSampleOutputParam = function(i) {
      return this.samples[i].getOutputParam();
    };

    SamplerCore.prototype.sampleLoaded = function(id) {
      return this.view.updateWaveformCanvas(id);
    };

    SamplerCore.prototype.bindSample = function(sample_now) {
      this.view.bindSample(sample_now, this.samples[sample_now].getParam());
      this.view.setSampleTimeParam(this.getSampleTimeParam(sample_now));
      this.view.setSampleEQParam(this.getSampleEQParam(sample_now));
      return this.view.setSampleOutputParam(this.getSampleOutputParam(sample_now));
    };

    SamplerCore.prototype.getParam = function() {
      var s;
      return {
        type: 'SAMPLER',
        samples: (function() {
          var _i, _len, _ref, _results;
          _ref = this.samples;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            _results.push(s.getParam());
          }
          return _results;
        }).call(this)
      };
    };

    SamplerCore.prototype.setParam = function(p) {
      var i, _i, _ref;
      if (p.samples != null) {
        for (i = _i = 0, _ref = p.samples.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.samples[i].setParam(p.samples[i]);
        }
      }
      return this.bindSample(0);
    };

    SamplerCore.prototype.mute = function() {
      return this.is_mute = true;
    };

    SamplerCore.prototype.demute = function() {
      return this.is_mute = false;
    };

    return SamplerCore;

  })();

  this.Sampler = (function() {
    function Sampler(ctx, id, player, name) {
      this.ctx = ctx;
      this.id = id;
      this.player = player;
      this.name = name;
      this.type = 'SAMPLER';
      if (this.name == null) {
        this.name = 'Sampler #' + this.id;
      }
      this.pattern_name = 'pattern 0';
      this.pattern = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
      this.pattern_obj = {
        name: this.pattern_name,
        pattern: this.pattern
      };
      this.time = 0;
      this.view = new SamplerView(this, this.id);
      this.core = new SamplerCore(this, this.ctx, this.id);
      this.is_sustaining = false;
      this.session = this.player.session;
      this.send = this.ctx.createGain();
      this.send.gain.value = 1.0;
      this["return"] = this.ctx.createGain();
      this["return"].gain.value = 1.0;
      this.core.connect(this.send);
      this.send.connect(this["return"]);
      this.effects = [];
    }

    Sampler.prototype.connect = function(dst) {
      if (dst instanceof Panner) {
        return this["return"].connect(dst["in"]);
      } else {
        return this["return"].connect(dst);
      }
    };

    Sampler.prototype.disconnect = function() {
      return this["return"].disconnect();
    };

    Sampler.prototype.setDuration = function() {};

    Sampler.prototype.setKey = function() {};

    Sampler.prototype.setScale = function() {};

    Sampler.prototype.setNote = function(note) {
      return this.core.setNote(note);
    };

    Sampler.prototype.setGain = function(gain) {
      return this.core.setGain(gain);
    };

    Sampler.prototype.getGain = function() {
      return this.core.gain;
    };

    Sampler.prototype.noteOn = function(note) {
      return this.core.noteOn([[note, 1.0]]);
    };

    Sampler.prototype.noteOff = function() {
      return this.core.noteOff();
    };

    Sampler.prototype.playAt = function(time) {
      var mytime, notes;
      this.time = time;
      mytime = this.time % this.pattern.length;
      this.view.playAt(mytime);
      if (this.pattern[mytime] !== 0) {
        notes = this.pattern[mytime];
        return this.core.noteOn(notes);
      }
    };

    Sampler.prototype.play = function() {
      return this.view.play();
    };

    Sampler.prototype.stop = function() {
      this.core.noteOff();
      return this.view.stop();
    };

    Sampler.prototype.pause = function(time) {
      return this.core.noteOff();
    };

    Sampler.prototype.setPattern = function(_pattern_obj) {
      this.pattern_obj = $.extend(true, {}, _pattern_obj);
      this.pattern = this.pattern_obj.pattern;
      this.pattern_name = this.pattern_obj.name;
      return this.view.setPattern(this.pattern_obj);
    };

    Sampler.prototype.getPattern = function() {
      this.pattern_obj = {
        name: this.pattern_name,
        pattern: this.pattern
      };
      return $.extend(true, {}, this.pattern_obj);
    };

    Sampler.prototype.clearPattern = function() {
      this.pattern = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
      this.pattern_obj.pattern = this.pattern;
      return this.view.setPattern(this.pattern_obj);
    };

    Sampler.prototype.plusPattern = function() {
      this.pattern = this.pattern.concat([[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]);
      return this.player.resetSceneLength();
    };

    Sampler.prototype.minusPattern = function() {
      this.pattern = this.pattern.slice(0, this.pattern.length - 32);
      return this.player.resetSceneLength();
    };

    Sampler.prototype.addNote = function(time, note, gain) {
      var i, _i, _ref;
      if (!Array.isArray(this.pattern[time])) {
        this.pattern[time] = [[this.pattern[time], 1.0]];
      }
      for (i = _i = 0, _ref = this.pattern[time].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.pattern[time][i][0] === note) {
          this.pattern[time].splice(i, 1);
        }
      }
      return this.pattern[time].push([note, gain]);
    };

    Sampler.prototype.removeNote = function(pos) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.pattern[pos.x_abs].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.pattern[pos.x_abs][i][0] === pos.note) {
          _results.push(this.pattern[pos.x_abs].splice(i, 1));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Sampler.prototype.activate = function(i) {
      return this.view.activate(i);
    };

    Sampler.prototype.inactivate = function(i) {
      return this.view.inactivate(i);
    };

    Sampler.prototype.redraw = function(time) {
      this.time = time;
      return this.view.drawPattern(this.time);
    };

    Sampler.prototype.setSynthName = function(name) {
      this.name = name;
      this.session.setSynthName(this.id, this.name);
      return this.view.setSynthName(this.name);
    };

    Sampler.prototype.inputPatternName = function(pattern_name) {
      this.pattern_name = pattern_name;
      return this.session.setPatternName(this.id, this.pattern_name);
    };

    Sampler.prototype.setPatternName = function(pattern_name) {
      this.pattern_name = pattern_name;
      return this.view.setPatternName(this.pattern_name);
    };

    Sampler.prototype.selectSample = function(sample_now) {
      return this.core.bindSample(sample_now);
    };

    Sampler.prototype.changeSynth = function(type) {
      var s_new;
      s_new = this.player.changeSynth(this.id, type, s_new);
      this.view.dom.replaceWith(s_new.view.dom);
      this.noteOff(true);
      return this.disconnect();
    };

    Sampler.prototype.getParam = function() {
      var p;
      p = this.core.getParam();
      p.name = this.name;
      p.effects = this.getEffectsParam();
      return p;
    };

    Sampler.prototype.setParam = function(p) {
      if (p != null) {
        return this.core.setParam(p);
      }
    };

    Sampler.prototype.mute = function() {
      return this.core.mute();
    };

    Sampler.prototype.demute = function() {
      return this.core.demute();
    };

    Sampler.prototype.getEffectsParam = function() {
      var f, _i, _len, _ref, _results;
      _ref = this.effects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        _results.push(f.getParam());
      }
      return _results;
    };

    Sampler.prototype.insertEffect = function(fx) {
      if (this.effects.length === 0) {
        this.send.disconnect();
        this.send.connect(fx["in"]);
      } else {
        this.effects[this.effects.length - 1].disconnect();
        this.effects[this.effects.length - 1].connect(fx["in"]);
      }
      fx.connect(this["return"]);
      fx.setSource(this);
      return this.effects.push(fx);
    };

    Sampler.prototype.removeEffect = function(fx) {
      var i, prev;
      i = this.effects.indexOf(fx);
      if (i === -1) {
        return;
      }
      if (i === 0) {
        prev = this.send;
      } else {
        prev = this.effects[i - 1];
      }
      prev.disconnect();
      if (this.effects[i + 1] != null) {
        prev.connect(this.effects[i + 1]["in"]);
      } else {
        prev.connect(this["return"]);
      }
      fx.disconnect();
      return this.effects.splice(i, 1);
    };

    return Sampler;

  })();

  SAMPLES_DEFAULT = ['bd_909dwsd', 'bd_sub808', 'snr_drm909kit1', 'snr_mpc', 'clp_raw', 'clp_basics', 'hat_lilcloser', 'hat_nice909open', 'shaker_bot', 'tam_lifein2d'];

  this.SAMPLES = {
    'kick1': {
      url: 'static/wav/kick1.wav'
    },
    'kick2': {
      url: 'static/wav/kick2.wav'
    },
    'snare1': {
      url: 'static/wav/snare1.wav'
    },
    'snare2': {
      url: 'static/wav/snare2.wav'
    },
    'clap': {
      url: 'static/wav/clap.wav'
    },
    'hat_closed': {
      url: 'static/wav/hat_closed.wav'
    },
    'hat_open': {
      url: 'static/wav/hat_open.wav'
    },
    'ride': {
      url: 'static/wav/ride.wav'
    },
    'bd_909dwsd': {
      url: 'static/wav/deep_house/bd_kick/bd_909dwsd.wav'
    },
    'bd_chicago': {
      url: 'static/wav/deep_house/bd_kick/bd_chicago.wav'
    },
    'bd_dandans': {
      url: 'static/wav/deep_house/bd_kick/bd_dandans.wav'
    },
    'bd_deephouser': {
      url: 'static/wav/deep_house/bd_kick/bd_deephouser.wav'
    },
    'bd_diesel': {
      url: 'static/wav/deep_house/bd_kick/bd_diesel.wav'
    },
    'bd_dropped': {
      url: 'static/wav/deep_house/bd_kick/bd_dropped.wav'
    },
    'bd_flir': {
      url: 'static/wav/deep_house/bd_kick/bd_flir.wav'
    },
    'bd_gas': {
      url: 'static/wav/deep_house/bd_kick/bd_gas.wav'
    },
    'bd_ghost': {
      url: 'static/wav/deep_house/bd_kick/bd_ghost.wav'
    },
    'bd_hybrid': {
      url: 'static/wav/deep_house/bd_kick/bd_hybrid.wav'
    },
    'bd_isampleoldskool': {
      url: 'static/wav/deep_house/bd_kick/bd_isampleoldskool.wav'
    },
    'bd_liked': {
      url: 'static/wav/deep_house/bd_kick/bd_liked.wav'
    },
    'bd_mainroom': {
      url: 'static/wav/deep_house/bd_kick/bd_mainroom.wav'
    },
    'bd_mirror': {
      url: 'static/wav/deep_house/bd_kick/bd_mirror.wav'
    },
    'bd_nash': {
      url: 'static/wav/deep_house/bd_kick/bd_nash.wav'
    },
    'bd_newyear': {
      url: 'static/wav/deep_house/bd_kick/bd_newyear.wav'
    },
    'bd_organicisin': {
      url: 'static/wav/deep_house/bd_kick/bd_organicisin.wav'
    },
    'bd_outdoor': {
      url: 'static/wav/deep_house/bd_kick/bd_outdoor.wav'
    },
    'bd_shoein': {
      url: 'static/wav/deep_house/bd_kick/bd_shoein.wav'
    },
    'bd_sodeep': {
      url: 'static/wav/deep_house/bd_kick/bd_sodeep.wav'
    },
    'bd_sonikboom': {
      url: 'static/wav/deep_house/bd_kick/bd_sonikboom.wav'
    },
    'bd_streek': {
      url: 'static/wav/deep_house/bd_kick/bd_streek.wav'
    },
    'bd_stripped': {
      url: 'static/wav/deep_house/bd_kick/bd_stripped.wav'
    },
    'bd_sub808': {
      url: 'static/wav/deep_house/bd_kick/bd_sub808.wav'
    },
    'bd_tech': {
      url: 'static/wav/deep_house/bd_kick/bd_tech.wav'
    },
    'bd_tripper': {
      url: 'static/wav/deep_house/bd_kick/bd_tripper.wav'
    },
    'bd_uma': {
      url: 'static/wav/deep_house/bd_kick/bd_uma.wav'
    },
    'bd_untitled': {
      url: 'static/wav/deep_house/bd_kick/bd_untitled.wav'
    },
    'bd_vintager': {
      url: 'static/wav/deep_house/bd_kick/bd_vintager.wav'
    },
    'bd_vinylinstereo': {
      url: 'static/wav/deep_house/bd_kick/bd_vinylinstereo.wav'
    },
    'snr_analogging': {
      url: 'static/wav/deep_house/snare/snr_analogging.wav'
    },
    'snr_answer8bit': {
      url: 'static/wav/deep_house/snare/snr_answer8bit.wav'
    },
    'snr_bland': {
      url: 'static/wav/deep_house/snare/snr_bland.wav'
    },
    'snr_drm909kit': {
      url: 'static/wav/deep_house/snare/snr_drm909kit.wav'
    },
    'snr_dwreal': {
      url: 'static/wav/deep_house/snare/snr_dwreal.wav'
    },
    'snr_housey': {
      url: 'static/wav/deep_house/snare/snr_housey.wav'
    },
    'snr_mpc': {
      url: 'static/wav/deep_house/snare/snr_mpc.wav'
    },
    'snr_myclassicsnare': {
      url: 'static/wav/deep_house/snare/snr_myclassicsnare.wav'
    },
    'snr_owned': {
      url: 'static/wav/deep_house/snare/snr_owned.wav'
    },
    'snr_royalty': {
      url: 'static/wav/deep_house/snare/snr_royalty.wav'
    },
    'snr_rusnarious': {
      url: 'static/wav/deep_house/snare/snr_rusnarious.wav'
    },
    'snr_truevintage': {
      url: 'static/wav/deep_house/snare/snr_truevintage.wav'
    },
    'clp_analogue': {
      url: 'static/wav/deep_house/clap/clp_analogue.wav'
    },
    'clp_applause': {
      url: 'static/wav/deep_house/clap/clp_applause.wav'
    },
    'clp_basics': {
      url: 'static/wav/deep_house/clap/clp_basics.wav'
    },
    'clp_can': {
      url: 'static/wav/deep_house/clap/clp_can.wav'
    },
    'clp_clap10000': {
      url: 'static/wav/deep_house/clap/clp_clap10000.wav'
    },
    'clp_classic': {
      url: 'static/wav/deep_house/clap/clp_classic.wav'
    },
    'clp_clipper': {
      url: 'static/wav/deep_house/clap/clp_clipper.wav'
    },
    'clp_delma': {
      url: 'static/wav/deep_house/clap/clp_delma.wav'
    },
    'clp_donuts': {
      url: 'static/wav/deep_house/clap/clp_donuts.wav'
    },
    'clp_drastik': {
      url: 'static/wav/deep_house/clap/clp_drastik.wav'
    },
    'clp_eternity': {
      url: 'static/wav/deep_house/clap/clp_eternity.wav'
    },
    'clp_happiness': {
      url: 'static/wav/deep_house/clap/clp_happiness.wav'
    },
    'clp_kiddo': {
      url: 'static/wav/deep_house/clap/clp_kiddo.wav'
    },
    'clp_knowledge': {
      url: 'static/wav/deep_house/clap/clp_knowledge.wav'
    },
    'clp_kournikova': {
      url: 'static/wav/deep_house/clap/clp_kournikova.wav'
    },
    'clp_raw': {
      url: 'static/wav/deep_house/clap/clp_raw.wav'
    },
    'clp_scorch': {
      url: 'static/wav/deep_house/clap/clp_scorch.wav'
    },
    'clp_socute': {
      url: 'static/wav/deep_house/clap/clp_socute.wav'
    },
    'clp_sustained': {
      url: 'static/wav/deep_house/clap/clp_sustained.wav'
    },
    'clp_tayo': {
      url: 'static/wav/deep_house/clap/clp_tayo.wav'
    },
    'clp_tense': {
      url: 'static/wav/deep_house/clap/clp_tense.wav'
    },
    'clp_thinlayer': {
      url: 'static/wav/deep_house/clap/clp_thinlayer.wav'
    },
    'clp_verona': {
      url: 'static/wav/deep_house/clap/clp_verona.wav'
    },
    'hat_626': {
      url: 'static/wav/deep_house/hats/hat_626.wav'
    },
    'hat_ace': {
      url: 'static/wav/deep_house/hats/hat_ace.wav'
    },
    'hat_addverb': {
      url: 'static/wav/deep_house/hats/hat_addverb.wav'
    },
    'hat_analog': {
      url: 'static/wav/deep_house/hats/hat_analog.wav'
    },
    'hat_bebias': {
      url: 'static/wav/deep_house/hats/hat_bebias.wav'
    },
    'hat_bestfriend': {
      url: 'static/wav/deep_house/hats/hat_bestfriend.wav'
    },
    'hat_bigdeal': {
      url: 'static/wav/deep_house/hats/hat_bigdeal.wav'
    },
    'hat_blackmamba': {
      url: 'static/wav/deep_house/hats/hat_blackmamba.wav'
    },
    'hat_chart': {
      url: 'static/wav/deep_house/hats/hat_chart.wav'
    },
    'hat_charter': {
      url: 'static/wav/deep_house/hats/hat_charter.wav'
    },
    'hat_chipitaka': {
      url: 'static/wav/deep_house/hats/hat_chipitaka.wav'
    },
    'hat_classical': {
      url: 'static/wav/deep_house/hats/hat_classical.wav'
    },
    'hat_classichousehat': {
      url: 'static/wav/deep_house/hats/hat_classichousehat.wav'
    },
    'hat_closer': {
      url: 'static/wav/deep_house/hats/hat_closer.wav'
    },
    'hat_collective': {
      url: 'static/wav/deep_house/hats/hat_collective.wav'
    },
    'hat_crackers': {
      url: 'static/wav/deep_house/hats/hat_crackers.wav'
    },
    'hat_critters': {
      url: 'static/wav/deep_house/hats/hat_critters.wav'
    },
    'hat_cuppa': {
      url: 'static/wav/deep_house/hats/hat_cuppa.wav'
    },
    'hat_darkstar': {
      url: 'static/wav/deep_house/hats/hat_darkstar.wav'
    },
    'hat_deephouseopen': {
      url: 'static/wav/deep_house/hats/hat_deephouseopen.wav'
    },
    'hat_drawn': {
      url: 'static/wav/deep_house/hats/hat_drawn.wav'
    },
    'hat_freekn': {
      url: 'static/wav/deep_house/hats/hat_freekn.wav'
    },
    'hat_gater': {
      url: 'static/wav/deep_house/hats/hat_gater.wav'
    },
    'hat_glitchbitch': {
      url: 'static/wav/deep_house/hats/hat_glitchbitch.wav'
    },
    'hat_hatgasm': {
      url: 'static/wav/deep_house/hats/hat_hatgasm.wav'
    },
    'hat_hattool': {
      url: 'static/wav/deep_house/hats/hat_hattool.wav'
    },
    'hat_jelly': {
      url: 'static/wav/deep_house/hats/hat_jelly.wav'
    },
    'hat_kate': {
      url: 'static/wav/deep_house/hats/hat_kate.wav'
    },
    'hat_lights': {
      url: 'static/wav/deep_house/hats/hat_lights.wav'
    },
    'hat_lilcloser': {
      url: 'static/wav/deep_house/hats/hat_lilcloser.wav'
    },
    'hat_mydustyhouse': {
      url: 'static/wav/deep_house/hats/hat_mydustyhouse.wav'
    },
    'hat_myfavouriteopen': {
      url: 'static/wav/deep_house/hats/hat_myfavouriteopen.wav'
    },
    'hat_negative6': {
      url: 'static/wav/deep_house/hats/hat_negative6.wav'
    },
    'hat_nice909open': {
      url: 'static/wav/deep_house/hats/hat_nice909open.wav'
    },
    'hat_niner0niner': {
      url: 'static/wav/deep_house/hats/hat_niner0niner.wav'
    },
    'hat_omgopen': {
      url: 'static/wav/deep_house/hats/hat_omgopen.wav'
    },
    'hat_openiner': {
      url: 'static/wav/deep_house/hats/hat_openiner.wav'
    },
    'hat_original': {
      url: 'static/wav/deep_house/hats/hat_original.wav'
    },
    'hat_quentin': {
      url: 'static/wav/deep_house/hats/hat_quentin.wav'
    },
    'hat_rawsample': {
      url: 'static/wav/deep_house/hats/hat_rawsample.wav'
    },
    'hat_retired': {
      url: 'static/wav/deep_house/hats/hat_retired.wav'
    },
    'hat_sampleking': {
      url: 'static/wav/deep_house/hats/hat_sampleking.wav'
    },
    'hat_samplekingdom': {
      url: 'static/wav/deep_house/hats/hat_samplekingdom.wav'
    },
    'hat_sharp': {
      url: 'static/wav/deep_house/hats/hat_sharp.wav'
    },
    'hat_soff': {
      url: 'static/wav/deep_house/hats/hat_soff.wav'
    },
    'hat_spreadertrick': {
      url: 'static/wav/deep_house/hats/hat_spreadertrick.wav'
    },
    'hat_stereosonic': {
      url: 'static/wav/deep_house/hats/hat_stereosonic.wav'
    },
    'hat_tameit': {
      url: 'static/wav/deep_house/hats/hat_tameit.wav'
    },
    'hat_vintagespread': {
      url: 'static/wav/deep_house/hats/hat_vintagespread.wav'
    },
    'hat_void': {
      url: 'static/wav/deep_house/hats/hat_void.wav'
    },
    'shaker_bot': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_bot.wav'
    },
    'shaker_broom': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_broom.wav'
    },
    'shaker_command': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_command.wav'
    },
    'shaker_halfshake': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_halfshake.wav'
    },
    'shaker_pause': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_pause.wav'
    },
    'shaker_quicky': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_quicky.wav'
    },
    'shaker_really': {
      url: 'static/wav/deep_house/shaker_tambourine/shaker_really.wav'
    },
    'tam_christmassy': {
      url: 'static/wav/deep_house/shaker_tambourine/tam_christmassy.wav'
    },
    'tam_extras': {
      url: 'static/wav/deep_house/shaker_tambourine/tam_extras.wav'
    },
    'tam_hohoho': {
      url: 'static/wav/deep_house/shaker_tambourine/tam_hohoho.wav'
    },
    'tam_lifein2d': {
      url: 'static/wav/deep_house/shaker_tambourine/tam_lifein2d.wav'
    },
    'tam_mrhat': {
      url: 'static/wav/deep_house/shaker_tambourine/tam_mrhat.wav'
    },
    'tom_909fatty': {
      url: 'static/wav/deep_house/toms/tom_909fatty.wav'
    },
    'tom_909onvinyl': {
      url: 'static/wav/deep_house/toms/tom_909onvinyl.wav'
    },
    'tom_cleansweep': {
      url: 'static/wav/deep_house/toms/tom_cleansweep.wav'
    },
    'tom_dept': {
      url: 'static/wav/deep_house/toms/tom_dept.wav'
    },
    'tom_discodisco': {
      url: 'static/wav/deep_house/toms/tom_discodisco.wav'
    },
    'tom_eclipse': {
      url: 'static/wav/deep_house/toms/tom_eclipse.wav'
    },
    'tom_enriched': {
      url: 'static/wav/deep_house/toms/tom_enriched.wav'
    },
    'tom_enrico': {
      url: 'static/wav/deep_house/toms/tom_enrico.wav'
    },
    'tom_greatwhite': {
      url: 'static/wav/deep_house/toms/tom_greatwhite.wav'
    },
    'tom_iloveroland': {
      url: 'static/wav/deep_house/toms/tom_iloveroland.wav'
    },
    'tom_madisonave': {
      url: 'static/wav/deep_house/toms/tom_madisonave.wav'
    },
    'tom_ofalltoms': {
      url: 'static/wav/deep_house/toms/tom_ofalltoms.wav'
    },
    'tom_summerdayze': {
      url: 'static/wav/deep_house/toms/tom_summerdayze.wav'
    },
    'tom_taste': {
      url: 'static/wav/deep_house/toms/tom_taste.wav'
    },
    'tom_vsneve': {
      url: 'static/wav/deep_house/toms/tom_vsneve.wav'
    },
    'prc_808rimmer': {
      url: 'static/wav/deep_house/percussion/prc_808rimmer.wav'
    },
    'prc_bigdrum': {
      url: 'static/wav/deep_house/percussion/prc_bigdrum.wav'
    },
    'prc_bongodrm': {
      url: 'static/wav/deep_house/percussion/prc_bongodrm.wav'
    },
    'prc_bongorock': {
      url: 'static/wav/deep_house/percussion/prc_bongorock.wav'
    },
    'prc_boxed': {
      url: 'static/wav/deep_house/percussion/prc_boxed.wav'
    },
    'prc_change': {
      url: 'static/wav/deep_house/percussion/prc_change.wav'
    },
    'prc_clav': {
      url: 'static/wav/deep_house/percussion/prc_clav.wav'
    },
    'prc_congaz': {
      url: 'static/wav/deep_house/percussion/prc_congaz.wav'
    },
    'prc_dnthavacowman': {
      url: 'static/wav/deep_house/percussion/prc_dnthavacowman.wav'
    },
    'prc_drop': {
      url: 'static/wav/deep_house/percussion/prc_drop.wav'
    },
    'prc_emtythepot': {
      url: 'static/wav/deep_house/percussion/prc_emtythepot.wav'
    },
    'prc_flickingabucket': {
      url: 'static/wav/deep_house/percussion/prc_flickingabucket.wav'
    },
    'prc_foryoursampler': {
      url: 'static/wav/deep_house/percussion/prc_foryoursampler.wav'
    },
    'prc_harmony': {
      url: 'static/wav/deep_house/percussion/prc_harmony.wav'
    },
    'prc_hit': {
      url: 'static/wav/deep_house/percussion/prc_hit.wav'
    },
    'prc_home': {
      url: 'static/wav/deep_house/percussion/prc_home.wav'
    },
    'prc_itgoespop': {
      url: 'static/wav/deep_house/percussion/prc_itgoespop.wav'
    },
    'prc_jungledrummer': {
      url: 'static/wav/deep_house/percussion/prc_jungledrummer.wav'
    },
    'prc_knockknock': {
      url: 'static/wav/deep_house/percussion/prc_knockknock.wav'
    },
    'prc_reworked': {
      url: 'static/wav/deep_house/percussion/prc_reworked.wav'
    },
    'prc_rolled': {
      url: 'static/wav/deep_house/percussion/prc_rolled.wav'
    },
    'prc_syntheticlav': {
      url: 'static/wav/deep_house/percussion/prc_syntheticlav.wav'
    },
    'prc_trainstation': {
      url: 'static/wav/deep_house/percussion/prc_trainstation.wav'
    },
    'prc_u5510n': {
      url: 'static/wav/deep_house/percussion/prc_u5510n.wav'
    },
    'prc_vinylshot': {
      url: 'static/wav/deep_house/percussion/prc_vinylshot.wav'
    },
    'prc_virustiatmos': {
      url: 'static/wav/deep_house/percussion/prc_virustiatmos.wav'
    },
    'prc_youpanit': {
      url: 'static/wav/deep_house/percussion/prc_youpanit.wav'
    },
    'cym_crashtest': {
      url: 'static/wav/deep_house/ride_cymbal/cym_crashtest.wav'
    },
    'cym_gatecrashed': {
      url: 'static/wav/deep_house/ride_cymbal/cym_gatecrashed.wav'
    },
    'ride_8bitdirty': {
      url: 'static/wav/deep_house/ride_cymbal/ride_8bitdirty.wav'
    },
    'ride_cymbal1': {
      url: 'static/wav/deep_house/ride_cymbal/ride_cymbal1.wav'
    },
    'ride_full': {
      url: 'static/wav/deep_house/ride_cymbal/ride_full.wav'
    },
    'ride_jules': {
      url: 'static/wav/deep_house/ride_cymbal/ride_jules.wav'
    },
    'ride_mpc60': {
      url: 'static/wav/deep_house/ride_cymbal/ride_mpc60.wav'
    }
  };

}).call(this);
;(function() {
  this.SamplerCoreView = (function() {
    function SamplerCoreView(model, id, dom) {
      this.model = model;
      this.id = id;
      this.dom = dom;
      this.sample = this.dom.find('.Sampler_sample');
      this.canvas_waveform_dom = this.dom.find('.waveform');
      this.canvas_waveform = this.canvas_waveform_dom[0];
      this.ctx_waveform = this.canvas_waveform.getContext('2d');
      this.canvas_EQ_dom = this.dom.find('.canvasEQ');
      this.canvas_EQ = this.canvas_EQ_dom[0];
      this.ctx_EQ = this.canvas_EQ.getContext('2d');
      this.eq = this.dom.find('.Sampler_EQ');
      this.output = this.dom.find('.Sampler_output');
      this.panner = this.output.find('.pan-slider');
      this.gain = this.output.find('.gain-slider');
      this.sample_now = 0;
      this.w_wave = 300;
      this.h_wave = 180;
      this.head_wave = 0;
      this.tail_wave = this.w_wave;
      this.clicked_wave = 0;
      this.target = {
        head: this.head_wave,
        tail: this.tail_wave,
        both: [this.tail_wave, this.head_wave]
      };
      this.sample_name = this.sample.find('.sample-name');
      this.sample_list = $('#tmpl-sample-list').clone();
      this.sample_list.removeAttr('id');
      this.sample.find('.file-select').append(this.sample_list);
      this.sample_list_wrapper = $('<div class="sample-list-wrapper"></div>');
      this.sample.find('.file-select').append(this.sample_list_wrapper);
      this.initEvent();
      this.updateEQCanvas();
    }

    SamplerCoreView.prototype.getWaveformPos = function(e) {
      return e.clientX - this.canvas_waveform.getBoundingClientRect().left;
    };

    SamplerCoreView.prototype.initEvent = function() {
      var self,
        _this = this;
      this.sample.find('input').on("change", function() {
        _this.fetchSampleTimeParam();
        return _this.updateWaveformCanvas(_this.sample_now);
      });
      this.canvas_waveform_dom.on('mousedown', function(e) {
        var pos;
        pos = _this.getWaveformPos(e);
        _this.clicked_wave = pos;
        if (Math.abs(pos - _this.head_wave) < 3) {
          return _this.target_wave = 'head';
        } else if (Math.abs(pos - _this.tail_wave) < 3) {
          return _this.target_wave = 'tail';
        } else if (_this.head_wave < pos && pos < _this.tail_wave) {
          return _this.target_wave = 'both';
        } else {
          return _this.target_wave = void 0;
        }
      }).on('mousemove', function(e) {
        var d, pos;
        if (_this.target_wave != null) {
          pos = _this.getWaveformPos(e);
          d = pos - _this.clicked_wave;
          if (_this.target_wave === 'head') {
            d = Math.max(d, -_this.head_wave);
            _this.head_wave += d;
          } else if (_this.target_wave === 'tail') {
            d = Math.min(d, _this.w_wave - _this.tail_wave);
            _this.tail_wave += d;
          } else {
            d = Math.max(Math.min(d, _this.w_wave - _this.tail_wave), -_this.head_wave);
            _this.head_wave += d;
            _this.tail_wave += d;
          }
          _this.fetchSampleTimeParam();
          _this.updateWaveformCanvas(_this.sample_now);
          return _this.clicked_wave = pos;
        }
      }).on('mouseup mouseout', function() {
        _this.target_wave = void 0;
        return _this.updateWaveformCanvas(_this.sample_now);
      });
      this.sample_name.on('click', function() {
        return _this.showSampleList();
      });
      self = this;
      this.sample_list.find('div').on('click', function() {
        self.setSample($(this).html());
        return self.hideSampleList();
      });
      this.sample_list_wrapper.on('click', function() {
        return _this.hideSampleList();
      });
      this.eq.on('change', function() {
        _this.fetchSampleEQParam();
        return _this.updateEQCanvas();
      });
      return this.output.on('change', function() {
        return _this.fetchSampleOutputParam();
      });
    };

    SamplerCoreView.prototype.bindSample = function(sample_now, param) {
      this.sample_now = sample_now;
      this.sample_name.find('span').text(param.wave);
      this.updateWaveformCanvas(this.sample_now);
      return this.updateEQCanvas();
    };

    SamplerCoreView.prototype.showSampleList = function() {
      var position;
      position = this.sample_name.position();
      this.sample_list.show().css({
        top: position.top + 20 + 'px',
        left: position.left + 'px'
      });
      return this.sample_list_wrapper.show();
    };

    SamplerCoreView.prototype.hideSampleList = function() {
      this.sample_list.hide();
      return this.sample_list_wrapper.hide();
    };

    SamplerCoreView.prototype.updateWaveformCanvas = function(sample_now) {
      var canvas, ctx, d, h, hts, left, right, w, wave, x, _data, _i;
      this.sample_now = sample_now;
      canvas = this.canvas_waveform;
      ctx = this.ctx_waveform;
      w = canvas.width = this.w_wave;
      h = canvas.height = this.h_wave - 10;
      ctx.clearRect(0, 0, w, h);
      ctx.translate(0, 10);
      hts = this.model.getSampleTimeParam(this.sample_now);
      _data = this.model.getSampleData(this.sample_now);
      if (_data != null) {
        wave = _data.getChannelData(0);
        ctx.translate(0, h / 2);
        ctx.beginPath();
        d = wave.length / w;
        for (x = _i = 0; 0 <= w ? _i < w : _i > w; x = 0 <= w ? ++_i : --_i) {
          ctx.lineTo(x, wave[Math.floor(x * d)] * h * 0.45);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgb(255, 0, 220)';
        ctx.stroke();
        ctx.translate(0, -h / 2);
      }
      left = hts[0] * w;
      right = hts[1] * w;
      if (left < right) {
        if (this.target_wave != null) {
          ctx.fillStyle = 'rgba(255, 0, 160, 0.1)';
        } else {
          ctx.fillStyle = 'rgba(255, 0, 160, 0.2)';
        }
        ctx.fillRect(left, 0, right - left, h);
      }
      ctx.beginPath();
      ctx.arc(left, -5, 5, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(right, -5, 5, 0, 2 * Math.PI, false);
      ctx.stroke();
      return ctx.closePath();
    };

    SamplerCoreView.prototype.updateEQCanvas = function() {
      var canvas, ctx, eq, h, w;
      canvas = this.canvas_EQ;
      ctx = this.ctx_EQ;
      w = canvas.width = 270;
      h = canvas.height = 100;
      eq = this.model.getSampleEQParam(this.sample_now);
      ctx.clearRect(0, 0, w, h);
      ctx.translate(0, h / 2);
      ctx.beginPath();
      ctx.moveTo(0, -(eq[0] / 100.0) * (h / 2));
      ctx.lineTo(w / 3, -(eq[1] / 100.0) * (h / 2));
      ctx.lineTo(w / 3 * 2, -(eq[1] / 100.0) * (h / 2));
      ctx.lineTo(w, -(eq[2] / 100.0) * (h / 2));
      ctx.strokeStyle = 'rgb(255, 0, 220)';
      ctx.stroke();
      ctx.closePath();
      return ctx.translate(0, -h / 2);
    };

    SamplerCoreView.prototype.setSample = function(name) {
      this.model.setSample(this.sample_now, name);
      return this.sample_name.find('span').text(name);
    };

    SamplerCoreView.prototype.fetchSampleTimeParam = function() {
      return this.model.setSampleTimeParam(this.sample_now, this.head_wave / 300.0, this.tail_wave / 300.0, Math.pow(10, parseFloat(this.sample.find('.speed').val()) / 100.0 - 1.0));
    };

    SamplerCoreView.prototype.fetchSampleEQParam = function() {
      return this.model.setSampleEQParam(this.sample_now, parseFloat(this.eq.find('.EQ_lo').val()) - 100.0, parseFloat(this.eq.find('.EQ_mid').val()) - 100.0, parseFloat(this.eq.find('.EQ_hi').val()) - 100.0);
    };

    SamplerCoreView.prototype.fetchSampleOutputParam = function() {
      return this.model.setSampleOutputParam(this.sample_now, 1.0 - (parseFloat(this.panner.val()) / 200.0), parseFloat(this.gain.val()) / 100.0);
    };

    SamplerCoreView.prototype.setSampleTimeParam = function(p) {
      var ratio;
      this.head_wave = p[0] * 300.0;
      this.tail_wave = p[1] * 300.0;
      ratio = Math.log(p[2]) / Math.LN10 + 1.0;
      return this.sample.find('.speed').val(ratio * 100);
    };

    SamplerCoreView.prototype.setSampleEQParam = function(p) {
      this.eq.find('.EQ_lo').val(p[0] + 100.0);
      this.eq.find('.EQ_mid').val(p[1] + 100.0);
      return this.eq.find('.EQ_hi').val(p[2] + 100.0);
    };

    SamplerCoreView.prototype.setSampleOutputParam = function(p) {
      var g, pan;
      pan = p[0], g = p[1];
      this.panner.val((1.0 - pan) * 200.0);
      return this.gain.val(g * 100.0);
    };

    SamplerCoreView.prototype.fetchGains = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.gain_inputs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.model.setNodeGain(i, parseInt(this.gain_inputs.eq(i).val())));
      }
      return _results;
    };

    return SamplerCoreView;

  })();

  this.SamplerView = (function() {
    function SamplerView(model, id) {
      var _this = this;
      this.model = model;
      this.id = id;
      this.dom = $('#tmpl_sampler').clone();
      this.dom.attr('id', 'sampler' + id);
      $("#instruments").append(this.dom);
      this.synth_name = this.dom.find('.synth-name');
      this.synth_name.val(this.model.name);
      this.pattern_name = this.dom.find('.pattern-name');
      this.pattern_name.val(this.model.pattern_name);
      this.synth_type = this.dom.find('.synth-type');
      this.header = this.dom.find('.header');
      this.markers = this.dom.find('.markers');
      this.pos_markers = this.dom.find('.marker');
      this.marker_prev = this.dom.find('.marker-prev');
      this.marker_next = this.dom.find('.marker-next');
      this.plus = this.dom.find('.pattern-plus');
      this.minus = this.dom.find('.pattern-minus');
      this.nosync = this.dom.find('.pattern-nosync');
      this.is_nosync = false;
      this.setMarker();
      this.table_wrapper = this.dom.find('.sequencer-table');
      this.canvas_hover_dom = this.dom.find('.table-hover');
      this.canvas_on_dom = this.dom.find('.table-on');
      this.canvas_off_dom = this.dom.find('.table-off');
      this.canvas_hover = this.canvas_hover_dom[0];
      this.canvas_on = this.canvas_on_dom[0];
      this.canvas_off = this.canvas_off_dom[0];
      this.ctx_hover = this.canvas_hover.getContext('2d');
      this.ctx_on = this.canvas_on.getContext('2d');
      this.ctx_off = this.canvas_off.getContext('2d');
      this.cell = new Image();
      this.cell.src = 'static/img/sequencer_cell.png';
      this.cell.onload = function() {
        return _this.initCanvas();
      };
      this.cells_x = 32;
      this.cells_y = 10;
      this.core = this.dom.find('.sampler-core');
      this.keyboard = new SamplerKeyboardView(this);
      this.pattern = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
      this.pattern_obj = {
        name: this.pattern_name.val(),
        pattern: this.pattern
      };
      this.page = 0;
      this.page_total = 1;
      this.last_time = 0;
      this.last_page = 0;
      this.is_clicked = false;
      this.hover_pos = {
        x: -1,
        y: -1
      };
      this.click_pos = {
        x: -1,
        y: -1
      };
      this.initEvent();
      this.initCanvas();
    }

    SamplerView.prototype.initCanvas = function() {
      var i, j, _i, _j, _ref, _ref1;
      this.canvas_hover.width = this.canvas_on.width = this.canvas_off.width = 832;
      this.canvas_hover.height = this.canvas_on.height = this.canvas_off.height = 260;
      this.rect = this.canvas_off.getBoundingClientRect();
      this.offset = {
        x: this.rect.left,
        y: this.rect.top
      };
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        for (j = _j = 0, _ref1 = this.cells_x; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          this.ctx_off.drawImage(this.cell, 0, 26, 26, 26, j * 26, i * 26, 26, 26);
        }
      }
      return this.setPattern(this.pattern_obj);
    };

    SamplerView.prototype.getPos = function(e) {
      var _x, _y;
      this.rect = this.canvas_off.getBoundingClientRect();
      _x = Math.floor((e.clientX - this.rect.left) / 26);
      _y = Math.floor((e.clientY - this.rect.top) / 26);
      _y = Math.min(9, _y);
      return {
        x: _x,
        y: _y,
        x_abs: this.page * this.cells_x + _x,
        y_abs: _y,
        note: this.cells_y - _y
      };
    };

    SamplerView.prototype.initEvent = function() {
      var _this = this;
      this.canvas_hover_dom.on('mousemove', function(e) {
        var pos;
        pos = _this.getPos(e);
        if (pos !== _this.hover_pos) {
          _this.ctx_hover.clearRect(_this.hover_pos.x * 26, _this.hover_pos.y * 26, 26, 26);
          _this.ctx_hover.drawImage(_this.cell, 52, 26, 26, 26, pos.x * 26, pos.y * 26, 26, 26);
          _this.hover_pos = pos;
        }
        if (_this.is_clicked && _this.click_pos !== pos) {
          if (_this.is_adding) {
            _this.addNote(pos, 1.0);
          } else {
            _this.removeNote(pos);
          }
          return _this.click_pos = pos;
        }
      }).on('mousedown', function(e) {
        var note, pos, remove, _i, _len, _ref;
        _this.is_clicked = true;
        pos = _this.getPos(e);
        remove = false;
        _ref = _this.pattern[pos.x_abs];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          note = _ref[_i];
          if (note[0] === pos.note) {
            remove = true;
          }
        }
        if (remove) {
          return _this.removeNote(pos);
        } else {
          _this.is_adding = true;
          return _this.addNote(pos, 1.0);
        }
      }).on('mouseup', function(e) {
        _this.is_clicked = false;
        _this.is_adding = false;
        return _this.is_removing = false;
      }).on('mouseout', function(e) {
        _this.ctx_hover.clearRect(_this.hover_pos.x * 26, _this.hover_pos.y * 26, 26, 26);
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        _this.is_clicked = false;
        _this.is_adding = false;
        return _this.is_removing = false;
      });
      this.synth_type.on('change', function() {
        return _this.model.changeSynth(_this.synth_type.val());
      });
      this.synth_name.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      })).on('change', (function() {
        return _this.model.setSynthName(_this.synth_name.val());
      }));
      this.pattern_name.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      })).on('change', (function() {
        return _this.model.setPatternName(_this.pattern_name.val());
      }));
      this.marker_prev.on('click', (function() {
        return _this.model.player.backward(true);
      }));
      this.marker_next.on('click', (function() {
        return _this.model.player.forward();
      }));
      this.nosync.on('click', (function() {
        return _this.toggleNoSync();
      }));
      this.plus.on('click', (function() {
        return _this.plusPattern();
      }));
      return this.minus.on('click', (function() {
        if (_this.pattern.length > _this.cells_x) {
          return _this.minusPattern();
        }
      }));
    };

    SamplerView.prototype.addNote = function(pos, gain) {
      var i, _i, _ref;
      if (this.pattern[pos.x_abs] === 0) {
        this.pattern[pos.x_abs] = [];
      }
      if (!Array.isArray(this.pattern[pos.x_abs])) {
        this.pattern[pos.x_abs] = [[this.pattern[pos.x_abs], 1.0]];
      }
      for (i = _i = 0, _ref = this.pattern[pos.x_abs].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.pattern[pos.x_abs][i][0] === pos.note) {
          this.pattern[pos.x_abs].splice(i, 1);
        }
      }
      this.pattern[pos.x_abs].push([pos.note, gain]);
      this.model.addNote(pos.x_abs, pos.note, gain);
      return this.ctx_on.drawImage(this.cell, 26, 26, 26, 26, pos.x * 26, pos.y * 26, 26, 26);
    };

    SamplerView.prototype.removeNote = function(pos) {
      var i, _i, _ref;
      for (i = _i = 0, _ref = this.pattern[pos.x_abs].length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.pattern[pos.x_abs][i][0] === pos.note) {
          this.pattern[pos.x_abs].splice(i, 1);
        }
      }
      this.ctx_on.clearRect(pos.x * 26, pos.y * 26, 26, 26);
      return this.model.removeNote(pos);
    };

    SamplerView.prototype.playAt = function(time) {
      var i, _i, _ref;
      this.time = time;
      if (this.is_nosync) {
        return;
      }
      if (this.time % this.cells_x === 0) {
        this.drawPattern(this.time);
      }
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.ctx_off.drawImage(this.cell, 0, 26, 26, 26, (this.last_time % this.cells_x) * 26, i * 26, 26, 26);
        this.ctx_off.drawImage(this.cell, 78, 26, 26, 26, (time % this.cells_x) * 26, i * 26, 26, 26);
      }
      return this.last_time = time;
    };

    SamplerView.prototype.setPattern = function(pattern_obj) {
      this.pattern_obj = pattern_obj;
      this.pattern = this.pattern_obj.pattern;
      this.page = 0;
      this.page_total = this.pattern.length / this.cells_x;
      this.drawPattern(0);
      this.setMarker();
      return this.setPatternName(this.pattern_obj.name);
    };

    SamplerView.prototype.drawPattern = function(time) {
      var i, j, y, _i, _j, _len, _ref, _ref1;
      if (time != null) {
        this.time = time;
      }
      this.page = Math.floor(this.time / this.cells_x);
      this.ctx_on.clearRect(0, 0, 832, 260);
      for (i = _i = 0, _ref = this.cells_x; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _ref1 = this.pattern[this.page * this.cells_x + i];
        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
          j = _ref1[_j];
          y = this.cells_y - j[0];
          this.ctx_on.drawImage(this.cell, 26, 26, 26, 26, i * 26, y * 26, 26, 26);
        }
      }
      return this.setMarker();
    };

    SamplerView.prototype.plusPattern = function() {
      if (this.page_total === 8) {
        return;
      }
      this.pattern = this.pattern.concat([[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]);
      this.page_total++;
      this.model.plusPattern();
      this.drawPattern();
      this.minus.removeClass('btn-false').addClass('btn-true');
      if (this.page_total === 8) {
        return this.plus.removeClass('btn-true').addClass('btn-false');
      }
    };

    SamplerView.prototype.minusPattern = function() {
      if (this.page_total === 1) {
        return;
      }
      this.pattern = this.pattern.slice(0, this.pattern.length - this.cells_x);
      this.page_total--;
      this.model.minusPattern();
      this.drawPattern();
      this.plus.removeClass('btn-false').addClass('btn-true');
      if (this.page_total === 1) {
        return this.minus.removeClass('btn-true').addClass('btn-false');
      }
    };

    SamplerView.prototype.setMarker = function() {
      var _this = this;
      this.pos_markers.filter(function(i) {
        return i < _this.page_total;
      }).addClass('marker-active');
      this.pos_markers.filter(function(i) {
        return _this.page_total <= i;
      }).removeClass('marker-active');
      this.pos_markers.removeClass('marker-now').eq(this.page).addClass('marker-now');
      this.markers.find('.marker-pos').text(this.page + 1);
      this.markers.find('.marker-total').text(this.page_total);
      return this.pos_markers.filter(function(i) {
        return i < _this.page_total;
      }).each(function(i) {
        return _this.pos_markers.eq(i).on('mousedown', function() {
          var _results;
          if (_this.page < i) {
            while (_this.page !== i) {
              _this.model.player.forward();
            }
          }
          if (i < _this.page) {
            _results = [];
            while (_this.page !== i) {
              _results.push(_this.model.player.backward(true));
            }
            return _results;
          }
        });
      });
    };

    SamplerView.prototype.play = function() {};

    SamplerView.prototype.stop = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.ctx_off.drawImage(this.cell, 0, 26, 26, 26, (this.last_time % this.cells_x) * 26, i * 26, 26, 26));
      }
      return _results;
    };

    SamplerView.prototype.activate = function(i) {
      this.is_active = true;
      return this.initCanvas();
    };

    SamplerView.prototype.inactivate = function() {
      return this.is_active = false;
    };

    SamplerView.prototype.setSynthName = function(name) {
      return this.synth_name.val(name);
    };

    SamplerView.prototype.setPatternName = function(name) {
      return this.pattern_name.val(name);
    };

    SamplerView.prototype.toggleNoSync = function() {
      var i, _i, _ref, _results;
      if (this.is_nosync) {
        this.is_nosync = false;
        this.nosync.removeClass('btn-true').addClass('btn-false');
        return this.drawPattern(this.time);
      } else {
        this.is_nosync = true;
        this.nosync.removeClass('btn-false').addClass('btn-true');
        _results = [];
        for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(this.ctx_off.drawImage(this.cell, 0, 26, 26, 26, (this.time % this.cells_x) * 26, i * 26, 26, 26));
        }
        return _results;
      }
    };

    SamplerView.prototype.selectSample = function(sample_now) {
      this.sample_now = sample_now;
      this.keyboard.selectSample(this.sample_now);
      return this.model.selectSample(this.sample_now);
    };

    return SamplerView;

  })();

  this.SamplerKeyboardView = (function() {
    function SamplerKeyboardView(sequencer) {
      this.sequencer = sequencer;
      this.on_dom = this.sequencer.dom.find('.keyboard-off');
      this.off_dom = this.sequencer.dom.find('.keyboard-on');
      this.canvas_on = this.on_dom[0];
      this.canvas_off = this.off_dom[0];
      this.ctx_on = this.canvas_on.getContext('2d');
      this.ctx_off = this.canvas_off.getContext('2d');
      this.w = 64;
      this.h = 26;
      this.cells_y = 10;
      this.color = ['rgba(230, 230, 230, 1.0)', 'rgba(  250, 50, 230, 0.7)', 'rgba(255, 100, 230, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)'];
      this.is_clicked = false;
      this.hover_pos = {
        x: -1,
        y: -1
      };
      this.click_pos = {
        x: -1,
        y: -1
      };
      this.initCanvas();
      this.initEvent();
    }

    SamplerKeyboardView.prototype.initCanvas = function() {
      var i, _i, _ref, _results;
      this.canvas_on.width = this.canvas_off.width = this.w;
      this.canvas_on.height = this.canvas_off.height = this.h * this.cells_y;
      this.rect = this.canvas_off.getBoundingClientRect();
      this.offset = {
        x: this.rect.left,
        y: this.rect.top
      };
      this.ctx_off.fillStyle = this.color[0];
      _results = [];
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.drawNormal(i);
        _results.push(this.drawText(i));
      }
      return _results;
    };

    SamplerKeyboardView.prototype.getPos = function(e) {
      this.rect = this.canvas_off.getBoundingClientRect();
      return Math.floor((e.clientY - this.rect.top) / this.h);
    };

    SamplerKeyboardView.prototype.initEvent = function() {
      var _this = this;
      return this.off_dom.on('mousemove', function(e) {
        var pos;
        pos = _this.getPos(e);
        if (pos !== _this.hover_pos) {
          _this.drawNormal(_this.hover_pos);
          _this.drawHover(pos);
          _this.hover_pos = pos;
        }
        if (_this.is_clicked && _this.click_pos !== pos) {
          _this.clearActive(_this.click_pos);
          _this.drawActive(pos);
          _this.sequencer.model.noteOff();
          _this.sequencer.model.noteOn(_this.cells_y - pos);
          return _this.click_pos = pos;
        }
      }).on('mousedown', function(e) {
        var note, pos;
        _this.is_clicked = true;
        pos = _this.getPos(e);
        note = _this.cells_y - pos;
        _this.sequencer.selectSample(note - 1);
        _this.drawActive(pos);
        _this.sequencer.model.noteOn(note);
        return _this.click_pos = pos;
      }).on('mouseup', function(e) {
        _this.is_clicked = false;
        _this.clearActive(_this.click_pos);
        _this.sequencer.model.noteOff();
        return _this.click_pos = {
          x: -1,
          y: -1
        };
      }).on('mouseout', function(e) {
        _this.clearActive(_this.hover_pos);
        _this.sequencer.model.noteOff();
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        return _this.click_pos = {
          x: -1,
          y: -1
        };
      });
    };

    SamplerKeyboardView.prototype.drawNormal = function(i) {
      this.clearNormal(i);
      this.ctx_off.fillStyle = this.color[0];
      this.ctx_off.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
      this.ctx_off.fillStyle = this.color[3];
      return this.ctx_off.fillText((this.cells_y - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    SamplerKeyboardView.prototype.drawHover = function(i) {
      this.ctx_off.fillStyle = this.color[1];
      this.ctx_off.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
      return this.ctx_off.fillText((this.cells_y - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    SamplerKeyboardView.prototype.drawActive = function(i) {
      this.clearNormal(i);
      this.ctx_off.fillStyle = this.color[2];
      this.ctx_off.fillRect(0, i * this.h, this.w, this.h);
      this.ctx_off.fillStyle = this.color[4];
      return this.ctx_off.fillText((this.cells_y - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    SamplerKeyboardView.prototype.clearNormal = function(i) {
      return this.ctx_off.clearRect(0, i * this.h, this.w, this.h);
    };

    SamplerKeyboardView.prototype.clearActive = function(i) {
      this.clearNormal(i);
      this.drawNormal(i);
      return this.drawText(i);
    };

    SamplerKeyboardView.prototype.drawText = function(i) {
      this.ctx_off.fillStyle = this.color[3];
      return this.ctx_off.fillText((this.cells_y - i - 1) % 7 + 1 + 'th', 10, (i + 1) * this.h - 10);
    };

    SamplerKeyboardView.prototype.selectSample = function(sample_now) {
      this.ctx_on.clearRect(0, (this.cells_y - this.sample_last - 1) * this.h, this.w, this.h);
      this.ctx_on.fillStyle = 'rgba(255, 200, 230, 0.3)';
      this.ctx_on.fillRect(0, (this.cells_y - sample_now - 1) * this.h, this.w, this.h);
      return this.sample_last = sample_now;
    };

    return SamplerKeyboardView;

  })();

}).call(this);
;(function() {
  var _master;

  _master = {
    name: 'section-0',
    bpm: 144,
    key: 'A',
    scale: 'minor'
  };

  this.SONG_DEFAULT = {
    tracks: [],
    length: 1,
    master: [_master]
  };

  this.Session = (function() {
    function Session(ctx, player) {
      this.ctx = ctx;
      this.player = player;
      this.scenes = [];
      this.scene_pos = 0;
      this.scene = {};
      this.scene_length = 32;
      this.current_cells = [];
      this.next_pattern_pos = [];
      this.next_scene_pos = void 0;
      this.is_loop = true;
      this.is_waiting_next_pattern = false;
      this.is_waiting_next_scene = false;
      this.cue_queue = [];
      this.song = SONG_DEFAULT;
      this.view = new SessionView(this, this.song);
    }

    Session.prototype.toggleLoop = function() {
      return this.is_loop = !this.is_loop;
    };

    Session.prototype.nextMeasure = function(synth, time) {
      this.synth = synth;
      if (this.is_loop) {
        if (this.is_waiting_next_scene) {
          return this.nextScene(this.next_scene_pos);
        } else if (this.is_waiting_next_pattern) {
          return this.nextPattern();
        }
      } else {
        return this.nextScene();
      }
    };

    Session.prototype.nextPattern = function() {
      var pat, q, _i, _len, _ref;
      this.savePatterns();
      this.is_waiting_next_pattern = false;
      _ref = this.cue_queue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        q = _ref[_i];
        pat = this.song.tracks[q[0]].patterns[q[1]];
        this.synth[q[0]].setPattern(pat);
        this.current_cells[q[0]] = q[1];
      }
      this.view.drawScene(this.scene_pos, this.current_cells);
      this.next_pattern_pos = [];
      return this.cue_queue = [];
    };

    Session.prototype.nextScene = function(pos) {
      var i, pat, s, _i, _ref;
      this.savePatterns();
      this.is_waiting_next_scene = false;
      if (pos == null) {
        this.scene_pos++;
        pos = this.scene_pos;
      } else {
        this.scene_pos = pos;
      }
      if (this.scene_pos >= this.song.length) {
        this.player.is_playing = false;
        this.view.clearAllActive();
        this.scene_pos = this.next_scene_pos = 0;
        this.current_cells = (function() {
          var _i, _len, _ref, _results;
          _ref = this.song.tracks;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            _results.push(0);
          }
          return _results;
        }).call(this);
        return;
      }
      for (i = _i = 0, _ref = this.synth.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.song.tracks[i].patterns[this.scene_pos] == null) {
          continue;
        }
        pat = this.song.tracks[i].patterns[this.scene_pos];
        if ((pat != null) && pat !== null) {
          this.synth[i].setPattern(pat);
          this.scene_length = Math.max(this.scene_length, pat.pattern.length);
          this.current_cells[i] = pos;
        }
      }
      if (this.song.master[this.scene_pos] != null) {
        this.player.readScene(this.song.master[this.scene_pos]);
      }
      this.player.setSceneLength(this.scene_length);
      this.view.readSong(this.song, this.current_cells);
      this.view.drawScene(this.scene_pos, this.current_cells);
      this.next_pattern_pos = [];
      this.next_scene_pos = void 0;
      return this.cue_queue = [];
    };

    Session.prototype.getScene = function(i) {
      return this.song.master[i];
    };

    Session.prototype.play = function() {
      return this.view.drawScene(this.scene_pos, this.current_cells);
    };

    Session.prototype.beat = function() {
      if (this.is_waiting_next_scene) {
        return this.view.beat(true, [0, this.next_scene_pos]);
      } else {
        return this.view.beat(false, this.cue_queue);
      }
    };

    Session.prototype.cuePattern = function(synth_num, pat_num) {
      this.is_waiting_next_pattern = true;
      this.next_pattern_pos[synth_num] = pat_num;
      return this.cue_queue.push([synth_num, pat_num]);
    };

    Session.prototype.cueScene = function(scene_num) {
      this.is_waiting_next_scene = true;
      return this.next_scene_pos = scene_num;
    };

    Session.prototype.next = function() {
      this.nextScene();
      return this.nextPattern();
    };

    Session.prototype.addSynth = function(s, _pos) {
      var name, patterns, pos, s_obj;
      pos = _pos ? _pos : this.scene_pos;
      name = s.id + '-' + pos;
      s.setPatternName(name);
      patterns = [];
      patterns[pos] = {
        name: s.pattern_name,
        pattern: s.pattern
      };
      s_obj = {
        id: s.id,
        type: s.type,
        name: s.name,
        patterns: patterns,
        params: [],
        gain: 1.0,
        pan: 0.0
      };
      this.song.tracks.push(s_obj);
      this.current_cells.push(pos);
      return this.view.addSynth(this.song);
    };

    Session.prototype.setSynth = function(synth) {
      this.synth = synth;
    };

    Session.prototype.readTrack = function(song, src, dst) {
      var name, synth_num;
      this.song = song;
      if (this.song.master[dst.y] == null) {
        this.song.master[dst.y] = {
          name: 'section-' + dst.y
        };
      }
      if (dst.y + 1 > this.song.length) {
        this.song.length = dst.y + 1;
      }
      name = this.song.tracks[src.x].patterns[src.y].name;
      synth_num = dst.x;
      if (this.song.tracks.length <= dst.x) {
        synth_num = this.song.tracks.length;
        if (this.song.tracks[src.x].type === 'REZ') {
          this.player.addSynth(dst.y);
        } else if (this.song.tracks[src.x].type === 'SAMPLER') {
          this.player.addSampler(dst.y);
        }
      }
      return this.song.tracks.length - 1;
    };

    Session.prototype.readPattern = function(pat, synth_num, pat_num) {
      this.song.tracks[synth_num].patterns[pat_num] = pat;
      if (this.song.master[pat_num] == null) {
        this.song.master[pat_num] = {
          name: 'section-' + pat_num
        };
      }
      if (pat_num + 1 > this.song.length) {
        this.song.length = pat_num + 1;
      }
      if (this.current_cells[synth_num] === pat_num) {
        return this.player.synth[synth_num].setPattern(pat);
      }
    };

    Session.prototype.readMaster = function(pat, pat_num) {
      this.song.master[pat_num] = pat;
      if (pat_num + 1 > this.song.length) {
        return this.song.length = pat_num + 1;
      }
    };

    Session.prototype.editPattern = function(_synth_num, pat_num) {
      var pat_name, synth_num;
      if (this.song.master[pat_num] == null) {
        this.song.master[pat_num] = {
          name: 'section-' + pat_num
        };
      }
      if (pat_num + 1 > this.song.length) {
        this.song.length = pat_num + 1;
      }
      synth_num = _synth_num;
      if (this.song.tracks.length <= _synth_num) {
        synth_num = this.song.tracks.length;
        this.player.addSynth(pat_num);
      }
      this.savePattern(synth_num, this.current_cells[synth_num]);
      if (this.song.tracks[synth_num].patterns[pat_num] != null) {
        this.player.synth[synth_num].setPattern(this.song.tracks[synth_num].patterns[pat_num]);
      } else {
        pat_name = synth_num + '-' + pat_num;
        this.player.synth[synth_num].clearPattern();
        this.player.synth[synth_num].setPatternName(pat_name);
        this.song.tracks[synth_num].patterns[pat_num] = this.player.synth[synth_num].getPattern();
      }
      this.current_cells[synth_num] = pat_num;
      this.view.readSong(this.song, this.current_cells);
      this.player.moveTo(synth_num);
      return [synth_num, pat_num, this.song.tracks[synth_num].patterns[pat_num]];
    };

    Session.prototype.savePatterns = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.current_cells.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.savePattern(i, this.current_cells[i]));
      }
      return _results;
    };

    Session.prototype.savePattern = function(x, y) {
      return this.song.tracks[x].patterns[y] = this.player.synth[x].getPattern();
    };

    Session.prototype.saveTracks = function() {
      var i, param, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.player.synth.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        param = this.player.synth[i].getParam();
        if (this.song.tracks[i].patterns != null) {
          param.patterns = this.song.tracks[i].patterns;
        }
        _results.push(this.song.tracks[i] = param);
      }
      return _results;
    };

    Session.prototype.saveTracksEffect = function(pos) {
      return this.song.tracks[pos.x].effects = this.player.synth[pos.x].getEffectsParam();
    };

    Session.prototype.saveMaster = function(y, obj) {
      this.song.master[y] = obj;
      this.view.readSong(this.song, this.current_cells);
      if (y === this.scene_pos) {
        return this.player.readScene(obj);
      }
    };

    Session.prototype.saveMasters = function() {
      if (this.song.master === []) {
        return this.song.master.push(this.player.getScene());
      }
    };

    Session.prototype.saveMixer = function() {
      return this.song.mixer = this.player.mixer.getParam();
    };

    Session.prototype.saveSong = function() {
      var csrf_token, song_json,
        _this = this;
      this.savePatterns();
      this.saveTracks();
      this.saveMasters();
      this.saveMixer();
      song_json = JSON.stringify(this.song);
      csrf_token = $('#ajax-form > input[name=csrf_token]').val();
      return $.ajax({
        url: '/',
        type: 'POST',
        dataType: 'text',
        data: {
          json: song_json,
          csrf_token: csrf_token
        }
      }).done(function(d) {
        return _this.view.showSuccess(d, _this.song.title, _this.song.creator);
      }).fail(function(err) {
        return _this.view.showError(err);
      });
    };

    Session.prototype.readSong = function(song) {
      var i, pat, _i, _ref;
      this.song = song;
      this.scene_pos = 0;
      this.scene_length = 0;
      for (i = _i = 0, _ref = this.song.tracks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        pat = this.song.tracks[i].patterns[0];
        if ((pat != null) && pat !== null) {
          this.synth[i].setPattern(pat);
          this.current_cells[i] = 0;
          this.scene_length = Math.max(this.scene_length, pat.pattern.length);
        } else {
          this.current_cells[i] = void 0;
        }
      }
      return this.view.readSong(this.song, this.current_cells);
    };

    Session.prototype.setSynthName = function(synth_id, name) {
      this.song.tracks[synth_id].name = name;
      return this.view.drawTrackName(synth_id, name, this.song.tracks[synth_id].type);
    };

    Session.prototype.setPatternName = function(synth_id, name) {
      var pat_num;
      pat_num = this.current_cells[synth_id];
      if (this.song.tracks[synth_id].patterns[pat_num] != null) {
        this.song.tracks[synth_id].patterns[pat_num].name = name;
      } else {
        this.song.tracks[synth_id].patterns[pat_num] = {
          name: name
        };
      }
      return this.view.drawPatternName(synth_id, pat_num, this.song.tracks[synth_id].patterns[pat_num]);
    };

    Session.prototype.changeSynth = function(id, type, synth_new) {
      var pat_name, patterns, s_params, _ref;
      pat_name = id + '-' + this.scene_pos;
      synth_new.setPatternName(pat_name);
      patterns = [];
      patterns[this.scene_pos] = {
        name: pat_name,
        pattern: synth_new.pattern
      };
      s_params = {
        id: id,
        type: type,
        name: 'Synth #' + id,
        patterns: patterns,
        params: [],
        gain: 1.0,
        pan: 0.0
      };
      this.song.tracks[id] = s_params;
      synth_new.setPattern(patterns[this.scene_pos]);
      _ref = [this.song.tracks[id].patterns[this.current_cells[id]], this.song.tracks[id].patterns[0]], this.song.tracks[id].patterns[0] = _ref[0], this.song.tracks[id].patterns[this.current_cells[id]] = _ref[1];
      return this.view.addSynth(this.song, [id, this.scene_pos]);
    };

    Session.prototype.empty = function() {
      this.next_pattern_pos = [];
      this.scenes = [];
      this.scene_pos = 0;
      this.scene = {};
      this.scene_length = 32;
      this.current_cells = [];
      this.next_pattern_pos = [];
      this.next_scene_pos = void 0;
      this.is_loop = true;
      this.is_waiting_next_pattern = false;
      this.is_waiting_next_scene = false;
      this.cue_queue = [];
      return this.song = {
        tracks: [],
        master: [],
        length: 0,
        mixer: []
      };
    };

    Session.prototype.deleteCell = function() {
      var p;
      p = this.view.getSelectPos();
      if (p == null) {
        return;
      }
      if (p.type === 'tracks') {
        this.song.tracks[p.x].patterns[p.y] = void 0;
        if (this.current_cells[p.x] === p.y) {
          this.player.synth[p.x].clearPattern();
          this.current_cells[p.x] = void 0;
        }
        return this.view.readSong(this.song, this.current_cells);
      } else if (p.type === 'master') {
        this.song.master[p.y] = {
          name: this.song.master[p.y].name
        };
        return this.view.readSong(this.song, this.current_cells);
      }
    };

    return Session;

  })();

}).call(this);
;(function() {
  this.SessionView = (function() {
    function SessionView(model, song) {
      var i,
        _this = this;
      this.model = model;
      this.song = song;
      this.wrapper_mixer = $('#mixer-tracks');
      this.wrapper_master = $('#session-master-wrapper');
      this.wrapper_tracks = $('#session-tracks-wrapper');
      this.wrapper_tracks_sub = $('#session-tracks-wrapper-sub');
      this.canvas_tracks_dom = $('#session-tracks');
      this.canvas_master_dom = $('#session-master');
      this.canvas_tracks_on_dom = $('#session-tracks-on');
      this.canvas_master_on_dom = $('#session-master-on');
      this.canvas_tracks_hover_dom = $('#session-tracks-hover');
      this.canvas_master_hover_dom = $('#session-master-hover');
      this.canvas_tracks = this.canvas_tracks_dom[0];
      this.canvas_master = this.canvas_master_dom[0];
      this.canvas_tracks_on = this.canvas_tracks_on_dom[0];
      this.canvas_master_on = this.canvas_master_on_dom[0];
      this.canvas_tracks_hover = this.canvas_tracks_hover_dom[0];
      this.canvas_master_hover = this.canvas_master_hover_dom[0];
      this.ctx_tracks = this.canvas_tracks.getContext('2d');
      this.ctx_master = this.canvas_master.getContext('2d');
      this.ctx_tracks_on = this.canvas_tracks_on.getContext('2d');
      this.ctx_master_on = this.canvas_master_on.getContext('2d');
      this.ctx_tracks_hover = this.canvas_tracks_hover.getContext('2d');
      this.ctx_master_hover = this.canvas_master_hover.getContext('2d');
      this.w = 70;
      this.h = 20;
      this.w_master = 80;
      this.color = ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(100, 230, 255, 0.2)'];
      this.color_schemes = {
        REZ: ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(100, 230, 255, 0.2)'],
        SAMPLER: ['rgba(230, 230, 230, 1.0)', 'rgba(  255, 100, 192, 0.7)', 'rgba(255, 160, 216, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(255, 160, 216, 0.2)']
      };
      this.track_color = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 8; i = ++_i) {
          _results.push(this.color);
        }
        return _results;
      }).call(this);
      this.img_play = new Image();
      this.img_play.src = 'static/img/play.png';
      this.img_play.onload = function() {
        return _this.initCanvas();
      };
      this.last_active = [];
      this.current_cells = [];
      this.hover_pos = {
        x: -1,
        y: -1
      };
      this.click_pos = {
        x: -1,
        y: -1
      };
      this.select_pos = {
        x: 0,
        y: 0,
        type: 'master'
      };
      this.last_clicked = performance.now();
      this.dialog = $('#dialog');
      this.dialog_wrapper = $('#dialog-wrapper');
      this.dialog_close = this.dialog.find('.dialog-close');
      this.btn_save = $('#btn-save');
      this.btn_clear = $('#btn-clear');
      this.song_info = $('#song-info');
      this.song_title = this.song_info.find('#song-title');
      this.song_creator = this.song_info.find('#song-creator');
      this.social_twitter = $('#twitter');
      this.social_facebook = $('#facebook');
      this.social_hatena = $('#hatena');
    }

    SessionView.prototype.initCanvas = function() {
      this.canvas_tracks.width = this.canvas_tracks_on.width = this.canvas_tracks_hover.width = this.w * 8 + 1;
      this.canvas_master.width = this.canvas_master_on.width = this.canvas_master_hover.width = this.w + 11;
      this.canvas_tracks.height = this.canvas_tracks_on.height = this.canvas_tracks_hover.height = this.h * 11 + 10;
      this.canvas_master.height = this.canvas_master_on.height = this.canvas_master_hover.height = this.h * 11 + 10;
      this.offset_y = 20;
      this.ctx_tracks.translate(0, this.offset_y);
      this.ctx_master.translate(0, this.offset_y);
      this.ctx_tracks_on.translate(0, this.offset_y);
      this.ctx_master_on.translate(0, this.offset_y);
      this.ctx_tracks_hover.translate(0, this.offset_y);
      this.ctx_master_hover.translate(0, this.offset_y);
      this.font_size = 12;
      this.ctx_tracks.font = this.ctx_master.font = this.font_size + 'px "ＭＳ Ｐゴシック, ヒラギノ角ゴ Pro W3"';
      this.rect_tracks = this.canvas_tracks_hover.getBoundingClientRect();
      this.rect_master = this.canvas_master_hover.getBoundingClientRect();
      this.offset_translate = 700 + this.offset_y;
      return this.initEvent();
    };

    SessionView.prototype.resize = function() {
      var h_new, w_new;
      this.ctx_tracks.translate(0, -this.offset_y);
      this.ctx_master.translate(0, -this.offset_y);
      this.ctx_tracks_on.translate(0, -this.offset_y);
      this.ctx_master_on.translate(0, -this.offset_y);
      this.ctx_tracks_hover.translate(0, -this.offset_y);
      this.ctx_master_hover.translate(0, -this.offset_y);
      w_new = Math.max(this.song.tracks.length, 8) * this.w + 1;
      h_new = Math.max(this.song.length + 2, 11) * this.h + 10;
      this.canvas_tracks.width = this.canvas_tracks_on.width = this.canvas_tracks_hover.width = w_new;
      this.canvas_tracks.height = this.canvas_tracks_on.height = this.canvas_tracks_hover.height = h_new;
      this.canvas_master.height = this.canvas_master_on.height = this.canvas_master_hover.height = h_new;
      this.canvas_tracks_dom.css({
        width: w_new + 'px',
        height: h_new + 'px'
      });
      this.canvas_tracks_on_dom.css({
        width: w_new + 'px',
        height: h_new + 'px'
      });
      this.canvas_tracks_hover_dom.css({
        width: w_new + 'px',
        height: h_new + 'px'
      });
      this.canvas_master_dom.css({
        height: h_new + 'px'
      });
      this.canvas_master_on_dom.css({
        height: h_new + 'px'
      });
      this.canvas_master_hover_dom.css({
        height: h_new + 'px'
      });
      this.wrapper_tracks.css({
        width: w_new + 'px'
      });
      this.wrapper_tracks_sub.css({
        width: w_new + 'px'
      });
      this.ctx_tracks.translate(0, this.offset_y);
      this.ctx_master.translate(0, this.offset_y);
      this.ctx_tracks_on.translate(0, this.offset_y);
      this.ctx_master_on.translate(0, this.offset_y);
      this.ctx_tracks_hover.translate(0, this.offset_y);
      return this.ctx_master_hover.translate(0, this.offset_y);
    };

    SessionView.prototype.getPos = function(rect, wrapper, e, type) {
      var _x, _y;
      _x = Math.floor((e.clientX - rect.left + this.wrapper_mixer.scrollLeft()) / this.w);
      _y = Math.floor((e.clientY - rect.top + wrapper.scrollTop() - this.offset_translate) / this.h);
      return {
        x: _x,
        y: _y,
        type: type
      };
    };

    SessionView.prototype.getPlayPos = function(rect, wrapper, e) {
      var _x, _y;
      _x = Math.floor((e.clientX - rect.left + this.wrapper_mixer.scrollLeft()) / this.w);
      _y = Math.floor((e.clientY - rect.top + wrapper.scrollTop() - this.offset_translate) / this.h);
      if (!((e.clientX - rect.left + this.wrapper_mixer.scrollLeft()) - _x * this.w < 20 && (e.clientY - rect.top + wrapper.scrollTop() - this.offset_translate) - _y * this.h < 20)) {
        _y = -1;
      }
      return {
        x: _x,
        y: _y
      };
    };

    SessionView.prototype.initEvent = function() {
      var _this = this;
      this.canvas_tracks_hover_dom.on('mousemove', function(e) {
        var pos;
        pos = _this.getPos(_this.rect_tracks, _this.wrapper_tracks_sub, e, 'tracks');
        if (_this.is_clicked) {
          return _this.drawDrag(_this.ctx_tracks_hover, pos);
        } else {
          return _this.drawHover(_this.ctx_tracks_hover, pos);
        }
      }).on('mouseout', function(e) {
        _this.clearHover(_this.ctx_tracks_hover);
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        return _this.is_clicked = false;
      }).on('mousedown', function(e) {
        var now, pos;
        pos = _this.getPlayPos(_this.rect_tracks, _this.wrapper_tracks_sub, e);
        if (pos.y >= 0) {
          _this.cueTracks(pos.x, pos.y);
        } else {
          pos = _this.getPos(_this.rect_tracks, _this.wrapper_tracks_sub, e, 'tracks');
          now = performance.now();
          if (now - _this.last_clicked < 500 && pos.y !== -1) {
            _this.editPattern(pos);
            _this.last_clicked = -10000;
          } else {
            _this.last_clicked = now;
          }
          _this.is_clicked = true;
        }
        return _this.click_pos = pos;
      }).on('mouseup', function(e) {
        var pos;
        pos = _this.getPos(_this.rect_tracks, _this.wrapper_tracks_sub, e, 'tracks');
        if (_this.click_pos.x === pos.x && _this.click_pos.y === pos.y) {
          _this.selectCell(pos);
        } else {
          if (_this.click_pos.x !== pos.x || _this.click_pos.y !== pos.y) {
            _this.copyCell(_this.click_pos, pos);
          }
        }
        return _this.is_clicked = false;
      });
      this.canvas_master_hover_dom.on('mousemove', function(e) {
        var pos;
        pos = _this.getPos(_this.rect_master, _this.wrapper_master, e, 'master');
        if (_this.is_clicked) {
          return _this.drawDragMaster(_this.ctx_master_hover, pos);
        } else {
          return _this.drawHover(_this.ctx_master_hover, pos);
        }
      }).on('mouseout', function(e) {
        _this.clearHover(_this.ctx_master_hover);
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        return _this.is_clicked = false;
      }).on('mousedown', function(e) {
        var pos;
        pos = _this.getPlayPos(_this.rect_master, _this.wrapper_master, e);
        if (pos.y >= 0) {
          _this.cueMaster(pos.x, pos.y);
        } else {
          pos = _this.getPos(_this.rect_master, _this.wrapper_master, e, 'master');
          _this.is_clicked = true;
        }
        return _this.click_pos = pos;
      }).on('mouseup', function(e) {
        var pos;
        pos = _this.getPos(_this.rect_master, _this.wrapper_master, e, 'master');
        if (_this.click_pos.x === pos.x && _this.click_pos.y === pos.y) {
          _this.selectCellMaster(pos);
        } else {
          if (_this.click_pos.x !== pos.x || _this.click_pos.y !== pos.y) {
            _this.copyCellMaster(_this.click_pos, pos);
          }
        }
        return _this.is_clicked = false;
      });
      this.wrapper_master.on('scroll', function(e) {
        return _this.wrapper_tracks_sub.scrollTop(_this.wrapper_master.scrollTop());
      });
      this.wrapper_tracks_sub.on('scroll', function(e) {
        return _this.wrapper_master.scrollTop(_this.wrapper_tracks_sub.scrollTop());
      });
      this.btn_save.on('click', function() {
        return _this.model.saveSong();
      });
      this.dialog.on('mousedown', function(e) {
        if ((!_this.dialog_wrapper.is(e.target)) && _this.dialog_wrapper.has(e.target).length === 0) {
          return _this.closeDialog();
        }
      });
      this.dialog_close.on('mousedown', function() {
        return _this.closeDialog();
      });
      this.song_title.on('focus', function() {
        return window.keyboard.beginInput();
      }).on('change', function() {
        return _this.setSongTitle();
      }).on('blur', function() {
        return window.keyboard.endInput();
      });
      this.song_creator.on('focus', function() {
        return window.keyboard.beginInput();
      }).on('change', function() {
        return _this.setCreatorName();
      }).on('blur', function() {
        return window.keyboard.endInput();
      });
      this.social_twitter.on('click', function() {
        return _this.share('twitter');
      });
      this.social_facebook.on('click', function() {
        return _this.share('facebook');
      });
      this.social_hatena.on('click', function() {
        return _this.share('hatena');
      });
      return this.readSong(this.song, this.current_cells);
    };

    SessionView.prototype.setSongTitle = function() {
      return this.song.title = this.song_title.val();
    };

    SessionView.prototype.setCreatorName = function() {
      return this.song.creator = this.song_creator.val();
    };

    SessionView.prototype.readSong = function(song, current_cells) {
      var t, x, y, _i, _j, _k, _ref, _ref1, _ref2;
      this.song = song;
      this.current_cells = current_cells;
      this.resize();
      for (x = _i = 0, _ref = Math.max(this.song.tracks.length + 1, 8); 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
        t = this.song.tracks[x];
        if (t != null) {
          if (t.type != null) {
            this.track_color[x] = this.color_schemes[t.type];
          }
          if (t.name != null) {
            this.drawTrackName(x, t.name);
          }
        }
        for (y = _j = 0, _ref1 = Math.max(this.song.length + 1, 10); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          if ((t != null) && (t.patterns[y] != null)) {
            this.drawCellTracks(t.patterns[y], x, y);
          } else {
            this.drawEmpty(this.ctx_tracks, x, y);
          }
        }
      }
      this.drawMasterName();
      for (y = _k = 0, _ref2 = Math.max(this.song.length + 1, 10); 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
        if (this.song.master[y] != null) {
          this.drawCellMaster(this.song.master[y], 0, y);
        } else {
          this.drawEmptyMaster(y);
        }
      }
      this.drawScene(this.scene_pos, this.current_cells);
      this.selectCellMaster(this.select_pos);
      this.song_title.val(this.song.title);
      return this.song_creator.val(this.song.creator);
    };

    SessionView.prototype.drawCellTracks = function(p, x, y) {
      this.clearCell(this.ctx_tracks, x, y);
      if (this.track_color[x] == null) {
        this.track_color[x] = this.color_schemes[this.song.tracks[x].type];
      }
      this.ctx_tracks.strokeStyle = this.track_color[x][1];
      this.ctx_tracks.lineWidth = 1;
      this.ctx_tracks.strokeRect(x * this.w + 2, y * this.h + 2, this.w - 2, this.h - 2);
      this.ctx_tracks.drawImage(this.img_play, 0, 0, 18, 18, x * this.w + 3, y * this.h + 3, 16, 15);
      this.ctx_tracks.fillStyle = this.track_color[x][1];
      return this.ctx_tracks.fillText(p.name, x * this.w + 24, (y + 1) * this.h - 6);
    };

    SessionView.prototype.drawCellMaster = function(p, x, y) {
      this.clearCell(this.ctx_master, x, y);
      this.ctx_master.strokeStyle = this.color[1];
      this.ctx_master.lineWidth = 1;
      this.ctx_master.strokeRect(2, y * this.h + 2, this.w_master - 2, this.h - 2);
      this.ctx_master.drawImage(this.img_play, 0, 0, 18, 18, 3, y * this.h + 3, 16, 15);
      this.ctx_master.fillStyle = this.color[1];
      return this.ctx_master.fillText(p.name, 24, (y + 1) * this.h - 6);
    };

    SessionView.prototype.drawEmpty = function(ctx, x, y) {
      this.clearCell(ctx, x, y);
      ctx.strokeStyle = this.color[0];
      ctx.lineWidth = 1;
      return ctx.strokeRect(x * this.w + 2, y * this.h + 2, this.w - 2, this.h - 2);
    };

    SessionView.prototype.drawEmptyMaster = function(y) {
      this.clearCell(this.ctx_master, 0, y);
      this.ctx_master.strokeStyle = this.color[0];
      this.ctx_master.lineWidth = 1;
      this.ctx_master.strokeRect(2, y * this.h + 2, this.w_master - 2, this.h - 2);
      return this.ctx_master.drawImage(this.img_play, 0, 0, 18, 18, 3, y * this.h + 3, 16, 15);
    };

    SessionView.prototype.clearCell = function(ctx, x, y) {
      if (ctx === this.ctx_master) {
        return ctx.clearRect(0, y * this.h, this.w_master, this.h);
      } else {
        return ctx.clearRect(x * this.w, y * this.h, this.w, this.h);
      }
    };

    SessionView.prototype.drawMasterName = function() {
      var dx, dy, m;
      m = this.ctx_master.measureText('MASTER');
      dx = (this.w - m.width) / 2;
      dy = (this.offset_y - this.font_size) / 2;
      this.ctx_master.fillStyle = '#ccc';
      return this.ctx_master.fillText('MASTER', dx + 2, -dy - 3);
    };

    SessionView.prototype.drawTrackName = function(x, name, type) {
      var dx, dy, m;
      if (type != null) {
        this.track_color[x] = this.color_schemes[type];
      }
      this.ctx_tracks.fillStyle = this.track_color[x][1];
      this.ctx_tracks.fillRect(x * this.w + 2, -20, this.w - 2, 18);
      m = this.ctx_tracks.measureText(name);
      dx = (this.w - m.width) / 2;
      dy = (this.offset_y - this.font_size) / 2;
      this.ctx_tracks.shadowColor = '#fff';
      this.ctx_tracks.shadowBlur = 1;
      this.ctx_tracks.fillStyle = '#fff';
      this.ctx_tracks.fillText(name, x * this.w + dx + 2, -dy - 3);
      return this.ctx_tracks.shadowBlur = 0;
    };

    SessionView.prototype.drawPatternName = function(x, y, p) {
      return this.drawCellTracks(p, x, y);
    };

    SessionView.prototype.drawSceneName = function(y, name) {};

    SessionView.prototype.drawScene = function(pos, cells) {
      var i, _i, _ref;
      this.ctx_tracks_on.clearRect(0, this.scene_pos * this.h, this.w * 8, this.h);
      this.ctx_master_on.clearRect(0, this.scene_pos * this.h, this.w, this.h);
      if (cells != null) {
        this.current_cells = cells;
      }
      for (i = _i = 0, _ref = this.current_cells.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.current_cells[i] != null) {
          this.drawActive(i, this.current_cells[i]);
        }
      }
      this.drawActiveMaster(pos);
      this.scene_pos = pos;
      if (this.select_pos.type === 'tracks') {
        return this.selectCell(this.select_pos);
      } else if (this.select_pos.type === 'master') {
        return this.selectCellMaster(this.select_pos);
      }
    };

    SessionView.prototype.drawActive = function(x, y) {
      this.clearActive(x);
      this.ctx_tracks_on.drawImage(this.img_play, 36, 0, 18, 18, x * this.w + 3, y * this.h + 3, 16, 15);
      return this.last_active[x] = y;
    };

    SessionView.prototype.drawActiveMaster = function(y) {
      this.ctx_master_on.clearRect(0, 0, this.w_master, 10000);
      return this.ctx_master_on.drawImage(this.img_play, 36, 0, 18, 18, 3, y * this.h + 3, 16, 15);
    };

    SessionView.prototype.drawDrag = function(ctx, pos) {
      var name;
      this.clearHover(ctx);
      if (this.song.tracks[this.click_pos.x] == null) {
        return;
      }
      if (this.song.tracks[this.click_pos.x].patterns == null) {
        return;
      }
      if (this.song.tracks[this.click_pos.x].patterns[this.click_pos.y] == null) {
        return;
      }
      name = this.song.tracks[this.click_pos.x].patterns[this.click_pos.y].name;
      if (pos.y >= Math.max(this.song.length, 10) || pos.y < 0) {
        return;
      }
      if (this.track_color[pos.x] == null) {
        this.track_color[pos.x] = this.color_schemes[this.song.tracks[pos.x].type];
      }
      ctx.fillStyle = 'rgba(255,255,255,1.0)';
      ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w + 2, this.h + 2);
      ctx.strokeStyle = this.track_color[pos.x][1];
      ctx.fillStyle = this.track_color[pos.x][1];
      ctx.lineWidth = 1;
      ctx.strokeRect(pos.x * this.w + 2, pos.y * this.h + 2, this.w - 2, this.h - 2);
      ctx.fillText(name, pos.x * this.w + 24, (pos.y + 1) * this.h - 6);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w + 2, this.h + 2);
      return this.hover_pos = pos;
    };

    SessionView.prototype.drawDragMaster = function(ctx, pos) {
      var name;
      this.clearHover(ctx);
      if (this.song.master[this.click_pos.y] == null) {
        return;
      }
      name = this.song.master[this.click_pos.y].name;
      if (pos.y >= Math.max(this.song.length, 10)) {
        return;
      }
      ctx.strokeStyle = this.color[1];
      ctx.fillStyle = this.color[1];
      ctx.lineWidth = 1;
      ctx.strokeRect(2, pos.y * this.h + 2, this.w_master - 2, this.h - 2);
      ctx.fillText(name, 24, (pos.y + 1) * this.h - 6);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(0, pos.y * this.h, this.w_master, this.h);
      return this.hover_pos = pos;
    };

    SessionView.prototype.drawHover = function(ctx, pos) {
      this.clearHover(ctx);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      if (ctx === this.ctx_master_hover) {
        ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w_master, this.h);
      } else {
        ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w, this.h);
      }
      return this.hover_pos = pos;
    };

    SessionView.prototype.clearHover = function(ctx) {
      if (ctx === this.ctx_tracks_hover) {
        ctx.clearRect(this.hover_pos.x * this.w, this.hover_pos.y * this.h, this.w + 2, this.h + 2);
        if (this.hover_pos.x === this.select_pos.x && this.hover_pos.y === this.select_pos.y && this.hover_pos.type === this.select_pos.type) {
          return this.selectCell(this.select_pos);
        }
      } else {
        ctx.clearRect(0, this.hover_pos.y * this.h, this.w_master + 2, this.h + 2);
        if (this.hover_pos.x === this.select_pos.x && this.hover_pos.y === this.select_pos.y && this.hover_pos.type === this.select_pos.type) {
          return this.selectCellMaster(this.select_pos);
        }
      }
    };

    SessionView.prototype.clearActive = function(x) {
      return this.ctx_tracks_on.clearRect(x * this.w, this.last_active[x] * this.h, this.w, this.h);
    };

    SessionView.prototype.clearAllActive = function() {
      this.ctx_tracks_on.clearRect(0, 0, 10000, 10000);
      return this.ctx_master_on.clearRect(0, 0, 10000, 10000);
    };

    SessionView.prototype.cueTracks = function(x, y) {
      var _this = this;
      if ((this.song.tracks[x] != null) && (this.song.tracks[x].patterns[y] != null)) {
        this.model.cuePattern(x, y);
        this.ctx_tracks_on.drawImage(this.img_play, 36, 0, 18, 18, x * this.w + 4, y * this.h + 4, 15, 16);
        return window.setTimeout((function() {
          return _this.ctx_tracks_on.clearRect(x * _this.w + 4, y * _this.h + 4, 15, 16);
        }), 100);
      }
    };

    SessionView.prototype.cueMaster = function(x, y) {
      var _this = this;
      if (this.song.master[y] != null) {
        this.model.cueScene(y);
        this.ctx_master_on.drawImage(this.img_play, 36, 0, 18, 18, 4, y * this.h + 4, 15, 16);
        return window.setTimeout((function() {
          return _this.ctx_master_on.clearRect(4, y * _this.h + 4, 15, 16);
        }), 100);
      }
    };

    SessionView.prototype.beat = function(is_master, cells) {
      var c, _i, _len, _results,
        _this = this;
      if (is_master) {
        c = cells;
        this.ctx_master_on.drawImage(this.img_play, 36, 0, 18, 18, c[0] * this.w + 3, c[1] * this.h + 3, 16, 15);
        return window.setTimeout((function() {
          return _this.ctx_master_on.clearRect(c[0] * _this.w + 3, c[1] * _this.h + 3, 16, 15);
        }), 100);
      } else {
        _results = [];
        for (_i = 0, _len = cells.length; _i < _len; _i++) {
          c = cells[_i];
          this.ctx_tracks_on.drawImage(this.img_play, 36, 0, 18, 18, c[0] * this.w + 3, c[1] * this.h + 3, 16, 15);
          _results.push(window.setTimeout((function() {
            return _this.ctx_tracks_on.clearRect(c[0] * _this.w + 3, c[1] * _this.h + 3, 16, 15);
          }), 100));
        }
        return _results;
      }
    };

    SessionView.prototype.editPattern = function(pos) {
      var pat;
      pat = this.model.editPattern(pos.x, pos.y);
      return this.drawCellTracks(pat[2], pat[0], pat[1]);
    };

    SessionView.prototype.addSynth = function(song) {
      this.song = song;
      return this.readSong(this.song, this.current_cells);
    };

    SessionView.prototype.showSuccess = function(_url, song_title, user_name) {
      var fb_url, text, title, tw_url, url,
        _this = this;
      if (song_title != null) {
        if (user_name != null) {
          text = '"' + song_title + '" by ' + user_name;
        } else {
          text = '"' + song_title + '"';
        }
        title = text + ' :: evil';
      } else {
        text = '"evil" by gmork';
        title = 'evil';
      }
      url = 'http://evil.gmork.in/' + _url;
      history.pushState('', title, _url);
      document.title = title;
      this.dialog.css({
        opacity: '1',
        'z-index': '10000'
      });
      this.dialog.find('#dialog-socials').show();
      this.dialog.find('#dialog-success').show();
      this.dialog.find('#dialog-error').hide();
      this.dialog.find('.dialog-message-sub').text(url);
      tw_url = 'http://twitter.com/intent/tweet?url=' + encodeURI(url + '&text=' + text + '&hashtags=evil');
      fb_url = 'http://www.facebook.com/sharer.php?&u=' + url;
      this.dialog.find('.dialog-twitter').attr('href', tw_url).click(function() {
        return _this.closeDialog();
      });
      return this.dialog.find('.dialog-facebook').attr('href', fb_url).click(function() {
        return _this.closeDialog();
      });
    };

    SessionView.prototype.showError = function(error) {
      this.dialog.css({
        opacity: '1',
        'z-index': '10000'
      });
      this.dialog.find('#dialog-socials').hide();
      this.dialog.find('#dialog-success').hide();
      return this.dialog.find('#dialog-error').show();
    };

    SessionView.prototype.closeDialog = function() {
      return this.dialog.css({
        opacity: '1',
        'z-index': '-10000'
      });
    };

    SessionView.prototype.share = function(service) {
      var fb_url, hb_url, text, title, tw_url, url;
      if (this.song.title != null) {
        if (this.song.creator != null) {
          text = '"' + this.song.title + '" by ' + this.song.creator;
        } else {
          text = '"' + this.song.title + '"';
        }
        title = text + ' :: evil';
      } else {
        text = '"evil" by gmork';
        title = 'evil';
      }
      url = location.href;
      if (service === 'twitter') {
        tw_url = 'http://twitter.com/intent/tweet?url=' + encodeURI(url + '&text=' + text + '&hashtags=evil');
        return window.open(tw_url, 'Tweet', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
      } else if (service === 'facebook') {
        fb_url = 'http://www.facebook.com/sharer.php?&u=' + url;
        return window.open(fb_url, 'Share on facebook', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
      } else {
        hb_url = 'http://b.hatena.ne.jp/entry/' + url.split('://')[1];
        return window.open(hb_url);
      }
    };

    SessionView.prototype.changeSynth = function(song, id, type) {
      this.song = song;
      return this.readSong(this.song, this.current_cells);
    };

    SessionView.prototype.copyCell = function(src, dst) {
      if (this.song.tracks[src.x] == null) {
        return;
      }
      if (this.song.tracks[src.x].patterns[src.y] == null) {
        return;
      }
      this.model.savePattern(src.x, src.y);
      if (this.song.tracks[dst.x] == null) {
        dst.x = this.model.readTrack(this.song, src, dst);
        this.current_cells.length = dst.x + 1;
        this.song.tracks[dst.x].type = this.song.tracks[src.x].type;
      }
      if (this.song.tracks[src.x].type !== this.song.tracks[dst.x].type) {
        return;
      }
      this.song.tracks[dst.x].patterns[dst.y] = $.extend(true, {}, this.song.tracks[src.x].patterns[src.y]);
      this.drawCellTracks(this.song.tracks[dst.x].patterns[dst.y], dst.x, dst.y);
      this.model.readPattern(this.song.tracks[dst.x].patterns[dst.y], dst.x, dst.y);
      return this.drawCellMaster(this.song.master[dst.y], 0, dst.y);
    };

    SessionView.prototype.copyCellMaster = function(src, dst) {
      if (this.song.master[src.y] == null) {
        return;
      }
      this.song.master[dst.y] = $.extend(true, {}, this.song.master[src.y]);
      this.drawCellMaster(this.song.master[dst.x], 0, dst.y);
      return this.model.readMaster(this.song.master[dst.y], dst.y);
    };

    SessionView.prototype.selectCell = function(pos) {
      if (this.song.tracks[pos.x] == null) {
        return;
      }
      if (this.song.tracks[pos.x].patterns[pos.y] == null) {
        return;
      }
      this.ctx_master_hover.clearRect(this.select_pos.x * this.w, this.select_pos.y * this.h, this.w_master, this.h);
      this.ctx_tracks_hover.clearRect(this.hover_pos.x * this.w, this.hover_pos.y * this.h, this.w, this.h);
      this.ctx_tracks_hover.clearRect(this.click_pos.x * this.w, this.click_pos.y * this.h, this.w, this.h);
      this.ctx_tracks_hover.clearRect(this.select_pos.x * this.w, this.select_pos.y * this.h, this.w, this.h);
      if (this.track_color[pos.x] == null) {
        this.track_color[pos.x] = this.color_schemes[this.song.tracks[pos.x].type];
      }
      this.ctx_tracks_hover.fillStyle = this.track_color[pos.x][5];
      this.ctx_tracks_hover.fillRect(pos.x * this.w + 2, pos.y * this.h + 2, this.w - 2, this.h - 2);
      this.ctx_tracks_hover.fillStyle = this.track_color[pos.x][1];
      this.ctx_tracks_hover.fillText(this.song.tracks[pos.x].patterns[pos.y].name, pos.x * this.w + 24, (pos.y + 1) * this.h - 6);
      this.select_pos = pos;
      this.select_pos.type = 'tracks';
      return this.model.player.sidebar.show(this.song, this.select_pos);
    };

    SessionView.prototype.selectCellMaster = function(pos) {
      if (this.song.master[pos.y] == null) {
        return;
      }
      this.ctx_tracks_hover.clearRect(this.select_pos.x * this.w, this.select_pos.y * this.h, this.w, this.h);
      this.ctx_master_hover.clearRect(0, this.hover_pos.y * this.h, this.w_master, this.h);
      this.ctx_master_hover.clearRect(0, this.click_pos.y * this.h, this.w_master, this.h);
      this.ctx_master_hover.clearRect(0, this.select_pos.y * this.h, this.w_master, this.h);
      this.ctx_master_hover.fillStyle = this.color[5];
      this.ctx_master_hover.fillRect(2, pos.y * this.h + 2, this.w_master - 2, this.h - 2);
      this.ctx_master_hover.fillStyle = this.color[1];
      this.ctx_master_hover.fillText(this.song.master[pos.y].name, pos.x * this.w_master + 24, (pos.y + 1) * this.h - 6);
      this.select_pos = pos;
      this.select_pos.type = 'master';
      return this.model.player.sidebar.show(this.song, this.select_pos);
    };

    SessionView.prototype.getSelectPos = function() {
      if (this.select_pos.x !== -1 && this.select_pos.y !== -1) {
        return this.select_pos;
      }
    };

    return SessionView;

  })();

}).call(this);
;(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Sidebar = (function() {
    function Sidebar(ctx, player, session, mixer) {
      this.ctx = ctx;
      this.player = player;
      this.session = session;
      this.mixer = mixer;
      this.addTracksEffect = __bind(this.addTracksEffect, this);
      this.addMasterEffect = __bind(this.addMasterEffect, this);
      this.sidebar_pos = {
        x: 0,
        y: 1,
        type: 'master'
      };
      this.view = new SidebarView(this);
    }

    Sidebar.prototype.show = function(song, select_pos) {
      this.song = song;
      this.select_pos = select_pos;
      if (this.select_pos.type === 'tracks') {
        if (this.sidebar_pos.x === this.select_pos.x && this.sidebar_pos.type === this.select_pos.type) {
          return;
        }
        this.saveTracksEffect(this.sidebar_pos.x);
        this.sidebar_pos = this.select_pos;
        return this.view.showTracks(this.player.synth[this.select_pos.x]);
      } else {
        if (this.sidebar_pos.y === this.select_pos.y && this.sidebar_pos.type === this.select_pos.type) {
          return;
        }
        this.sidebar_pos = this.select_pos;
        return this.view.showMaster(this.song.master[this.select_pos.y]);
      }
    };

    Sidebar.prototype.saveMaster = function(obj) {
      if (this.sidebar_pos.y === -1) {
        return;
      }
      return this.session.saveMaster(this.sidebar_pos.y, obj);
    };

    Sidebar.prototype.saveTracksEffect = function() {
      if (this.sidebar_pos.type === 'master') {
        return;
      }
      return this.session.saveTracksEffect(this.sidebar_pos);
    };

    Sidebar.prototype.addMasterEffect = function(name) {
      return this.mixer.addMasterEffect(name);
    };

    Sidebar.prototype.addTracksEffect = function(name) {
      return this.mixer.addTracksEffect(this.sidebar_pos.x, name);
    };

    Sidebar.prototype.setBPM = function(b) {
      return this.view.setBPM(b);
    };

    Sidebar.prototype.setKey = function(k) {
      return this.view.setKey(k);
    };

    Sidebar.prototype.setScale = function(s) {
      return this.view.setScale(s);
    };

    return Sidebar;

  })();

}).call(this);
;(function() {
  this.SidebarView = (function() {
    function SidebarView(model) {
      this.model = model;
      this.wrapper = $('#sidebar-wrapper');
      this.tracks = this.wrapper.find('#sidebar-tracks');
      this.master = this.wrapper.find('#sidebar-master');
      this.master_display = this.master.find('.display');
      this.master_control = this.master.find('.control');
      this.master_display_label = this.master.find('.display-current-control');
      this.master_edit = this.master.find('[name=edit]');
      this.master_name = this.master.find('[name=name]');
      this.master_bpm = this.master.find('[name=bpm]');
      this.master_key = this.master.find('[name=key]');
      this.master_scale = this.master.find('[name=mode]');
      this.master_save = this.master.find('[name=save]');
      this.master_effects = this.master.find('.sidebar-effects');
      this.add_master = this.master.find('.add-type');
      this.add_master_btn = this.master.find('.add-btn');
      this.tracks_effects = this.tracks.find('.sidebar-effects');
      this.add_tracks = this.tracks.find('.add-type');
      this.add_tracks_btn = this.tracks.find('.add-btn');
      this.initEvent();
    }

    SidebarView.prototype.initEvent = function() {
      var m, _i, _len, _ref,
        _this = this;
      this.master_name.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      })).on('change', (function() {
        return _this.saveMaster();
      }));
      _ref = [this.master_bpm, this.master_key, this.master_scale];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        m.on('focus', (function() {
          return window.keyboard.beginInput();
        })).on('blur', (function() {
          return window.keyboard.endInput();
        }));
      }
      this.master_save.on('click', (function() {
        _this.saveMaster();
        return _this.hideMasterControl();
      }));
      this.master_edit.on('click', (function() {
        return _this.showMasterControl();
      }));
      this.tracks.find('.sidebar-effect').each(function(i) {
        return $(_this).on('change', function() {
          return _this.model.readTracksEffect(i);
        });
      });
      this.add_master_btn.on('click', function() {
        return _this.addMasterEffect(_this.add_master.val());
      });
      return this.add_tracks_btn.on('click', function() {
        return _this.addTracksEffect(_this.add_tracks.val());
      });
    };

    SidebarView.prototype.saveMaster = function() {
      var bpm, key, name, obj, scale;
      name = this.master_name.val();
      bpm = this.master_bpm.val();
      key = this.master_key.val();
      scale = this.master_scale.val();
      obj = {
        name: name != null ? name : void 0,
        bpm: bpm != null ? bpm : void 0,
        key: key != null ? key : void 0,
        scale: scale != null ? scale : void 0
      };
      this.model.saveMaster(obj);
      return this.showMaster(obj);
    };

    SidebarView.prototype.clearMaster = function() {
      var o;
      o = {
        name: this.master_name.val()
      };
      this.model.saveMaster(o);
      return this.showMaster(o);
    };

    SidebarView.prototype.saveTracksEffect = function() {
      var f, _i, _len, _ref, _results;
      _ref = this.tracks_effects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        _results.push(f.getParam());
      }
      return _results;
    };

    SidebarView.prototype.showTracks = function(track) {
      var f, _i, _len, _ref;
      this.tracks_effects.find('.sidebar-effect').remove();
      _ref = track.effects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        f.appendTo(this.tracks_effects);
      }
      return this.wrapper.css('left', '0px');
    };

    SidebarView.prototype.showMaster = function(o) {
      var s;
      this.hideMasterControl();
      s = '';
      if (o.name != null) {
        this.master_name.val(o.name);
      }
      if (o.bpm != null) {
        s += o.bpm + ' BPM 　';
      }
      if (o.key != null) {
        s += o.key + ' 　';
      }
      if (o.scale != null) {
        s += o.scale;
      }
      this.master_display_label.text(s);
      return this.wrapper.css('left', '-223px');
    };

    SidebarView.prototype.showMasterControl = function() {
      this.master_control.show();
      return this.master_display.hide();
    };

    SidebarView.prototype.hideMasterControl = function() {
      this.master_display.show();
      return this.master_control.hide();
    };

    SidebarView.prototype.addMasterEffect = function(name) {
      var fx;
      fx = this.model.addMasterEffect(name);
      return fx.appendTo(this.master_effects);
    };

    SidebarView.prototype.addTracksEffect = function(name) {
      var fx;
      fx = this.model.addTracksEffect(name);
      return fx.appendTo(this.tracks_effects);
    };

    SidebarView.prototype.setBPM = function(b) {
      return this.master_bpm.val(b);
    };

    SidebarView.prototype.setKey = function(k) {
      return this.master_key.val(k);
    };

    SidebarView.prototype.setScale = function(s) {
      return this.master_scale.val(s);
    };

    return SidebarView;

  })();

}).call(this);
;(function() {
  var FREQ_OFFSET, OSC_TYPE, T2, TIME_OFFSET;

  this.KEY_LIST = {
    A: 55,
    Bb: 58.27047018976124,
    B: 61.7354126570155,
    C: 32.70319566257483,
    Db: 34.64782887210901,
    D: 36.70809598967594,
    Eb: 38.890872965260115,
    E: 41.20344461410875,
    F: 43.653528929125486,
    Gb: 46.2493028389543,
    G: 48.999429497718666,
    Ab: 51.91308719749314
  };

  this.SCALE_LIST = {
    Major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    Pentatonic: [0, 3, 5, 7, 10],
    Dorian: [0, 2, 3, 5, 7, 9, 10],
    Phrygian: [0, 1, 3, 5, 7, 8, 10],
    Lydian: [0, 2, 4, 6, 7, 9, 11],
    Mixolydian: [0, 2, 4, 5, 7, 9, 10],
    CHROMATIC: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    'Harm-minor': [0, 2, 3, 5, 7, 8, 11]
  };

  OSC_TYPE = {
    SINE: 0,
    RECT: 1,
    SAW: 2,
    TRIANGLE: 3
  };

  T2 = new MutekiTimer();

  TIME_OFFSET = [2, 3, 5, 7, 11, 13, 17];

  FREQ_OFFSET = [0.1, 0.15, 0.25, 0.35, 0.55, 0.65, 0.85];

  this.Noise = (function() {
    function Noise(ctx) {
      var _this = this;
      this.ctx = ctx;
      this.node = this.ctx.createScriptProcessor(STREAM_LENGTH);
      this.node.onaudioprocess = function(event) {
        var data_L, data_R, i, _i, _ref, _results;
        data_L = event.outputBuffer.getChannelData(0);
        data_R = event.outputBuffer.getChannelData(1);
        _results = [];
        for (i = _i = 0, _ref = data_L.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(data_L[i] = data_R[i] = Math.random());
        }
        return _results;
      };
    }

    Noise.prototype.connect = function(dst) {
      return this.node.connect(dst);
    };

    Noise.prototype.setOctave = function(octae) {
      this.octae = octae;
    };

    Noise.prototype.setFine = function(fine) {
      this.fine = fine;
    };

    Noise.prototype.setNote = function() {};

    Noise.prototype.setInterval = function(interval) {
      this.interval = interval;
    };

    Noise.prototype.setFreq = function() {};

    Noise.prototype.setKey = function() {};

    Noise.prototype.setShape = function(shape) {
      this.shape = shape;
    };

    Noise.prototype.getParam = function() {
      return {
        shape: this.shape,
        octave: this.octave,
        interval: this.interval,
        fine: this.fine
      };
    };

    Noise.prototype.setParam = function(p) {
      this.shape = p.shape;
      this.octave = p.octave;
      this.interval = p.interval;
      return this.fine = p.fine;
    };

    return Noise;

  })();

  this.VCO = (function() {
    function VCO(ctx) {
      var i, _i;
      this.ctx = ctx;
      this.freq_key = 55;
      this.octave = 4;
      this.interval = 0;
      this.fine = 0;
      this.note = 0;
      this.freq = Math.pow(2, this.octave) * this.freq_key;
      this.node = this.ctx.createGain();
      this.node.gain.value = 1.0;
      this.osc = this.ctx.createOscillator();
      this.osc.type = 0;
      this.oscs = [this.ctx.createOscillator(), this.ctx.createOscillator(), this.ctx.createOscillator(), this.ctx.createOscillator(), this.ctx.createOscillator(), this.ctx.createOscillator(), this.ctx.createOscillator()];
      this.setFreq();
      this.osc.start(0);
      for (i = _i = 0; _i < 7; i = ++_i) {
        this.oscs[i].start(TIME_OFFSET[i]);
      }
    }

    VCO.prototype.setOctave = function(octave) {
      this.octave = octave;
    };

    VCO.prototype.setNote = function(note) {
      this.note = note;
    };

    VCO.prototype.setKey = function(freq_key) {
      this.freq_key = freq_key;
    };

    VCO.prototype.setInterval = function(interval) {
      this.interval = interval;
    };

    VCO.prototype.setFine = function(fine) {
      var o, _i, _len, _ref, _results;
      this.fine = fine;
      this.osc.detune.value = this.fine;
      _ref = this.oscs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        o = _ref[_i];
        _results.push(o.detune.value = this.fine);
      }
      return _results;
    };

    VCO.prototype.setShape = function(shape) {
      var o, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      this.shape = shape;
      if (this.shape === 'SUPERSAW') {
        _ref = this.oscs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          o = _ref[_i];
          o.type = OSC_TYPE['SAW'];
          o.connect(this.node);
        }
        this.osc.disconnect();
        return this.node.gain.value = 0.9;
      } else if (this.shape === 'SUPERRECT') {
        _ref1 = this.oscs;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          o = _ref1[_j];
          o.type = OSC_TYPE['RECT'];
          o.connect(this.node);
        }
        this.osc.disconnect();
        return this.node.gain.value = 0.9;
      } else {
        _ref2 = this.oscs;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          o = _ref2[_k];
          o.disconnect();
        }
        this.osc.type = OSC_TYPE[shape];
        this.osc.connect(this.node);
        return this.node.gain.value = 1.0;
      }
    };

    VCO.prototype.setFreq = function() {
      var i, note_oct, note_shift, _i, _results;
      note_oct = Math.floor(this.note / 12);
      note_shift = this.note % 12;
      this.freq = (Math.pow(2, this.octave + note_oct) * Math.pow(SEMITONE, note_shift) * this.freq_key) + this.fine;
      if (this.shape === 'SUPERSAW' || this.shape === 'SUPERRECT') {
        _results = [];
        for (i = _i = 0; _i < 7; i = ++_i) {
          _results.push(this.oscs[i].frequency.setValueAtTime(this.freq + FREQ_OFFSET[i], 0));
        }
        return _results;
      } else {
        return this.osc.frequency.setValueAtTime(this.freq, 0);
      }
    };

    VCO.prototype.connect = function(dst) {
      var o, _i, _len, _ref;
      this.dst = dst;
      this.osc.connect(this.node);
      _ref = this.oscs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        o = _ref[_i];
        o.connect(this.node);
      }
      return this.node.connect(this.dst);
    };

    VCO.prototype.disconnect = function() {
      return this.node.disconnect();
    };

    VCO.prototype.getParam = function() {
      return {
        shape: this.shape,
        octave: this.octave,
        interval: this.interval,
        fine: this.fine
      };
    };

    VCO.prototype.setParam = function(p) {
      this.octave = p.octave;
      this.interval = p.interval;
      this.fine = p.fine;
      return this.setShape(p.shape);
    };

    return VCO;

  })();

  this.EG = (function() {
    function EG(target, min, max) {
      this.target = target;
      this.min = min;
      this.max = max;
      this.attack = 0;
      this.decay = 0;
      this.sustain = 0.0;
      this.release = 0;
    }

    EG.prototype.getADSR = function() {
      return [this.attack, this.decay, this.sustain, this.release];
    };

    EG.prototype.setADSR = function(attack, decay, sustain, release) {
      this.attack = attack / 50000.0;
      this.decay = decay / 50000.0;
      this.sustain = sustain / 100.0;
      return this.release = release / 50000.0;
    };

    EG.prototype.getRange = function() {
      return [this.min, this.max];
    };

    EG.prototype.setRange = function(min, max) {
      this.min = min;
      this.max = max;
    };

    EG.prototype.getParam = function() {
      return {
        adsr: this.getADSR(),
        range: this.getRange()
      };
    };

    EG.prototype.setParam = function(p) {
      var _ref;
      _ref = p.adsr, this.attack = _ref[0], this.decay = _ref[1], this.sustain = _ref[2], this.release = _ref[3];
      return this.setRange(p.range[0], p.range[1]);
    };

    EG.prototype.noteOn = function(time) {
      this.target.cancelScheduledValues(time);
      this.target.setValueAtTime(this.target.value, time);
      this.target.linearRampToValueAtTime(this.max, time + this.attack);
      return this.target.linearRampToValueAtTime(this.sustain * (this.max - this.min) + this.min, time + this.attack + this.decay);
    };

    EG.prototype.noteOff = function(time) {
      this.target.linearRampToValueAtTime(this.min, time + this.release);
      this.target.linearRampToValueAtTime(0, time + this.release + 0.001);
      return this.target.cancelScheduledValues(time + this.release + 0.002);
    };

    return EG;

  })();

  this.ResFilter = (function() {
    function ResFilter(ctx) {
      this.ctx = ctx;
      this.lpf = this.ctx.createBiquadFilter();
      this.lpf.type = 'lowpass';
      this.lpf.gain.value = 1.0;
    }

    ResFilter.prototype.connect = function(dst) {
      return this.lpf.connect(dst);
    };

    ResFilter.prototype.disconnect = function() {
      return this.lpf.disconnect();
    };

    ResFilter.prototype.getResonance = function() {
      return this.lpf.Q.value;
    };

    ResFilter.prototype.setQ = function(Q) {
      return this.lpf.Q.value = Q;
    };

    ResFilter.prototype.getQ = function() {
      return this.lpf.Q.value;
    };

    return ResFilter;

  })();

  this.SynthCore = (function() {
    function SynthCore(parent, ctx, id) {
      var i, _i;
      this.parent = parent;
      this.ctx = ctx;
      this.id = id;
      this.node = this.ctx.createGain();
      this.node.gain.value = 0;
      this.gain = 1.0;
      this.is_mute = false;
      this.is_on = false;
      this.is_harmony = true;
      this.scale = this.parent.scale;
      this.vcos = [new VCO(this.ctx), new VCO(this.ctx), new Noise(this.ctx)];
      this.gains = [this.ctx.createGain(), this.ctx.createGain(), this.ctx.createGain()];
      for (i = _i = 0; _i < 3; i = ++_i) {
        this.vcos[i].connect(this.gains[i]);
        this.gains[i].gain.value = 0;
        this.gains[i].connect(this.node);
      }
      this.filter = new ResFilter(this.ctx);
      this.eg = new EG(this.node.gain, 0.0, this.gain);
      this.feg = new EG(this.filter.lpf.frequency, 0, 0);
      this.gain_res = this.ctx.createGain();
      this.gain_res.gain.value = 0;
      this.vcos[2].connect(this.gain_res);
      this.gain_res.connect(this.node);
      this.view = new SynthCoreView(this, id, this.parent.view.dom.find('.synth-core'));
    }

    SynthCore.prototype.getParam = function() {
      var g, v;
      return {
        type: 'REZ',
        vcos: (function() {
          var _i, _len, _ref, _results;
          _ref = this.vcos;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            v = _ref[_i];
            _results.push(v.getParam());
          }
          return _results;
        }).call(this),
        gains: (function() {
          var _i, _len, _ref, _results;
          _ref = this.gains;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            g = _ref[_i];
            _results.push(g.gain.value);
          }
          return _results;
        }).call(this),
        eg: this.eg.getParam(),
        feg: this.feg.getParam(),
        filter: [this.feg.getRange()[1], this.filter.getQ()],
        harmony: this.is_harmony
      };
    };

    SynthCore.prototype.setParam = function(p) {
      var i, _i, _j, _ref, _ref1;
      if (p.vcos != null) {
        for (i = _i = 0, _ref = p.vcos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.vcos[i].setParam(p.vcos[i]);
        }
      }
      if (p.gains != null) {
        for (i = _j = 0, _ref1 = p.gains.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          this.gains[i].gain.value = p.gains[i];
        }
      }
      if (p.eg != null) {
        this.eg.setParam(p.eg);
      }
      if (p.feg != null) {
        this.feg.setParam(p.feg);
      }
      if (p.filter != null) {
        this.feg.setRange(this.feg.getRange()[0], p.filter[0]);
        this.filter.setQ(p.filter[1]);
      }
      return this.view.setParam(p);
    };

    SynthCore.prototype.setVCOParam = function(i, shape, oct, interval, fine, harmony) {
      this.vcos[i].setShape(shape);
      this.vcos[i].setOctave(oct);
      this.vcos[i].setInterval(interval);
      this.vcos[i].setFine(fine);
      this.vcos[i].setFreq();
      if (harmony != null) {
        return this.is_harmony = harmony === 'harmony';
      }
    };

    SynthCore.prototype.setEGParam = function(a, d, s, r) {
      return this.eg.setADSR(a, d, s, r);
    };

    SynthCore.prototype.setFEGParam = function(a, d, s, r) {
      return this.feg.setADSR(a, d, s, r);
    };

    SynthCore.prototype.setFilterParam = function(freq, q) {
      this.feg.setRange(80, Math.pow(freq / 1000, 2.0) * 25000 + 80);
      this.filter.setQ(q);
      if (q > 1) {
        return this.gain_res.gain.value = 0.1 * (q / 1000.0);
      }
    };

    SynthCore.prototype.setVCOGain = function(i, gain) {
      return this.gains[i].gain.value = (gain / 100.0) * 0.3;
    };

    SynthCore.prototype.setGain = function(gain) {
      this.gain = gain;
      return this.eg.setRange(0.0, this.gain);
    };

    SynthCore.prototype.noteOn = function() {
      var t0;
      if (this.is_mute) {
        return;
      }
      if (this.is_on) {
        return;
      }
      t0 = this.ctx.currentTime;
      this.eg.noteOn(t0);
      this.feg.noteOn(t0);
      return this.is_on = true;
    };

    SynthCore.prototype.noteOff = function() {
      var t0;
      if (!this.is_on) {
        return;
      }
      t0 = this.ctx.currentTime;
      this.eg.noteOff(t0);
      this.feg.noteOff(t0);
      return this.is_on = false;
    };

    SynthCore.prototype.setKey = function(key) {
      var freq_key, v, _i, _len, _ref, _results;
      freq_key = KEY_LIST[key];
      _ref = this.vcos;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _results.push(v.setKey(freq_key));
      }
      return _results;
    };

    SynthCore.prototype.setScale = function(scale) {
      this.scale = scale;
    };

    SynthCore.prototype.connect = function(dst) {
      this.node.connect(this.filter.lpf);
      return this.filter.connect(dst);
    };

    SynthCore.prototype.disconnect = function() {
      this.filter.disconnect();
      return this.node.disconnect();
    };

    SynthCore.prototype.noteToSemitone = function(note, shift) {
      var semitone;
      if (this.is_harmony) {
        note = note + shift;
        if (shift > 0) {
          note--;
        }
        if (shift < 0) {
          note++;
        }
        return semitone = Math.floor((note - 1) / this.scale.length) * 12 + this.scale[(note - 1) % this.scale.length];
      } else {
        return semitone = Math.floor((note - 1) / this.scale.length) * 12 + this.scale[(note - 1) % this.scale.length] + shift;
      }
    };

    SynthCore.prototype.setNote = function(note) {
      var v, _i, _len, _ref, _results;
      this.note = note;
      _ref = this.vcos;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        v.setNote(this.noteToSemitone(this.note, v.interval));
        _results.push(v.setFreq());
      }
      return _results;
    };

    SynthCore.prototype.mute = function() {
      return this.is_mute = true;
    };

    SynthCore.prototype.demute = function() {
      return this.is_mute = false;
    };

    return SynthCore;

  })();

  this.Synth = (function() {
    function Synth(ctx, id, player, name) {
      this.ctx = ctx;
      this.id = id;
      this.player = player;
      this.name = name;
      this.type = 'REZ';
      if (this.name == null) {
        this.name = 'Synth #' + this.id;
      }
      this.pattern_name = 'pattern 0';
      this.pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.pattern_obj = {
        name: this.pattern_name,
        pattern: this.pattern
      };
      this.time = 0;
      this.scale_name = 'Major';
      this.scale = SCALE_LIST[this.scale_name];
      this.view = new SynthView(this, this.id);
      this.core = new SynthCore(this, this.ctx, this.id);
      this.is_on = false;
      this.is_sustaining = false;
      this.is_performing = false;
      this.session = this.player.session;
      this.send = this.ctx.createGain();
      this.send.gain.value = 1.0;
      this["return"] = this.ctx.createGain();
      this["return"].gain.value = 1.0;
      this.core.connect(this.send);
      this.send.connect(this["return"]);
      this.effects = [];
      this.T = new MutekiTimer();
    }

    Synth.prototype.connect = function(dst) {
      if (dst instanceof Panner) {
        return this["return"].connect(dst["in"]);
      } else {
        return this["return"].connect(dst);
      }
    };

    Synth.prototype.disconnect = function() {
      return this["return"].disconnect();
    };

    Synth.prototype.setDuration = function(duration) {
      this.duration = duration;
    };

    Synth.prototype.setKey = function(key) {
      return this.core.setKey(key);
    };

    Synth.prototype.setNote = function(note) {
      return this.core.setNote(note);
    };

    Synth.prototype.setScale = function(scale_name) {
      this.scale_name = scale_name;
      this.scale = SCALE_LIST[this.scale_name];
      this.core.scale = this.scale;
      return this.view.changeScale(this.scale);
    };

    Synth.prototype.setGain = function(gain) {
      return this.core.setGain(gain);
    };

    Synth.prototype.getGain = function() {
      return this.core.gain;
    };

    Synth.prototype.noteOn = function(note, force) {
      if (force || !this.is_performing) {
        this.core.setNote(note);
        this.core.noteOn();
      }
      if (force) {
        return this.is_performing = true;
      }
    };

    Synth.prototype.noteOff = function(force) {
      if (force) {
        this.is_performing = false;
      }
      if (!this.is_performing) {
        return this.core.noteOff();
      }
    };

    Synth.prototype.playAt = function(time) {
      var mytime, n,
        _this = this;
      this.time = time;
      mytime = this.time % this.pattern.length;
      this.view.playAt(mytime);
      if (this.is_performing) {
        return;
      }
      if (this.pattern[mytime] === 0) {
        return this.core.noteOff();
      } else if (this.pattern[mytime] < 0) {
        this.is_sustaining = true;
        n = -this.pattern[mytime];
        this.core.setNote(n);
        return this.core.noteOn();
      } else if (this.pattern[mytime] === 'sustain') {

      } else if (this.pattern[mytime] === 'end') {
        return T2.setTimeout((function() {
          return _this.core.noteOff();
        }), this.duration - 10);
      } else {
        this.core.setNote(this.pattern[mytime]);
        this.core.noteOn();
        return T2.setTimeout((function() {
          return _this.core.noteOff();
        }), this.duration - 10);
      }
    };

    Synth.prototype.play = function() {
      return this.view.play();
    };

    Synth.prototype.stop = function() {
      this.core.noteOff();
      return this.view.stop();
    };

    Synth.prototype.pause = function(time) {
      return this.core.noteOff();
    };

    Synth.prototype.setPattern = function(_pattern_obj) {
      this.pattern_obj = $.extend(true, {}, _pattern_obj);
      this.pattern = this.pattern_obj.pattern;
      this.pattern_name = this.pattern_obj.name;
      return this.view.setPattern(this.pattern_obj);
    };

    Synth.prototype.getPattern = function() {
      this.pattern_obj = {
        name: this.pattern_name,
        pattern: this.pattern
      };
      return $.extend(true, {}, this.pattern_obj);
    };

    Synth.prototype.clearPattern = function() {
      this.pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.pattern_obj.pattern = this.pattern;
      return this.view.setPattern(this.pattern_obj);
    };

    Synth.prototype.plusPattern = function() {
      this.pattern = this.pattern.concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      return this.player.resetSceneLength();
    };

    Synth.prototype.minusPattern = function() {
      this.pattern = this.pattern.slice(0, this.pattern.length - 32);
      return this.player.resetSceneLength();
    };

    Synth.prototype.addNote = function(time, note) {
      return this.pattern[time] = note;
    };

    Synth.prototype.removeNote = function(time) {
      return this.pattern[time] = 0;
    };

    Synth.prototype.sustainNote = function(l, r, note) {
      var i, _i;
      if (l === r) {
        this.pattern[l] = note;
        return;
      }
      for (i = _i = l; l <= r ? _i < r : _i > r; i = l <= r ? ++_i : --_i) {
        this.pattern[i] = 'sustain';
      }
      this.pattern[l] = -note;
      return this.pattern[r] = 'end';
    };

    Synth.prototype.activate = function(i) {
      return this.view.activate(i);
    };

    Synth.prototype.inactivate = function(i) {
      return this.view.inactivate(i);
    };

    Synth.prototype.redraw = function(time) {
      this.time = time;
      return this.view.drawPattern(this.time);
    };

    Synth.prototype.inputPatternName = function(pattern_name) {
      this.pattern_name = pattern_name;
      return this.session.setPatternName(this.id, this.pattern_name);
    };

    Synth.prototype.setPatternName = function(pattern_name) {
      this.pattern_name = pattern_name;
      return this.view.setPatternName(this.pattern_name);
    };

    Synth.prototype.setSynthName = function(name) {
      this.name = name;
      this.session.setSynthName(this.id, this.name);
      return this.view.setSynthName(this.name);
    };

    Synth.prototype.changeSynth = function(type) {
      var s_new;
      s_new = this.player.changeSynth(this.id, type, s_new);
      this.view.dom.replaceWith(s_new.view.dom);
      this.noteOff(true);
      return this.disconnect();
    };

    Synth.prototype.getParam = function() {
      var p;
      p = this.core.getParam();
      p.name = this.name;
      p.scale_name = this.scale_name;
      p.effects = this.getEffectsParam();
      return p;
    };

    Synth.prototype.setParam = function(p) {
      if (p == null) {
        return;
      }
      this.core.setParam(p);
      if (p.effects != null) {
        return this.setEffects(p.effects);
      }
    };

    Synth.prototype.mute = function() {
      return this.core.mute();
    };

    Synth.prototype.demute = function() {
      return this.core.demute();
    };

    Synth.prototype.setEffects = function(effects_new) {
      var e, fx, _i, _j, _len, _len1, _ref, _results;
      _ref = this.effects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e.disconnect();
      }
      this.effects = [];
      _results = [];
      for (_j = 0, _len1 = effects_new.length; _j < _len1; _j++) {
        e = effects_new[_j];
        if (e.effect === 'Fuzz') {
          fx = new Fuzz(this.ctx);
        } else if (e.effect === 'Delay') {
          fx = new Delay(this.ctx);
        } else if (e.effect === 'Reverb') {
          fx = new Reverb(this.ctx);
        } else if (e.effect === 'Comp') {
          fx = new Compressor(this.ctx);
        } else if (e.effect === 'Double') {
          fx = new Double(this.ctx);
        }
        this.insertEffect(fx);
        _results.push(fx.setParam(e));
      }
      return _results;
    };

    Synth.prototype.getEffectsParam = function() {
      var f, _i, _len, _ref, _results;
      _ref = this.effects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        _results.push(f.getParam());
      }
      return _results;
    };

    Synth.prototype.insertEffect = function(fx) {
      if (this.effects.length === 0) {
        this.send.disconnect();
        this.send.connect(fx["in"]);
      } else {
        this.effects[this.effects.length - 1].disconnect();
        this.effects[this.effects.length - 1].connect(fx["in"]);
      }
      fx.connect(this["return"]);
      fx.setSource(this);
      return this.effects.push(fx);
    };

    Synth.prototype.removeEffect = function(fx) {
      var i, prev;
      i = this.effects.indexOf(fx);
      if (i === -1) {
        return;
      }
      if (i === 0) {
        prev = this.send;
      } else {
        prev = this.effects[i - 1];
      }
      prev.disconnect();
      if (this.effects[i + 1] != null) {
        prev.connect(this.effects[i + 1]["in"]);
      } else {
        prev.connect(this["return"]);
      }
      fx.disconnect();
      return this.effects.splice(i, 1);
    };

    return Synth;

  })();

}).call(this);
;(function() {
  this.SynthView = (function() {
    function SynthView(model, id) {
      var _this = this;
      this.model = model;
      this.id = id;
      this.dom = $('#tmpl_synth').clone();
      this.dom.attr('id', 'synth' + id);
      $("#instruments").append(this.dom);
      this.synth_name = this.dom.find('.synth-name');
      this.synth_name.val(this.model.name);
      this.pattern_name = this.dom.find('.pattern-name');
      this.pattern_name.val(this.model.pattern_name);
      this.synth_type = this.dom.find('.synth-type');
      this.pencil = this.dom.find('.sequencer-pencil');
      this.step = this.dom.find('.sequencer-step');
      this.is_step = false;
      this.header = this.dom.find('.header');
      this.markers = this.dom.find('.markers');
      this.pos_markers = this.dom.find('.marker');
      this.marker_prev = this.dom.find('.marker-prev');
      this.marker_next = this.dom.find('.marker-next');
      this.plus = this.dom.find('.pattern-plus');
      this.minus = this.dom.find('.pattern-minus');
      this.nosync = this.dom.find('.pattern-nosync');
      this.is_nosync = false;
      this.setMarker();
      this.table_wrapper = this.dom.find('.sequencer-table');
      this.canvas_hover_dom = this.dom.find('.table-hover');
      this.canvas_on_dom = this.dom.find('.table-on');
      this.canvas_off_dom = this.dom.find('.table-off');
      this.canvas_hover = this.canvas_hover_dom[0];
      this.canvas_on = this.canvas_on_dom[0];
      this.canvas_off = this.canvas_off_dom[0];
      this.ctx_hover = this.canvas_hover.getContext('2d');
      this.ctx_on = this.canvas_on.getContext('2d');
      this.ctx_off = this.canvas_off.getContext('2d');
      this.cell = new Image();
      this.cell.src = 'static/img/sequencer_cell.png';
      this.cell.onload = function() {
        return _this.initCanvas();
      };
      this.cells_x = 32;
      this.cells_y = 20;
      this.btn_fold = this.dom.find('.btn-fold-core');
      this.core = this.dom.find('.synth-core');
      this.is_panel_opened = true;
      this.btn_fx = this.dom.find('.btn-fx-view');
      this.fx = this.dom.find('.synth-fx');
      this.is_fx_view = false;
      this.keyboard = new KeyboardView(this);
      this.pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.pattern_obj = {
        name: this.model.pattern_name,
        pattern: this.pattern
      };
      this.page = 0;
      this.page_total = 1;
      this.last_time = 0;
      this.last_page = 0;
      this.is_clicked = false;
      this.hover_pos = {
        x: -1,
        y: -1
      };
      this.click_pos = {
        x: -1,
        y: -1
      };
      this.initEvent();
    }

    SynthView.prototype.initCanvas = function() {
      var i, j, _i, _j, _ref, _ref1;
      this.canvas_hover.width = this.canvas_on.width = this.canvas_off.width = 832;
      this.canvas_hover.height = this.canvas_on.height = this.canvas_off.height = 520;
      this.rect = this.canvas_off.getBoundingClientRect();
      this.offset = {
        x: this.rect.left,
        y: this.rect.top
      };
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        for (j = _j = 0, _ref1 = this.cells_x; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, j * 26, i * 26, 26, 26);
        }
      }
      return this.setPattern(this.pattern_obj);
    };

    SynthView.prototype.getPos = function(e) {
      var _x, _y;
      this.rect = this.canvas_off.getBoundingClientRect();
      _x = Math.floor((e.clientX - this.rect.left) / 26);
      _y = Math.floor((e.clientY - this.rect.top) / 26);
      return {
        x: _x,
        y: _y,
        x_abs: this.page * this.cells_x + _x,
        y_abs: _y,
        note: this.cells_y - _y
      };
    };

    SynthView.prototype.initEvent = function() {
      var _this = this;
      this.canvas_hover_dom.on('mousemove', function(e) {
        var pos;
        pos = _this.getPos(e);
        if (pos !== _this.hover_pos) {
          _this.ctx_hover.clearRect(_this.hover_pos.x * 26, _this.hover_pos.y * 26, 26, 26);
          _this.ctx_hover.drawImage(_this.cell, 52, 0, 26, 26, pos.x * 26, pos.y * 26, 26, 26);
          _this.hover_pos = pos;
        }
        if (_this.is_clicked && _this.click_pos !== pos) {
          if (_this.is_sustaining) {
            _this.sustain_l = Math.min(pos.x_abs, _this.sustain_l);
            _this.sustain_r = Math.max(pos.x_abs, _this.sustain_r);
            _this.sustainNote(_this.sustain_l, _this.sustain_r, pos);
          } else {
            if (_this.is_adding) {
              _this.addNote(pos);
            } else if (_this.pattern[pos.x_abs] === pos.note) {
              _this.removeNote(pos);
            }
          }
          return _this.click_pos = pos;
        }
      }).on('mousedown', function(e) {
        var pos;
        _this.is_clicked = true;
        pos = _this.getPos(e);
        if (!_this.is_step) {
          if (_this.pattern[pos.x_abs] === 'sustain' || _this.pattern[pos.x_abs] === 'end') {
            _this.addNote(pos);
            _this.sustain_l = _this.sustain_r = pos.x_abs;
            return _this.is_sustaining = true;
          } else {
            _this.addNote(pos);
            _this.sustain_l = _this.sustain_r = pos.x_abs;
            return _this.is_sustaining = true;
          }
        } else {
          if (_this.pattern[pos.x_abs] === pos.note) {
            return _this.removeNote(pos);
          } else {
            _this.is_adding = true;
            return _this.addNote(pos);
          }
        }
      }).on('mouseup', function(e) {
        var pos;
        _this.is_clicked = false;
        if (!_this.is_step) {
          pos = _this.getPos(e);
          return _this.is_sustaining = false;
        } else {
          return _this.is_adding = false;
        }
      }).on('mouseout', function(e) {
        _this.ctx_hover.clearRect(_this.hover_pos.x * 26, _this.hover_pos.y * 26, 26, 26);
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        _this.is_clicked = false;
        return _this.is_adding = false;
      });
      this.synth_type.on('change', function() {
        return _this.model.changeSynth(_this.synth_type.val());
      });
      this.synth_name.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      })).on('change', (function() {
        return _this.model.setSynthName(_this.synth_name.val());
      }));
      this.pattern_name.on('focus', (function() {
        return window.keyboard.beginInput();
      })).on('blur', (function() {
        return window.keyboard.endInput();
      })).on('change', (function() {
        return _this.model.inputPatternName(_this.pattern_name.val());
      }));
      this.pencil.on('click', (function() {
        return _this.pencilMode();
      }));
      this.step.on('click', (function() {
        return _this.stepMode();
      }));
      this.marker_prev.on('click', (function() {
        return _this.model.player.backward(true);
      }));
      this.marker_next.on('click', (function() {
        return _this.model.player.forward();
      }));
      this.nosync.on('click', (function() {
        return _this.toggleNoSync();
      }));
      this.plus.on('click', (function() {
        return _this.plusPattern();
      }));
      this.minus.on('click', (function() {
        if (_this.pattern.length > _this.cells_x) {
          return _this.minusPattern();
        }
      }));
      this.btn_fold.on('mousedown', function() {
        if (_this.is_panel_opened) {
          _this.core.css('height', '0px');
          _this.table_wrapper.css('height', '524px');
          _this.btn_fold.css({
            top: '-22px',
            padding: '0px 5px 0px 0px'
          }).removeClass('fa-angle-down').addClass('fa-angle-up');
          return _this.is_panel_opened = false;
        } else {
          _this.core.css('height', '280px');
          _this.table_wrapper.css('height', '262px');
          _this.btn_fold.css({
            top: '0px',
            padding: '5px 5px 5px 5px'
          }).removeClass('fa-angle-up').addClass('fa-angle-down');
          return _this.is_panel_opened = true;
        }
      });
      return this.btn_fx.on('mousedown', function() {
        if (_this.is_fx_view) {
          return _this.is_fx_view = false;
        } else {
          _this.core.css('height', '280px');
          _this.table_wrapper.css('height', '262px');
          _this.btn_fold.css({
            top: '0px',
            padding: '5px 5px 5px 5px'
          }).removeClass('fa-angle-up').addClass('fa-angle-down');
          return _this.is_panel_opened = true;
        }
      });
    };

    SynthView.prototype.addNote = function(pos) {
      var i, y;
      if (this.pattern[pos.x_abs] === 'end' || this.pattern[pos.x_abs] === 'sustain') {
        i = pos.x_abs - 1;
        while (this.pattern[i] === 'sustain' || this.pattern[i] === 'end') {
          i--;
        }
        this.ctx_on.clearRect(((pos.x_abs - 1) % this.cells_x) * 26, 0, 26, 1000);
        y = this.cells_y + this.pattern[i];
        if (this.pattern[pos.x_abs - 1] < 0) {
          this.pattern[pos.x_abs - 1] = -this.pattern[pos.x_abs - 1];
          this.ctx_on.drawImage(this.cell, 0, 0, 26, 26, ((pos.x_abs - 1) % this.cells_x) * 26, y * 26, 26, 26);
        } else {
          this.pattern[pos.x_abs - 1] = 'end';
          this.ctx_on.drawImage(this.cell, 156, 0, 26, 26, ((pos.x_abs - 1) % this.cells_x) * 26, y * 26, 26, 26);
        }
      }
      i = pos.x_abs + 1;
      while (this.pattern[i] === 'end' || this.pattern[i] === 'sustain') {
        this.pattern[i] = 0;
        i++;
      }
      this.ctx_on.clearRect(pos.x * 26, 0, (i - pos.x_abs) * 26, 1000);
      this.pattern[pos.x_abs] = pos.note;
      this.model.addNote(pos.x_abs, pos.note);
      this.ctx_on.clearRect(pos.x * 26, 0, 26, 1000);
      return this.ctx_on.drawImage(this.cell, 26, 0, 26, 26, pos.x * 26, pos.y * 26, 26, 26);
    };

    SynthView.prototype.removeNote = function(pos) {
      this.pattern[pos.x_abs] = 0;
      this.ctx_on.clearRect(pos.x * 26, pos.y * 26, 26, 26);
      return this.model.removeNote(pos.x_abs);
    };

    SynthView.prototype.sustainNote = function(l, r, pos) {
      var i, y, _i, _j, _ref;
      if (l === r) {
        this.addNote(pos);
        return;
      }
      for (i = _i = l; l <= r ? _i <= r : _i >= r; i = l <= r ? ++_i : --_i) {
        this.ctx_on.clearRect((i % this.cells_x) * 26, 0, 26, 1000);
      }
      for (i = _j = _ref = l + 1; _ref <= r ? _j < r : _j > r; i = _ref <= r ? ++_j : --_j) {
        this.pattern[i] = 'sustain';
        this.ctx_on.drawImage(this.cell, 130, 0, 26, 26, (i % this.cells_x) * 26, pos.y * 26, 26, 26);
      }
      if (this.pattern[l] === 'sustain' || this.pattern[l] === 'end') {
        i = l - 1;
        while (this.pattern[i] === 'sustain' || this.pattern[i] === 'end') {
          i--;
        }
        this.ctx_on.clearRect(((l - 1) % this.cells_x) * 26, 0, 26, 1000);
        y = this.cells_y + this.pattern[i];
        if (this.pattern[l - 1] < 0) {
          this.pattern[l - 1] = -this.pattern[l - 1];
          this.ctx_on.drawImage(this.cell, 0, 0, 26, 26, ((l - 1) % this.cells_x) * 26, y * 26, 26, 26);
        } else {
          this.pattern[l - 1] = 'end';
          this.ctx_on.drawImage(this.cell, 156, 0, 26, 26, ((l - 1) % this.cells_x) * 26, y * 26, 26, 26);
        }
      }
      if (this.pattern[r] < 0) {
        y = this.cells_y + this.pattern[r];
        if (this.pattern[r + 1] === 'end') {
          this.pattern[r + 1] = -this.pattern[r];
          this.ctx_on.drawImage(this.cell, 26, 0, 26, 26, ((r + 1) % this.cells_x) * 26, y * 26, 26, 26);
        } else {
          this.pattern[r + 1] = this.pattern[r];
          this.ctx_on.drawImage(this.cell, 104, 0, 26, 26, ((r + 1) % this.cells_x) * 26, y * 26, 26, 26);
        }
      }
      this.pattern[l] = -pos.note;
      this.pattern[r] = 'end';
      this.ctx_on.drawImage(this.cell, 104, 0, 26, 26, (l % this.cells_x) * 26, pos.y * 26, 26, 26);
      this.ctx_on.drawImage(this.cell, 156, 0, 26, 26, (r % this.cells_x) * 26, pos.y * 26, 26, 26);
      return this.model.sustainNote(l, r, pos.note);
    };

    SynthView.prototype.endSustain = function(time) {
      if (this.is_sustaining) {
        if (this.pattern[time - 1] === 'sustain') {
          this.pattern[time - 1] = 'end';
        } else {
          this.pattern[time - 1] *= -1;
        }
        return this.is_sustaining = false;
      }
    };

    SynthView.prototype.playAt = function(time) {
      var i, _i, _ref;
      this.time = time;
      if (this.is_nosync) {
        return;
      }
      if (this.time % this.cells_x === 0) {
        this.endSustain();
        this.drawPattern(this.time);
      }
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, (this.last_time % this.cells_x) * 26, i * 26, 26, 26);
        this.ctx_off.drawImage(this.cell, 78, 0, 26, 26, (time % this.cells_x) * 26, i * 26, 26, 26);
      }
      return this.last_time = time;
    };

    SynthView.prototype.setPattern = function(pattern_obj) {
      this.pattern_obj = pattern_obj;
      this.pattern = this.pattern_obj.pattern;
      this.page = 0;
      this.page_total = this.pattern.length / this.cells_x;
      this.drawPattern(0);
      this.setMarker();
      return this.setPatternName(this.pattern_obj.name);
    };

    SynthView.prototype.drawPattern = function(time) {
      var i, last_y, note, y, _i, _ref;
      if (time != null) {
        this.time = time;
      }
      this.page = Math.floor(this.time / this.cells_x);
      this.ctx_on.clearRect(0, 0, 832, 520);
      last_y = 0;
      for (i = _i = 0, _ref = this.cells_x; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        note = this.pattern[this.page * this.cells_x + i];
        if (note === 'sustain') {
          this.ctx_on.drawImage(this.cell, 130, 0, 26, 26, i * 26, last_y * 26, 26, 26);
        } else if (note === 'end') {
          this.ctx_on.drawImage(this.cell, 156, 0, 26, 26, i * 26, last_y * 26, 26, 26);
          last_y = 0;
        } else if (note < 0) {
          y = this.cells_y + note;
          this.ctx_on.drawImage(this.cell, 104, 0, 26, 26, i * 26, y * 26, 26, 26);
          last_y = y;
        } else {
          y = this.cells_y - note;
          this.ctx_on.drawImage(this.cell, 26, 0, 26, 26, i * 26, y * 26, 26, 26);
          last_y = y;
        }
      }
      return this.setMarker();
    };

    SynthView.prototype.plusPattern = function() {
      if (this.page_total === 8) {
        return;
      }
      this.pattern = this.pattern.concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      this.page_total++;
      this.model.plusPattern();
      this.drawPattern();
      this.minus.removeClass('btn-false').addClass('btn-true');
      if (this.page_total === 8) {
        return this.plus.removeClass('btn-true').addClass('btn-false');
      }
    };

    SynthView.prototype.minusPattern = function() {
      if (this.page_total === 1) {
        return;
      }
      this.pattern = this.pattern.slice(0, this.pattern.length - this.cells_x);
      this.page_total--;
      this.model.minusPattern();
      this.drawPattern();
      this.plus.removeClass('btn-false').addClass('btn-true');
      if (this.page_total === 1) {
        return this.minus.removeClass('btn-true').addClass('btn-false');
      }
    };

    SynthView.prototype.setMarker = function() {
      var _this = this;
      this.pos_markers.filter(function(i) {
        return i < _this.page_total;
      }).addClass('marker-active');
      this.pos_markers.filter(function(i) {
        return _this.page_total <= i;
      }).removeClass('marker-active');
      this.pos_markers.removeClass('marker-now').eq(this.page).addClass('marker-now');
      this.markers.find('.marker-pos').text(this.page + 1);
      this.markers.find('.marker-total').text(this.page_total);
      return this.pos_markers.filter(function(i) {
        return i < _this.page_total;
      }).each(function(i) {
        return _this.pos_markers.eq(i).on('mousedown', function() {
          var _results;
          if (_this.page < i) {
            while (_this.page !== i) {
              _this.model.player.forward();
            }
          }
          if (i < _this.page) {
            _results = [];
            while (_this.page !== i) {
              _results.push(_this.model.player.backward(true));
            }
            return _results;
          }
        });
      });
    };

    SynthView.prototype.play = function() {};

    SynthView.prototype.stop = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, (this.last_time % this.cells_x) * 26, i * 26, 26, 26));
      }
      return _results;
    };

    SynthView.prototype.activate = function(i) {
      this.is_active = true;
      return this.initCanvas();
    };

    SynthView.prototype.inactivate = function() {
      return this.is_active = false;
    };

    SynthView.prototype.setSynthName = function(name) {
      return this.synth_name.val(name);
    };

    SynthView.prototype.setPatternName = function(name) {
      this.pattern_name.val(name);
      return this.pattern_obj.name = name;
    };

    SynthView.prototype.toggleNoSync = function() {
      var i, _i, _ref, _results;
      if (this.is_nosync) {
        this.is_nosync = false;
        this.nosync.removeClass('btn-true').addClass('btn-false');
        return this.drawPattern(this.time);
      } else {
        this.is_nosync = true;
        this.nosync.removeClass('btn-false').addClass('btn-true');
        _results = [];
        for (i = _i = 0, _ref = this.cells_y; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(this.ctx_off.drawImage(this.cell, 0, 0, 26, 26, (this.time % this.cells_x) * 26, i * 26, 26, 26));
        }
        return _results;
      }
    };

    SynthView.prototype.pencilMode = function() {
      this.is_step = false;
      this.pencil.removeClass('btn-false').addClass('btn-true');
      return this.step.removeClass('btn-true').addClass('btn-false');
    };

    SynthView.prototype.stepMode = function() {
      this.is_step = true;
      this.step.removeClass('btn-false').addClass('btn-true');
      return this.pencil.removeClass('btn-true').addClass('btn-false');
    };

    SynthView.prototype.changeScale = function(scale) {
      return this.keyboard.changeScale(scale);
    };

    return SynthView;

  })();

  this.SynthCoreView = (function() {
    function SynthCoreView(model, id, dom) {
      this.model = model;
      this.id = id;
      this.dom = dom;
      this.vcos = $(this.dom.find('.RS_VCO'));
      this.EG_inputs = this.dom.find('.RS_EG input');
      this.FEG_inputs = this.dom.find('.RS_FEG input');
      this.filter_inputs = this.dom.find(".RS_filter input");
      this.gain_inputs = this.dom.find('.RS_mixer input');
      this.canvasEG = this.dom.find(".RS_EG .canvasEG").get()[0];
      this.canvasFEG = this.dom.find(".RS_FEG .canvasFEG").get()[0];
      this.contextEG = this.canvasEG.getContext('2d');
      this.contextFEG = this.canvasFEG.getContext('2d');
      this.initEvent();
    }

    SynthCoreView.prototype.initEvent = function() {
      var _this = this;
      this.vcos.on("change", function() {
        return _this.fetchVCOParam();
      });
      this.gain_inputs.on("change", function() {
        return _this.fetchGains();
      });
      this.filter_inputs.on("change", function() {
        return _this.fetchFilterParam();
      });
      this.EG_inputs.on("change", function() {
        return _this.fetchEGParam();
      });
      this.FEG_inputs.on("change", function() {
        return _this.fetchFEGParam();
      });
      return this.fetchParam();
    };

    SynthCoreView.prototype.updateCanvas = function(name) {
      var adsr, canvas, context, h, w, w4;
      canvas = null;
      context = null;
      adsr = null;
      if (name === "EG") {
        canvas = this.canvasEG;
        context = this.contextEG;
        adsr = this.model.eg.getADSR();
      } else {
        canvas = this.canvasFEG;
        context = this.contextFEG;
        adsr = this.model.feg.getADSR();
      }
      w = canvas.width = 180;
      h = canvas.height = 50;
      w4 = w / 4;
      context.clearRect(0, 0, w, h);
      context.beginPath();
      context.moveTo(w4 * (1.0 - adsr[0]), h);
      context.lineTo(w / 4, 0);
      context.lineTo(w4 * (adsr[1] + 1), h * (1.0 - adsr[2]));
      context.lineTo(w4 * 3, h * (1.0 - adsr[2]));
      context.lineTo(w4 * (adsr[3] + 3), h);
      context.strokeStyle = 'rgb(0, 220, 255)';
      return context.stroke();
    };

    SynthCoreView.prototype.fetchParam = function() {
      this.fetchVCOParam();
      this.fetchEGParam();
      this.fetchFEGParam();
      this.fetchFilterParam();
      return this.fetchGains();
    };

    SynthCoreView.prototype.fetchVCOParam = function() {
      var harmony, i, vco, _i, _ref, _results;
      harmony = this.vcos.eq(0).find('.harmony').val();
      _results = [];
      for (i = _i = 0, _ref = this.vcos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        vco = this.vcos.eq(i);
        _results.push(this.model.setVCOParam(i, vco.find('.shape').val(), parseInt(vco.find('.octave').val()), parseInt(vco.find('.interval').val()), parseInt(vco.find('.fine').val()), harmony));
      }
      return _results;
    };

    SynthCoreView.prototype.setVCOParam = function(p) {
      var i, vco, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.vcos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        vco = this.vcos.eq(i);
        vco.find('.shape').val(p[i].shape);
        vco.find('.octave').val(p[i].octave);
        vco.find('.interval').val(p[i].interval);
        _results.push(vco.find('.fine').val(p[i].fine));
      }
      return _results;
    };

    SynthCoreView.prototype.fetchEGParam = function() {
      this.model.setEGParam(parseFloat(this.EG_inputs.eq(0).val()), parseFloat(this.EG_inputs.eq(1).val()), parseFloat(this.EG_inputs.eq(2).val()), parseFloat(this.EG_inputs.eq(3).val()));
      return this.updateCanvas("EG");
    };

    SynthCoreView.prototype.setEGParam = function(p) {
      this.EG_inputs.eq(0).val(p.adsr[0] * 50000);
      this.EG_inputs.eq(1).val(p.adsr[1] * 50000);
      this.EG_inputs.eq(2).val(p.adsr[2] * 100);
      return this.EG_inputs.eq(3).val(p.adsr[3] * 50000);
    };

    SynthCoreView.prototype.fetchFEGParam = function() {
      this.model.setFEGParam(parseFloat(this.FEG_inputs.eq(0).val()), parseFloat(this.FEG_inputs.eq(1).val()), parseFloat(this.FEG_inputs.eq(2).val()), parseFloat(this.FEG_inputs.eq(3).val()));
      return this.updateCanvas("FEG");
    };

    SynthCoreView.prototype.setFEGParam = function(p) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = p.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.FEG_inputs.eq(i).val(p.adsr[i]));
      }
      return _results;
    };

    SynthCoreView.prototype.fetchFilterParam = function() {
      return this.model.setFilterParam(parseFloat(this.filter_inputs.eq(0).val()), parseFloat(this.filter_inputs.eq(1).val()));
    };

    SynthCoreView.prototype.setFilterParam = function(p) {
      this.filter_inputs.eq(0).val(p[0]);
      return this.filter_inputs.eq(1).val(p[1]);
    };

    SynthCoreView.prototype.fetchGains = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.gain_inputs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.model.setVCOGain(i, parseInt(this.gain_inputs.eq(i).val())));
      }
      return _results;
    };

    SynthCoreView.prototype.setParam = function(p) {
      var i, _i, _ref;
      if (p.vcos != null) {
        this.setVCOParam(p.vcos);
      }
      if (p.gains != null) {
        for (i = _i = 0, _ref = p.gains.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.gain_inputs.eq(i).val(p.gains[i] / 0.3 * 100);
        }
      }
      if (p.eg != null) {
        this.setEGParam(p.eg);
      }
      if (p.feg != null) {
        this.setFEGParam(p.feg);
      }
      if (p.filter != null) {
        return this.setFilterParam(p.filter);
      }
    };

    return SynthCoreView;

  })();

  this.KeyboardView = (function() {
    function KeyboardView(sequencer) {
      this.sequencer = sequencer;
      this.dom = this.sequencer.dom.find('.keyboard');
      this.canvas = this.dom[0];
      this.ctx = this.canvas.getContext('2d');
      this.w = 48;
      this.h = 26;
      this.num = 20;
      this.color = ['rgba(230, 230, 230, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)', 'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)'];
      this.is_clicked = false;
      this.hover_pos = {
        x: -1,
        y: -1
      };
      this.click_pos = {
        x: -1,
        y: -1
      };
      this.scale = this.sequencer.model.scale;
      this.initCanvas();
      this.initEvent();
    }

    KeyboardView.prototype.initCanvas = function() {
      var i, _i, _ref, _results;
      this.canvas.width = this.w;
      this.canvas.height = this.h * this.num;
      this.rect = this.canvas.getBoundingClientRect();
      this.offset = {
        x: this.rect.left,
        y: this.rect.top
      };
      this.ctx.fillStyle = this.color[0];
      _results = [];
      for (i = _i = 0, _ref = this.num; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.drawNormal(i));
      }
      return _results;
    };

    KeyboardView.prototype.getPos = function(e) {
      this.rect = this.canvas.getBoundingClientRect();
      return Math.floor((e.clientY - this.rect.top) / this.h);
    };

    KeyboardView.prototype.initEvent = function() {
      var _this = this;
      return this.dom.on('mousemove', function(e) {
        var pos;
        pos = _this.getPos(e);
        if (pos !== _this.hover_pos) {
          _this.drawNormal(_this.hover_pos);
          _this.drawHover(pos);
          _this.hover_pos = pos;
        }
        if (_this.is_clicked && _this.click_pos !== pos) {
          _this.clearActive(_this.click_pos);
          _this.drawActive(pos);
          _this.sequencer.model.noteOff(true);
          _this.sequencer.model.noteOn(_this.num - pos, true);
          return _this.click_pos = pos;
        }
      }).on('mousedown', function(e) {
        var pos;
        _this.is_clicked = true;
        pos = _this.getPos(e);
        _this.drawActive(pos);
        _this.sequencer.model.noteOn(_this.num - pos, true);
        return _this.click_pos = pos;
      }).on('mouseup', function(e) {
        _this.is_clicked = false;
        _this.clearActive(_this.click_pos);
        _this.sequencer.model.noteOff(true);
        return _this.click_pos = {
          x: -1,
          y: -1
        };
      }).on('mouseout', function(e) {
        _this.clearActive(_this.hover_pos);
        _this.sequencer.model.noteOff(true);
        _this.hover_pos = {
          x: -1,
          y: -1
        };
        return _this.click_pos = {
          x: -1,
          y: -1
        };
      });
    };

    KeyboardView.prototype.drawNormal = function(i) {
      this.clearNormal(i);
      this.ctx.fillStyle = this.color[0];
      if (this.isKey(i)) {
        this.ctx.fillRect(0, (i + 1) * this.h - 5, this.w, 2);
      }
      this.ctx.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
      this.ctx.fillStyle = this.color[3];
      return this.ctx.fillText(this.text(i), 10, (i + 1) * this.h - 10);
    };

    KeyboardView.prototype.drawHover = function(i) {
      this.ctx.fillStyle = this.color[1];
      this.ctx.fillRect(0, (i + 1) * this.h - 3, this.w, 2);
      if (this.isKey(i)) {
        this.ctx.fillRect(0, (i + 1) * this.h - 5, this.w, 2);
      }
      return this.ctx.fillText(this.text(i), 10, (i + 1) * this.h - 10);
    };

    KeyboardView.prototype.drawActive = function(i) {
      this.clearNormal(i);
      this.ctx.fillStyle = this.color[2];
      this.ctx.fillRect(0, i * this.h, this.w, this.h);
      this.ctx.fillStyle = this.color[4];
      return this.ctx.fillText(this.text(i), 10, (i + 1) * this.h - 10);
    };

    KeyboardView.prototype.clearNormal = function(i) {
      return this.ctx.clearRect(0, i * this.h, this.w, this.h);
    };

    KeyboardView.prototype.clearActive = function(i) {
      this.clearNormal(i);
      return this.drawNormal(i);
    };

    KeyboardView.prototype.changeScale = function(scale) {
      var i, _i, _ref, _results;
      this.scale = scale;
      _results = [];
      for (i = _i = 0, _ref = this.num; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.drawNormal(i));
      }
      return _results;
    };

    KeyboardView.prototype.text = function(i) {
      return (this.num - i - 1) % this.scale.length + 1 + 'th';
    };

    KeyboardView.prototype.isKey = function(i) {
      return (this.num - i - 1) % this.scale.length === 0;
    };

    return KeyboardView;

  })();

}).call(this);
;(function() {
  this.STREAM_LENGTH = 1024;

  this.SAMPLE_RATE = 48000;

  this.SEMITONE = 1.05946309;

  this.T = new MutekiTimer();

  $(function() {
    var ua;
    console.log('Welcome to evil!');
    ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/chrome/g)) {
      return initEvil();
    } else {
      return sorry();
    }
  });

  this.sorry = function() {
    $('#top-sorry').show();
    return $('#top-logo-wrapper').addClass('logo-sorry');
  };

  this.initEvil = function() {
    var footer_size,
      _this = this;
    setTimeout((function() {
      $('#top').css({
        opacity: '0'
      }).delay(500).css('z-index', '-1');
      return $('#top-logo').css({
        '-webkit-transform': 'translate3d(0px, -100px, 0px)',
        opacity: '0'
      });
    }), 1500);
    window.CONTEXT = new webkitAudioContext();
    window.player = new Player();
    window.keyboard = new Keyboard(window.player);
    footer_size = $(window).height() / 2 - 300;
    $('footer').css('height', footer_size + 'px');
    if (typeof song_read !== "undefined" && song_read !== null) {
      return player.readSong(song_read);
    } else {
      return player.readSong(SONG_DEFAULT);
    }
  };

}).call(this);
