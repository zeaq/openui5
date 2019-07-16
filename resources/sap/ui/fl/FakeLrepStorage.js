/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(function(){"use strict";return function(s){var F="sap.ui.fl.change";var a="sap.ui.fl.variant";var b={};b.setStorage=function(n){s=n;};b.createChangeKey=function(i){if(i){return F+"."+i;}};b.createVariantKey=function(i){if(i){return a+"."+i;}};b.forEachLrepChangeInLocalStorage=function(p){var k=Object.keys(s);k.forEach(function(K){if(K.includes(F)||K.includes(a)){p(K);}});};b.getChange=function(i){if(i){var c=s.getItem(this.createChangeKey(i));if(!c){c=s.getItem(this.createVariantKey(i));}return JSON.parse(c);}};b.getChanges=function(r,l){var c=[],C;this.forEachLrepChangeInLocalStorage(function(k){C=JSON.parse(s[k]);var S=C.reference===r||C.reference+".Component"===r;var d=C.layer===l;if(r&&!S||l&&!d){return;}c.push(C);});return c;};b.getNumChanges=function(){var c=0;this.forEachLrepChangeInLocalStorage(function(){c++;});return c;};b._aModifyCallbacks=[];b.attachModifyCallback=function(c){this._aModifyCallbacks.push(c);};b.detachModifyCallback=function(c){var i=this._aModifyCallbacks.indexOf(c);if(i!==-1){this._aModifyCallbacks.splice(i,1);}};b._callModifyCallbacks=function(m){this._aModifyCallbacks.forEach(function(c){c(m);});};b.deleteChange=function(i){if(i){s.removeItem(this.createChangeKey(i));s.removeItem(this.createVariantKey(i));}this._callModifyCallbacks("delete");};b.deleteChanges=function(){this.forEachLrepChangeInLocalStorage(function(k){s.removeItem(k);});this._callModifyCallbacks("delete");};b.saveChange=function(i,c){var C,d;if(i&&c){if(c.fileType==="ctrl_variant"&&c.variantManagementReference){C=this.createVariantKey(i);}else{C=this.createChangeKey(i);}d=JSON.stringify(c);s.setItem(C,d);}this._callModifyCallbacks("save");};return b;};},true);
