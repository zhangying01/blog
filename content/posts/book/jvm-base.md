+++

date = "2020-11-17"

title = "《深入理解Java虚拟机第三版》——基本概念"

description = "深入理解Java虚拟机第三版"

series = ["book", "jvm"]

+++

## Java虚拟机基本概念

### JVM运行时数据区域

![jvm](http://106.53.240.171/images/jvm/JVM-Memory.png)

### 说明

每开启一个线程JVM都给线程分配三个独立的内存区域，分别是Stack Area（虚拟机栈）、PC Registers（程序计数器）、Native Method Area（本地方法区）。而他们的共享内存区域是Method Area（方法区）、Heap（堆）。



### PC Register

程序寄存器，线程执行的字节码的行号指示器，通过改变计数器的值选取下一条执行的字节码指令，控制分支、循环、跳转、异常处理、线程恢复。

> java虚拟机的多线程是通过线程轮换、分配处理器的执行时间的方式来实现的。**在任何一个确定的时刻，一个处理器（多核来说也是一个处理器）都只会执行一条线程中的指令**。为了每个线程都能恢复到正确的执行位置，所以就有了PC Register。

### Stack Area

虚拟机栈，线程私有，生命周期与线程相同。**每个方法被执行的时候，jvm都会同步创建一个栈帧（Stack Frame）用于存储局部变量表、操作数栈、动态连接、方法出口等信息**，每个方法被调用直至完成，就对应一个栈帧从入栈到出栈的过程。更多情况下只是指虚拟机栈中的局部变量表部分。局部变量表存放了编译期可知的各种Java虚拟机 基本数据类型（boolean、byte、char、short、int、float、long、double)、对象引用（reference类型，它并不等同于对象本身）

### Native Method Area

本地方法栈，与虚拟机发挥的作用非常相似，区别：VM Stacks执行Java方法，Native Method Stacks执行本地方法，如：c、cpp等。

> 有的虚拟机直接把本地方法栈和虚拟机栈合二为一使用，如Hot-Spot虚拟机



栈溢出的场景（StackOverflowError）代码

```java

public class TestDemo {

    private int index = 1;

    public void method() {
        index++;
        method();
    }

    @Test
    public void testStackOverflowError() {
        try {
            method();
        } catch (StackOverflowError e) {
            System.out.println("程序所需要的栈大小 > 允许最大的栈大小，执行深度: " + index);
            e.printStackTrace();
        }
    }
}

java.lang.StackOverflowError
	at com.collection.map.MapDemo.method(MapDemo.java:29)
	at com.collection.map.MapDemo.method(MapDemo.java:29)
	at com.collection.map.MapDemo.method(MapDemo.java:29)
	at com.collection.map.MapDemo.method(MapDemo.java:29)
	at com.collection.map.MapDemo.method(MapDemo.java:29)

```
当栈内存超过系统配置的栈内存-Xss:2048（*为jvm启动的每个线程分配的内存大小*），就会出现java.lang.StackOverflowError异常。这也是为什么对于需要谨慎使用递归调用的原因！



堆栈溢出的场景（OutOfMemoryError）代码

```java
public class Heap {

public static void main(String[] args) {
    ArrayList list = new ArrayList();
    while (true) {
        list.add(new Heap());
    }
  }
}

Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
	at java.util.Arrays.copyOf(Arrays.java:3210)
	at java.util.Arrays.copyOf(Arrays.java:3181)
	at java.util.ArrayList.grow(ArrayList.java:261)
	at java.util.ArrayList.ensureExplicitCapacity(ArrayList.java:235)
	at java.util.ArrayList.ensureCapacityInternal(ArrayList.java:227)
	at java.util.ArrayList.add(ArrayList.java:458)

```
List是动态增长的，因此容量不够了，就会扩容，一旦空闲内存分配完毕，请求不到其他内存，就抛出OutOfMemoryError。



### Heap

堆，是虚拟机管理内存中最大的一块，被所有线程共享，在虚拟机启动时创建。此内存的唯一目的是存放对象。Java堆是垃圾收集器管理的内存区域（GC堆），JVM大多数的堆容量都是可以扩展的（-Xmx和-Xms）



### Method Area

方法区，和Java堆一样，是各个线程共享的内存区域，他用于存储**已被虚拟机加载的类型信息、常量、静态变量、即时编译器编译后的代码缓存**等数据。

#### Runtime Constant Pool

运行时常量池，是Method Area的一部分。Class文件中除了有类的版本、字段、方法、接口等描述信息外，还有一项信息是常量池表（ Constant Pool Table），用于存放编译器生成的各种字面量与符号引用，这部分内容将在类加载后存放到方法区的运行时常量池中。

















































