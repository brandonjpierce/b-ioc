<a name="module_b-ioc-js"></a>

## b-ioc-js
IoC Module


* [b-ioc-js](#module_b-ioc-js)
    * [~getBindings()](#module_b-ioc-js..getBindings) ⇒ <code>Object</code>
    * [~getSingletons()](#module_b-ioc-js..getSingletons) ⇒ <code>Object</code>
    * [~clear()](#module_b-ioc-js..clear)
    * [~bind(binding, closure)](#module_b-ioc-js..bind)
    * [~singleton(binding, closure)](#module_b-ioc-js..singleton)
    * [~use<A>(binding)](#module_b-ioc-js..use<A>) ⇒ <code>A</code>
    * [~make(Obj)](#module_b-ioc-js..make) ⇒ <code>Object</code>

<a name="module_b-ioc-js..getBindings"></a>

### b-ioc-js~getBindings() ⇒ <code>Object</code>
Gets all of the current bindings in the container

**Kind**: inner method of [<code>b-ioc-js</code>](#module_b-ioc-js)  
**Returns**: <code>Object</code> - The containers bindings  
<a name="module_b-ioc-js..getSingletons"></a>

### b-ioc-js~getSingletons() ⇒ <code>Object</code>
Gets all of the current singletons in the container

**Kind**: inner method of [<code>b-ioc-js</code>](#module_b-ioc-js)  
**Returns**: <code>Object</code> - The containers singletons  
<a name="module_b-ioc-js..clear"></a>

### b-ioc-js~clear()
Resets container to default state

**Kind**: inner method of [<code>b-ioc-js</code>](#module_b-ioc-js)  
<a name="module_b-ioc-js..bind"></a>

### b-ioc-js~bind(binding, closure)
Assigns to our bindings object

**Kind**: inner method of [<code>b-ioc-js</code>](#module_b-ioc-js)  

| Param | Type | Description |
| --- | --- | --- |
| binding | <code>String</code> | The name of the IoC binding |
| closure | <code>any</code> | Factory method or value to bind to container |

<a name="module_b-ioc-js..singleton"></a>

### b-ioc-js~singleton(binding, closure)
Assigns to our singleton object

**Kind**: inner method of [<code>b-ioc-js</code>](#module_b-ioc-js)  

| Param | Type | Description |
| --- | --- | --- |
| binding | <code>String</code> | The name of the IoC binding |
| closure | <code>any</code> | Factory method or value to bind to container |

<a name="module_b-ioc-js..use<A>"></a>

### b-ioc-js~use<A>(binding) ⇒ <code>A</code>
Grabs a binding from the IoC. Leverages node require as a fallback

**Kind**: inner method of [<code>b-ioc-js</code>](#module_b-ioc-js)  
**Returns**: <code>A</code> - The instance of the binding  

| Param | Type | Description |
| --- | --- | --- |
| binding | <code>String</code> | The name of the binding in the container |

<a name="module_b-ioc-js..make"></a>

### b-ioc-js~make(Obj) ⇒ <code>Object</code>
Creates an instance of a class and will inject dependencies defined in static
inject method. This is an alternative to using Ioc.bind

**Kind**: inner method of [<code>b-ioc-js</code>](#module_b-ioc-js)  
**Returns**: <code>Object</code> - The instantiated function instance  

| Param | Type | Description |
| --- | --- | --- |
| Obj | <code>function</code> | The class you wish to create a new instance of |

