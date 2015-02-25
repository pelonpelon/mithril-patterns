/* 'use strict'; */

macro to_str {
  case { _ ($toks ...) } => {
    return [makeValue(#{ $toks ... }.map(unwrapSyntax).join(''), #{ here })];
  }
}

macro get_env {
  case { _ ($arg) } => {
    var arg = unwrapSyntax(#{$arg})
    letstx $DEBUG = [makeValue(process.env[arg] || 'false', #{ here })]
    return #{$DEBUG}
  }
}

function get_env(arg) {
  console.log('process.env[arg]: ' + process.env[arg]);
  return process.env[arg];
}

/* macro get_env { */
  /* case { _ ($arg) } => { */
    /* var arg = unwrapSyntax(#{$arg}); */
    /* var truthy = makeValue('true', #{ here }) */
    /* var falsey = makeValue('false', #{ here }) */
    /* letstx $falsey = [falsey] */
    /* letstx $truthy = [truthy] */
    /* if (process.env[arg] === 'true') { */
      /* return #{$truthy}; */
    /* }else{ */
      /* return #{$falsey}; */
    /* } */
  /* } */
/* } */

// macro mkVal {
  // case { _ ($id) } => {
    // var id = unwrapSyntax(#{$id});
    // console.log('id = ' + id)
    // var idstx = makeValue(id, #{ here })
    // console.log(idstx)
    // letstx $i = [idstx]
    // console.log(#{$i})
    // console.log([idstx])
    // return [idstx]
  // }
// }




/* macroclass fn { */
  /* pattern { rule { $name:ident ($params:ident (,) ...) {$body ...} } } */
  /* pattern { rule { ($params:ident (,) ...) {$body ...} } with $name = #{''} } */
/* } */



let function = macro {
  case infix { $m.$method = | $_ ($params (,) ...) {$body ...} } => {
    /* if (#{m}[0].token.value === 'm' && #{$method}[0].token.value === 'module') console.log(#{$method}[0].token.value); */
    if (#{m}[0].token.value === 'm' && #{$method}[0].token.value === 'module') {
      if (Number(get_env('MITHRIL_DEBUG')) < 2 ) return #{$m.$method = function ($params (,) ...) {$body ...} };
      return #{ $m.$method = function ($params (,) ...) {console.log($method); $body ...;} }
    }
    if (Number(get_env('MITHRIL_DEBUG')) < 3 ) return #{$m.$method = function ($params (,) ...) {$body ...} };
    return #{ $m.$method = function ($params (,) ...) {
        console.log(to_str($method), $m.$method.arguments)
        $body ...
      }
    }
  }
  case { $_ $name:ident ($params (,) ...) {$body ...} } => { 

    if (#{$name}[0].token.value === 'initialize') {
      return #{
        function $name($params (,) ...) {
          $name.arguments[0].mithril_time = Date.now();
          console.log($name.name.replace(/\$.*/, ''), $name.arguments);
          $body ...
        } 
      }
    }
    if (#{$name}[0].token.value === 'redraw') {
      letstx $rdsd = [ makeIdent('_count_diff', #{ $name }) ]
      letstx $rdsa = [ makeIdent('_count_all', #{ $name }) ]
      letstx $rdsn = [ makeIdent('_count_none', #{ $name }) ]
      return #{
        function $name ($params (,) ...) {
          console.log('- ' + $name.name + ' begins ------------------------')
          window.mithril_predraw_time = Date.now();
          var strategy = m.redraw.strategy();
          if (typeof $name.$rdsd === 'undefined') $name.$rdsd = m.prop(0)
          if (typeof $name.$rdsa === 'undefined') $name.$rdsa = m.prop(0)
          if (typeof $name.$rdsn === 'undefined') $name.$rdsn = m.prop(0)
          if ( m.redraw.strategy() === 'diff' ) $name.$rdsd( $name.$rdsd() + 1 )
          if ( m.redraw.strategy() === 'all' ) $name.$rdsa( $name.$rdsa() + 1 )
          if ( m.redraw.strategy() === 'none' ) $name.$rdsn( $name.$rdsn() + 1 )
          $body ...; 
          console.log('- ' + $name.name, '[' + strategy + ']', $name.$rdsd()+'d', $name.$rdsa()+'a', $name.$rdsn()+'n', (Date.now() - window.mithril_predraw_time)+'s', (Date.now() - window.mithril_time)+'s' )
        }
      }
    }
    if (Number(get_env('MITHRIL_DEBUG')) < 3 ) return #{function $name($params (,) ...) {$body ...} };
    return #{ function $name($params (,) ...) {console.log($name.name.replace(/\$.*/, ''), $name.arguments); $body ... } }
  }
  case { $_ } => { return #{function} }
}
export function

let var = macro {
  case { $_ $name = function ($params (,) ...) { $body ... } } => {
    return #{ var $name = function($params (,) ...) { $body ... } }
  }
  case {var} => { return #{var} }
}
export var

/*
macro show_redraws {
  case { _ ({$token})
  } => {
    var arg = unwrapSyntax(#{$token});
    console.log(arg);
    var args = makeValue(arg, #{here})
    console.log(args);
    letstx $args = [args]
    console.log(#{$args});
    console.log([args])
    return #{$args}
    var memb = unwrapSyntax(#{$member});
    var count_diff = makeIdent(memb + '_count_diff', #{ here });
    var count_all = makeIdent(memb + '_count_all', #{ here });
    var count_none = makeIdent(memb + '_count_none', #{ here });
    letstx $cnt_d = [count_diff];
    letstx $cnt_a = [count_all];
    letstx $cnt_n = [count_none];
    var rs = makeIdent('m.redraw.strategy()', #{ here });
    letstx $rs = [rs];
    if ( memb === 'redraw' || memb === 'render' ) {
      return #{console.log(memb)}
      // return #{
        // if (!$module.$cnt_d) $module.$cnt_d = $module.prop(0)
        // if (!$module.$cnt_a) $module.$cnt_a = $module.prop(0)
        // if (!$module.$cnt_n) $module.$cnt_n = $module.prop(0)
        // if ( $rs === 'diff' ) $module.$cnt_d( $module.$cnt_d() + 1 )
        // if ( $rs === 'all' ) $module.$cnt_a( $module.$cnt_a() + 1 )
        // if ( $rs === 'none' ) $module.$cnt_n( $module.$cnt_n() + 1 )
        // if ( to_str($member) === 'render') {
          // console.log('m.redraw: ' 
          // + $module.redraw_count_diff() + 'd '
          // + $module.redraw_count_all() + 'a '
          // + $module.redraw_count_none() + 'n '
          // + '   m.render: ' 
          // + $module.render_count_diff() + 'd '
          // + $module.render_count_all() + 'a '
          // + $module.render_count_none() + 'n '
          // );
        // }
      // }
    }
    return #{$module}
  }
}

let function = macro {
  case { $_ $id ($params ...) { $body ...} } => {
    if (get_env('DEBUG') === 'false') return #{function $id ($params ...) {$body ...} };
    var id = unwrapSyntax(#{$id});
    if ( id === 'prop' ) {
      return #{
        $_ function ($params ...) { $body ...}
      };
    }
    var rs = makeIdent('m.redraw.strategy()', #{ here });
    letstx $rs = [rs];
    if ( id === 'autoredraw' ) {
      return #{
        function $id ($params ...) { 

          console.log($id.name + '('+ $rs +')');
          $body ...
        }
      };
    }
    return #{
      function $id ($params ...) { */
    //    console.log($id.name.replace(/\$.*/, ''));
    /*    if (!!arguments.length) console.log(arguments);
        console.log(' ');
        $body ...
      }
    }
  }
  case infix { $module.$m1.$m2 = | $_ ($params ...) {$body ...}
  } => {
    if (get_env('DEBUG') === 'false') return #{ $module.$m1.$m2 = function ($params ...) {$body ...} };
    return #{
      $module.$m1.$m2 = function ($params ...) {
        console.log(to_str($module) + '.' + to_str($m1) + '.' + to_str($m2));
        if (!!arguments.length) console.log(arguments);
        console.log(' ');
        $body ...
      }
    };
  }
  case infix { $module.$member = | $_ ($params ...) { $body ...}
  } => {
    if (get_env('DEBUG') === 'false' && get_env('REDRAW') === 'true') {
      // console.log((#{$module}), (#{$member}))
      var value = show_redraws(#{$member})
      var tof = makeValue(value, #{ here })
      // letstx $v = [value]
      letstx $tof = [tof] 
      return #{
        $module.$member = function ($params ...) {
          $body ...
          console.log('tof = ' + $tof)
        };
      }
    }
 //   if (get_env('DEBUG') === 'false') return #{ $module.$member = function ($params ...) {$body ...} }; 
    return #{
      $module.$member = function ($params ...) {
        console.log(to_str($module) + '.' + to_str($member));
        if (!!arguments.length) console.log(arguments);
        console.log(' ');
        $body ...
     //   show_redraws( $module.$member ) 
      }
    };
  }
  case { $_ } => { return #{function}; }
}
export function;

// function definitions don't work so...
let var = macro {
  case {
    $_ $id = function ($params ...) {$body ...}
  } => {
    if (get_env('DEBUG') === 'false') return #{var $id = function ($params ...) {$body ...} };
    var id = unwrapSyntax(#{$id});
    var idstx = makeValue(id, #{ here })
    letstx $i = [idstx]
    if ( id === 'prop' ) { return #{ var $id = function ($params ...) {$body ...} }
    }
    return #{
      var $id = function ($params ...) {
        console.log($i);
        if (!!arguments.length) console.log(arguments);
        console.log(' ');
        $body ...
      }
    };
  }
  case { $_ } => { return #{var}; }
};

export var;
*/
