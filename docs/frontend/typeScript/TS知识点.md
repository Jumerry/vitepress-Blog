# TS知识点整理

### 什么是 TypeScript？

TypeScript 是一种开源的编程语言，由微软开发。它是 JavaScript 的超集，这意味着任何有效的 JavaScript 代码也是有效的 TypeScript 代码。TypeScript 在 JavaScript 的基础上添加了静态类型检查和其他一些高级特性，如接口、泛型、装饰器等。这些特性使得 TypeScript 成为一种更适合大型项目和团队开发的语言。



### 为什么使用 TypeScript？

1. **静态类型检查**：TypeScript 的静态类型系统可以在编译时捕获类型错误，帮助开发者在代码编写阶段发现潜在的问题，从而减少运行时错误。
2. **更好的工具支持**：TypeScript 提供了丰富的工具支持，如智能感知、代码导航、重构等，这些工具可以显著提高开发效率。
3. **面向对象编程**：TypeScript 支持类、接口、枚举等面向对象编程的特性，使得代码更加模块化和可维护。
4. **泛型**：泛型允许开发者编写更通用的代码，提高代码的复用性和灵活性。
5. **装饰器**：装饰器是一种特殊类型的声明，可以附加到类声明、方法、访问器、属性或参数上，用于修改或增强类的行为。
6. **模块化**：TypeScript 支持模块化编程，可以方便地组织和管理大型项目的代码。
7. **社区支持**：TypeScript 拥有活跃的社区和丰富的资源，开发者可以轻松找到解决方案和最佳实践。 



### 安装 TypeScript

首先，你需要安装 Node.js。然后，使用 npm（Node 包管理器）安装 TypeScript：

`npm install -g typescript`

安装完成后，你可以使用 `tsc` 命令来编译 TypeScript 文件：

`tsc yourfile.ts`



### 安装和使用 ts-node

`ts-node` 是一个允许你直接运行 TypeScript 文件的工具，而无需先编译成 JavaScript。安装 `ts-node` 非常简单：

`npm install -g ts-node`

安装完成后，你可以直接使用 `ts-node` 命令来运行 TypeScript 文件：

`ts-node yourfile.ts`



### 基本类型

TypeScript 提供了多种基本类型，这些类型可以帮助你在编写代码时进行静态类型检查，从而减少运行时错误。

#### 常见基本类型

- **`boolean`**: 表示布尔值。
- **`number`**: 表示数字。
- **`string`**: 表示字符串。
- **`array`**: 表示数组。
- **`tuple`**: 表示元组，即固定长度和类型的数组。
- **`enum`**: 表示枚举类型。
- **`void`**: 表示没有任何类型。
- **`null`** 和 **`undefined`**: 表示空值和未定义。
- **`never`**: 表示永远不会返回的函数。
- **`object`**: 表示非原始类型。
- **`any`**: 表示任意类型，可以赋值给任何类型，也可以接收任何类型的值。使用 `any` 类型会失去类型检查的优势，因此应谨慎使用。
- **`unknown`**: 表示未知类型，需要进行类型检查后才能使用。`unknown` 类型提供了一种更安全的方式来处理不确定的类型。

> 示例

```typescript
// boolean
let isDone: boolean = false;   // 定义一个布尔变量

// number
let myNumber: number = 6;   // 定义一个数字变量

// string
let myName: string = "Alice";   // 定义一个字符串变量

// array
let list: number[] = [1, 2, 3];   // 定义一个数字类型的数组

// tuple
let tuple: [string, number] = ["hello", 10];   // 定义一个元组，第一个元素是字符串，第二个是数字

// enum
enum Color {Red, Green, Blue};    // 定义一个枚举类型
let c: Color = Color.Green;   // 使用枚举类型定义变量

// any
let notSure: any = 4;   // 定义一个任意类型的变量
notSure = "maybe a string instead";   // 可以重新赋值为其他类型
notSure = false;   

// void
function warnUser(): void {   // 定义一个没有返回值的函数
    console.log("This is my warning message");
}

// null 和 undefined
let u: undefined = undefined;   // 定义一个未定义类型的变量
let n: null = null;   // 定义一个空值类型的变量

// never
function error(message: string): never {   // 定义一个永远不会返回的函数
    throw new Error(message);
}

// object
let obj: object = {};   // 定义一个对象类型的变量

// 数组操作
const arr: number[] = [1, 2, 3];   // 定义一个数字数组
arr.push(4);

// 联合类型数组
const arr2: (string | number)[] = [1, 2, '3'];   // 定义一个联合类型数组
console.log(arr2);  

// any 类型数组
const arr1: any[] = [];   // 定义一个任意类型的数组
arr1.push(4);    // 可以向数组中添加任何类型的元素
arr1.push('hello');

// 泛型数组
const arr3: Array<number | string> = [];   // 使用泛型定义一个联合类型数组
arr3.push(4);     // 向数组中添加一个数字
arr3.push('hello');     // 向数组中添加一个字符串

// 只读数组
const arr4: readonly number[] = [1, 2];    // 定义一个只读的数字数组
console.log(arr4[0]);

// 尝试修改只读数组（将导致编译错误）
const arr5: readonly number[] = [1, 2];
arr5.push(3);   // Error: Cannot assign to 'arr5' because it is a read-only array or tuple. 
                   错误：无法分配给 'arr5'，因为它是一个只读数组或元组。

// 使用不同方式定义只读数组
const arr6: readonly Array<number> = [1, 2];
const arr7: ReadonlyArray<number> = [1, 2];
const arr8: Readonly<number[]> = [1, 2];

// 使用 unknown 类型
const arr9 = [1, 2] as unknown[]; // 将数组转换为未知类型数组
arr9.push('3'); // 可以向未知类型数组中添加任何类型的元素

// 使用 const 断言创建不可变数组
const arr10 = [1, 2] as const;   // 创建一个不可变的数组
arr10.push('3'); // Error: Cannot assign to 'arr10' because it is a constant or a read-only property.                   
                 错误：无法分配给 'arr10'，因为它是一个常量或只读属性。

// 多维数组
const arr11: number[][] = [[2, 3]];   // 定义一个二维数字数组
const arr12: Array<Array<number>> = [[2, 3]];   // 使用泛型定义一个二维数字数组

```

#### any 和 unknown的区别

**`any`**: 表示任意类型，可以**赋值**给任何类型，也可以接收任何类型的值。使用 `any` 类型会失去类型检查的优势，因此应谨慎使用。

**`unknown`**: 表示未知类型，需要进行类型检查后才能使用，**不可以赋值**给其它类型。`unknown` 类型提供了一种更安全的方式来处理不确定的类型。

> 示例

```typescript
let x: any = 1;
let y: unknown = 1;
let z: string = "hello";

x = "hello"; // 可以，因为类型为 `any` 的变量可以赋值为任何类型。
x = true; // 也可以，理由同上。

y = y + 1; // Error: Operator '+' cannot be applied to types 'unknown' and '1'.
              错误：运算符 '+' 不能应用于类型 'unknown' 和 '1'。

if (typeof y === 'number') {
    y = y + 1;  // 在类型检查之后可以这样做
}

z = x;  // 虽然可以，但不推荐，因为这会导致潜在的类型错误。
z = y;  // Error: Type 'unknown' is not assignable to type 'string'.
          错误：类型 'unknown' 不能分配给类型 'string'。

```



### 接口（Interface）

接口用于定义对象的结构，确保对象符合特定的契约。

#### 定义接口

```typescript
interface Person {
    firstName: string;
    lastName: string;
    age: number;
}

let person: Person = {
    firstName: '张',
    lastName: '三',
    age: 20
};
```

#### 接口的扩展

接口可以通过继承其他接口来扩展其功能。

```typescript
interface Employee extends Person {
    employeeId: number;
}

let employee: Employee = {
    firstName: '李',
    lastName: '四',
    age: 25,
    employeeId: 12345
};
```

#### 多个接口合并

如果定义了多个同名的接口，TypeScript 会自动合并它们。

```typescript
interface Box {
    width: number;
    height: number;
}

interface Box {
    length: number;
}

let box: Box = {
    width: 10,
    height: 20,
    length: 30
};
```



### 类型别名（Type）

类型别名允许我们为类型创建一个新的名字。与接口不同，类型别名可以用于基本类型、联合类型等。

#### 定义类型别名

```typescript
type ID = number | string;

let id: ID = 123;
id = "456";

type Point = {
    x: number;
    y: number;
};

let point: Point = { x: 10, y: 20 };
```

#### type与interface的区别

**适用范围**

- **接口**只能用于对象类型。
- **类型别名**可以用于任意类型，包括基本类型、联合类型、元组等。

**继承**

- **接口**支持继承，可以使用 `extends` 关键字来扩展其他接口。
- **类型别名**不支持继承，不能使用 `extends` 关键字。

**多次声明**

- **接口**可以多次声明并自动合并。
- **类型别名**不能多次声明相同的类型，否则会导致编译错误。

**`this` 类型**

- **接口**可以使用 `this` 类型来引用当前类型。
- **类型别名**不能使用 `this` 类型来引用当前类型。

> 示例

##### 接口的 `this` 类型

```typescript
interface Person {
    name: string;
    getName(): this;
}

const person: Person = {
    name: '张三',
    getName() {
        return this;
    }
};
```

##### 类型别名的限制

```typescript
type Point = {
    x: number;
    y: number;
};

// 错误：类型别名不能使用 `this` 类型
// type PointWithThis = {
//     x: number;
//     y: number;
//     getPoint(): this;
// };
```



### 类（Class）

类是 TypeScript 中面向对象编程的基础。类可以用于定义对象的结构和行为，也可以用作类型注解。我们将分别讨论类作为类型和作为类的用途。

#### 1. 类作为类型（Type）

类可以像接口一样用作类型注解，用于定义对象的结构。在这种情况下，类的行为类似于接口。

```typescript
class A {
    x: number = 1;
}

// 将类 A 用作类型注解
let a: A = new A();
a.x = 2;
console.log(a); // 输出: A { x: 2 }
```

- **类作为类型**：类 `A` 定义了属性 `x`，可以用作类型注解来确保对象具有相同的结构。

与接口的比较

```typescript
interface A {
    x: number;
}

// 使用接口 A 作为类型注解
let a: A = { x: 1 };
a.x = 2;
console.log(a); // 输出: { x: 2 }
```

- **接口**：接口 `A` 定义了属性 `x`，可以用作类型注解来确保对象具有相同的结构。
- **区别**：类除了可以定义属性外，还可以包含方法和构造函数，而接口只能定义属性和方法的签名。

#### 2. 类作为类（Class）

类可以用于定义对象的蓝图，包含属性、方法和构造函数。类可以实例化，创建具体的对象。

```typescript
class Person {
    name: string;
    readonly age: number;

    constructor(name: string) {
        this.name = name;
        this.age = 18;
    }

    greet(): string {
        return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
    }
}

let p = new Person('Jack');
p.name = 'Jerry';   // 合法，可以修改 name 属性
// p.age = 20;   // 错误，age 是只读属性，不能修改

// 可以修改构造函数，传入对应参数
constructor(name: string, age: number = 18) {
        this.name = name;
        this.age = age;
}

console.log(p.greet()); // 输出: Hello, my name is Jerry and I am 18 years old.
```

- **属性**：类中的属性可以是普通属性（如 `name`）或只读属性（如 `age`）。
- **构造函数**：构造函数用于初始化类的实例。在构造函数中，可以为属性赋初值。
- **方法**：类可以包含方法，用于定义对象的行为。

#### 类和接口的名称冲突

在 TypeScript 中，类和接口可以具有相同的名称。这种情况下，TypeScript 会自动处理它们的关系，使得类可以实现同名的接口。

```typescript
class A {
    x: number = 1;
}

interface A {
    y: number;
}

let a = new A();
a.y = 2; // 合法，a 既是类 A 的实例，也实现了接口 A
console.log(a); // 输出: A { x: 1, y: 2 }
```

- **类**：`A` 类定义了 `x` 属性，并在构造函数中初始化为 `1`。
- **接口**：`A` 接口定义了 `y` 属性。
- **自动合并**：TypeScript 自动合并类和接口的定义，使得 `a` 既是类 `A` 的实例，也实现了接口 `A`，因此可以访问 `x` 和 `y` 属性。



### 泛型（Generics）

泛型允许我们在定义函数、接口或类的时候，不预先指定具体的类型，而在使用时再指定类型。

#### 定义泛型函数

```typescript
// 定义一个泛型函数 identity，它可以接受任何类型的参数并返回相同类型的值
function identity<T>(arg: T): T {
    return arg;
}

// 使用泛型函数时，我们可以指定参数的类型
let output = identity<string>("myString"); // 指定类型为 string
console.log(output); // 输出: myString
```

- `identity<T>` 是一个泛型函数，其中 `<T>` 表示一个类型参数。`T` 可以是任何类型。 - 当调用 `identity<string>("myString")` 时，`T` 被指定为 `string`，所以 `arg` 必须是字符串类型，返回值也是字符串类型。

#### 泛型接口

```typescript
// 定义一个泛型接口 GenericIdentityFn，它描述了一个函数的结构
interface GenericIdentityFn {
    <T>(arg: T): T;
}

// 定义一个泛型函数 identity，符合上述接口的结构
function identity<T>(arg: T): T {
    return arg;
}

// 使用泛型接口来声明一个变量，并将其赋值为 identity 函数
let myIdentity: GenericIdentityFn = identity;

// 调用 myIdentity 并传入一个字符串
let result = myIdentity("Hello, World!");
console.log(result);   // 输出: Hello, World!
```

- `GenericIdentityFn` 是一个泛型接口，它描述了一个函数的结构，该函数可以接受任何类型的参数并返回相同类型的值。
- `myIdentity` 变量被声明为 `GenericIdentityFn` 类型，并被赋值为 `identity` 函数，这意味着 `myIdentity` 也必须符合 `GenericIdentityFn` 接口的结构。

#### 泛型类

```typescript
// 定义一个泛型类 GenericNumber，它有一个泛型属性 zeroValue 和一个泛型方法 add
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

// 创建一个 GenericNumber 类的实例，指定类型为 number
let myGenericNumber = new GenericNumber<number>();

// 设置 zeroValue 属性的值
myGenericNumber.zeroValue = 0;

// 定义 add 方法，实现两个数相加
myGenericNumber.add = function(x: number, y: number): number {
    return x + y;
};

let sum = myGenericNumber.add(10, 20);
console.log(sum);   // 输出: 30
```

- `GenericNumber<T>` 是一个泛型类，其中 `<T>` 表示一个类型参数。`T` 可以是任何类型。
- `myGenericNumber` 是 `GenericNumber` 类的一个实例，类型参数 `T` 被指定为 `number`。



### 函数（Function）

#### 函数参数

函数可以有多种参数类型，包括必需参数、可选参数和默认参数。函数的返回类型由 `return` 语句决定，如果没有返回值，则函数的返回类型为 `void`。

```typescript
function foo(x: number, y: number = 1): number {
    return x + y;
}

console.log(foo(5)); // 输出 6
console.log(foo(5, 10)); // 输出 15
```

- **必需参数**：必须在调用函数时提供，如 `x`。
- **可选参数**：在参数名后面加上 `?`，表示该参数是可选的。
- **默认参数**：在参数名后面加上 `= 默认值`，表示如果调用时没有提供该参数，则使用默认值，如 `y`。

#### 函数重载

函数重载允许我们定义多个函数签名，以便根据传入的参数类型选择合适的方法。这在处理多态性时非常有用。

```typescript
function reverse(x: string): string;
function reverse(x: number[]): number[];
function reverse(x: string | number[]): string | number[] {
    if (typeof x === 'string') {
        return x.split('').reverse().join('');
    } else if (Array.isArray(x)) {
        return x.slice().reverse();
    }
}

console.log(reverse("hello")); // 输出 "olleh"
console.log(reverse([1, 2, 3])); // 输出 [3, 2, 1]
```

- **函数签名**：定义了函数的参数和返回类型。例如，`function reverse(x: string): string;` 定义了一个接受字符串并返回字符串的函数签名。
- **实现**：实际的函数实现，根据传入的参数类型执行不同的逻辑。

#### 函数的 `this` 参数

TypeScript 允许我们在函数签名中指定 `this` 参数的类型，以确保函数在正确的作用域中调用。这对于类方法特别有用，可以确保 `this` 指向正确的对象。

```typescript
interface Person {
    name: string;
    age: number;
    greet(this: Person): string;
}

let person: Person = {
    name: "Alice",
    age: 30,
    greet: function(this: Person) {
        return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
    }
};

console.log(person.greet()); // 输出: Hello, my name is Alice and I am 30 years old.
```

**`this` 参数**：

- 在函数签名中指定 `this` 的类型，例如 `greet(this: Person): string` 表示 `this` 必须是一个 `Person` 对象。
- 这样可以确保在函数内部，`this` 指向调用该函数的对象。

**作用域**：

- 在 `greet` 方法内部，`this` 指向 `person` 对象，因此可以正确访问 `person` 的 `name` 和 `age` 属性。
- 通过指定 `this` 的类型，TypeScript 编译器可以在编译时检查 `this` 是否正确指向预期的对象。



### 装饰器（Decorators）

装饰器是一种特殊类型的声明，可以附加到类声明、方法、访问器、属性或参数上。装饰器使用 `@expression` 这种形式，其中 `expression` 求值后必须为一个函数，该函数会在运行时被调用，传入装饰器可以操作的类、方法、属性或参数的信息，这对于`学习鸿蒙开发`非常重要。

#### 定义装饰器

```typescript
function simpleDecorator(value: any, context: ClassFieldDecoratorContext) {
  console.log(`hi, this is ${context.kind} ${context.name}`);  // 输出:hi,this is class A 
}

@simpleDecorator
class A {
  // 类体
}
```

在这个例子中，`simpleDecorator` 是一个装饰器函数，它接受两个参数：

- `value`: 所装饰的对象。
- `context`: 包含装饰器上下文信息的对象，包括 `kind`（所装饰的对象类型）、`name`（所装饰的对象名称）、`addInitializer`（初始化函数）、`static`（是否静态）、`private`（是否私有）和 `access`（访问器）。

#### 装饰器的类型定义

```typescript
type Decorator = {
  value: any;  // 所装饰的对象
  context: {
    kind: string;  // 所装饰的对象类型
    name: string | symbol;  // 所装饰的对象名称
    addInitializer?: (initializer: () => void) => void;
    static?: boolean;
    private?: boolean;
    access: {
      get?(): unknown;
      set?(value: any): void;
    }
  }
};


function classDecorator(target: Function) {
  console.log('Class decorator called');
}

@classDecorator
class MyClass {
  constructor() {
    console.log('MyClass instance created');
  }
}

const instance = new MyClass(); // 输出: Class decorator called, MyClass instance created
```



### 其他类型和高级用法

#### 元组（Tuple）

元组是一种固定长度和类型的数组。

```typescript
const arr: [number, string, boolean] = [1, '2', true];
let a: number[] = [1];
let b: [number] = [1];

let c: [number, string?] = [1, '2'];

type MyTuple = [number, string?, boolean?];
let d: MyTuple = [1, '2', true];

type MyTuple1 = [number, string?, boolean?, ...number[]];
let e: MyTuple1 = [1, '2', true, 3, 1, 1, 1, 1, 1, 1];

type MyTuple2 = [
  aaa: number,
  bbb?: string,
  ccc?: boolean,
  ...ddd: number[]
];
let f: MyTuple2 = [1, '2', true, 3, 1, 1, 1, 1, 1, 1];

let g: readonly [number, number] = [1, 2];
```

#### 枚举（Enum）

枚举是一种特殊的类型，用于表示一组命名的常量。

```typescript
enum Color {Red, Green, Blue};
console.log(Color.Red); // 输出 0
console.log(Color[0]); // 输出 "Red"
```

#### 交叉类型（Intersection Types）

交叉类型允许我们将多个类型组合在一起。

```typescript
let obj: { foo: string } & { bar: string } = {
  foo: 'hello',
  bar: 'world'
};
```

#### 类型断言（Type Assertion）

类型断言允许我们在编译时告诉 TypeScript 编译器某个值的类型。

```typescript
const arr = [1, 2] as unknown[];
arr.push('3');

const arr1 = [1, 2] as const;
arr1.push('3'); // Error: Cannot assign to 'arr1' because it is a constant or a read-only property.
```

