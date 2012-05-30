

Foo = function()
{
    var john = 'testing'
    console.log('ok', john);
}

Foo.prototype.something = function()
{
    console.log('this = '+this);
}

module.exports.Foo = Foo;

