( function (window) {
    "use strict";


    var arjunane_validations = function () 
    {
        this.version = "1.0.0";
        this.github                     = "https://github.com/dimas-ak/";
        this.documentation_server_1     = "https://dimas-ak.github.io/documentation/arjunane-validation-javascript";
        this.documentation_server_2     = "https://dimas-ak.github.io/documentation/arjunane-validation-javascript/";
        this.developed_by               = "Dimas Awang Kusuma";
        this.facebook                   = "https://www.facebook.com/arjunane.co.id";
    }

    arjunane_validations.prototype.init = function (container) 
    {
        var ar = function() { };
        ar.prototype = arjunane_validations.prototype;

        var newReturn = new ar();
        newReturn.__initValidations(container);
        return newReturn;
    }

    arjunane_validations.prototype.__initValidations = function (selectorContainer)
    {
        if(typeof selectorContainer === 'undefined') throw Error('\nSelector with name "' + selectorContainer + '" doesn`t exist');

        var getContainer = this.__getElements(selectorContainer, true);
        
        this.formElement = getContainer.isArray ? getContainer.elements[0] : getContainer.element;

        this.rules          = new Array();
        
        this.errorText      = {
            "id" : {
                "in"                    : "{field} tidak valid.",
                "ip"                    : "{field} tidak valid.",
                "gt"                    : "{field} harus lebih besar dari {param}.", //Greater Than
                "lt"                    : "{field} harus lebih kecil dari {param}.", //Lower Than
                "gte"                   : "{field} harus lebih besar dari sama dengan {param}.", //Greater Than or Equal
                "lte"                   : "{field} harus lebih kecil dari sama dengan {param}.", //Lower Than or Equal//Lower Than or Equal
                "max"                   : "Maksimal dari {field} ialah {param}.",
                "min"                   : "Minimal dari {field} ialah {param}.",
                "url"                   : "{field} tidak valid.",
                "ipv4"                  : "{field} tidak valid.",
                "ipv6"                  : "{field} tidak valid.",
                "json"                  : "{field} tidak valid.",
                "name"                  : "{field} tidak valid.",
                "same"                  : "{field} tidak sama dengan {param}.",
                "email"                 : "{field} tidak valid.",
                "regex"                 : "{field} tidak valid.",
                "alpha"                 : "{field} hanya boleh diisi dengan Alphabet.",
                "not_in"                : "{field} tidak valid.",
                "integer"               : "{field} tidak valid.",
                "numeric"               : "{field} tidak valid.",
                "boolean"               : "{field} tidak valid.",
                "mimetypes"             : "{field} tidak valid.",
                "required"              : "{field} harap diisi.",
                "ends_with"             : "{field} harus diakhiri dengan {param}.",
                "different"             : "{field} tidak boleh sama dengan {param}.",
                "not_regex"             : "{field} tidak valid.",
                "alpha_dash"            : "{field} hanya boleh diisi dengan Alphabet dan Garis.",
                "starts_with"           : "{field} harus diawali dengan {param}.",
                "required_if"           : "{field} harus diisi.",
                "alpha_numeric"         : "{field} hanya boleh diisi dengan Alphabet dan Angka.",
                "alpha_numeric_dash"    : "{field} hanya boleh diisi dengan Alphabet, Angka dan Garis.",
            }
        };

        this.errorLanguage = "id";

        this.showErrorOnChange = true;

        this.showErrorOnSubmit = true;

        this.errorTag       = "error_";

        this.errorTextCustom = {};

        this.errorElementInner = {};

        this.errorsValidation = {};

        this.callbackOnError = {};

        this.callbackOnErrors = function(errors) {};

        this.errorPrefix = '<div style="color:#c0392b">';
        this.errorSuffix = '</div>';

        return this;
    }

    /**
     * 
     * @param {string} selector 
     * @param {string} label 
     * @param {string} validations 
     */
    arjunane_validations.prototype.setRules = function (selector, label, validations)
    {
        var getElement = this.__getElements(selector);
        
        this.rules.push({
            selector        : selector, 
            label           : label, 
            field           : getElement.field,
            validations     : validations, 
            type            : getElement.type, 
            elements        : getElement.elements, 
            element         : getElement.element, 
            isArray         : getElement.isArray,
            isError         : null
        });

        this.errorsValidation[getElement.field] = "";

        this.errorElementInner[getElement.field] = this.formElement.getElementsByClassName(this.errorTag + getElement.field);

        this.callbackOnError[getElement.field] = function (error) {};

        this.__setOnChange(getElement);
        
        return this;
    }

    arjunane_validations.prototype.setConfig = function(callback)
    {
        var configs = {
            showErrorOnChange : this.showErrorOnChange,
            showErrorOnSubmit :this.showErrorOnSubmit,
            errorTag  : this.errorTag,
            errorPrefix : this.errorPrefix,
            errorSuffix : this.errorSuffix
        };

        if(typeof callback(configs) === 'undefined') throw Error('setConfig must return an "object".');

        var configsChange = callback(configs);
        
        this.showErrorOnChange  =  configsChange.showErrorOnChange;
        this.showErrorOnSubmit  = configsChange.showErrorOnSubmit;
        this.errorTag           = configsChange.errorTag;
        this.errorPrefix        = configsChange.errorPrefix;
        this.errorSuffix        = configsChange.errorSuffix;

        return this;
    }

    arjunane_validations.prototype.setErrorCustom = function(obj)
    {
        this.errorTextCustom = obj;
        return this;
    }

    arjunane_validations.prototype.setErrorLanguage = function(language)
    {
        this.errorLanguage = language;
        return this;
    }

    arjunane_validations.prototype.onError = function(field, callback)
    {
        if(typeof this.callbackOnError[field] === 'undefined' || typeof field !== 'string') throw Error("Cannot find field with : '" + field + "'");
        this.callbackOnError[field] = callback;
        return this;
    }

    arjunane_validations.prototype.onErrors = function (callback)
    {
        this.callbackOnErrors = callback;
        return this;
    }

    arjunane_validations.prototype.setError = function(className, errorText)
    {
        var elements    = this.formElement.getElementsByClassName(className);
        var container   = this;
        forEach(elements, function (html) {
            html.innerHTML = container.__setErrorHTML(errorText);
        });
        return this;
    }

    arjunane_validations.prototype.__setErrorHTML = function (errorText)
    {
        return this.errorPrefix + (typeof errorText !== 'undefined' ? errorText : "") + this.errorSuffix;
    }

    arjunane_validations.prototype.__setOnChange = function (rule) 
    {
        var container           = this;
        var errorElementInner   = this.errorElementInner;

        this.__getRuleElements(rule, function (ini, i) {
            
            if(rule.type === "input" && (ini.type === 'checkbox' || ini.type === 'radio'))
            {
                ini.addEventListener("click", function () {
                    container.__getErrors(rule.field);

                    var error = container.errorsValidation[rule.field];
                    var callbackOnError = container.callbackOnError[rule.field];
                    var callbackOnErrors = container.callbackOnErrors;

                    callbackOnError(error);
                    callbackOnErrors(container.errorsValidation);

                    if(typeof errorElementInner[rule.field] !== 'undefined' && container.showErrorOnChange) 
                    {
                        forEach(container.errorElementInner[rule.field], function (html) {
                            html.innerHTML = container.__setErrorHTML(error);
                        });
                    }
                }); 
            }
            else if(rule.type === "input" || rule.type === "textarea" || rule.type === 'select')
            {
                ini.addEventListener("input", function () {
                    container.__getErrors(rule.field);

                    var error = container.errorsValidation[rule.field];

                    var callbackOnError = container.callbackOnError[rule.field];
                    var callbackOnErrors = container.callbackOnErrors;

                    callbackOnError(error);
                    callbackOnErrors(container.errorsValidation);
                    
                    if(typeof errorElementInner[rule.field] !== 'undefined' && container.showErrorOnChange) 
                    {
                        forEach(container.errorElementInner[rule.field], function (html) {
                            html.innerHTML = container.__setErrorHTML(error);
                        });
                    }
                    
                });
            }
        });
    }

    arjunane_validations.prototype.fails = function ()
    {
        var error = false;
        for(var key in this.errorsValidation)
        {
            if(this.errorsValidation[key] !== null) 
            {
                error = true;
                break;
            }
        }
        return error;
    }

    arjunane_validations.prototype.errors = function ()
    {
        return this.errorsValidation;
    }

    arjunane_validations.prototype.__forEachValidations = function (callback)
    {
        for(var i = 0; i < this.rules.length; i++)
        {
            callback(this.rules[i]);
        }
    }

    arjunane_validations.prototype.getElements = function ()
    {
        var tmpElements = {};
        
        for(var i in this.rules)
        {
            var obj = this.rules[i];

            var fieldName = obj.field;
            var element = obj.isArray ? obj.elements : obj.element;
            
            tmpElements[fieldName] = element;
        }
        return tmpElements;
    }

    /**
     * 
     * @param {function} callback 
     * @param {bool} show : show Error on submit (if true)
     */
    arjunane_validations.prototype.onSubmit = function (callback)
    {
        var container = this;
        if(this.formElement.tagName === 'FORM') this.formElement.addEventListener("submit", function (evt) {
            container.__getErrors();

            callback(evt);
            
            if(container.showErrorOnSubmit)
            {
                container.__forEachValidations( function (validation) {
                    
                    if(container.errorElementInner[validation.field] !== null && container.showErrorOnSubmit)
                    {
                        forEach(container.errorElementInner[validation.field], function (html) {
                            html.innerHTML = container.__setErrorHTML(container.errorsValidation[validation.field]);
                        });
                    }
                });
            }
        });
        else 
        {
            container.__getErrors();

            callback();

            if(container.showErrorOnSubmit)
            {
                container.__forEachValidations( function (validation) {
                    
                    if(container.errorElementInner[validation.field] !== null && container.showErrorOnSubmit)
                    {
                        forEach(container.errorElementInner[validation.field], function (html) {
                            html.innerHTML = container.__setErrorHTML(container.errorsValidation[validation.field]);
                        });
                    }
                });
            }
        }
    }

    arjunane_validations.prototype.__getRuleElements = function (rule, callback)
    {
        if(rule.isArray) for(var i = 0; i < rule.elements.length; i++) callback(rule.elements[i], i);
        else callback(rule.element, 0);
    }

    arjunane_validations.prototype.__getErrors = function (field)
    {
        for(var i = 0; i < this.rules.length; i++)
        {
            var rule = this.rules[i];
            var validationSplit = rule.validations.split("|");
            
            if(typeof field !== 'undefined' && rule.field !== field) continue;

            for(var j = 0; j < validationSplit.length; j++)
            {
                var validationName  = validationSplit[j];
                var validationParam = validationName.split(":");

                if(validationParam.length > 1) 
                {
                    this.errorsValidation[rule.field] = this.__isError(rule, validationParam[0], validationParam[1], this.__getRules(validationParam[0]));
                    if(this.errorsValidation[rule.field] !== null) break;
                    return;
                }
                
                this.errorsValidation[rule.field] = this.__isError(rule, validationName);
                if(this.errorsValidation[rule.field] !== null) break;
            }
            
        }

        return this.errorsValidation;
    }

    arjunane_validations.prototype.__getRules = function (field)
    {
        if(typeof field === 'undefined') return this.rules;
        
        var obj = null;
        forEach(this.rules, function (ini) {
            if(ini.field === field) obj = ini;
        })
        return obj;
    }

    arjunane_validations.prototype.__getErrorText = function(name)
    {
        return typeof this.errorTextCustom[this.errorLanguage] === 'undefined' ? this.errorText[this.errorLanguage][name] : this.errorTextCustom[this.errorLanguage][name];
    }

    arjunane_validations.prototype.__isError = function (obj, validationName, param, objParam) 
    {
        if      (validationName === 'required')             return isErrorRequired(obj, this.__getErrorText('required'));
        else if (validationName === 'required__if')         return isErrorRequiredIf(obj, this.__getErrorText('required_if'), param, objParam);
        else if (validationName === 'max')                  return isErrorMax(obj, this.__getErrorText('max'), param);
        else if (validationName === 'min')                  return isErrorMin(obj, this.__getErrorText('min'), param);
        else if (validationName === 'lt')                   return isErrorLT(obj, this.__getErrorText('lt'), param, objParam);
        else if (validationName === 'gt')                   return isErrorGT(obj, this.__getErrorText('gt'), param, objParam);
        else if (validationName === 'lt')                   return isErrorLT(obj, this.__getErrorText('lt'), param, objParam);
        else if (validationName === 'gte')                  return isErrorGTE(obj, this.__getErrorText('gte'), param, objParam);
        else if (validationName === 'lte')                  return isErrorLTE(obj, this.__getErrorText('lte'), param, objParam);
        else if (validationName === 'name')                 return isErrorName(obj, this.__getErrorText('name'));
        else if (validationName === 'email')                return isErrorEmail(obj, this.__getErrorText('email'));
        else if (validationName === 'alpha')                return isErrorAlpha(obj, this.__getErrorText('alpha'));
        else if (validationName === 'alpha_dash')           return isErrorAlphaDash(obj, this.__getErrorText('alpha_dash'));
        else if (validationName === 'alpha_numeric')        return isErrorAlphaNumeric(obj, this.__getErrorText('alpha_numeric'));
        else if (validationName === 'alpha_numeric_dash')   return isErrorAlphaNumericDash(obj, this.__getErrorText('alpha_numeric_dash'));
        else if (validationName === 'integer')              return isErrorInteger(obj, this.__getErrorText('integer'));
        else if (validationName === 'boolean')              return isErrorBoolean(obj, this.__getErrorText('boolean'));
        else if (validationName === 'numeric')              return isErrorNumeric(obj, this.__getErrorText('numeric'));
        else if (validationName === 'different')            return isErrorDifferent(obj, this.__getErrorText('different'), param, objParam);
        else if (validationName === 'same')                 return isErrorSame(obj, this.__getErrorText('same'), param, objParam);
        else if (validationName === 'start_with')           return isErrorStartWith(obj, this.__getErrorText('start_with'), param);
        else if (validationName === 'end_with')             return isErrorEndWith(obj, this.__getErrorText('end_with'), param);
        else if (validationName === 'json')                 return isErrorJSON(obj, this.__getErrorText('json'));
        else if (validationName === 'ip')                   return isErrorIP(obj, this.__getErrorText('ip'));
        else if (validationName === 'ipv4')                 return isErrorIPv4(obj, this.__getErrorText('ipv4'));
        else if (validationName === 'ipv6')                 return isErrorIPv6(obj, this.__getErrorText('ipv6'));
        else if (validationName === 'url')                  return isErrorURL(obj, this.__getErrorText('url'));
        else if (validationName === 'in')                   return isErrorIn(obj, this.__getErrorText('in'), param);
        else if (validationName === 'not_in')               return isErrorIn(obj, this.__getErrorText('not_in'), param);
        else if (validationName === 'mimetypes')            return isErrorMimeTypes(obj, this.__getErrorText('mimetypes'), param);
        
        return null;
    }

    arjunane_validations.prototype.__getElements = function(selector, isFindParent)
    {
        var elements = new Array();
        var element = null;
        var type = "";

        var selectorCls = selector.replace(".", "");
        var selectorId  = selector.replace("#", "");
        var selectorName = selector;

        if(typeof isFindParent !== 'undefined')
        {
    
            if(isStartWith(selector, "."))
            {
                elements = document.getElementsByClassName(selectorCls);
                if(elements.length === 0) throw Error("Cannot get class selector : " + selector);
            }
            // getById
            else if(isStartWith(selector, "#"))
            {
                element = document.getElementById(selectorId);
                
                if(typeof element === 'undefined' || element === null) throw Error("Cannot get ID selector : " + selector);
            }
            // getByName
            else
            {
                elements = document.getElementsByName(selectorName);
                if(elements.length === 0) throw Error("Cannot get Name selector : " + selector);
    
            }
    
            type = (elements.length !== 0 ? elements[0].tagName : element.tagName).toLowerCase();
    
        }
        else
        {
            var tags = this.formElement.getElementsByTagName("*");

            for(var i = 0; i < tags.length; i++)
            {
                var tag = tags[i];
                
                if(isStartWith(selector, "."))
                {
                    var classList = tag.classList;
                    for(var j = 0; j < classList.length; j++)
                    {
                        var cls = classList[j];
                        if(cls === selectorCls) elements.push(tag);
                    }
                }
                // getById
                else if(isStartWith(selector, "#"))
                {
                    if(tag.id === selectorId) element = tag;
                }
                // getByName
                else
                {
                    if(tag.name === selectorName) elements.push(tag);
                }
            }

            if(elements.length === 0 && element === null) throw Error("Cannot get element with selector : " + selector);

            type = (elements.length !== 0 ? elements[0].tagName : element.tagName).toLowerCase();
        }

        return {
            isArray     : elements.length > 0,
            elements    : elements,
            element     : element,
            field       : selector.replace(".","").replace("#", ""),
            type        : type
        };
        
    }

    function isStartWith(str, searchString)
    {
        return str.split("")[0] === searchString;
    }

    function replaceValidationMessage(errorMessage, obj, param, objParam)
    {
        errorMessage = errorMessage.replace("{field}", obj.label);
        if(typeof objParam !== 'undefined') errorMessage = errorMessage.replace("{param}", objParam.label);
        else if(typeof param !== 'undefined') errorMessage = errorMessage.replace("{param}", param);

        return errorMessage;
    }

    function forEach(arr, callback)
    {
        for(var i = 0; i < arr.length; i++)
        {
            callback(arr[i]);
        }
    }
    
    function isErrorContainer(obj, callback)
    {
        if(!obj.isArray) callback(obj.element);
        else forEach(obj.elements, function (ini) {
            callback(ini);
        });
    }

    // validations
    // required
    function isErrorRequired(obj, errorText)
    {
        var error = null;

        var isRadio = false;
        var isRadioChecked = false;

        var isCheckbox = false;
        var isCheckboxChecked = false;

        isErrorContainer(obj, function (ini) {
            var tagName = ini.tagName.toLowerCase();
            
            if( tagName === 'input' && ini.type === 'file')
            {
                if(ini.files.length === 0)
                {
                    error = replaceValidationMessage(errorText, obj);
                    return;
                }
            }
            else if(tagName === 'input' && ini.type === 'radio')
            {
                isRadio = true;

                if(ini.checked) isRadioChecked = true;
            }
            else if(tagName === 'input' && ini.type === 'checkbox')
            {
                isCheckbox = true;
                if(ini.checked) isCheckboxChecked = true;
            }
            else if((tagName === "input" && ini.type !== 'file') || tagName == 'textarea')
            {
                var isEmpty     = ini.value.replace(/^\s+|\s+$/gm,'').length === 0;
                if(isEmpty) 
                {
                    error = replaceValidationMessage(errorText, obj);
                    return;
                }
            }
            else if(tagName === 'select')
            {
                var isEmpty     = ini.value.replace(/^\s+|\s+$/gm,'').length === 0;
                if(isEmpty) 
                {
                    error = replaceValidationMessage(errorText, obj);
                    return;
                }
            }
        });
        
        if(isRadio && !isRadioChecked) return replaceValidationMessage(errorText, obj);

        if(isCheckbox && !isCheckboxChecked) return replaceValidationMessage(errorText, obj);
        
        return error;
    }

    // required if
    function isErrorRequiredIf(obj, errorText, param, objParam)
    {
        var error = null;

        var isRadio = false;
        var isRadioChecked = false;

        var isCheckbox = false;
        var isCheckboxChecked = false;

        var isNull = true;

        isErrorContainer(objParam, function (ini) {
            var tagName = ini.tagName.toLowerCase();
            
            if( tagName === 'input' && ini.type === 'file')
            {
                if(ini.files.length !== 0)
                {
                    isNull = false;
                    return;
                }
            }
            else if(tagName === 'input' && ini.type === 'radio')
            {
                isRadio = true;

                if(ini.checked) 
                {
                    isNull = false;
                    isRadioChecked = true;
                }
            }
            else if(tagName === 'input' && ini.type === 'checkbox')
            {
                isCheckbox = true;
                if(ini.checked) 
                {
                    isNull = false;
                    isCheckboxChecked = true;
                }
            }
            else if((tagName === "input" && ini.type !== 'file') || tagName == 'textarea')
            {
                var isEmpty     = ini.value.replace(/^\s+|\s+$/gm,'').length === 0;
                if(isEmpty) 
                {
                    isNull = false;
                    return;
                }
            }
            else if(tagName === 'select')
            {
                var isEmpty     = ini.value.replace(/^\s+|\s+$/gm,'').length === 0;
                if(isEmpty) 
                {
                    isNull = false;
                    return;
                }
            }
        });

        isErrorContainer(obj, function (ini) {
            var tagName = ini.tagName.toLowerCase();
            
            if( tagName === 'input' && ini.type === 'file')
            {
                if(ini.files.length === 0 && !isNull)
                {
                    error = replaceValidationMessage(errorText, obj);
                    return;
                }
            }
            else if(tagName === 'input' && ini.type === 'radio')
            {
                isRadio = true;

                if(ini.checked) isRadioChecked = true;
            }
            else if(tagName === 'input' && ini.type === 'checkbox')
            {
                isCheckbox = true;
                if(ini.checked) isCheckboxChecked = true;
            }
            else if((tagName === "input" && ini.type !== 'file') || tagName == 'textarea')
            {
                var isEmpty     = ini.value.replace(/^\s+|\s+$/gm,'').length === 0;
                if(isEmpty && !isNull) 
                {
                    error = replaceValidationMessage(errorText, obj);
                    return;
                }
            }
            else if(tagName === 'select')
            {
                var isEmpty     = ini.value.replace(/^\s+|\s+$/gm,'').length === 0;
                if(isEmpty && !isNull) 
                {
                    error = replaceValidationMessage(errorText, obj);
                    return;
                }
            }
        });
        
        if(isRadio && !isRadioChecked && !isNull) return replaceValidationMessage(errorText, obj);

        if(isCheckbox && !isCheckboxChecked && !isNull) return replaceValidationMessage(errorText, obj);
        
        return error;
    }

    // email
    function isErrorMimeTypes(obj, errorText, param)
    {
        var split = param.split(",");

        var isEqual = false;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') 
            {
                var files = ini.files;
                for(var i = 0; i < files.length; i++)
                {
                    var file = files[i];
                    
                    for(var j = 0; j < split.length; j++)
                    {
                        var mime = split[j];

                        if(file.type === mime) isEqual = true;
                    }
                }
            }
        });

        return !isEqual ? replaceValidationMessage(errorText, obj) : null;
    }

    // email
    function isErrorEmail(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;

            var isMatch = /^.+@[a-zA-Z]+\.{1}[a-zA-Z]+(\.{0,1}[a-zA-Z]+)$/.test(ini.value);
            if(!isMatch) error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }

    // nama manusia
    function isErrorName(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;

            var isMatch = /^[a-zA-Z ,.']*$/.test(ini.value);
            if(!isMatch) error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }

    // error start with
    function isErrorStartWith(obj, errorText, param)
    {
        var error = null;
        var isFind = true;
        var split = param.split(",");
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;

            for(var p in split)
            {
                var isMatch = new RegExp("^" + p).test(ini.value);
                if(isMatch) isFind = false;
            }
        });

        if(!isFind) error = replaceValidationMessage(errorText, obj, param);

        return error;
    }

    // error start with
    function isErrorEndWith(obj, errorText, param)
    {
        var error = null;
        var isFind = true;
        var split = param.split(",");
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;

            for(var p in split)
            {
                var isMatch = new RegExp(".*" + p + "$").test(ini.value);
                if(isMatch) isFind = false;
            }
        });

        if(!isFind) error = replaceValidationMessage(errorText, obj, param);

        return error;
    }

    // alpha [a-z] atau [A-Z]
    function isErrorAlpha(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;

            var isMatch = /^[A-Za-z]+$/.test(ini.value);
            if(!isMatch) error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }

    // alpha [a-z] atau [A-Z]
    function isErrorAlphaDash(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;

            var isMatch = /^[A-Za-z-_]+$/.test(ini.value);
            if(!isMatch) error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }

    // alpha [a-z] atau [A-Z] dan [0-9]
    function isErrorAlphaNumeric(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;

            var isMatch = /^[A-Za-z0-9]+$/.test(ini.value);
            if(!isMatch) error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }

    // alpha [a-z] atau [A-Z] dan [0-9]
    function isErrorAlphaNumericDash(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;

            var isMatch = /^[A-Za-z0-9-_]+$/.test(ini.value);
            if(!isMatch) error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }

    // integer
    function isErrorInteger(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;

            var isMatch = /^[-+]?[1-9]\d*$/.test(ini.value);
            if(!isMatch) error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }

    // numeric
    function isErrorNumeric(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;

            var isMatch = /^[0-9]*$/.test(ini.value);
            if(!isMatch) error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }

    // boolean
    function isErrorBoolean(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;

            if(ini.value === "true" || ini.value === "false") error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }

    // different
    function isErrorDifferent(obj, errorText, field, objParam)
    {
        var error = null;
        var tmpFirst = new Array();
        var tmpLast = new Array();

        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;
            tmpFirst.push(ini.value);
            //if(ini.value === "true" || ini.value === "false") error = replaceValidationMessage(errorText, obj);
        });

        isErrorContainer(objParam, function (ini) {
            if(ini.type === 'file') return;
            tmpLast.push(ini.value);
        });

        for(var i = 0; i < tmpFirst.length; i++)
        {
            if(typeof tmpLast[i] === 'undefined') return;

            var first = tmpFirst[i];
            var last = tmpLast[i];

            if(first === last) error = replaceValidationMessage(errorText, obj, field, objParam);
            
        }

        return error;
    }

    // different
    function isErrorSame(obj, errorText, field, objParam)
    {
        var error = null;
        var tmpFirst = new Array();
        var tmpLast = new Array();

        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;
            tmpFirst.push(ini.value);
        });

        isErrorContainer(objParam, function (ini) {
            if(ini.type === 'file') return;
            tmpLast.push(ini.value);
        });

        for(var i = 0; i < tmpFirst.length; i++)
        {
            if(typeof tmpLast[i] === 'undefined') return;

            var first = tmpFirst[i];
            var last = tmpLast[i];

            if(first !== last) error = replaceValidationMessage(errorText, obj, field, objParam);
            
        }

        return error;
    }

    // IP Address
    function isErrorIP(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;
            var isIpAddress = /(^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$)|(^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)/gi.test(ini.value);

            if(!isIpAddress) error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }
    
    // IPv4 Address
    function isErrorIPv4(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;
            var isIpAddress = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi.test(ini.value);

            if(!isIpAddress) error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }
    
    // IPv6 Address
    function isErrorIPv6(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;
            var isIpAddress = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/gi.test(ini.value);

            if(!isIpAddress) error = replaceValidationMessage(errorText, obj);
        });

        return error;
    }

    // URL
    function isErrorURL(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;
            var isURL = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(ini.value);
            if(!isURL) error = replaceValidationMessage(errorText, obj);
        });
        return error;
    }

    // json
    function isErrorJSON(obj, errorText)
    {
        var error = null;
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') return;
            try
            {
                var json = JSON.parse(ini.value);
            }
            catch(e)
            {
                error = replaceValidationMessage(errorText, obj);
            }
        });
        return error;
    }

    function isFindMaxError(value, param, isFindMax)
    {
        var isError = false;
        if(isFindMax)
        {
            if(value > param && value >= param) 
            {
                isError = true;
            }
        }

        if(value < param && value <= param)
        {
            isError = true;
        }
        return isError;
    }
    // json
    function isErrorMaxOrMin(obj, errorText, param, isFindMax)
    {
        var error = null;
        var size  = Number(param);

        var isCheckbox = false;
        var tmpCheckboxChecked = 0;
        
        isErrorContainer(obj, function (ini) {
            
            if(ini.type === 'file')
            {
                for(var i = 0; i < ini.files.length; i++)
                {
                    var file = ini.files[i];
                    if(isFindMaxError(file.size, size, isFindMax))
                    {
                        error = replaceValidationMessage(errorText, obj, param);
                        return;
                    }
                }
                return;
            }

            
            if(ini.type === 'checkbox')
            {
                isCheckbox = true;
                
                if(ini.checked) tmpCheckboxChecked += 1;
            }
            // jika value input bukan angka
            else if(isNaN(ini.value))
            {
                if(isFindMaxError(ini.value.length, size, isFindMax))
                {
                    error = replaceValidationMessage(errorText, obj, param);
                    return;
                }
            }
            else
            {
                if(isFindMaxError(Number(ini.value), size, isFindMax))
                {
                    error = replaceValidationMessage(errorText, obj, param);
                    return;
                }
            }
        });

        if(isCheckbox)
        {
            if(isFindMaxError(tmpCheckboxChecked, size, isFindMax))
            {
                error = replaceValidationMessage(errorText, obj, param);
            }
        }

        return error;
    }

    function isErrorMax(obj, errorText, param)
    {
        return isErrorMaxOrMin(obj, errorText, param, true);
    }

    function isErrorMin(obj, errorText, param)
    {
        return isErrorMaxOrMin(obj, errorText, param, false);
    }

    function containerErrorGTLT(obj, objParam, errorText, comparator)
    {
        var error = null;
        var tmpFirst = new Array();
        var tmpLast = new Array();
        isErrorContainer(obj, function (ini) {
            if(ini.type === 'file') {
                var files = ini.files;
                for(var i = 0; i < files.length; i++)
                {
                    var file = files[i];

                    tmpFirst.push(file.size);
                }

                return;
            }
            
            tmpFirst.push(ini.value);
        });

        isErrorContainer(objParam, function (ini) {
            if(ini.type === 'file') {
                var files = ini.files;
                for(var i = 0; i < files.length; i++)
                {
                    var file = files[i];

                    tmpLast.push(file.size);
                }

                return;
            }
            
            tmpLast.push(ini.value);
        });

        for(var i = 0; i < tmpFirst.length; i++)
        {
            if(typeof tmpLast[i] === 'undefined') break;

            var first = tmpFirst[i];
            var last = tmpLast[i];
            var firstNumber = Number(first);
            var lastNumber = Number(last);

            if(firstNumber !== 'NaN' && lastNumber !== 'NaN')
            {
                if(comparator === 'lt')
                {
                    if(firstNumber > lastNumber)
                    {
                        error = replaceValidationMessage(errorText, obj, null, objParam);
                        break;
                    }
                    continue;
                }

                if(comparator === 'lte')
                {
                    if(firstNumber >= lastNumber)
                    {
                        error = replaceValidationMessage(errorText, obj, null, objParam);
                        break;
                    }
                    continue;
                }

                if(comparator === 'gt')
                {
                    if(firstNumber < lastNumber)
                    {
                        error = replaceValidationMessage(errorText, obj, null, objParam);
                        break;
                    }
                    continue;
                }

                if(comparator === 'gte')
                {
                    if(firstNumber <= lastNumber)
                    {
                        error = replaceValidationMessage(errorText, obj, null, objParam);
                        break;
                    }
                    continue;
                }
            }
            else
            {
                if(comparator === 'lt')
                {
                    if(first.length > last.length)
                    {
                        error = replaceValidationMessage(errorText, obj, null, objParam);
                        break;
                    }
                    continue;
                }

                if(comparator === 'lte')
                {
                    if(first.length >= last.length)
                    {
                        error = replaceValidationMessage(errorText, obj, null, objParam);
                        break;
                    }
                    continue;
                }

                if(comparator === 'gt')
                {
                    if(first.length < last.length)
                    {
                        error = replaceValidationMessage(errorText, obj, null, objParam);
                        break;
                    }
                    continue;
                }

                if(comparator === 'gte')
                {
                    if(first.length <= last.length)
                    {
                        error = replaceValidationMessage(errorText, obj, null, objParam);
                        break;
                    }
                    continue;
                }
            }

        }
        return error;
    }

    // Greater Than
    function isErrorGT(obj, errorText, param, paramObj)
    {
        return containerErrorGTLT(obj, paramObj, errorText, "gt");
    }
    // Greater Than Equal
    function isErrorGTE(obj, errorText, param, paramObj)
    {
        return containerErrorGTLT(obj, paramObj, errorText, "gte");
    }
    // Lower Than
    function isErrorLT(obj, errorText, param, paramObj)
    {
        return containerErrorGTLT(obj, paramObj, errorText, "lt");
    }
    // Lower Than Equal
    function isErrorLTE(obj, errorText, param, paramObj)
    {
        return containerErrorGTLT(obj, paramObj, errorText, "lte");
    }

    function containerErrorInOrNotIn(obj, errorText, param, isNotIn)
    {
        var error = null;
        var arrParam = param.split(",");

        var tmpValue = new Array();
        
        isErrorContainer(obj, function (ini) {
            
            if(ini.type === 'file')
            {
                return;
            }

            
            if(ini.type === 'checkbox')
            {                
                if(ini.checked) tmpValue.push(ini.value);
            }
            else
            {
                tmpValue.push(ini.value);
            }
        });

        var isErrorIn = true;
        var isErrorNotIn = false;

        for(var i = 0; i < tmpValue.length; i++)
        {
            var value = tmpValue[i];
            for(var j = 0; j < arrParam.length; j++)
            {
                // not_in
                if(isNotIn && value === arrParam[j])
                {
                    isErrorNotIn = true;
                    break;
                }
                // in
                else if(!isNotIn && value === arrParam[j])
                {
                    isErrorIn = false;
                    break;
                }
            }

            if(!isErrorIn || isErrorNotIn) 
            {
                error = replaceValidationMessage(errorText, obj, param);
                break;
            }
        }

        return error;
    }

    function isErrorNotIn(obj, errorText, param)
    {
        return containerErrorInOrNotIn(obj, errorText, param, true);
    }

    function isErrorIn(obj, errorText, param)
    {
        return containerErrorInOrNotIn(obj, errorText, param, false);
    }

    window.arValidations = new arjunane_validations();

})(window);