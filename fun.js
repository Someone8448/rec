var fun = {};
fun.timeword = (time) => {
    if (time >= 10000000000000) {
        return 'forever';
    }
    if (time >= 31536000000) {
        return Math.round((time / 31536000000) * 10) / 10 + ' years';
    }
    if (time >= 2592000000) {
        return Math.round((time / 2592000000) * 10) / 10 + ' months';
    }
    if (time >= 604800000) {
        return Math.round((time / 604800000) * 10) / 10 + ' weeks';
    }
    if (time >= 86400000) {
        return Math.round((time / 86400000) * 10) / 10 + ' days';
    }
    if (time >= 3600000) {
        return Math.round((time / 3600000) * 10) / 10 + ' hours';
    }
    if (time >= 60000) {
        return Math.round((time / 60000) * 10) / 10 + ' minutes';
    }
    if (time >= 1000) {
        return Math.round((time / 1000) * 10) / 10 + ' seconds';
    }
    return time + ' milliseconds';

}
fun.timenum = (timeSec) => {
function pad (num,size) {
return ("000" + num).slice(size * -1)
}
time = parseFloat(timeSec).toFixed(3)
hours = Math.floor(time/60/60)
minutes = Math.floor(time/60) % 60
seconds = Math.floor(time - minutes * 60)
milliseconds = time.slice(-3)
return pad(hours,3)+":"+pad(minutes,2)+":"+pad(seconds,2)+"."+milliseconds
}
fun.sleep = (t) => new Promise(r => setTimeout(() => r(), t));
fun.nps = () => {
var nps = {nps: {}};
nps.put = () => {
var date = Date.now();
if (!nps.nps[date]) nps.nps[date] = 0;
nps.nps[date]++
//Object.keys(nps.nps).filter(n => n < date - 1000).forEach(n => {delete nps.nps[n]});
}
nps.get = () => {
var date = Date.now();
Object.keys(nps.nps).filter(n => n < date - 1000).forEach(n => {delete nps.nps[n]});
var nc = 0;
Object.values(nps.nps).forEach(n => {nc += n});
return nc;
}
return nps
}
module.exports = fun
