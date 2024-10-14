---
outline: deep
title: Reduce用法
---

# Reduce用法

### 一、语法介绍

`reduce` 是 JavaScript 中的一个高阶函数，用于对数组进行迭代并将其缩减为单个值。它接受一个回调函数和一个可选的初始值作为参数。

```javascript
array.reduce(callback, initialValue)
```

- `array`：要进行迭代的数组。

- ```
  callback
  ```

  ：一个回调函数，用于处理每个数组元素并返回结果。它接受四个参数：

  - `accumulator`：累加器，用于存储每次迭代的中间结果。
  - `currentValue`：当前正在处理的数组元素。
  - `currentIndex`：当前元素的索引（可选）。
  - `array`：原始数组（可选）。

- `initialValue`（可选）：作为初始值的累加器的值。如果提供了初始值，则第一次迭代时，`accumulator` 的值将是初始值，`currentValue` 将是数组的第一个元素；如果没有提供初始值，则第一次迭代时，`accumulator` 的值将是数组的第一个元素，`currentValue` 将是数组的第二个元素。



### 二、基本用法

#### 1、数组求和

```javascript
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);

console.log(sum); // 输出：15
```

在上述示例中，我们使用 `reduce` 对 `numbers` 数组进行迭代，并将每个元素累加到 `accumulator` 中，初始值为 0。最终，`sum` 的值将是数组中所有元素的总和。

除了计算总和，`reduce` 还可以用于执行其他类型的累积操作，例如计算最大值、最小值、平均值，或者将数组转换为对象等。

请注意，`reduce` 方法不会修改原始数组，而是返回一个最终的累加结果。如果需要修改原始数组，可以在回调函数中进行相应的操作。



#### 2、计算数组中每个元素出现的次数

```javascript
let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];
    let nameNum = names.reduce((pre, cur) => {
        if (cur in pre) {
            pre[cur]++
        } else {
            pre[cur] = 1
        }
        return pre
    }, {})
    console.log(nameNum); //{Alice: 2, Bob: 1, Bruce: 1, Tiff: 1}
```

**1.** 由于**设置了迭代初始值**，pre的第一个值是一个空对象，此时name为Alice，然后进行判断，发现在pre中没有Alice属性，所以就将Alice对应的属性值赋为1。
**2.** 后面没有重复的是一样的道理，如果碰到重复值，就会将该属性值加1，这样就能计算元素重复的次数了。



#### 3、数组根据名称分组

假设数据已经存储在名为 `data` 的数组中，根据name进行分组，可以使用 JavaScript 的 `reduce()` 方法进行分组：

```javascript
const groupedData = data.reduce((result, item) => {
  const name = item.name;
  if (!result[name]) {
    result[name] = [];
  }
  result[name].push(item);
  return result;
}, {});
```

这段代码创建了一个名为 `groupedData` 的新对象，其中每个属性的名称是 `catName`，对应的属性值是具有相同 `name` 属性的 `data` 数组元素组成的数组。

#### 1、通过reduce修改为索引，而不是name作为属性名

可以直接定义一个 `index` 变量，每次 `reduce()` 处理时将其自增，将 `index` 作为新对象的属性名称即可。

```javascript
const modifiedData = data.reduce((result, item, index) => {
  const name = item.name;
  if (!result[index]) {
    result[index] = [];
  }
  result[index].push(item);
  return result;
}, {});

console.log(modifiedData);
```

这段代码与上面的示例非常类似。唯一的区别是，将新对象的属性名称设置为了 `index` 变量（起始值为0）。

#### 2、分成数组

将元素按照 `name` 属性值进行分组，得到一个包含多个数组的数组

```javascript
const groupedData = data.reduce((result, item) => {
  const name = item.name;
  const existingGroup = result.find(group => group[0]?.name === name);
  if (existingGroup) {
    existingGroup.push(item);
  } else {
    result.push([item]);
  }
  return result;
}, []);

console.log(groupedData);
```

这段代码首先定义了一个空数组 `result`，用于存储分组后的元素。然后使用 `reduce()` 方法对原始数组 `data` 进行处理，将属于同一个 `name` 的元素放入同一个数组中。如果已经存在一个 `name` 值相同的数组，就将元素添加到该数组，否则就创建一个新数组并将元素添加到其中。

最终得到的 `groupedData` 就是一个包含多个数组的数组，每个子数组代表一个 `name` 分组。

需要注意的是，上面代码中使用了可选链操作符`?.`，这是因为当数组为空时，访问其第一个元素会返回`undefined`，这会导致代码运行时出错。加上可选链操作符后，如果数组为空，访问第一个元素时会自动返回 `null`，从而避免了错误。如果你的 JavaScript 环境不支持可选链操作符，可以把 `?.` 替换成 `[0]`。



#### 3、将二维数组转化为一维

```javascript
  let arr = [[0, 1], [2, 3], [4, 5]]
  let newArr = arr.reduce((pre, cur) => {
      return pre.concat(cur)
  }, [])
  console.log(newArr); // [0, 1, 2, 3, 4, 5]
```



#### 4、将多维数组转化为一维

```javascript
 let arr = [[0, 1], [2, 3], [4, [5, 6, 7]]]
 const newArr = function (arr) {
     return arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? newArr(cur) : cur), [])
 }
 console.log(newArr(arr)); //[0, 1, 2, 3, 4, 5, 6, 7]
```

