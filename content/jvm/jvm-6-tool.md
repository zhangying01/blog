+++

date = "2020-12-24"

title = "《深入理解JVM》——06.JVM性能监控及故障处理命令"

description = "深入理解Java虚拟机第三版"

series = ["book", "jvm"]

+++

## JVM性能监控及故障处理命令
                                                                                    
jps命令(JVM Process Status Tool)
-

`jps -l `

输出jvm当前运行的pid及的服务主类的全名，要比ps -ef | grep XXX方便

![jps](https://gopher-cn.icu/images/jvm/jps-1.png)

`jps -v `

输出虚拟机进程启动时的JVM参数，超级好用。

![jps](https://gopher-cn.icu/images/jvm/jps-2.jpg)


jstat命令(JVM Statistics Monitoring Tool)
-

`jstat -gcutil $pid`

输出java堆各个区域已使用空间占总空间的百分比。E(Eden)、S0(Survivor0)、S1(Survivor1)、O(Old)、P(Permanent)、YGC(Young GC)、YGCT(Young GC Time,单位s)。后面见名思意，自行理解即可。

![jps](https://gopher-cn.icu/images/jvm/jps-3.jpg)


更新中...


- [目录](../)
- 上一章：[JVM内存分配](../jvm-5-memery-allocate)
- 下一节：[JVM性能监控及故障处理命令](../jvm-6-tool)


















































