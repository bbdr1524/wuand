Registry.require(["promise","helper","convert","xmlhttprequest"],function(){var E=rea.FEATURES,d=Registry.get("promise"),C=Registry.get("helper"),F=Registry.get("xmlhttprequest").run,G=Registry.get("convert"),p=0,r=0,v={ePASTEBIN:1,eCHROMESYNC:2,eGOOGLEDRIVE:3},z=[],B=!1,w=null,J=[{method:"HEAD",url:"https://www.google.com",extract:function(d,l){try{var k=l?l.split("\n"):null,f;for(f in k){var s=k[f].split(":"),m=s.shift()||"",H=s.join(":")||"";if("date"==m.trim().toLowerCase()&&H){var I=new Date(H);
if(I)return I.getTime()-(new Date).getTime()}}}catch(p){}return null}},{method:"GET",url:"https://json-time.appspot.com/time.json",extract:function(d,l){try{var k=JSON.parse(d);if(!k.error&&k.datetime){var f=new Date(k.datetime);if(f)return f.getTime()-(new Date).getTime()}}catch(s){}return null}}],u=function(){var n=function(){var s,m=!1,f=null,k=function(a){},n=function(a){f=a.state;console.log("si: sync filesystem state changed to : "+f)},l=function(){var a=d(),h=function(b){console.warn("si: listFiles() error:",
b);a.reject()};s.root.getDirectory("/",{create:!0},function(b){var g=b.createReader(),c=[],d=function(){g.readEntries(function(b){b.length?(c=c.concat(b),d()):a.resolve(c)},h)};d()},h);return a.promise()},p=function(a,h){var b=d(),g=function(h){console.warn("si: writeFileData(",a,") error:",h);b.reject()};s.root.getDirectory("/",{create:!0},function(c){c.getFile(a,{create:!0},function(a){a.createWriter(function(a){a.onwriteend=function(c){a.onwriteend=function(a){b.resolve()};a.onerror=g;c=new Blob([h],
{type:"text/plain"});a.write(c)};a.truncate(0)},g)},g)},g);return b.promise()},t=function(a){var h=d(),b=function(b){console.warn("si: getFileData(",a,") error:",b);h.reject()},c=function(a){var c=new FileReader;c.onloadend=function(){h.resolve(this.result)};c.onerror=b;c.onabort=b;c.readAsText(a)};s.root.getDirectory("/",{create:!0},function(h){h.getFile(a,{},function(a){a.file(function(a){c(a)},b)},b)},b);return h.promise()},q=function(a){var c=d(),b=function(b){console.warn("fileStorage: deleteFile(",
a,") error:",b);c.reject()};s.root.getDirectory("/",{create:!0},function(g){g.getFile(a,{create:!1},function(a){a.remove(c.resolve,b)},b)},b);return c.promise()},e=null,y={},c=function(){return A(function(){var a=d(),c=[];C.each(y,function(a,g){c.push(function(){var c=d();p(g,a).always(function(){c.resolve()});return c.promise()}())});y={};d.when(c).done(function(){a.resolve()});return a.promise()})};return{init:function(){if(!m){try{rea.syncFileSystem.onFileStatusChanged.addListener(k)}catch(a){console.log("si: error registering file status callback: "+
a.message)}if(E.SYNC.GOOGLE_DRIVE.HAS_SERVICE_STATUS)try{rea.syncFileSystem.onServiceStatusChanged.addListener(n)}catch(c){console.log("si: error registering service status callback: "+c.message)}m=!0}var b=d();rea.syncFileSystem.supported?rea.syncFileSystem.requestFileSystem(function(a){rea.runtime.lastError?b.resolve(!1):(s=a,b.resolve(!0))}):b.resolve(!1);return b.promise()},list:function(){return l().then(function(a){var c=[],b=[],g=d(),e=/.user.js$/;a.forEach(function(a){-1!=a.search(e)&&b.push(function(){var b=
d();t(a).done(function(a){var b;try{b=JSON.parse(a)}catch(g){}b&&c.push({uuid:b.uuid,url:b.url,options:b.options?b.options:{},content:b.content})}).always(function(){b.resolve()});return b.promise()}())});d.when(b).done(function(){g.resolve(c)});return g.promise()})},add:function(a){y[a.uuid+".user.js"]=JSON.stringify({uuid:a.uuid,url:a.url,options:a.options,content:a.content});e&&window.clearTimeout(e);e=window.setTimeout(c,3E3);return d.Pledge()},write:c,remove:function(a){var h={uuid:a.uuid,url:a.url,
options:a.options||{}};h.options.removed=(new Date).getTime()+w;y[a.uuid+".user.js"]=JSON.stringify(h);e&&window.clearTimeout(e);e=window.setTimeout(c,3E3);return d.Pledge()},reset:function(){return l().then(function(a){var c=[],b=d();a.forEach(function(a){c.push(function(){var b=d();q(a).always(function(){b.resolve()});return b.promise()}())});d.when(c).done(function(){b.resolve()});return b.promise()})}}}(),l=function(){var f=!1,m,k=function(c,a){if(p==v.eCHROMESYNC&&"sync"==a)if(null===w)D().done(function(){k(c,
a)});else{var h=RegExp(m+"$"),b;for(b in c){var g=c[b];console.log('si: storage key "%s" in namespace "%s" changed. Old value was "%s", new value is "%s".',b,a,g.oldValue,g.newValue);if(-1==b.search(h))console.log("si:   ^^ ignore cause this is not related to us!");else for(var d=0;d<z.length;d++)if(q[b])console.log("si:   ^^ ignore cause object is going to be changed right now or was changed by me!");else{var e=u(g.newValue,b);if(e)z[d](b,e)}}}},l=function(c,a){var h=d(),b=[];a?n().done(function(g){"url"==
c&&(a=a.split("#")[0]);b=C.select(g,function(b){return b.item&&b.item[c]==a});h.resolve(b)}).fail(function(a){h.reject(a)}):h.resolve(b);return h.promise()},n=function(){return A(function(){var c=d(),a=RegExp(m+"$");rea.storage.sync.get(null,function(h){var b=[],g;for(g in h)-1!=g.search(a)&&b.push({key:g,item:u(h[g],g)});c.resolve(b)});return c.promise()})},u=function(c,a){var h=null;try{h=JSON.parse(c)}catch(b){}return h&&h.url?h:(console.warn("si: unable to parse extended info of "+a),null)},x=
function(c){return c.then(function(a){var c={};a=C.select(a,function(a,b){if(!c[a.key])return c[a.key]=!0});if(1<a.length){var b=d(),g=[],f=a.pop();a.forEach(function(a){g.push(e(a.key))});d.when(g).done(function(){b.resolve(f)});return b.promise()}return d.Pledge(a[0])})},t=null,q={},e=function(c,a){return A(function(){var a=d();rea.storage.sync.remove(c,function(b){(b=rea.runtime.lastError)?a.reject(b):a.resolve()});return a.promise()})},y=function(c){return A(function(){var a=d();rea.storage.sync.set(q,
function(c){(c=rea.runtime.lastError)?a.reject(c):(q={},a.resolve())});return a.promise()})};return{init:function(){var c=!0;if(!f)try{rea.storage.onChanged.addListener(k),f=!0}catch(a){console.log("si: error registering sync callback: "+a.message),c=!1}2==r?m="@v2":(r=1,m="@us");return d.Pledge(c)},list:function(){var c;c=null===w?D():d.Pledge();return c.then(function(){return n()}).then(function(a){var c=RegExp(m+"$"),b=[];a.forEach(function(a){var d=a.key;a=a.item;var e=d.replace(c,""),f=null;
(f=q[d]?u(q[d],d):a)&&(1==r||(!f.vmin||r>=f.vmin)&&(!f.vmax||r<=f.vmax))&&b.push({id:e,uuid:f.uuid,url:f.url,options:f.options||{}})});return d.Pledge(b)})},add:function(c){var a=d(),e=2==r?l("uuid",c.uuid):l("url",c.url);x(e).done(function(b){var d;b?(d=b.key,b=b.item):(d=c.uuid+m,b={});b.url=c.url;b.options=c.options||{};2==r&&(b.uuid=c.uuid);q[d]=JSON.stringify(b);t&&window.clearTimeout(t);t=window.setTimeout(y,3E3);a.resolve()});return a.promise()},remove:function(c){var a=d(),e=2==r?l("uuid",
c.uuid):l("url",c.url);x(e).done(function(b){var d;b?(d=b.key,b=b.item):(d=c.uuid+m,b={});b.options=b.options||{};b.options.removed=(new Date).getTime()+w;q[d]=JSON.stringify(b);t&&window.clearTimeout(t);t=window.setTimeout(y,3E3);a.resolve()});return a.promise()},reset:function(){return A(function(){var c=d();rea.storage.sync.clear(function(){q={};c.resolve()});return c.promise()})}}}(),k=function(){var f,l=null,k=function(){var e=d();f?F({method:"GET",retries:3,url:f},{onload:function(d){4==d.readyState&&
(200==d.status?e.resolve(d.responseText):e.reject())},onerror:e.reject}):e.reject({});return e.promise()},n=function(){var e=d();k().done(function(d){r(d).done(function(c){l=G.MD5(d);e.resolve(c)})}).fail(function(d){e.reject(d)});return e.promise()},r=function(e){var f=d(),c=[];try{e=e.replace(/\t/g,"    ");e=e.replace(/\r/g,"\n");e=e.replace(/\n\n+/g,"\n");for(var a=e.split("\n"),h=0;h<a.length;h++){var b=a[h],g=b.split("|");if(3<g.length)console.log("si: can't handle line: "+b);else{var l=g[g.length-
1],k=null,n=null;if(1<g.length)for(var m=g.length-2;0<=m;m--)try{k=JSON.parse(g[m])}catch(s){n=g[m]}c.push({name:n,url:l,options:k||{}})}}}catch(p){console.warn("si: unable to parse data: "+e)}f.resolve(c);return f.promise()},u=function(){var e=d();k().done(function(d){r(d).done(function(c){if(l!=G.MD5(d))for(c=0;c<z.length;c++)z[c]()})}).fail(function(d){e.reject(d)});return e.promise()},x=null,t=function(d){if(x)if(d)window.clearTimeout(x);else return;console.debug("si: schedule sync for periodical run every 18000000 ms");
x=window.setTimeout(function(){x=null;p==v.ePASTEBIN&&u().always(function(){t()})},18E6)},q={init:function(e){f="https://pastebin.com/raw.php?i=%s".replace("%s",e);t(!0);return d.Pledge(!0)},list:function(){return null===w?D().then(function(){return q.list()}):n()}};return q}(),f={};f[v.ePASTEBIN]=k;f[v.eCHROMESYNC]=l;E.SYNC.GOOGLE_DRIVE.SUPPORTED&&(f[v.eGOOGLEDRIVE]=n);return f}(),D=function(){var n=d(),l=0,k=function(){if(l<J.length){var d=J[l],s={method:d.method,url:d.url};console.log("si: determine time offset with server "+
d.url);F(s,{ondone:function(m){4==m.readyState&&(200==m.status?(m=d.extract(m.responseText,m.responseHeaders),null===m?(l++,window.setTimeout(k,1)):(w=m,console.log("si: detected a time offset of "+m+" ms"),n.resolve(!0))):(l++,window.setTimeout(k,1)))}})}else w=0,console.log("si: time offset detection failed!"),n.resolve(!1)};k();return n.promise()},A=function(n,l){var k=d();void 0===l&&(l=3);var f=function(){if(B)window.setTimeout(f,500);else{B=!0;try{n().always(function(){B=!1}).done(function(){k.resolve.apply(this,
arguments)}).fail(function(){0<--l?(console.log("si: some retries left, wait for",6E4,"ms"),window.setTimeout(f,6E4)):(console.warn("si: no retries left, skipping this sync request!"),k.reject("no retries left"))})}catch(d){console.warn(d),B=!1,k.reject(d)}}};f();return k.promise()},K={init:function(n,l,k){z=[];p=n;r=l;return u[p]?u[p].init(k).done(function(d){}):d.Breach()},debug:function(d){},addChangeListener:function(d){z.push(d)},isWritable:function(){return p==v.eCHROMESYNC||p==v.eGOOGLEDRIVE},
types:v};["list","add","reset","remove"].forEach(function(n){K[n]=function(){return u[p]&&u[p][n]?u[p][n].apply(this,arguments):d.Pledge()}});Registry.register("syncinfo","0",K)});
