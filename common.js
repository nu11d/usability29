// <script src="./common.js"></script>
// <script>(function(global){
// let m1 =  global.common;
// })(window.global || (window.global = {}));</script>

(function(global){
let date = new Date();
let common = "imcommon ";
global.common = common+date;
})(window.global || (window.global = {}));
