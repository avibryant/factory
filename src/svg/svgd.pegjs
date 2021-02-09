commands = 
  ws first:command rest:(ws command)* ws {
    return [first].concat(rest.map(e => e[1]))
  }

command = command0 / command1 / command2 / command4 / command6

command0 = name:name0 {
  return {
    name: name,
    args: []
   }
}

command1 = name:name1 ws first:arg1 rest:(ws arg1)* ws {
	return {
      name: name,
      args: [first].concat(rest.map(e => e[1]))
    }
}

command2 = name:name2 ws first:arg2 rest:(ws arg2)* ws {
	return {
      name: name,
      args: [first].concat(rest.map(e => e[1]))
    }
}

command4 = name:name4 ws first:arg4 rest:(ws arg4)* ws {
	return {
      name: name,
      args: [first].concat(rest.map(e => e[1]))
    }
}

command6 = name:name6 ws first:arg6 rest:(ws arg6)* ws {
	return {
      name: name,
      args: [first].concat(rest.map(e => e[1]))
    }
}

arg1 = number
arg2 = x:number ws ("," ws)? y:number {
   return [x,y]
}
arg4 =
  x2:number ws ("," ws)?
  y2:number ws ("," ws)?
  x:number ws ("," ws)?
  y:number {
  return [x2, y2, x, y]
 }
arg6 =
  x1:number ws ("," ws)?
  y1:number ws ("," ws)?
  x2:number ws ("," ws)?
  y2:number ws ("," ws)?
  x:number ws ("," ws)?
  y:number {
  return [x1, y1, x2, y2, x, y]
 }

name0 = "z" / "Z"
name1 = "h" / "H" / "v" / "V"
name2 = "m" / "M" / "l" / "L"
name4 = "s" / "S"
name6 = "c" / "C"


number
  = "-"? ("0" / ([1-9] [0-9]*)) frac? exp? {
    return parseFloat(text())
  }

frac
  = "." [0-9]+

exp
  = [eE] ("-" / "+")? [0-9]+
  
ws
  = [ \t\n\r]*
