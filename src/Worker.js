/*eslint-env browser*/

const global = this

const wl = {
    'self': 1,
    'onmessage': 1,
    'postMessage': 1,
    'global': 1,
    'wl': 1,
    'eval': 1,
    'Array': 1,
    'Boolean': 1,
    'Date': 1,
    'Function': 1,
    'Number' : 1,
    'Object': 1,
    'RegExp': 1,
    'String': 1,
    'Error': 1,
    'EvalError': 1,
    'RangeError': 1,
    'ReferenceError': 1,
    'SyntaxError': 1,
    'TypeError': 1,
    'URIError': 1,
    'decodeURI': 1,
    'decodeURIComponent': 1,
    'encodeURI': 1,
    'encodeURIComponent': 1,
    'isFinite': 1,
    'isNaN': 1,
    'parseFloat': 1,
    'parseInt': 1,
    'Infinity': 1,
    'JSON': 1,
    'Math': 1,
    'NaN': 1,
    'undefined': 1
}

Object.getOwnPropertyNames( global ).forEach( function( prop ) {
    if( !wl.hasOwnProperty( prop ) ) {
        Object.defineProperty( global, prop, {
            get : function() {
                throw 'Security Exception: cannot access '+prop
            }, 
            configurable : false
        })    
    }
})

Object.getOwnPropertyNames( global.__proto__ ).forEach( function( prop ) {
    if( !wl.hasOwnProperty( prop ) ) {
        Object.defineProperty( global.__proto__, prop, {
            get : function() {
                throw 'Security Exception: cannot access '+prop
            }, 
            configurable : false
        })    
    }
})

Object.defineProperty( Array.prototype, 'join', {

    writable: false,
    configurable: false,
    enumerable: false,

    value: function(old){
        return function(arg){
            if( this.length > 500 || (arg && arg.length > 500 ) ) {
                throw 'Exception: too many items'
            }

            return old.apply( this, arguments )
        }
    }(Array.prototype.join)
});

(function(){
    var cvalues = []

    // var console = {
    //     log: function(){
    //         cvalues = cvalues.concat( [].slice.call( arguments ) )
    //     }
    // }

    function objToResult( obj ) {
        var result = obj
        switch( typeof result ) {
        case 'string':
            return '"' + result + '"'
        case 'number':
        case 'boolean':
        case 'undefined':
        case 'null':
        case 'function':
            return result + ''
        case 'object':
            if( !result ) {
                return 'null'
            }
            else if( result.constructor === Object || result.constructor === Array ) {
                var type = ({}).toString.call( result )
                var stringified
                try {
                    stringified = JSON.stringify(result)
                }
                catch(e) {
                    return ''+e
                }
                return type + ' ' + stringified
            }
            else {
                return ({}).toString.call( result )
            }
        }
    }

    onmessage = function( event ) {
        'use strict'
        var code = event.data.code
        var result
        try {
            result = eval( '"use strict"\n'+code )
        }
        catch(e) {
            postMessage( e.toString() )
            return
        }
        result = objToResult( result )
        if( cvalues && cvalues.length ) {
            result = result + cvalues.map( function( value, index ) {
                return 'Console log '+(index+1)+':' + objToResult(value)
            }).join(' ')
        }
        postMessage( (''+result).substr(0,400) )
    }
})()