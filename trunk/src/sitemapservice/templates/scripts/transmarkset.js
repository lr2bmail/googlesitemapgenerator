// Copyright 2007 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview  This file includes the class that deal with the localization
 * of the UI. It fills the web page with the texts in the language.js file.
 *
 * It deals with three type of element's attribute's translation:
 * 1. text: the text content of an element, such as innerHTML of SPAN elements.
 * 2. tip: the tip of a setting.
 * 3. value: the value of a button.
 * 
 * The elements in the HTML that need to be deal with will have an attribute
 * named 'transmark', which value will be 'text:mark1;tip:mark2', etc. Here
 * 'mark1' or 'mark2' is the name of the mark, it will be used to get mark value
 * from SettingEditorLanguage in languages.js. The mark value is the language-
 * specific string which will appears on the UI.
 * 
 * @author chaiying@google.com (Ying Chai)
 */

var TransMarkSet = {};

/**
 * Transmark types.
 */
TransMarkSet.types = {TEXT: 'text', TIP: 'tip', VALUE: 'value'};

/**
 * Extracts certain type of mark from this markset.
 * @param {String} markset  The value of the 'transmark' attribute
 * @param {TransMarkSet.types} type  The mark type
 * @return {String?} The mark name, or null if no such type of mark in the
 *   markset
 * @private
 */
TransMarkSet.getMark_ = function(markset, type) {
  var marks = markset.split(/[:;]/);
  if (marks.length < 2) {
    return null;
  }
  for (var i = 0; i < marks.length - 1; i += 2) {
    var name = marks[i];
    var mark = marks[i + 1];
    if (name == type) {
      return mark;
    }
  }
  return null;
};

/**
 * Generates the markset according to the given marks.
 * @param {String} text  The mark name of 'TEXT' type
 * @param {String} tip  The mark name of 'TIP' type
 * @param {String} value  The mark name of 'VALUE' type
 * @return {String} The markset
 * @private
 */
TransMarkSet.fillMark_ = function(text, tip, value) {
  var markset = '';
  if (text) 
    markset += TransMarkSet.types.TEXT + ':' + text + ';';
  if (tip) 
    markset += TransMarkSet.types.TIP + ':' + tip + ';';
  if (value) 
    markset += TransMarkSet.types.VALUE + ':' + value + ';';

  return markset == '' ? null : markset.slice(0, -1); // remove the last ';'
};

/**
 * Provides a way to modify the mark names in the markset.
 * @param {String} markset  The markset
 * @param {Object} modifier  The function that does the modification, which has
 *   the following params and return value:
 *     param {TransMarkSet.types} type  The mark type
 *     param {String} value  The original mark name of the type
 *     return {String} The modified mark name of the type
 */
TransMarkSet.modifyMark = function(markset, modifier) {
  var text = TransMarkSet.getMark_(markset, TransMarkSet.types.TEXT);
  var tip = TransMarkSet.getMark_(markset, TransMarkSet.types.TIP);
  var value = TransMarkSet.getMark_(markset, TransMarkSet.types.VALUE);

  text = modifier(TransMarkSet.types.TEXT, text);
  tip = modifier(TransMarkSet.types.TIP, tip);
  value = modifier(TransMarkSet.types.VALUE, value);

  return TransMarkSet.fillMark_(text, tip, value);
};

/////////////////////
/**
 * Gets the mark value of the 'TEXT' type in the markset.
 * @param {String} markset  The markset
 * @return {String} The mark value (language-specific string)
 * @private
 */
TransMarkSet.getText_ = function(markset) {
  var mark = TransMarkSet.getMark_(markset, TransMarkSet.types.TEXT);
  return SettingEditorLanguage.texts[mark];
};

/**
 * Gets the mark value of the 'TIP' type in the markset.
 * @param {String} markset  The markset
 * @return {String} The mark value (language-specific string)
 * @private
 */
TransMarkSet.getTip_ = function(markset) {
  var mark = TransMarkSet.getMark_(markset, TransMarkSet.types.TIP);
  return SettingEditorLanguage.tips[mark];
};

/**
 * Gets the mark value of the 'VALUE' type in the markset.
 * @param {String} markset  The markset
 * @return {String} The mark value (language-specific string)
 * @private
 */
TransMarkSet.getValue_ = function(markset) {
  var mark = TransMarkSet.getMark_(markset, TransMarkSet.types.VALUE);
  return SettingEditorLanguage.values[mark];
};

/////////////////////
/**
 * Gets the element's tip, not only the static-text, maybe add some thing that
 * is dynamically generated if needed.
 * @param {Element} elem  The element to deal with
 * @return {String?} The language-specific tip of the element
 * @private
 */
TransMarkSet.getElementTip_ = function(elem) {
  var mark = elem.getAttribute(TRANSMARK_ATTRNAME);
  if (mark && mark != '') { // have transmark attribute
    var tip = TransMarkSet.getTip_(mark);
    if (tip) { // valid transmark
      // add range info to tips
      var range = elem.getAttribute('range');
      if (range && range != '') {
        tip += ' Range=' + range;
      }
      return tip;
    }
  }
  return null;
};

/**
 * Gets the element's value of the 'value' attribute.
 * @param {Element} elem  The element to deal with
 * @return {String?} The language-specific value of the element
 * @private
 */
TransMarkSet.getElementValue_ = function(elem) {
  var mark = elem.getAttribute(TRANSMARK_ATTRNAME);
  if (mark && mark != '') { // have transmark attribute
    var value = TransMarkSet.getValue_(mark);
    if (value) { // valid transmark
      return value;
    }
  }
  return null;
};

/**
 * Gets the element's text content.
 * @param {Element} elem  The element to deal with
 * @return {String?} The language-specific text of the element
 * @private
 */
TransMarkSet.getElementText_ = function(elem) {
  var mark = elem.getAttribute(TRANSMARK_ATTRNAME);
  if (mark && mark != '') { // have transmark attribute
    var text = TransMarkSet.getText_(mark);
    if (text) { // valid transmark
      return text;
    }
  }
  return null;
};

/////////////////////

/**
 * Does localization for 'SPAN' element.
 * @param {Element} elem  The 'SPAN' element
 */
TransMarkSet.transLanguageForSpanElem = function(elem) {
  var text = TransMarkSet.getElementText_(elem);
  if (text) {
    elem.innerHTML = text;
  }

  var tip = TransMarkSet.getElementTip_(elem);
  if (tip) {
    elem.tip = tip;
    Tips.schedule(elem);
  }
};


/**
 * Does localization for 'INPUT' element.
 * @param {Element} elem  The 'INPUT' element
 */
TransMarkSet.transLanguageForInputElem = function(elem) {
  var value = TransMarkSet.getElementValue_(elem);
  if (value) {
    elem.value = value;
  }

  var tip = TransMarkSet.getElementTip_(elem);
  if (tip) {
    elem.tip = tip;
    Tips.schedule(elem);
  }
};

/**
 * Does localization for 'SELECT' element.
 * @param {Element} elem  The 'SELECT' element
 */
TransMarkSet.transLanguageForSelectElem = function(elem) {
  // select has tip
  var tip = TransMarkSet.getElementTip_(elem);
  if (tip) {
    elem.tip = tip;
    Tips.schedule(elem);
  }

  // option has text
  Util.array.apply(elem.options, function(option) {
    var text = TransMarkSet.getElementText_(option);
    if (text) {
      option.innerHTML = text;
    }
  });
};

/**
 * Does localization for 'LINK' element.
 * @param {Element} elem  The 'LINK' element
 */
TransMarkSet.transLanguageForLinkElem = function(elem) {
  var tip = TransMarkSet.getElementTip_(elem);
  if (tip) {
    elem.tip = tip;
    Tips.schedule(elem);
  }
};