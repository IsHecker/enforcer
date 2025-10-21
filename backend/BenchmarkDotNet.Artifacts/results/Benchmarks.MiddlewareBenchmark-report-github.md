```

BenchmarkDotNet v0.15.4, Windows 10 (10.0.19045.6456/22H2/2022Update)
AMD Ryzen 5 2600 3.40GHz, 1 CPU, 12 logical and 6 physical cores
.NET SDK 9.0.302
  [Host]     : .NET 8.0.1 (8.0.1, 8.0.123.58001), X64 RyuJIT x86-64-v3
  DefaultJob : .NET 8.0.1 (8.0.1, 8.0.123.58001), X64 RyuJIT x86-64-v3


```
| Method             | RequestUrl    | Mean     | Error     | StdDev    | Median   | Gen0     | Gen1    | Allocated |
|------------------- |-------------- |---------:|----------:|----------:|---------:|---------:|--------:|----------:|
| **MiddlewarePipeline** | **all todos**     | **1.990 ms** | **0.0398 ms** | **0.1109 ms** | **1.995 ms** | **117.1875** | **23.4375** |  **518.4 KB** |
| **MiddlewarePipeline** | **base**          | **1.967 ms** | **0.0378 ms** | **0.0691 ms** | **1.942 ms** | **109.3750** | **31.2500** | **519.32 KB** |
| **MiddlewarePipeline** | **long ass url**  | **1.956 ms** | **0.0301 ms** | **0.0267 ms** | **1.949 ms** | **109.3750** | **23.4375** | **513.53 KB** |
| **MiddlewarePipeline** | **post comments** | **2.128 ms** | **0.0422 ms** | **0.0927 ms** | **2.141 ms** | **109.3750** | **31.2500** | **519.12 KB** |
| **MiddlewarePipeline** | **search**        | **1.702 ms** | **0.0373 ms** | **0.1022 ms** | **1.661 ms** | **109.3750** | **23.4375** | **505.39 KB** |
| **MiddlewarePipeline** | **todo ID**       | **1.609 ms** | **0.0197 ms** | **0.0174 ms** | **1.607 ms** | **109.3750** | **23.4375** | **497.21 KB** |
