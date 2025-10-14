```

BenchmarkDotNet v0.15.4, Windows 10 (10.0.19045.6332/22H2/2022Update)
AMD Ryzen 5 2600 3.40GHz, 1 CPU, 12 logical and 6 physical cores
.NET SDK 9.0.302
  [Host]     : .NET 8.0.1 (8.0.1, 8.0.123.58001), X64 RyuJIT x86-64-v3
  Job-CNUJVU : .NET 8.0.1 (8.0.1, 8.0.123.58001), X64 RyuJIT x86-64-v3

InvocationCount=1  UnrollFactor=1  

```
| Method             | RequestUrl    | Mean     | Error   | StdDev   | Median   | Gen0    | Gen1   | Allocated |
|------------------- |-------------- |---------:|--------:|---------:|---------:|--------:|-------:|----------:|
| **MiddlewarePipeline** | **all todos**     | **342.8 μs** | **1.77 μs** |  **1.56 μs** | **342.3 μs** | **19.0000** | **1.0000** |  **80.15 KB** |
| **MiddlewarePipeline** | **base**          | **342.7 μs** | **6.60 μs** |  **7.34 μs** | **342.9 μs** | **19.0000** | **2.0000** |  **80.27 KB** |
| **MiddlewarePipeline** | **long ass url**  | **343.9 μs** | **1.29 μs** |  **1.08 μs** | **344.2 μs** | **20.0000** | **1.0000** |   **81.4 KB** |
| **MiddlewarePipeline** | **post comments** | **343.0 μs** | **6.82 μs** |  **7.86 μs** | **339.5 μs** | **19.0000** | **1.0000** |  **80.61 KB** |
| **MiddlewarePipeline** | **search**        | **341.3 μs** | **5.86 μs** |  **5.19 μs** | **341.0 μs** | **19.0000** | **1.0000** |  **80.54 KB** |
| **MiddlewarePipeline** | **todo ID**       | **345.9 μs** | **6.75 μs** | **10.10 μs** | **339.7 μs** | **19.0000** | **2.0000** |  **80.47 KB** |
