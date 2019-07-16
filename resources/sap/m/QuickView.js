/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/Device','sap/ui/core/IconPool','./QuickViewBase','./ResponsivePopover','./NavContainer','./Page','./Bar','./Button','./QuickViewRenderer'],function(l,D,I,Q,R,N,P,B,a,b){"use strict";var c=l.PlacementType;var d=Q.extend("sap.m.QuickView",{metadata:{library:"sap.m",properties:{placement:{type:"sap.m.PlacementType",group:"Misc",defaultValue:c.Right},width:{type:'sap.ui.core.CSSSize',group:'Dimension',defaultValue:'320px'}},aggregations:{},designtime:"sap/m/designtime/QuickView.designtime",events:{afterOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},afterClose:{parameters:{openBy:{type:"sap.ui.core.Control"},origin:{type:"sap.m.Button"}}},beforeOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},beforeClose:{parameters:{openBy:{type:"sap.ui.core.Control"},origin:{type:"sap.m.Button"}}}}}});d.prototype.init=function(){var n={pages:[new P()],navigate:this._navigate.bind(this),afterNavigate:this._afterNavigate.bind(this)};this._oNavContainer=new N(n);var t=this;this._oPopover=new R(this.getId()+'-quickView',{placement:this.getPlacement(),content:[this._oNavContainer],contentWidth:this.getWidth(),showHeader:false,showCloseButton:false,afterOpen:function(e){t._afterOpen(e);t.fireAfterOpen({openBy:e.getParameter("openBy")});},afterClose:function(e){t.fireAfterClose({openBy:e.getParameter("openBy"),origin:t.getCloseButton()});},beforeOpen:function(e){t.fireBeforeOpen({openBy:e.getParameter("openBy")});},beforeClose:function(e){t.fireBeforeClose({openBy:e.getParameter("openBy"),origin:t.getCloseButton()});t._bRendered=false;}});this._oPopover.addStyleClass('sapMQuickView');var p=this._oPopover.getAggregation("_popup");p.addEventDelegate({onBeforeRendering:this._initializeQuickView,onAfterRendering:this._setLinkWidth,onkeydown:this._onPopupKeyDown},this);var t=this;var s=p._fnAdjustPositionAndArrow;if(s){p._fnAdjustPositionAndArrow=function(){s.apply(p,arguments);t._adjustContainerHeight();};}this._bItemsChanged=true;this._oPopover.addStyleClass("sapMQuickView");};d.prototype._initializeQuickView=function(){this._bRendered=true;if(this._bItemsChanged){this._clearContainerHeight();this._initPages();var p=this._oNavContainer.getCurrentPage();if(p){var h=p.getCustomHeader();if(h){this._oPopover.addAriaDescribedBy(h.getId());}}var e=this.getAggregation("pages");if(!e&&D.system.phone){this._addEmptyPage();}this._bItemsChanged=false;}};d.prototype.exit=function(){this._bRendered=false;this._bItemsChanged=true;if(this._oPopover){this._oPopover.destroy();this._oPopover=null;}};d.prototype.invalidate=function(){};d.prototype._createPage=function(q){return q._createPage();};d.prototype._onPopupKeyDown=function(e){this._processKeyboard(e);};d.prototype._afterOpen=function(e){if(D.system.phone){this._restoreFocus();}};d.prototype._addEmptyPage=function(){var p=new P({customHeader:new B().addStyleClass("sapMQuickViewHeader")});var t=this;var C=p.getCustomHeader();C.addContentRight(new a({icon:I.getIconURI("decline"),press:function(){t._oPopover.close();}}));p.addStyleClass('sapMQuickViewPage');this._oNavContainer.addPage(p);};d.prototype._clearContainerHeight=function(){var p=this._oPopover.getAggregation("_popup");var $=p.$().find('.sapMPopoverCont');if($[0]&&$[0].style.height){$[0].style.height='';}};d.prototype._adjustContainerHeight=function(){if(this.getPages().length<=1){return;}var p=this._oPopover.getAggregation("_popup");var $=p.$().find('.sapMPopoverCont');if($[0]&&!$[0].style.height){$[0].style.height=$.height()+'px';}};d.prototype._setLinkWidth=function(){this._oPopover.$().find(".sapMLnk").css("width","auto");};d.prototype.getCloseButton=function(){if(!D.system.phone){return undefined;}var p=this._oNavContainer.getCurrentPage();var o=p.getCustomHeader().getContentRight()[0];return o;};d.prototype.setPlacement=function(p){this.setProperty("placement",p,true);this._oPopover.setPlacement(p);return this;};d.prototype.setWidth=function(w){if(this._oPopover){this._oPopover.setContentWidth(w);this.setProperty('width',w,true);}return this;};d.prototype.openBy=function(C){this._bItemsChanged=true;this._oPopover.openBy(C);return this;};d.prototype.getDomRef=function(s){return this._oPopover&&this._oPopover.getAggregation("_popup").getDomRef(s);};["addStyleClass","removeStyleClass","toggleStyleClass","hasStyleClass","getBusyIndicatorDelay","setBusyIndicatorDelay","getVisible","setVisible","getFieldGroupIds","setFieldGroupIds","getBusy","setBusy","setTooltip","getTooltip"].forEach(function(n){d.prototype[n]=function(){if(this._oPopover&&this._oPopover[n]){var r=this._oPopover.getAggregation("_popup")[n].apply(this._oPopover.getAggregation("_popup"),arguments);return r===this._oPopover.getAggregation("_popup")?this:r;}};});["setModel","bindAggregation","setAggregation","insertAggregation","addAggregation","removeAggregation","removeAllAggregation","destroyAggregation"].forEach(function(f){d.prototype["_"+f+"Old"]=d.prototype[f];d.prototype[f]=function(){var n,r;if(["removeAggregation","removeAllAggregation","destroyAggregation"].indexOf(f)!==-1){n=[arguments[0],true];}else{n=[arguments[0],arguments[1],true];}r=d.prototype["_"+f+"Old"].apply(this,n);this._bItemsChanged=true;if(this._oPopover){if(arguments[0]!="pages"){this._oPopover[f].apply(this._oPopover,arguments);}if(this._bRendered){this._initializeQuickView();}}if(["removeAggregation","removeAllAggregation"].indexOf(f)!==-1){return r;}return this;};});return d;});
