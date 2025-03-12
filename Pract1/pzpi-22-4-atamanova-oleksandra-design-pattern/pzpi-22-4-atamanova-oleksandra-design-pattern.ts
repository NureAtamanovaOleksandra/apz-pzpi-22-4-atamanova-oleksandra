function Logger(logString: string) {
    return function(constructor: Function) {
      console.log(logString);
      console.log(constructor);
    };
  }
  
  @Logger('LOGGING - PERSON')
  class Person {
    name = 'Max';
  
    constructor() {
      console.log('Creating person object...');
    }
  }

  const person = new Person();


function Log() {
    return function (target: any, context: ClassSetterDecoratorContext) {
        console.log('Method decorator!');
        console.log(target);
        console.log(context);
    }
}

class Product {
    title: string;
    private _price: number;

    @Log()
    set price(val: number) {
        if (val > 0) {
            this._price = val;
        } else {
            throw new Error('Invalid price - should be positive!');
        }
    }

    constructor(t: string, p: number) {
        this.title = t;
        this._price = p;
    }
}

const product = new Product('Example Product', 100);
product.price = 150;


function Property(value: any, context: ClassFieldDecoratorContext<any, any>) {
    console.log('Property decorator!');
    console.log('Context:', context);
    return value;
  }
  
  class ProductWithProperty {
    @Property
    title: string = 'Default';
  
    constructor(title: string) {
      this.title = title;
    }
  }


function MinLength(length: number) {
  return function (value: undefined, context: ClassFieldDecoratorContext) {
    return function (initialValue: string) {
      if (typeof initialValue !== "string") {
        throw new Error(`Property '${String(context.name)}' must be a string.`);
      }
      if (initialValue.length < length) {
        throw new Error(`Property '${String(context.name)}' must be at least ${length} characters long.`);
      }
      return initialValue;
    };
  };
}

class User {
  @MinLength(5)
  password: string = "12345";
}

const user = new User();
console.log(user.password);


function measure<This, Args extends any[], Return>(
    value: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ) {
    return function (this: This, ...args: Args): Return {
      const start = performance.now();
      const result = value.apply(this, args);
      const finish = performance.now();
      console.log(`Execution time: ${finish - start} milliseconds`);
      return result;
    };
  }
  
  class Calculator {
    @measure
    fibonacci(n: number): number {
      if (n <= 1) return n;
      return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
  }
  
  const calc = new Calculator();
  console.log(calc.fibonacci(10));