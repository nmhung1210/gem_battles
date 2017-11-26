import src.characters.Player as Player;

exports = Class(Player, function(supr) {
    this.init = function(opts) {
        opts = merge(opts,{
            url: "resources/images/characters/ninjagirl/ninjagirl",
        });
        supr(this, 'init', [opts]);
        this.startAnimation('idle', {loop: true});
    }
});