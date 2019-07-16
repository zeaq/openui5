/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery',"sap/base/Log",'./Control','./RenderManager',"./HTMLRenderer","sap/base/security/sanitizeHTML"],function(q,L,C,R,H,b){"use strict";var c=R.RenderPrefixes;var d=C.extend("sap.ui.core.HTML",{metadata:{library:"sap.ui.core",properties:{content:{type:"string",group:"Misc",defaultValue:null},preferDOM:{type:"boolean",group:"Misc",defaultValue:true},sanitizeContent:{type:"boolean",group:"Misc",defaultValue:false},visible:{type:"boolean",group:"Appearance",defaultValue:true}},events:{afterRendering:{parameters:{isPreservedDOM:{type:"boolean"}}}}}});d.prototype.getDomRef=function(s){var i=s?this.getId()+"-"+s:this.getId();return((c.Dummy+i?window.document.getElementById(c.Dummy+i):null))||((i?window.document.getElementById(i):null));};d.prototype.setContent=function(e){function p(s){if(q.parseHTML){var a=q.parseHTML(s);if(a){var f=0,g=a.length;while(f<g&&a[f].nodeType!=1){f++;}while(f<g&&a[g-1].nodeType!=1){g--;}if(f>0||g<a.length){a=a.slice(f,g);}return q(a);}}return q(s);}if(this.getSanitizeContent()){L.trace("sanitizing HTML content for "+this);e=b(e);}this.setProperty("content",e,true);if(this.getDomRef()){var $=p(this.getContent());q(this.getDomRef()).replaceWith($);this._postprocessNewContent($);}else{this.invalidate();}return this;};d.prototype.setSanitizeContent=function(s){this.setProperty("sanitizeContent",s,true);if(s){this.setContent(this.getContent());}return this;};d.prototype.onBeforeRendering=function(){if(this.getPreferDOM()&&this.getDomRef()&&!R.isPreservedContent(this.getDomRef())){R.preserveContent(this.getDomRef(),true,false);}};d.prototype.onAfterRendering=function(){if(!this.getVisible()){return;}var $=q((c.Dummy+this.getId()?window.document.getElementById(c.Dummy+this.getId()):null));var a=R.findPreservedContent(this.getId());var e;var i=false;if((!this.getPreferDOM()||a.size()==0)){a.remove();e=new q(this.getContent());$.replaceWith(e);}else if(a.size()>0){$.replaceWith(a);e=a;i=true;}else{$.remove();}this._postprocessNewContent(e);this.fireAfterRendering({isPreservedDOM:i});};d.prototype._postprocessNewContent=function($){if($&&$.size()>0){if($.length>1){L.warning("[Unsupported Feature]: "+this+" has rendered "+$.length+" root nodes!");}else{var s=$.attr("id");if(s&&s!=this.getId()){L.warning("[Unsupported Feature]: Id of HTML Control '"+this.getId()+"' does not match with content id '"+s+"'!");}}R.markPreservableContent($,this.getId());if($.find("#"+this.getId().replace(/(:|\.)/g,'\\$1')).length===0){$.filter(":not([id])").first().attr("id",this.getId());}}else{L.debug(""+this+" is empty after rendering, setting bOutput to false");this.bOutput=false;}};d.prototype.setDOMContent=function(D){var $=q(D);if(this.getDomRef()){q(this.getDomRef()).replaceWith($);this._postprocessNewContent($);}else{$.appendTo(R.getPreserveAreaRef());if(this.getUIArea()){this.getUIArea().invalidate();}this._postprocessNewContent($);}return this;};d.prototype.setTooltip=function(){L.warning("The sap.ui.core.HTML control doesn't support tooltips. Add the tooltip to the HTML content instead.");return C.prototype.setTooltip.apply(this,arguments);};"hasStyleClass addStyleClass removeStyleClass toggleStyleClass".split(" ").forEach(function(m){d.prototype[m]=function(){L.warning("The sap.ui.core.HTML control doesn't support custom style classes. Manage custom CSS classes in the HTML content instead.");return C.prototype[m].apply(this,arguments);};});return d;});
