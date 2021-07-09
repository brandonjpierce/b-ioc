/**
 * IoC Module
 */
declare module "b-ioc-js" {
    /**
     * Gets all of the current bindings in the container
     * @returns The containers bindings
     */
    function getBindings(): any;
    /**
     * Gets all of the current singletons in the container
     * @returns The containers singletons
     */
    function getSingletons(): any;
    /**
     * Resets container to default state
     */
    function clear(): void;
    /**
     * Assigns to our bindings object
     * @param binding - The name of the IoC binding
     * @param closure - Factory method or value to bind to container
     */
    function bind(binding: string, closure: any): void;
    /**
     * Assigns to our singleton object
     * @param binding - The name of the IoC binding
     * @param closure - Factory method or value to bind to container
     */
    function singleton(binding: string, closure: any): void;
    /**
     * Grabs a binding from the IoC. Leverages node require as a fallback
     * @param binding - The name of the binding in the container
     * @returns The instance of the binding
     */
    function use<A>(binding: string): A;
    /**
     * Creates an instance of a class and will inject dependencies defined in static
     * inject method. This is an alternative to using Ioc.bind
     * @param Obj - The class you wish to create a new instance of
     * @returns The instantiated function instance
     */
    function make(Obj: (...params: any[]) => any): any;
}

