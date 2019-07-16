/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/Utils","sap/base/util/LoaderExtensions"],function(U,L){"use strict";var A={};var d=function(c){c.forEach(function(C){if(C.destroy){C.destroy();}});};A.applyChange=function(c,C,p){var m=p.modifier;var o=c.getDefinition();var M=c.getModuleName();var a=o.content.targetAggregation;if(!M){throw new Error("The module name of the fragment is not set. This should happen in the backend");}var f=L.loadResource(M,{dataType:"text"});var i=o.content.index;var v=p.view;var n=c.getProjectId();var N;try{N=m.instantiateFragment(f,n,v);}catch(e){throw new Error("The following XML Fragment could not be instantiated: "+f+" Reason: "+e.message);}var b=m.findAggregation(C,a);if(!b){d(N);throw new Error("The given Aggregation is not available in the given control: "+m.getId(C));}N.forEach(function(g,I){if(!m.validateType(g,b,C,f,I)){d(N);throw new Error("The content of the xml fragment does not match the type of the targetAggregation: "+b.type);}});N.forEach(function(g,I){m.insertAggregation(C,a,g,i+I,v);});c.setRevertData(N.map(function(g){return m.getId(g);}));return true;};A.revertChange=function(c,C,p){var m=p.modifier;var o=c.getDefinition();var a=o.content.targetAggregation;var v=p.view||U.getViewForControl(C);var b=p.appComponent;var r=c.getRevertData()||[];var e=r.map(function(i){return m.bySelector(i,b,v)||v&&v.createId&&m.bySelector(v.createId(i));});e.forEach(function(f){m.removeAggregation(C,a,f);});d(e);c.resetRevertData();return true;};A.completeChangeContent=function(c,s){var C=c.getDefinition();var _=function(a){throw new Error("Attribute missing from the change specific content'"+a+"'");};if(!C.content){C.content={};}if(s.fragmentPath){C.content.fragmentPath=s.fragmentPath;}else{_("fragmentPath");}if(s.targetAggregation){C.content.targetAggregation=s.targetAggregation;}else{_("targetAggregation");}if(s.index!==undefined){C.content.index=s.index;}else{_("index");}var g=function(C){var m=C.reference.replace(/\./g,"/");m+="/$$flexModules/";m+=C.validAppVersions.creation;m+="/changes/";m+=C.content.fragmentPath.replace(/\.fragment\.xml/g,"");return m;};var m=g(C);c.setModuleName(m);};return A;},true);
