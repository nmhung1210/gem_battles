exports.randomBetween = function(a,b)
{
    var rand = Math.floor(Math.random() * (Math.max(a,b)-Math.min(a,b)));
    return rand+Math.min(a,b);
}