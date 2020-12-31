+++

date = "2020-12-28"

title = "《深入理解JVM》——07.类文件结构"

description = "深入理解Java虚拟机第三版"

series = ["book", "jvm"]

+++

## 类文件结构

概述
-

不仅仅是Java。任何一种语言，只要将其编译成class文件，即可在jvm中运行。

Class类文件的结构
-
``` java
ClassFile {
    u4             magic;
    u2             minor_version;
    u2             major_version;
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;
    u2             this_class;
    u2             super_class;
    u2             interfaces_count;
    u2             interfaces[interfaces_count];
    u2             fields_count;
    field_info     fields[fields_count];
    u2             methods_count;
    method_info    methods[methods_count];
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```
Class文件是一组以8个字节为基础单位的二进制流，各个数据项目严格按照顺序紧凑地排列在文件之中，中间没有任何分隔符。当需要需要占用8个字节以上空间的数据项时，则会按照高位在前的方式分割成若干个8个字节进行存储。

Class文件格式采用一种类似于C语言结构体的伪结构来存储数据，这种结构只有两种数据类型：“无符号数”和“表”。
1. 无符号数属于基本的数据类型，u1,u2,u4,u8来分别代表1个字节、2个字节、4个字节和8个字节的无符号数，无符号数可以用来描述数字、索引引用、数量值或者按照UFT-8编码构成字符串值。
2. 表是由多个无符号数或者其他表作为数据项构成的符合数据类型，所有的表的命名都习惯地以“_info”结尾。表是用于描述有层次关系的复合结构的数据，整个Class文件本质上也可以视作是一张表，

魔数，有趣的东西，用来识别文件是不是java的class文件，因为后缀可以变动，而编译后文件的内容不会变，class文件前4个字节的魔数为COFEBABE，咖啡宝贝。在gif和jpeg文件头中都存在魔数这个东西。后4个字节 存储的是Class文件的版本号。5，6个字节存储的次版本号。


常量池
-
Class文件主次版本号后面紧接着就是常量池入口，常量池可以比喻为Class文件里的资源仓库，**它是Class文件结构中与其他项目关联最多的数据，通常也是占用Class文件空间最大的数据项目之一，另外它还是Class文件中第一个出现的表类型数据项目**，

由于常量池中常量的数量不是固定的，所以在常量池的入口放置了一项u2类型的数据，代表常量池容量计数值(constant_pool_count)。此容量是从1开始的而不是从0，为的是，在特定情况下表达“不引用任何一个的常量池项目”。把索引设置为0来表示。除了此常量池计数器，其他的类型都是从0开始的。

常量池中主要存放2大类常量：字面量和符号引用
1. 字面量。如文本字符、被声明的final的常量值。
2. 符号引用。编译原理方面的概念。
    1. 被模块导出或者开放的包
    2. 类和接口的全限定名
    3. 字段的名称和描述符
    4. 方法的名称和描述符
    5. 方法句柄和方法类型
    6. 动态调用点和动态常量

**在Class文件中不会保存各个方法、字段最终在内存中的布局信息，这些字段、方法的符号引用不仅过java虚拟机在运行期转换的话是无法得到真正的内存入口地址，也就无法直接被虚拟机使用。当虚拟机做类加载时，将会从常量池获得对应的符号引用，再在类创建时或运行时解析、翻译到具体的内存地址之中。**

常量池中每一项常量都是一个表，这类表都有一个共同的特点，表结构起始的第一个u1类型的标志位tag，代表着当前常量属于哪种常量类型。后面的name_index市场量池的索引值。我们通过工具javap -verbose XXX.class来分析一个类文件中的常量表的信息。

原始代码：
```java
package com.taifung.qrcode.chn.bocpay;

import com.jlpay.commons.tools.SpringContextUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * @description 中国银行澳门分行
 * @date 11:24 2020/9/8
 * @author Mr.Cloud
 **/
@Slf4j
@EnableDiscoveryClient
@SpringBootApplication
@ComponentScan(basePackages = {"com.jlpay.commons.rpc.thrift.referer.zookeeper",
		"com.jlpay.commons.rpc.thrift.referer.service", "com.jlpay.commons.rpc.thrift.server", "com.taifung.qrcode.chn.bocpay"})
@Import(SpringContextUtil.class)
public class BocPayBootstrap {

	public static void main(String[] args) {
		log.info("starting qrcode channel of BocPay server");
		SpringApplication.run(BocPayBootstrap.class, args);
		log.info("qrcode channel of BocPay server start ok");
	}

	@Bean
	public RestTemplate restTemplate() {
		SimpleClientHttpRequestFactory clientHttpRequestFactory
				= new SimpleClientHttpRequestFactory();
		clientHttpRequestFactory.setConnectTimeout(20000);
		clientHttpRequestFactory.setReadTimeout(20000);
		return new RestTemplate(clientHttpRequestFactory);
	}
}

```
使用命令javap -verbose BocPayBootstrap.class后

```java
 Last modified 2020-12-17; size 2172 bytes
  MD5 checksum 2c81850e316de50d35699eaee10d44dc
  Compiled from "BocPayBootstrap.java"
public class com.taifung.qrcode.chn.bocpay.BocPayBootstrap
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #15.#50        // java/lang/Object."<init>":()V
   #2 = Fieldref           #5.#51         // com/taifung/qrcode/chn/bocpay/BocPayBootstrap.log:Lorg/slf4j/Logger;
   #3 = String             #52            // starting qrcode channel of BocPay server
   #4 = InterfaceMethodref #53.#54        // org/slf4j/Logger.info:(Ljava/lang/String;)V
   #5 = Class              #55            // com/taifung/qrcode/chn/bocpay/BocPayBootstrap
   #6 = Methodref          #56.#57        // org/springframework/boot/SpringApplication.run:(Ljava/lang/Class;[Ljava/lang/String;)Lorg/springframework/context/ConfigurableApplicationContext;
   #7 = String             #58            // qrcode channel of BocPay server start ok
   #8 = Class              #59            // org/springframework/http/client/SimpleClientHttpRequestFactory
   #9 = Methodref          #8.#50         // org/springframework/http/client/SimpleClientHttpRequestFactory."<init>":()V
  #10 = Methodref          #8.#60         // org/springframework/http/client/SimpleClientHttpRequestFactory.setConnectTimeout:(I)V
  #11 = Methodref          #8.#61         // org/springframework/http/client/SimpleClientHttpRequestFactory.setReadTimeout:(I)V
  #12 = Class              #62            // org/springframework/web/client/RestTemplate
  #13 = Methodref          #12.#63        // org/springframework/web/client/RestTemplate."<init>":(Lorg/springframework/http/client/ClientHttpRequestFactory;)V
  #14 = Methodref          #64.#65        // org/slf4j/LoggerFactory.getLogger:(Ljava/lang/Class;)Lorg/slf4j/Logger;
  #15 = Class              #66            // java/lang/Object
  #16 = Utf8               log
  #17 = Utf8               Lorg/slf4j/Logger;
  #18 = Utf8               <init>
  #19 = Utf8               ()V
  #20 = Utf8               Code
  #21 = Utf8               LineNumberTable
  #22 = Utf8               LocalVariableTable
  #23 = Utf8               this
  #24 = Utf8               Lcom/taifung/qrcode/chn/bocpay/BocPayBootstrap;
  #25 = Utf8               main
  #26 = Utf8               ([Ljava/lang/String;)V
  #27 = Utf8               args
  #28 = Utf8               [Ljava/lang/String;
  #29 = Utf8               MethodParameters
  #30 = Utf8               restTemplate
  #31 = Utf8               ()Lorg/springframework/web/client/RestTemplate;
  #32 = Utf8               clientHttpRequestFactory
  #33 = Utf8               Lorg/springframework/http/client/SimpleClientHttpRequestFactory;
  #34 = Utf8               RuntimeVisibleAnnotations
  #35 = Utf8               Lorg/springframework/context/annotation/Bean;
  #36 = Utf8               <clinit>
  #37 = Utf8               SourceFile
  #38 = Utf8               BocPayBootstrap.java
  #39 = Utf8               Lorg/springframework/cloud/client/discovery/EnableDiscoveryClient;
  #40 = Utf8               Lorg/springframework/boot/autoconfigure/SpringBootApplication;
  #41 = Utf8               Lorg/springframework/context/annotation/ComponentScan;
  #42 = Utf8               basePackages
  #43 = Utf8               com.jlpay.commons.rpc.thrift.referer.zookeeper
  #44 = Utf8               com.jlpay.commons.rpc.thrift.referer.service
  #45 = Utf8               com.jlpay.commons.rpc.thrift.server
  #46 = Utf8               com.taifung.qrcode.chn.bocpay
  #47 = Utf8               Lorg/springframework/context/annotation/Import;
  #48 = Utf8               value
  #49 = Utf8               Lcom/jlpay/commons/tools/SpringContextUtil;
  #50 = NameAndType        #18:#19        // "<init>":()V
  #51 = NameAndType        #16:#17        // log:Lorg/slf4j/Logger;
  #52 = Utf8               starting qrcode channel of BocPay server
  #53 = Class              #67            // org/slf4j/Logger
  #54 = NameAndType        #68:#69        // info:(Ljava/lang/String;)V
  #55 = Utf8               com/taifung/qrcode/chn/bocpay/BocPayBootstrap
  #56 = Class              #70            // org/springframework/boot/SpringApplication
  #57 = NameAndType        #71:#72        // run:(Ljava/lang/Class;[Ljava/lang/String;)Lorg/springframework/context/ConfigurableApplicationContext;
  #58 = Utf8               qrcode channel of BocPay server start ok
  #59 = Utf8               org/springframework/http/client/SimpleClientHttpRequestFactory
  #60 = NameAndType        #73:#74        // setConnectTimeout:(I)V
  #61 = NameAndType        #75:#74        // setReadTimeout:(I)V
  #62 = Utf8               org/springframework/web/client/RestTemplate
  #63 = NameAndType        #18:#76        // "<init>":(Lorg/springframework/http/client/ClientHttpRequestFactory;)V
  #64 = Class              #77            // org/slf4j/LoggerFactory
  #65 = NameAndType        #78:#79        // getLogger:(Ljava/lang/Class;)Lorg/slf4j/Logger;
  #66 = Utf8               java/lang/Object
  #67 = Utf8               org/slf4j/Logger
  #68 = Utf8               info
  #69 = Utf8               (Ljava/lang/String;)V
  #70 = Utf8               org/springframework/boot/SpringApplication
  #71 = Utf8               run
  #72 = Utf8               (Ljava/lang/Class;[Ljava/lang/String;)Lorg/springframework/context/ConfigurableApplicationContext;
  #73 = Utf8               setConnectTimeout
  #74 = Utf8               (I)V
  #75 = Utf8               setReadTimeout
  #76 = Utf8               (Lorg/springframework/http/client/ClientHttpRequestFactory;)V
  #77 = Utf8               org/slf4j/LoggerFactory
  #78 = Utf8               getLogger
  #79 = Utf8               (Ljava/lang/Class;)Lorg/slf4j/Logger;
{
  public com.taifung.qrcode.chn.bocpay.BocPayBootstrap();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 25: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lcom/taifung/qrcode/chn/bocpay/BocPayBootstrap;

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #2                  // Field log:Lorg/slf4j/Logger;
         3: ldc           #3                  // String starting qrcode channel of BocPay server
         5: invokeinterface #4,  2            // InterfaceMethod org/slf4j/Logger.info:(Ljava/lang/String;)V
        10: ldc           #5                  // class com/taifung/qrcode/chn/bocpay/BocPayBootstrap
        12: aload_0
        13: invokestatic  #6                  // Method org/springframework/boot/SpringApplication.run:(Ljava/lang/Class;[Ljava/lang/String;)Lorg/springframework/context/ConfigurableApplicationContext;
        16: pop
        17: getstatic     #2                  // Field log:Lorg/slf4j/Logger;
        20: ldc           #7                  // String qrcode channel of BocPay server start ok
        22: invokeinterface #4,  2            // InterfaceMethod org/slf4j/Logger.info:(Ljava/lang/String;)V
        27: return
      LineNumberTable:
        line 28: 0
        line 29: 10
        line 30: 17
        line 31: 27
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      28     0  args   [Ljava/lang/String;
    MethodParameters:
      Name                           Flags
      args

  public org.springframework.web.client.RestTemplate restTemplate();
    descriptor: ()Lorg/springframework/web/client/RestTemplate;
    flags: ACC_PUBLIC
    Code:
      stack=3, locals=2, args_size=1
         0: new           #8                  // class org/springframework/http/client/SimpleClientHttpRequestFactory
         3: dup
         4: invokespecial #9                  // Method org/springframework/http/client/SimpleClientHttpRequestFactory."<init>":()V
         7: astore_1
         8: aload_1
         9: sipush        20000
        12: invokevirtual #10                 // Method org/springframework/http/client/SimpleClientHttpRequestFactory.setConnectTimeout:(I)V
        15: aload_1
        16: sipush        20000
        19: invokevirtual #11                 // Method org/springframework/http/client/SimpleClientHttpRequestFactory.setReadTimeout:(I)V
        22: new           #12                 // class org/springframework/web/client/RestTemplate
        25: dup
        26: aload_1
        27: invokespecial #13                 // Method org/springframework/web/client/RestTemplate."<init>":(Lorg/springframework/http/client/ClientHttpRequestFactory;)V
        30: areturn
      LineNumberTable:
        line 35: 0
        line 37: 8
        line 38: 15
        line 39: 22
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      31     0  this   Lcom/taifung/qrcode/chn/bocpay/BocPayBootstrap;
            8      23     1 clientHttpRequestFactory   Lorg/springframework/http/client/SimpleClientHttpRequestFactory;
    RuntimeVisibleAnnotations:
      0: #35()

  static {};
    descriptor: ()V
    flags: ACC_STATIC
    Code:
      stack=1, locals=0, args_size=0
         0: ldc           #5                  // class com/taifung/qrcode/chn/bocpay/BocPayBootstrap
         2: invokestatic  #14                 // Method org/slf4j/LoggerFactory.getLogger:(Ljava/lang/Class;)Lorg/slf4j/Logger;
         5: putstatic     #2                  // Field log:Lorg/slf4j/Logger;
         8: return
      LineNumberTable:
        line 19: 0
}
SourceFile: "BocPayBootstrap.java"
RuntimeVisibleAnnotations:
  0: #39()
  1: #40()
  2: #41(#42=[s#43,s#44,s#45,s#46])
  3: #47(#48=[c#49])

```

此命令将这个class文件的相关内容全部都解析出来了，其中ACC_开头的代表的是类或者接口的访问信息，如：这个类是Class还是接口；是否定义为public类型的，是否是abstract，如果是类，是否被声明final等。access_flags中一共有16个标志位可以使用。

类索引、父类索引与接口索引集合
-
![类索引、父类索引与接口索引集合](https://gopher-cn.icu/images/jvm/class-struct-1.png)



下面此说明十分重要，这就完全说明java可以在运行中改变一些类的行为，实现语言使用者的定制化服务。

>任何一个Class文件都对应着唯一的一个类或者接口的定义信息，但是反过来说，类或者接口并不一定都得定义在文件里（譬如类或者接口也可以动态生成，直接送入类加载器中）。


  

                                                                                    

- [目录](../)
- 上一章：[JVM性能监控及故障处理命令](../jvm-6-tool)
- 下一节：[JVM性能监控及故障处理命令](../jvm-6-tool)


















































