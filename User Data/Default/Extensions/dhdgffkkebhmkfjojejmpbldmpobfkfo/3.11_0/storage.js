(function(){Registry.require(["promise"],function(){var g=rea.FEATURES,e=Registry.get("promise"),t=!0,h=!1,w=[],m=!0,v=function(){var a=[g.CONSTANTS.STORAGE.VERSION,g.CONSTANTS.STORAGE.TYPE],b={};a.forEach(function(a){b[a]=!0});return{keys:a,has:function(a){return!!b[a]}}}(),n=g.HTML5.LOCALSTORAGE,C=function(){return rea.other.openDatabase("tmStorage","1.0","TM Storage",31457280)},D=function(a){return a},x=function(a,b){if(!a)return b;var c=a[0];a=a.substring(1);switch(c){case "b":return"true"==a;
case "n":return Number(a);case "o":try{return JSON.parse(a)}catch(e){console.error("Storage: getValue ERROR: "+e.message)}return b;default:return a}},y=function(a){var b=(typeof a)[0];switch(b){case "o":try{a=b+JSON.stringify(a)}catch(c){console.error("Storage: setValue ERROR: "+c.message);return}break;default:a=b+a}return a},r=function(a,b){var c=e(),d=Array.prototype.slice.call(arguments,2),f;"string"==typeof a?a==g.DB.USE&&"clean"==b?console.warn("Storage: can't clean currently active storage"):
f=l.implementations[a][b]:f=a[b];if(f)if(d=f.apply(this,d),"object"===typeof d&&d.then)d.then(function(){c.resolve.apply(this,arguments)},function(a){c.reject()});else return d;else c.resolve();return c.promise()},z=function(a,b){var c=e(),d=[];Object.getOwnPropertyNames(b).forEach(function(c){void 0!==b[c]&&d.push(r(a,"setValue",c,b[c]))});e.when(d).done(function(){c.resolve()});return c.promise()},A=function(a,b){var c={};b.forEach(function(b){c[b]=r(a,"getValue",b)});return c},l={implementations:{localStorage:function(){var a=
{setValue:function(a,c){var d=e();h&&console.log("localStorage: setValue -> "+a);var f=y(c);m&&n.setItem(a,f);d.resolve();return d.promise()},getValue:function(a,c){h&&console.log("Storage: getValue -> "+a);return x(n.getItem(a,c),c)},deleteAll:function(){var b=e();h&&console.log("localStorage: deleteAll()");m&&a.listValues().forEach(function(a){v.has(a)||n.removeItem(a)});b.resolve();return b.promise()},deleteValue:function(a){var c=e();h&&console.log("localStorage: deleteValue -> "+a);m&&n.removeItem(a);
c.resolve();return c.promise()},listValues:function(){h&&console.log("localStorage: listValues");for(var a=[],c=0;c<n.length;c++)a.push(D(n.key(c)));return a}};return{options:{},methods:a}}(),sql:function(){var a=null,b=null,c=function(){var a=e();b.db.transaction(function(c){c.executeSql("CREATE TABLE IF NOT EXISTS config(ID INTEGER PRIMARY KEY ASC, name TEXT, value TEXT)",[],a.resolve,b.onError)});return a.promise()},d=function(){var a=e();b={db:C(),onSuccess:function(a,b){h&&console.log("webSQL: localDB Success ")},
onError:function(a,b){console.error("webSQL: localDB Error ",b)}};b.db?c().done(a.resolve):a.reject();return a.promise()},f={setValue:function(c,p){var q=e();h&&console.log("Storage: setValue -> "+c);var d=y(p);m&&(a[c]?b.db.transaction(function(a){a.executeSql("UPDATE config SET value=? WHERE name=?",[d,c],function(){rea.runtime.lastError&&console.warn(rea.runtime.lastError);q.resolve()},b.onError)}):b.db.transaction(function(a){a.executeSql("INSERT INTO config(name, value) VALUES (?,?)",[c,d],function(){rea.runtime.lastError&&
console.warn(rea.runtime.lastError);q.resolve()},b.onError)}));a[c]=d;m||q.resolve();return q.promise()},getValue:function(b,c){h&&console.log("webSQL: getValue -> "+b);return x(a[b],c)},deleteAll:function(){var d=e();h&&console.log("webSQL: deleteAll()");var p=A(f,v.keys);a=p;m?b.db.transaction(function(a){a.executeSql("DROP TABLE config",[],function(){c().done(function(){z(f,p).done(d.resolve)})},b.onError)}):d.resolve();return d.promise()},deleteValue:function(c){var p=e();h&&console.log("webSQL: deleteValue -> "+
c);delete a[c];m?b.db.transaction(function(a){a.executeSql("DELETE FROM config WHERE name=?",[c],p.resolve,b.onError)}):p.resolve();return p.promise()},listValues:function(){h&&console.log("webSQL: listValues");var b=[];Object.getOwnPropertyNames(a).forEach(function(a){b.push(a)});return b},isWorking:function(){return e.Pledge()}};return{init:function(){var c=e(),p=function(b,k){a={};if(k)for(var s=0;s<k.rows.length;s++)a[k.rows.item(s).name]=k.rows.item(s).value;c.resolve()},q=function(){a?c.resolve():
b.db.transaction(function(a){a.executeSql("SELECT * FROM config",[],p,b.onError)})};b?q():d().done(q).fail(c.reject);return c.promise()},clean:function(){a=null;return e.Pledge()},options:{},methods:f}}(),chromeStorage:function(){var a=null,b=!1,c=!1,d=rea.extension.inIncognitoContext?"incognito":"normal",f=function(b,e){if(m&&c&&"local"==e)for(var f in b){var k=b[f];h&&console.log("si: local storage key",f,"@",e,"changed:",k);k.newValue?k.newValue.origin!==d&&(a[f]=k.newValue.value,l.notifyDifferentOriginChangeListeners(f,
k.newValue)):delete a[f]}},g={setValue:function(b,c){var f=e();h&&console.log("chromeStorage: setValue -> ",b,c);a[b]=c;if(m){var k={};k[b]={origin:d,value:c};rea.storage.local.set(k,f.resolve)}else f.resolve();return f.promise()},getValue:function(b,c){var e=void 0===a[b]?c:a[b];h&&console.log("chromeStorage: getValue -> ",b,e);return e},deleteAll:function(){var b=e();h&&console.log("chromeStorage: deleteAll()");var c=A(g,v.keys);a=c;m?rea.storage.local.clear(function(){z(g,c).done(b.resolve)}):
b.resolve();return b.promise()},deleteValue:function(b){var c=e();h&&console.log("chromeStorage: deleteValue -> "+b);delete a[b];m?rea.storage.local.remove(b,c.resolve):c.resolve();return c.promise()},listValues:function(){h&&console.log("chromeStorage: listValues");var b=[];Object.getOwnPropertyNames(a).forEach(function(a){b.push(a)});return b},setTemporary:function(a){m=!a;c=!0},isSupported:function(){return e.Pledge()},isWorking:function(){var a=e(),b=0,c=(new Date).getTime(),k={};k.foo=c;var s=
function(c){5>=++b?(console.warn("storage:",c?c:"storage set/get test failed!"),window.setTimeout(d,b*b*100)):(console.warn("storage: storage set/get test finally failed!"),u&&(window.clearTimeout(u),u=null,a.reject()))},u=window.setTimeout(function(){u=null},18E4),d=function(){t&&console.log("Storage: test -> start");var b=(new Date).getTime();rea.storage.local.set(k,function(){t&&console.log("Storage: test -> set after "+((new Date).getTime()-b)+"ms");rea.storage.local.get("foo",function(k){t&&
console.log("Storage: test -> get after "+((new Date).getTime()-b)+"ms");if(k){if(k.foo!==c)return s("read value is different "+JSON.stringify(k.foo)+" != "+JSON.stringify(c));if(rea.runtime.lastError)return s(rea.runtime.lastError&&rea.runtime.lastError.message||"lastError is set")}else return s("read value is"+k);rea.storage.local.remove("foo",function(){t&&console.log("Storage: test -> remove after "+((new Date).getTime()-b)+"ms");u&&(window.clearTimeout(u),u=null,a.resolve())})})})};d();return a.promise()}};
return{init:function(){var c=e();a?c.resolve():rea.storage.local.get(null,function(e){a={};for(var d in e){var k=e[d];a[d]=k&&k.hasOwnProperty("origin")&&k.hasOwnProperty("value")?k.value:k}b||(rea.storage.onChanged.addListener(f),b=!0);c.resolve()});return c.promise()},clean:function(){var b=e();a=null;b.resolve();return b.promise()},options:{},methods:g}}(),file:function(){var a=null,b=null,c=function(){var a=e(),c=function(b){console.warn("fileStorage: listFiles() error:",b);a.reject()};b.root.getDirectory("data",
{create:!0},function(b){var e=b.createReader(),d=[],f=function(){e.readEntries(function(b){b.length?(d=d.concat(b),f()):a.resolve(d)},c)};f()},c);return a.promise()},d=function(a,c){var d=e(),f=function(b){console.warn("fileStorage: writeFileData(",a,") error:",b);d.reject()};b.root.getDirectory("data",{create:!0},function(b){b.getFile(a,{create:!0},function(a){a.createWriter(function(a){a.onwriteend=function(b){a.onwriteend=function(a){d.resolve()};a.onerror=f;b=new Blob([c],{type:"text/plain"});
a.write(b)};a.truncate(0)},f)},f)},f);return d.promise()},f=function(a){var c=e(),d=function(b){console.warn("fileStorage: getFileData(",a,") error:",b);c.reject()},f=function(a){var b=new FileReader;b.onloadend=function(){c.resolve(this.result)};b.onerror=d;b.onabort=d;b.readAsText(a)};b.root.getDirectory("data",{create:!0},function(b){b.getFile(a,{},function(a){a.file(function(a){f(a)},d)},d)},d);return c.promise()},g=function(a){var c=e(),d=function(b){console.warn("fileStorage: deleteFile(",a,
") error:",b);c.reject()};b.root.getDirectory("data",{create:!0},function(b){b.getFile(a,{create:!1},function(a){a.remove(c.resolve,d)},d)},d);return c.promise()},l=function(){var a=e(),c=function(b){console.warn("fileStorage: removeDir() error:",b);a.reject()};b.root.getDirectory("data",{create:!0},function(b){b.removeRecursively(a.resolve,c)},c);return a.promise()},q=function(){var b=e();a={};var d=[];c().done(function(c){c.forEach(function(b){"string"!==typeof b&&(b=b.name);d.push(f(b).always(function(c){a[b]=
c}))});e.when(d).always(function(){b.resolve()})}).fail(b.resolve);return b.promise()},B={isSupported:function(){var a=e();window.File&&window.FileReader&&window.FileList&&window.Blob?a.resolve():a.reject();return a.promise()},isWorking:function(){return e.Pledge()},setValue:function(b,c){var f=e();h&&console.log("fileStorage: setValue -> "+b);var g=y(c);a[b]=g;m?d(b,g).always(f.resolve):f.resolve();return f.promise()},getValue:function(b,c){h&&console.log("fileStorage: getValue -> "+b);return x(a[b],
c)},deleteAll:function(){var b=e();h&&console.log("fileStorage: deleteAll()");var c=A(B,v.keys);a=c;m?l().always(function(){z(B,c).always(b.resolve)}):b.resolve();return b.promise()},deleteValue:function(b){var c=e();h&&console.log("fileStorage: deleteValue -> "+b);delete a[b];m?g(b).always(c.resolve):c.resolve();return c.promise()},listValues:function(){h&&console.log("fileStorage: listValues");var b=[];Object.getOwnPropertyNames(a).forEach(function(a){b.push(a)});return b}};return{init:function(){var c=
e();a?c.resolve():rea.other.requestFileSystem(window.PERSISTENT,31457280,function(a){b=a;q().done(c.resolve)},function(a){a&&console.warn("fileStorage: ",a);c.reject()});return c.promise()},clean:function(){a=null;return e.Pledge()},options:{},methods:B}}()},migrate:function(a,b,c){var d=e(),f=l.implementations[a],g=l.implementations[b];c=c||{};f&&g?(h&&console.log("Migration: from",a,"to",b),r(a,"init").then(function(){return r(b,"init")}).then(function(){var a=e(),b=[];f.methods.listValues().forEach(function(a){var d=
f.methods.getValue(a);c.drop&&b.push(f.methods.deleteValue(a));h&&console.log("Migration: copy value of "+a);b.push(g.methods.setValue(a,d))});e.when(b).done(function(){a.resolve()});return a.promise()}).then(function(){return r(b,"clean")}).then(function(){return r(a,"clean")}).done(function(){d.resolve()}).fail(function(){d.reject()})):(console.error("Migration: unknown storage implementation(s) ",a,b),d.reject());return d.promise()},isSupported:function(){return e.Pledge()},isWorking:function(){return e.Pledge()},
setTemporary:function(a){m=!a},init:function(){t&&console.log("Storage: use "+g.DB.USE);Object.getOwnPropertyNames(l.implementations[g.DB.USE].methods).forEach(function(a){l.__defineGetter__(a,function(){return l.implementations[g.DB.USE].methods[a]})});return l.implementations[g.DB.USE].init?l.implementations[g.DB.USE].init():e.Pledge()},getValues:function(a,b){var c={};b||(b={});Object.getOwnPropertyNames(a).forEach(function(a){c[a]=l.implementations[g.DB.USE].getValue(a,b[a])});return c},factoryReset:function(){n.removeItem(g.CONSTANTS.STORAGE.LEGACY_VERSION);
return l.deleteAll()},isWiped:function(){if("localStorage"===g.DB.USE)return e.Pledge(!1);var a=e(),b=l.getValue(g.CONSTANTS.STORAGE.VERSION),c=!1;n.getItem(g.CONSTANTS.STORAGE.LEGACY_VERSION)&&!b&&(l.listValues().length?console.warn("storage: unable to find version information"):c=!0);a.resolve(c);return a.promise()},setVersion:function(a,b){var c=e();m?(n.setItem(g.CONSTANTS.STORAGE.LEGACY_VERSION,a),l.setValue(g.CONSTANTS.STORAGE.VERSION,a).then(function(){return b?l.setValue(g.CONSTANTS.STORAGE.SCHEMA,
b):e.Pledge()}).always(c.resolve)):c.resolve();return c.promise()},getVersion:function(a){var b=e(),c=l.getValue(g.CONSTANTS.STORAGE.VERSION)||l.getValue(g.CONSTANTS.STORAGE.LEGACY_VERSION)||n.getItem(g.CONSTANTS.STORAGE.LEGACY_VERSION);c?b.resolve(c):r("sql","init").then(function(b){c=l.implementations.sql.methods.getValue(g.CONSTANTS.STORAGE.LEGACY_VERSION)||a;return r("sql","clean")}).always(function(){b.resolve(c||a)});return b.promise()},getSchemaVersion:function(){return l.getValue(g.CONSTANTS.STORAGE.SCHEMA,
"3.5")},debug:function(a,b){h|=b;t|=a},addDifferentOriginChangeListener:function(a,b){w.push({search:a,cb:b})},notifyDifferentOriginChangeListeners:function(a,b){for(var c in w){var d=w[c];0==a.search(d.search)&&d.cb(a,b)}},recover:function(a,b){"string"===typeof a&&(a={method:a,storages:["sql","chromeStorage"]});var c={};a.storages.forEach(function(a){c[a]=!0});if("log"==a.method){var d=null,f,e,g=[{method:"sql",fn:function(a){console.debug("check sql storage for data...");try{e=C();if(rea.runtime.lastError||
!e)return d=rea.runtime.lastError,a();e.transaction(function(b){b.executeSql("CREATE TABLE IF NOT EXISTS config(ID INTEGER PRIMARY KEY ASC, name TEXT, value TEXT)",[],function(){console.debug("sql table found/created");a()},function(b,c){d=c;a()})})}catch(b){d=b,window.setTimeout(a,1)}}},{method:"sql",fn:function(a){var b={};e.transaction(function(c){c.executeSql("SELECT * FROM config",[],function(c,d){if(d)for(var e=0;e<d.rows.length;e++)b[d.rows.item(e).name]=d.rows.item(e).value;f=b;window.setTimeout(a,
1)},function(b,c){d=c;a()})})}},{method:"sql",fn:function(a){var b=f?Object.getOwnPropertyNames(f):[];f&&b.length?(console.debug("found values:"),b.forEach(function(a){console.debug("    ",a,f[a]&&30<f[a].length?f[a].substr(0,30):f[a])})):(console.warn("no data found"),c.sql=!1);window.setTimeout(a,1)}},{method:"chromeStorage",fn:function(a){console.debug("check chromeStorage for data...");rea.storage.local.get(null,function(b){f=b;a()})}},{method:"chromeStorage",fn:function(a){var b=f?Object.getOwnPropertyNames(f):
[];f&&b.length?(console.debug("found values:"),b.forEach(function(a){console.debug("    ",a,f[a]&&30<f[a].length?f[a].substr(0,30):f[a])})):(console.warn("no data found"),c.chromeStorage=!1,window.setTimeout(a,1))}}],h=0,l=function(){if(d)console.warn("error:",d);else for(;g[h];){if(c[g[h].method]){g[h].fn(l);h++;return}h++}b&&b()};l()}}};Registry.register("storage","0",function(){return l})})})();