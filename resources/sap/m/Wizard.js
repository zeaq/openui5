/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/delegate/ScrollEnablement","./WizardProgressNavigator","sap/ui/Device","./WizardRenderer","sap/ui/dom/containsOrEquals","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/Focusable"],function(l,C,S,W,D,a,c,L,q){"use strict";var b=C.extend("sap.m.Wizard",{metadata:{library:"sap.m",designtime:"sap/m/designtime/Wizard.designtime",properties:{width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"auto"},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"100%"},showNextButton:{type:"boolean",group:"Behavior",defaultValue:true},finishButtonText:{type:"string",group:"Appearance",defaultValue:"Review"},enableBranching:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"steps",aggregations:{steps:{type:"sap.m.WizardStep",multiple:true,singularName:"step"},_progressNavigator:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_nextButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},associations:{
/**
					 * This association controls the current activated step of the wizard (meaning the last step)
					 * For example if we have A->B->C->D steps, we are on step A and we setCurrentStep(C) A,B and C are going to be activated. D will still remain unvisited.
					 * The parameter needs to be a Wizard step that is part of the current Wizard
					 * @since 1.50
					 */
currentStep:{type:"sap.m.WizardStep",multiple:false}},events:{stepActivate:{parameters:{index:{type:"int"}}},complete:{parameters:{}}},dnd:{draggable:false,droppable:true}}});b.CONSTANTS={MINIMUM_STEPS:3,MAXIMUM_STEPS:8,ANIMATION_TIME:300,SCROLL_OFFSET:16};b.prototype.init=function(){this._stepCount=0;this._stepPath=[];this._scrollLocked=false;this._scroller=this._initScrollEnablement();this._resourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._initProgressNavigator();};b.prototype.onBeforeRendering=function(){if(!this._isMinStepCountReached()||this._isMaxStepCountExceeded()){L.error("The Wizard is supposed to handle from 3 to 8 steps.");}this._saveInitialValidatedState();var s=this._getStartingStep();if(s&&this._stepPath.indexOf(s)<0){this._activateStep(s);s._setNumberInvisibleText(1);this._updateProgressNavigator();}};b.prototype.onAfterRendering=function(){if(!this.getCurrentStep()){this.setAssociation("currentStep",this.getSteps()[0],true);}var s=sap.ui.getCore().byId(this.getCurrentStep());this._activateAllPreceedingSteps(s);this._attachScrollHandler();};b.prototype.exit=function(){var d=this.getDomRef("step-container");if(d){d.onscroll=null;}this._scroller.destroy();this._scroller=null;this._stepPath=null;this._stepCount=null;this._scrollLocked=null;this._resourceBundle=null;};b.prototype.validateStep=function(s){if(!this._containsStep(s)){L.error("The wizard does not contain this step");return this;}s.setProperty("validated",true,true);this._updateNextButtonState();return this;};b.prototype.invalidateStep=function(s){if(!this._containsStep(s)){L.error("The wizard does not contain this step");return this;}s.setProperty("validated",false,true);this._updateNextButtonState();return this;};b.prototype.nextStep=function(){var d=this._getProgressNavigator().getProgress()-1;var e=this._stepPath[d];this.validateStep(e);this._handleNextButtonPress();return this;};b.prototype.previousStep=function(){var p=this._getProgressNavigator().getProgress()-2;if(p>=0){this.discardProgress(this._stepPath[p]);}return this;};b.prototype.getProgress=function(){return this._getProgressNavigator().getProgress();};b.prototype.getProgressStep=function(){return this._stepPath[this.getProgress()-1];};b.prototype.goToStep=function(s,f){if(!this.getVisible()||this._stepPath.indexOf(s)<0){return this;}s._setNumberInvisibleText(this.getProgress());var t=this,m={scrollTop:this._getStepScrollOffset(s)},A={queue:false,duration:b.CONSTANTS.ANIMATION_TIME,start:function(){t._scrollLocked=true;},complete:function(){t._scrollLocked=false;var p=t._getProgressNavigator();if(!p){return;}p._updateCurrentStep(t._stepPath.indexOf(s)+1,undefined,true);if(f||f===undefined){t._focusFirstStepElement(s);}}};q(this.getDomRef("step-container")).animate(m,A);return this;};b.prototype.discardProgress=function(s,p){var d=this.getProgress(),e=this._stepPath,f=this._stepPath.indexOf(s),g=this._stepPath[f],h=f+1;if(h>d||h<=0){L.warning("The given step is either not yet reached, or is not present in the wizard control.");return this;}this._getProgressNavigator().discardProgress(h,true);this._updateNextButtonState();this._restoreInitialValidatedState(h);g._markAsLast();for(var j=0;j<h-1;j++){var B=e[j].getAggregation("_nextButton");B.setEnabled(false);B.removeStyleClass("sapMWizardNextButtonVisible");}for(var i=h;i<e.length;i++){e[i]._deactivate();if(e[i].getSubsequentSteps().length>1){e[i].setNextStep(null);}}if(s.getSubsequentSteps().length>1&&!p){s.setNextStep(null);}e.splice(h);this._updateProgressNavigator();this.setAssociation("currentStep",s);this.getShowNextButton()&&g._oNextButton.setVisible(true);return this;};b.prototype.setCurrentStep=function(s){this.setAssociation("currentStep",s,true);var d=(typeof s==="string")?sap.ui.getCore().byId(s):s;if(d&&this._isStepReachable(d)){this._activateAllPreceedingSteps(d);}return this;};b.prototype.setShowNextButton=function(v){this.setProperty("showNextButton",v,true);this.getSteps().forEach(function(s){s.getAggregation("_nextButton").setVisible(v);});return this;};b.prototype.setFinishButtonText=function(v){this.setProperty("finishButtonText",v,true);this._updateNextButtonState();return this;};b.prototype.getFinishButtonText=function(){if(this.getProperty("finishButtonText")==="Review"){return this._resourceBundle.getText("WIZARD_FINISH");}else{return this.getProperty("finishButtonText");}};b.prototype.addStep=function(w){if(this._isMaxStepCountExceeded()){L.error("The Wizard is supposed to handle up to 8 steps.");return this;}w._attachNextButtonHandler(this._handleNextButtonPress.bind(this));this._incrementStepCount();return this.addAggregation("steps",w);};b.prototype.insertStep=function(w,i){throw new Error("Dynamic step insertion is not yet supported.");};b.prototype.removeStep=function(w){throw new Error("Dynamic step removal is not yet supported.");};b.prototype.removeAllSteps=function(){this._resetStepCount();this.getSteps().forEach(function(s){s._detachNextButtonHandler();});return this.removeAllAggregation("steps");};b.prototype.destroySteps=function(){this._resetStepCount();this._getProgressNavigator().setStepCount(this._getStepCount());return this.destroyAggregation("steps");};b.prototype._activateAllPreceedingSteps=function(s){if(this._stepPath.indexOf(s)>=0){this.discardProgress(s,true);return;}while(this.getProgressStep()!==s){this.nextStep();}};b.prototype._isNextStepDetermined=function(s,p){if(!this.getEnableBranching()){return true;}s=s||sap.ui.getCore().byId(this.getCurrentStep());return this._getNextStep(s,p)!==null;};b.prototype._isStepReachable=function(s){if(this.getEnableBranching()){var d=this._getStartingStep();while(d!==s){d=d._getNextStepReference();if(d==null){return false;}}return true;}else{return this.getSteps().indexOf(s)>=0;}};b.prototype._initScrollEnablement=function(){return new S(this,null,{scrollContainerId:this.getId()+"-step-container",horizontal:false,vertical:true});};b.prototype._initProgressNavigator=function(){var t=this,p=new W(this.getId()+"-progressNavigator",{stepChanged:this._handleStepChanged.bind(this)});p._setOnEnter(function(e,s){var d=t._stepPath[s];setTimeout(function(){this._focusFirstStepElement(d);}.bind(t),b.CONSTANTS.ANIMATION_TIME);});this.setAggregation("_progressNavigator",p);};b.prototype._handleNextButtonPress=function(){var p=this._getProgressNavigator(),d=this._stepPath[this._stepPath.length-1],e=p.getProgress(),s=p.getStepCount(),i=this.getEnableBranching()?d._isLeaf():e===s;if(i){this.fireComplete();}else{var f=this.getProgressStep();this._getNextButton().setVisible(false);f._complete();if(!this._isNextStepDetermined(f,e)){throw new Error("The wizard is in branching mode, and the nextStep association is not set.");}if(e===s){p.setStepCount(s+1);p.rerender();}p.incrementProgress();this._handleStepActivated(p.getProgress());this._handleStepChanged(p.getProgress());this.setAssociation("currentStep",this._stepPath[this._stepPath.length-1],true);}this._updateNextButtonState();};b.prototype._getStepScrollOffset=function(s){var i=this._scroller.getScrollTop(),p=this._stepPath[this.getProgress()-1],n=this._getNextButton(),A=0,d=0;if(s&&s.$()&&s.$().position()){d=s.$().position().top||0;}if(!D.system.phone&&p&&n&&!c(p.getDomRef(),n.getDomRef())){A=n.$().outerHeight();}return(i+d)-(b.CONSTANTS.SCROLL_OFFSET+A);};b.prototype._focusFirstStepElement=function(s){var $=s.$();if($&&$.firstFocusableDomRef()){$.firstFocusableDomRef().focus();}};b.prototype._handleStepChanged=function(e){var p=((typeof e==="number")?e:e.getParameter("current"))-2;var d=this._stepPath[p];var s=this._getNextStep(d,p);var f=D.system.desktop?true:false;this.goToStep(s,f);};b.prototype._handleStepActivated=function(i){var p=i-2,d=this._stepPath[p];var n=this._getNextStep(d,p);this._activateStep(n);this._updateProgressNavigator();this.fireStepActivate({index:i});};b.prototype._isMaxStepCountExceeded=function(){if(this.getEnableBranching()){return false;}var s=this._getStepCount();return s>=b.CONSTANTS.MAXIMUM_STEPS;};b.prototype._isMinStepCountReached=function(){var s=this._getStepCount();return s>=b.CONSTANTS.MINIMUM_STEPS;};b.prototype._getStepCount=function(){return this._stepCount;};b.prototype._incrementStepCount=function(){this._stepCount+=1;this._getProgressNavigator().setStepCount(this._getStepCount());};b.prototype._decrementStepCount=function(){this._stepCount-=1;this._getProgressNavigator().setStepCount(this._getStepCount());};b.prototype._resetStepCount=function(){this._stepCount=0;this._getProgressNavigator().setStepCount(this._getStepCount());};b.prototype._getProgressNavigator=function(){return this.getAggregation("_progressNavigator");};b.prototype._saveInitialValidatedState=function(){if(this._initialValidatedState){return;}this._initialValidatedState=this.getSteps().map(function(s){return s.getValidated();});};b.prototype._restoreInitialValidatedState=function(d){var s=this._stepPath,e=this.getSteps();for(var i=d;i<s.length;i++){var f=s[i];var g=e.indexOf(f);var h=this._initialValidatedState[g];f.setValidated(h);}};b.prototype._getNextStep=function(s,p){if(!this.getEnableBranching()){return this.getSteps()[p+1];}if(p<0){return this._getStartingStep();}var n=s._getNextStepReference();if(n===null){throw new Error("The wizard is in branching mode, and no next step is defined for "+"the current step, please set one.");}if(!this._containsStep(n)){throw new Error("The next step that you have defined is not part of the wizard steps aggregation."+"Please add it to the wizard control.");}var d=s.getSubsequentSteps();if(d.length>0&&!s._containsSubsequentStep(n.getId())){throw new Error("The next step that you have defined is not contained inside the subsequentSteps"+" association of the current step.");}return n;};b.prototype._updateNextButtonState=function(){if(!this._getNextButton()){return;}var i,s=this._getStepCount(),n=this._getNextButton(),p=this.getProgress(),d=this._stepPath[p-1].getValidated();if(this.getEnableBranching()){i=this._stepPath[p-1]._isLeaf();}else{i=p===s;}n.setEnabled(d);if(i){n.setText(this.getFinishButtonText());}else{n.setText(this._resourceBundle.getText("WIZARD_STEP")+" "+(p+1));}};b.prototype._getNextButton=function(){var s=this._stepPath[this._stepPath.length-1];if(s){return s.getAggregation("_nextButton");}else{return null;}};b.prototype._updateProgressNavigator=function(){var p=this._getProgressNavigator(),d=this._getStartingStep(),e=this.getSteps(),s=[d.getTitle()],f=[d.getIcon()],g=[d.getOptional()],h=1;if(this.getEnableBranching()){while(!d._isLeaf()&&d._getNextStepReference()!==null){h++;d=d._getNextStepReference();s.push(d.getTitle());g.push(d.getOptional());f.push(d.getIcon());}p.setVaryingStepCount(d._isBranched());p.setStepCount(h);}else{s=e.map(function(i){return i.getTitle();});g=e.map(function(i){return i.getOptional();});f=e.map(function(i){return i.getIcon();});}p.setStepTitles(s);p._stepOptionalIndication=g;p.setStepIcons(f);};b.prototype._getStartingStep=function(){return this.getSteps()[0];};b.prototype._attachScrollHandler=function(){var d=this.getDomRef("step-container");d.onscroll=this._scrollHandler.bind(this);};b.prototype._scrollHandler=function(e){if(this._scrollLocked){return;}var s=e.target.scrollTop,p=this._getProgressNavigator(),d=this._stepPath[p.getCurrentStep()-1].getDomRef();if(!d){return;}var f=d.clientHeight,g=d.offsetTop,h=100;if(s+h>=g+f&&p._isActiveStep(p._currentStep+1)){p.nextStep();}while(s+h<=g){p.previousStep();d=this._stepPath[p.getCurrentStep()-1].getDomRef();if(!d){return;}g=d.offsetTop;}};b.prototype._containsStep=function(s){return this.getSteps().some(function(o){return o===s;});};b.prototype._checkCircularReference=function(s){if(this._stepPath.indexOf(s)>=0){throw new Error("The step that you are trying to activate has already been visited. You are creating "+"a loop inside the wizard.");}};b.prototype._activateStep=function(s){this._checkCircularReference(s);this._stepPath.push(s);s._activate();};return b;});
