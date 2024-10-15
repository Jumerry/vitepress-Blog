## 一、变量
### 通过$在外部定义变量，即可在样式中引入使用。
```css
$width: 5em;
#main {
  width: $width;
}
```



## 二、继承
<font style="color:rgb(40, 45, 54);">继承是 </font><font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">js</font><font style="color:rgb(40, 45, 54);"> 的核心之一，js 中 使用 原型链就大大简化了代码</font>

```javascript
var x = 10;
console.log(x.toFixed(2))
```

<font style="color:rgb(40, 45, 54);">x 只是一个原始值，怎么能使用</font><font style="color:rgb(40, 45, 54);"> </font><font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">toFixed</font><font style="color:rgb(40, 45, 54);"> </font><font style="color:rgb(40, 45, 54);">方法呢，秘密就是 原型链</font>

<font style="color:rgb(40, 45, 54);">在 scss 中也有这么好用的功能</font>

### <font style="color:rgb(40, 45, 54);">1、嵌套继承</font>
```css
#main {
  &:hover{
    background: #000;
  }
  &.side {
    width: 20px;
  }
  .son{
    width: 30px;
  }
}

/* 编译后 */
#main:hover {
  background: #000;
}
#main.side {
  width: 20px;
}
#main .son {
  width: 30px;
}
```

<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">&</font><font style="color:rgb(40, 45, 54);">符号</font>**<font style="color:rgb(47, 132, 94);">指向了当前的父选择器</font>**<font style="color:rgb(40, 45, 54);">，</font><font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">son</font><font style="color:rgb(40, 45, 54);"> 是 </font><font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">main</font><font style="color:rgb(40, 45, 54);"> 的</font>**<font style="color:rgb(47, 132, 94);">后代选择器</font>**<font style="color:rgb(40, 45, 54);">，</font><font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">side</font><font style="color:rgb(40, 45, 54);"> 是 </font><font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">main</font><font style="color:rgb(40, 45, 54);"> 的</font>**<font style="color:rgb(47, 132, 94);">并列选择器</font>**

**<font style="color:rgb(47, 132, 94);"></font>**

### <font style="color:rgb(40, 45, 54);">2、混入继承</font>
在 vue2 中可以使用 mixin 混入重复的变量或者方法，在其他页面可以直接使用混入的变量/方法，可以简化操作，方便统一管理

在 sass 中也有类似的混入  
使用<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">@mixin</font>定义混入指令，使用<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">@include</font>引用变量，**在一些重复的定义的 css 片段里**，使用 混入是一个不错的选择

#### <font style="color:rgb(40, 45, 54);">定义混合指令</font>
```css
@mixin large-text {
  font-size: 30px;
  color: #ff0000;
}
```



#### <font style="color:rgb(40, 45, 54);">使用混入指令</font>
```css
.page {
  @include large-text;
  padding: 4px;
  margin-top: 10px;
}

/* 编译后 */
.page {
  font-size: 30px;
  color: #ff0000;
  padding: 4px;
  margin-top: 10px;
}
```



<font style="color:rgb(40, 45, 54);">如果只是这么简单的引用混入的话了，那你也太小看 sass 的混入了，他可以传参，来达到自定义的效果</font>

<font style="color:rgb(40, 45, 54);">还记得刚刚说的变量吗？ mixin 传入变量直接使用，类似于</font>**<font style="color:rgb(47, 132, 94);">函数的形参</font>**<font style="color:rgb(40, 45, 54);">，include 就是</font>**<font style="color:rgb(47, 132, 94);">函数的调用</font>**<font style="color:rgb(40, 45, 54);"></font>



#### <font style="color:rgb(40, 45, 54);">传入变量</font>
```css
@mixin large-text($color) {
  font-size: 30px;
  color: $color;
}

.page {
   /* 传入变量 blue */ 
  @include large-text(blue);
  padding: 4px;
  margin-top: 10px;
}

/* 编译后 */
.page {
  font-size: 30px;
  /* 颜色 变为 blue */
  color: blue;
  padding: 4px;
  margin-top: 10px;
}
```



#### <font style="color:rgb(40, 45, 54);">默认参数</font>
```css
@mixin flex($col:column,$justify:center,$items:center){
  display: flex;
  flex-direction: $col;
  justify-content: $justify;
  align-items: $items;
}

.page {
  @include flex(row)
}

/* 编译后 */
.page {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
```



#### <font style="color:rgb(40, 45, 54);">默认+解构传入( 关键词参数 )</font>
```css
@mixin flex($col:column,$justify:center,$items:center){
  display: flex;
  flex-direction: $col;
  justify-content: $justify;
  align-items: $items;
}

.page {
  @include flex($items:sapce-between)
}

/* 编译后 */
.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: sapce-between;
}
```

<font style="color:rgb(40, 45, 54);">使用 </font>**<font style="color:rgb(47, 132, 94);">关键词 参数 简化了传入操作</font>**

**<font style="color:rgb(47, 132, 94);"></font>**

#### <font style="color:rgb(40, 45, 54);">解构传入(剩余参数)</font>
```css
@mixin colors($text, $background, $border) {
  color: $text;
  background-color: $background;
  border-color: $border;
}

$values: #ff0000, #00ff00, #0000ff;
.primary {
  @include colors($values...);
}

/* 编译后 */
.primary {
  color: #ff0000;
  background-color: #00ff00;
  border-color: #0000ff;
}
```

**<font style="color:rgb(47, 132, 94);">这种多参数混入非常的常见，特别是在有比较强关联的样式的时候</font>**



### <font style="color:rgb(40, 45, 54);">3、循环</font>
<font style="color:rgb(40, 45, 54);">sass 中的循环和 js 中的循环有异曲同工的用处，甚至比 js 更方便</font>

> <font style="color:rgb(40, 45, 54);">#{ } 插值语句</font>  
<font style="color:rgb(40, 45, 54);">通过 </font><font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">#{}</font><font style="color:rgb(40, 45, 54);"> 插值语句可以在选择器或属性名中使用变量：</font>
>

```css
$name: foo;
$attr: border;
p.#{$name} {
 #{$attr}-color: blue;
}

// 编译为
p.foo {
 border-color: blue;
}
```



#### <font style="color:rgb(40, 45, 54);">for</font>
```css
 @for $i from 1 through 3 {
  .item-#{$i} { 
      width: 2em * $i;
  }
}

/* 编译后 */
.item-1 {
 width: 2em;
}

.item-2 {
 width: 4em;
}

.item-3 {
 width: 6em;
}
```



#### each
**<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">@each</font>****<font style="color:rgb(47, 132, 94);"> 指令的格式是 </font>****<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">$var in <list></font>****<font style="color:rgb(47, 132, 94);">,   
</font>****<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">$var</font>****<font style="color:rgb(47, 132, 94);"> 可以是任何变量名，比如 </font>****<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">$length</font>****<font style="color:rgb(47, 132, 94);"> 或者 </font>****<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">$name</font>****<font style="color:rgb(47, 132, 94);">，而 </font>****<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);"><list></font>****<font style="color:rgb(47, 132, 94);"> 是一连串的值，也就是值列表。</font>**

**<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">@each</font>****<font style="color:rgb(47, 132, 94);"> 将变量 </font>****<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">$var</font>****<font style="color:rgb(47, 132, 94);"> 作用于值列表中的每一个项目，然后输出结果</font>**

1. <font style="color:rgb(40, 45, 54);">这个循环可以看作是 </font><font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">[red,yellow]</font><font style="color:rgb(40, 45, 54);"> 的简化版</font>

```css
@each $color in red, yellow {
  .#{$color} {
   color:$color
  }
}

/* 编译后 */
.red {
  color: red;
}

.yellow {
  color: yellow;
}
```



2. <font style="color:rgb(40, 45, 54);">循环加解构，可以看作是 </font>**<font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">[ [black, default], [blue, pointer] ]</font>**<font style="color:rgb(40, 45, 54);"> 的简化版</font>

```css
@each $color, $cursor in (black, default), (blue, pointer) {
  .#{$color}-icon {
    border: 2px solid $color;
    cursor: $cursor;
  }
}

/* 编译后 */
.black-icon {
  border: 2px solid black;
  cursor: default;
}

.blue-icon {
  border: 2px solid blue;
  cursor: pointer;
}
```



3. <font style="color:rgb(40, 45, 54);">循环 maps,形如这种 </font><font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">(k:v)</font><font style="color:rgb(40, 45, 54);"> 称为 maps 结构</font>

```css
@each $header, $size in (h1: 2em, h2: 1.5em, h3: 1.2em) {
  #{$header} {
    font-size: $size;
  }
}

/* 编译后 */
h1 {
  font-size: 2em;
}
h2 {
  font-size: 1.5em;
}
h3 {
  font-size: 1.2em;
}
```



#### while
```css
$i: 6;
@while $i > 0 {
  .item-#{$i} { width: 2em * $i; }
  $i: $i - 2;
}

/* 编译后 */
.item-6 {
  width: 12em;
}

.item-4 {
  width: 8em;
}

.item-2 {
  width: 4em;
}
```



### 自定义函数
<font style="color:rgb(40, 45, 54);">和 </font><font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">js</font><font style="color:rgb(40, 45, 54);"> 中的函数是一样的，使用 </font><font style="color:rgb(82, 196, 26);background-color:rgb(246, 255, 237);">@function 关键字定义</font><font style="color:rgb(40, 45, 54);">，使用``模板语法</font>

```css
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}
#sidebar { width: grid-width(5); }
/* 关键词参数*/ 
#sidebar { width: grid-width($n: 5); }

/* 编译后 */
#sidebar {
  width: 240px;
}
```



### 判断
<font style="color:rgb(40, 45, 54);">sass中可以使用 if 来进行判断</font>

```css
p {
  @if 1 + 1 == 2 { border: 1px solid; }
  @if 5 < 3 { border: 2px dotted; }
  @if null  { border: 3px double; }
}

/* 编译后 */
p {
  border: 1px solid;
}
```

<font style="color:rgb(40, 45, 54);">如果配合上函数的话，就能组合出很多强大的功能( 没有括号包裹 )</font>

```css
@function color($mode){
  @if $mode == light {
    @return white
  }
  @else if $mode==dark {
    @return black
  } 
  @else {
    @return green
  }
}

p{
  color:color(light)
}

/* 编译后 */
p {
  color: white;
}
```



### 数学计算（加减乘除）
<font style="background-color:#FBDE28;"> / </font>在 CSS 中通常起到分隔数字的用途，SassScript 作为 CSS 语言的拓展当然也支持这个功能，同时也赋予了<font style="background-color:#FBDE28;"> / </font>除法运算的功能。也就是说，如果<font style="background-color:#FBDE28;"> / </font>在 SassScript 中把两个数字分隔，编译后的 CSS 文件中也是同样的作用。

以下三种情况<font style="background-color:#FBDE28;"> / </font>将被视为除法运算符号：

+ 如果值，或值的一部分，是变量或者函数的返回值
+ 如果值被圆括号包裹
+ 如果值是算数表达式的一部分

```css
p {
  font: 10px/8px;             // Plain CSS, no division
  
  $width: 1000px;
  width: $width/2;            // Uses a variable, does division
  width: round(1.5)/2;        // Uses a function, does division
  height: (500px/2);          // Uses parentheses, does division
  margin-left: 5px + 8px/2px; // Uses +, does division
}

/* 编译后 */
p {
  font: 10px/8px;
  width: 500px;
  height: 250px;
  margin-left: 9px;
 }
```

可以看出 font 没有解析，因为 font: 10px/8px 是 css 的原生属性，代表的是 font-size / line-height

如果需要使用变量，同时又要确保 / 不做除法运算而是完整地编译到 CSS 文件中，只需要用 <font style="background-color:#FBDE28;">#{} </font>插值语句将变量包裹。

```css
p {
  $font-size: 12px;
  $line-height: 30px;
  font: #{$font-size}/#{$line-height};
}

/* 编译后 */
p {
  font: 12px/30px; 
}
```

## <font style="color:rgb(47, 132, 94);">总结</font>
**<font style="color:rgb(47, 132, 94);">scss</font>**<font style="color:rgb(40, 45, 54);"> 可以高效的书写 css 代码，它拥有了 </font>**<font style="color:rgb(47, 132, 94);">js</font>**<font style="color:rgb(40, 45, 54);"> 的部分功能， </font>**<font style="color:rgb(47, 132, 94);">使用 变量，使用mixin，使用 函数</font>**<font style="color:rgb(40, 45, 54);"> 可以把重复的 样式抽离，大大增强了 css 的模块化的能力，前端工程师应该掌握一门 css 预处理语言。</font>

