// <script src="./common.js"></script>
// <script>(function(global){
// let m1 =  global.common;
// })(window.global || (window.global = {}));</script>

(function(global){
let common = "imcommon "+new Date();
global.common = common;
})(window.global || (window.global = {}));
