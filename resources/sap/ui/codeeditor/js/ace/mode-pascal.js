ace.define("ace/mode/pascal_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(r,e,m){"use strict";var o=r("../lib/oop");var T=r("./text_highlight_rules").TextHighlightRules;var P=function(){this.$rules={start:[{caseInsensitive:true,token:'keyword.control.pascal',regex:'\\b(?:(absolute|abstract|all|and|and_then|array|as|asm|attribute|begin|bindable|case|class|const|constructor|destructor|div|do|do|else|end|except|export|exports|external|far|file|finalization|finally|for|forward|goto|if|implementation|import|in|inherited|initialization|interface|interrupt|is|label|library|mod|module|name|near|nil|not|object|of|only|operator|or|or_else|otherwise|packed|pow|private|program|property|protected|public|published|qualified|record|repeat|resident|restricted|segment|set|shl|shr|then|to|try|type|unit|until|uses|value|var|view|virtual|while|with|xor))\\b'},{caseInsensitive:true,token:['variable.pascal',"text",'storage.type.prototype.pascal','entity.name.function.prototype.pascal'],regex:'\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?(?=(?:\\(.*?\\))?;\\s*(?:attribute|forward|external))'},{caseInsensitive:true,token:['variable.pascal',"text",'storage.type.function.pascal','entity.name.function.pascal'],regex:'\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?'},{token:'constant.numeric.pascal',regex:'\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b'},{token:'punctuation.definition.comment.pascal',regex:'--.*$',push_:[{token:'comment.line.double-dash.pascal.one',regex:'$',next:'pop'},{defaultToken:'comment.line.double-dash.pascal.one'}]},{token:'punctuation.definition.comment.pascal',regex:'//.*$',push_:[{token:'comment.line.double-slash.pascal.two',regex:'$',next:'pop'},{defaultToken:'comment.line.double-slash.pascal.two'}]},{token:'punctuation.definition.comment.pascal',regex:'\\(\\*',push:[{token:'punctuation.definition.comment.pascal',regex:'\\*\\)',next:'pop'},{defaultToken:'comment.block.pascal.one'}]},{token:'punctuation.definition.comment.pascal',regex:'\\{',push:[{token:'punctuation.definition.comment.pascal',regex:'\\}',next:'pop'},{defaultToken:'comment.block.pascal.two'}]},{token:'punctuation.definition.string.begin.pascal',regex:'"',push:[{token:'constant.character.escape.pascal',regex:'\\\\.'},{token:'punctuation.definition.string.end.pascal',regex:'"',next:'pop'},{defaultToken:'string.quoted.double.pascal'}]},{token:'punctuation.definition.string.begin.pascal',regex:'\'',push:[{token:'constant.character.escape.apostrophe.pascal',regex:'\'\''},{token:'punctuation.definition.string.end.pascal',regex:'\'',next:'pop'},{defaultToken:'string.quoted.single.pascal'}]},{token:'keyword.operator',regex:'[+\\-;,/*%]|:=|='}]};this.normalizeRules();};o.inherits(P,T);e.PascalHighlightRules=P;});ace.define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],function(r,e,m){"use strict";var o=r("../../lib/oop");var B=r("./fold_mode").FoldMode;var R=r("../../range").Range;var F=e.FoldMode=function(){};o.inherits(F,B);(function(){this.getFoldWidgetRange=function(s,f,a){var b=this.indentationBlock(s,a);if(b)return b;var c=/\S/;var l=s.getLine(a);var d=l.search(c);if(d==-1||l[d]!="#")return;var g=l.length;var h=s.getLength();var i=a;var j=a;while(++a<h){l=s.getLine(a);var k=l.search(c);if(k==-1)continue;if(l[k]!="#")break;j=a;}if(j>i){var n=s.getLine(j).length;return new R(i,g,j,n);}};this.getFoldWidget=function(s,f,a){var l=s.getLine(a);var i=l.search(/\S/);var n=s.getLine(a+1);var p=s.getLine(a-1);var b=p.search(/\S/);var c=n.search(/\S/);if(i==-1){s.foldWidgets[a-1]=b!=-1&&b<c?"start":"";return"";}if(b==-1){if(i==c&&l[i]=="#"&&n[i]=="#"){s.foldWidgets[a-1]="";s.foldWidgets[a+1]="";return"start";}}else if(b==i&&l[i]=="#"&&p[i]=="#"){if(s.getLine(a-2).search(/\S/)==-1){s.foldWidgets[a-1]="start";s.foldWidgets[a+1]="";return"";}}if(b!=-1&&b<i)s.foldWidgets[a-1]="start";else s.foldWidgets[a-1]="";if(i<c)return"start";else return"";};}).call(F.prototype);});ace.define("ace/mode/pascal",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/pascal_highlight_rules","ace/mode/folding/coffee"],function(r,e,m){"use strict";var o=r("../lib/oop");var T=r("./text").Mode;var P=r("./pascal_highlight_rules").PascalHighlightRules;var F=r("./folding/coffee").FoldMode;var M=function(){this.HighlightRules=P;this.foldingRules=new F();this.$behaviour=this.$defaultBehaviour;};o.inherits(M,T);(function(){this.lineCommentStart=["--","//"];this.blockComment=[{start:"(*",end:"*)"},{start:"{",end:"}"}];this.$id="ace/mode/pascal";}).call(M.prototype);e.Mode=M;});(function(){ace.require(["ace/mode/pascal"],function(m){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=m;}});})();
