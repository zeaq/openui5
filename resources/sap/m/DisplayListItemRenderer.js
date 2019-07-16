/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/ui/core/Renderer","./ListItemBaseRenderer"],function(c,R,L){"use strict";var T=c.TextDirection;var D=R.extend(L);D.renderLIAttributes=function(r,l){r.addClass("sapMDLI");};D.renderLIContent=function(r,l){var i=l.getLabel();if(i){r.write("<label for='"+l.getId()+"-value' class='sapMDLILabel'>");r.writeEscaped(l.getLabel());r.write("</label>");}var a=l.getValue();var v=l.getValueTextDirection();if(a){r.write("<div id='"+l.getId()+"-value' class='sapMDLIValue'");if(v!=T.Inherit){r.writeAttribute("dir",v.toLowerCase());}r.write(">");r.writeEscaped(l.getValue());r.write("</div>");}};return D;},true);