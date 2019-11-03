var queryfactory = function(selector,context){
    return new query()
}
function query(){
    
}
query.prototype=queryfactory.prototype={
    name:function(){
        console.log('name')
    }
}

queryfactory().name()

new function(){
    console.log('new function')
}