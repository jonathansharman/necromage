﻿PST$sortedCopyOfArray = function(n) {
	var a = n.concat([]);
	a.sort();
	return a;
};

PST$multiplyList = function(l, n) {
	var o = [];
	var s = l.length;
	var i;
	while (n-- > 0) {
		for (i = 0; i < s; ++i) {
			o.push(l[i]);
		}
	}
	return o;
};

PST$checksubstring = function(s, index, lookfor) { return s.substring(index, index + lookfor.length) === lookfor; };

PST$stringTrimOneSide = function(s, isLeft) {
	var i = isLeft ? 0 : s.length - 1;
	var end = isLeft ? s.length : -1;
	var step = isLeft ? 1 : -1;
	var c;
	var trimming = true;
	while (trimming && i != end) {
		c = s.charAt(i);
		switch (c) {
			case ' ':
			case '\n':
			case '\t':
			case '\r':
				i += step;
				break;
			default:
				trimming = false;
				break;
		}
	}

	return isLeft ? s.substring(i) : s.substring(0, i + 1);
};

PST$floatParseHelper = function(o, s) {
	var t = parseFloat(s);
	if (t + '' == 'NaN') {
		o[0] = -1;
	} else {
		o[0] = 1;
		o[1] = t;
	}
};

PST$createNewArray = function(s) {
	var o = [];
	while (s-- > 0) o.push(null);
	return o;
};

PST$dictionaryKeys = function(d) {
	var o = [];
	for (var k in d) {
		o.push(k);
	}
	return o;
};

PST$dictionaryValues = function(d) {
	var o = [];
	for (var k in d) {
		o.push(d[k]);
	}
	return o;
};

PST$is_valid_integer = function(n) {
	var t = parseInt(n);
	return t < 0 || t >= 0;
};

PST$clearList = function(v) {
	v.length = 0;
};

PST$shuffle = function(v) {
	var t;
	var len = v.length;
	var sw;
	for (i = len - 1; i >= 0; --i) {
		sw = Math.floor(Math.random() * len);
		t = v[sw];
		v[sw] = v[i];
		v[i] = t;
	}
};

PST$stringEndsWith = function(s, v) {
	return s.indexOf(v, s.length - v.length) !== -1;
};

PST$intBuffer16 = PST$multiplyList([0], 16);
PST$floatBuffer16 = PST$multiplyList([0.0], 16);
PST$stringBuffer16 = PST$multiplyList([''], 16);

var lib_json_parse = function(vm, args) {
	var raw = args[0][1];
	if ((raw.length > 0)) {
		var output = LIB$json$parseJson(vm[13], raw);
		if ((output != null)) {
			return output;
		}
	}
	return vm[14];
};


C$common$scrapeLibFuncNames('json');


LIB$json$parseJson = function(globals, rawText) {
    try {
        return LIB$json$convertJsonThing(globals, window.JSON.parse(rawText));
    } catch (e) {
        return null;
    }
};

LIB$json$convertJsonThing = function(globals, thing) {
    var type = LIB$Json$typeClassifyHelper(thing);
    switch (type) {
        case 'null': return buildNull(globals);
        case 'bool': return buildBoolean(globals, thing);
        case 'string': return buildString(globals, thing);
        case 'list':
            var list = [];
            for (var i = 0; i < thing.length; ++i) {
                list.push(LIB$json$convertJsonThing(globals, thing[i]));
            }
            return buildList(list);
        case 'dict':
            var keys = [];
            var values = [];
            for (var rawKey in thing) {
                keys.push(rawKey);
                values.push(LIB$json$convertJsonThing(globals, thing[rawKey]));
            }
            return buildStringDictionary(globals, keys, values);
        case 'int':
            return buildInteger(globals, thing);
        case 'float':
            return buildFloat(globals, thing);
        default:
            return buildNull(globals);
    }
};

LIB$Json$typeClassifyHelper = function(t) {
    if (t === null) return 'null';
    if (t === true || t === false) return 'bool';
    if (typeof t == "string") return 'string';
    if (typeof t == "number") {
        if (t % 1 == 0) return 'int';
        return 'float';
    }
    ts = Object.prototype.toString.call(t);
    if (ts == '[object Array]') {
        return 'list';
    }
    if (ts == '[object Object]') {
        return 'dict';
    }
    return 'null';
};

